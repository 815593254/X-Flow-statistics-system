<template>
    <div class="realtime-flow-container">
        <!-- 筛选条件 -->
        <el-card>
            <!-- <div class="filter-container"> -->
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="queryForm.ip" placeholder="请输入IP地址" clearable />
                </el-col>
                <el-col :span="6">
                    <div>
                        <el-button type="primary" @click="handleQuery">查询</el-button>
                        <el-button @click="resetQuery">重置</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- </div> -->
        </el-card>

        <!-- 实时状态信息 -->
        <el-card style="margin-top: 10px;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-card>
                        <div class="status-card">
                            <div class="status-value">{{ formatBytes(latestData.rate_bps || 0) }}</div>
                            <div class="status-label">当前流量 (bps)</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="status-card">
                            <div class="status-value">{{ formatBytes(avgRateBps5Min) }}</div>
                            <div class="status-label">5分钟平均流量 (bps)</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card>
                        <div class="status-card">
                            <div class="status-value">{{ formatBytes(maxRateBps) }}</div>
                            <div class="status-label">5分钟峰值 (bps)</div>
                        </div>
                    </el-card>
                </el-col>
                <!-- 实时状态显示已移除 -->
            </el-row>
        </el-card>

        <!-- 实时流量图表 -->
        <el-card style="margin-top: 10px;" v-loading="loading" element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading">
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="chart-wrapper">
                        <div class="chart-header">
                            <div class="chart-title">IP流量监控（最近5分钟）</div>
                            <div class="chart-info">
                                <span style="margin-left: 20px;">最后更新：{{ lastUpdateTime }}</span>
                            </div>
                        </div>
                        <div id="realTimeChart" style="width: 100%; height: 400px;"></div>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- IP段IP排名列表 -->
        <el-card v-if="showCurrentCClass" style="margin-top: 10px;" v-loading="cClassRankLoading"
            element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <div slot="header" class="card-header">
                <span>段内IP流量排名</span>
                <el-button type="text" @click="refreshCClassData" :loading="cclassLoading">
                    <i class="el-icon-refresh"></i>
                </el-button>
            </div>

            <div class="ranking-list">
                <div v-for="(item, index) in cclassIpList" :key="index" class="ranking-item">
                    <div class="rank-number" :class="getCClassRankClass(index + 1)">
                        #{{ index + 1 }}
                    </div>
                    <div class="ip-info">
                        <div class="ip-address">{{ item.ip }}</div>
                        <div class="flow-stats">
                            <span class="current-flow">当前: {{ formatBytes(item.rate_bps) }}</span>
                            <span class="avg-flow">平均: {{ formatBytes(item.avg_bps) }}</span>
                            <span class="max-flow">峰值: {{ formatBytes(item.max_bps) }}</span>
                        </div>
                    </div>
                </div>
                <!-- <div class="timestamp">
                        {{ parseTime(item.ts_ms, '{h}:{i}:{s}') }}
                    </div> -->
            </div>

        </el-card>
    </div>
</template>

<script>
import { request } from '@/utils/request'
import { getIpFlowApi } from '@/api/flow-analysis/ip-flow'
import { getCClassIpTop } from '@/api/flow-analysis/cclass-ip'

export default {
    name: 'IpFlowRealtime',
    data() {
        return {
            loading: false,
            cClassRankLoading: false,
            timer: null, // 定时器
            chart: null,
            queryForm: {
                ip: ''
            },
            queryParams: {
                ip: ''
            },
            chartData: {
                timeData: [], // 时间轴数据
                rateBpsData: [], // 流量数据
                avgBpsData: [] // 平均流量数据
            },
            latestData: {}, // 最新的一条数据
            maxRateBps: 0, // 5分钟内的峰值
            avgRateBps5Min: 0, // 5分钟内的平均流量
            lastUpdateTime: '',
            // IP段相关数据
            currentCClass: '', // 当前查看的IP段
            cclassIpList: [], // IP段内IP排名列表
            cclassLoading: false // IP段数据加载状态
        }
    },
    mounted() {
        // 检查路由参数中是否有IP或IP段
        if (this.$route.query.ip) {
            this.queryForm.ip = this.$route.query.ip
            this.queryParams.ip = this.$route.query.ip
        }

        if (this.$route.query.cclass) {
            this.currentCClass = this.$route.query.cclass
            this.queryForm.ip = this.$route.query.cclass
            this.queryParams.ip = this.$route.query.cclass
        }

        this.initChart()
        this.loadInitialData()
        this.startAutoUpdate()

        // 如果有IP段参数，加载IP段IP排名
        if (this.currentCClass.indexOf('/') !== -1) {
            this.loadCClassData()
        }
    },
    watch: {
        // 监听路由变化，更新IP参数
        '$route'(to, from) {
            if (to.query.ip && to.query.ip !== this.queryParams.ip) {
                this.queryForm.ip = to.query.ip
                this.queryParams.ip = to.query.ip
                this.currentCClass = '' // 清除IP段状态
                this.cclassIpList = [] // 清除IP段列表
                // 如果IP改变了，重新加载数据
                this.loadInitialData()
            }

            if (to.query.cclass && to.query.cclass !== this.currentCClass) {
                this.currentCClass = to.query.cclass
                // 如果是IP段，设置基础IP到查询框
                const baseIp = to.query.cclass
                this.queryForm.ip = baseIp
                this.queryParams.ip = baseIp
                // 重新加载数据
                this.loadInitialData()
                this.loadCClassData()
            }
        }
    },
    computed: {
        showCurrentCClass() {
            return this.queryParams.ip.indexOf('/') !== -1
        }
    },
    beforeDestroy() {
        this.stopAutoUpdate()
        if (this.chart) {
            this.chart.dispose()
        }
    },
    methods: {
        // 初始化图表
        initChart() {
            this.chart = this.$echarts.init(document.getElementById('realTimeChart'))

            const option = {
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        const timeStr = this.formatTime(params[0].axisValue)
                        let tooltip = `时间: ${timeStr}<br/>`
                        params.forEach(param => {
                            const value = this.formatBytes(param.value)
                            tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`
                        })
                        return tooltip
                    }
                },
                legend: {
                    data: ['当前流量(bps)'],
                    // data: ['当前流量(bps)', '平均流量(bps)'],
                    top: 10
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.chartData.timeData,
                    axisLabel: {
                        formatter: (value) => {
                            return this.formatTime(value, 'HH:mm:ss')
                        }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '流量(bps)',
                        position: 'left',
                        axisLabel: {
                            formatter: (value) => this.formatBytes(value)
                        }
                    }
                ],
                series: [
                    {
                        name: '当前流量(bps)',
                        type: 'line',
                        yAxisIndex: 0,
                        data: this.chartData.rateBpsData,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 4,
                        lineStyle: {
                            color: '#409EFF',
                            width: 2
                        },
                        // areaStyle: {
                        //     color: {
                        //         type: 'linear',
                        //         x: 0,
                        //         y: 0,
                        //         x2: 0,
                        //         y2: 1,
                        //         colorStops: [{
                        //             offset: 0, color: 'rgba(64, 158, 255, 0.3)'
                        //         }, {
                        //             offset: 1, color: 'rgba(64, 158, 255, 0.1)'
                        //         }]
                        //     }
                        // }
                    },
                    // {
                    //     name: '平均流量(bps)',
                    //     type: 'line',
                    //     yAxisIndex: 0,
                    //     data: this.chartData.avgBpsData,
                    //     smooth: true,
                    //     symbol: 'circle',
                    //     symbolSize: 4,
                    //     lineStyle: {
                    //         color: '#67C23A',
                    //         width: 2
                    //     }
                    // }
                ]
            }

            this.chart.setOption(option)

            // 监听窗口大小变化
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },

        // 加载初始数据（5分钟前到现在）
        async loadInitialData() {
            // 如果没有输入IP地址，不进行查询
            if (!this.queryParams.ip) {
                // this.$message.warning('请输入IP地址进行查询')
                return
            }

            const endTime = Date.now()
            const startTime = endTime - 5 * 60 * 1000 // 5分钟前

            try {
                // this.loading = true
                const data = {
                    ip: this.queryParams.ip, // IP是必填参数
                    condition: {
                        begin: startTime,
                        end: endTime
                    },
                    page: {
                        // pageNo: 0, // 全量查询
                        pageSize: 0 // 全量查询
                    }
                }

                const response = await getIpFlowApi(data)
                if (response.code === '000000' && response.body.results) {
                    this.processInitialData(response.body.results)
                    this.updateChart()

                } else {
                    this.$message.error('获取数据失败')
                }
            } catch (error) {
                console.error('加载初始数据失败:', error)
                this.$message.error('加载初始数据失败')
            } finally {
                // this.loading = false
            }
        },

        // 处理初始数据
        processInitialData(results) {
            this.chartData.timeData = []
            this.chartData.rateBpsData = []
            this.chartData.avgBpsData = []

            let totalRateBps = 0 // 用于计算5分钟平均流量

            results.forEach(item => {
                this.chartData.timeData.push(item.ts_ms)
                this.chartData.rateBpsData.push(item.rate_bps || 0)
                this.chartData.avgBpsData.push(item.avg_bps || 0)

                totalRateBps += (item.rate_bps || 0) // 累加用于计算平均值
            })

            // 更新最新数据和统计数据
            if (results.length > 0) {
                this.latestData = results[results.length - 1]
                this.maxRateBps = Math.max(...this.chartData.rateBpsData)
                // 计算5分钟内的平均流量
                this.avgRateBps5Min = Math.round(totalRateBps / results.length)
            } else {
                this.avgRateBps5Min = 0
            }

            this.lastUpdateTime = this.formatTime(Date.now())
        },

        // 更新图表
        updateChart() {
            if (this.chart) {
                this.chart.setOption({
                    xAxis: {
                        data: this.chartData.timeData
                    },
                    series: [
                        { data: this.chartData.rateBpsData },
                        { data: this.chartData.avgBpsData }
                    ]
                })
            }
        },

        // 应用筛选
        handleQuery() {
            if (!this.queryForm.ip) {
                // this.$message.warning('请输入IP地址')
                return
            }
            this.queryParams.ip = this.queryForm.ip
            this.stopAutoUpdate()
            this.loadInitialData()
            this.loadCClassData()
            this.startAutoUpdate()
        },

        // 启动自动更新
        startAutoUpdate() {
            this.stopAutoUpdate() // 先清理已有的定时器
            this.timer = setInterval(() => {
                this.loadCClassData()
                this.loadInitialData()
            }, 10000) // 每10秒更新一次
        },

        // 停止自动更新
        stopAutoUpdate() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },

        // 重置筛选
        resetQuery() {
            this.queryForm = {
                ip: ''
            }
            this.queryParams = {
                ip: ''
            }
            // 重置后停止自动更新，清空图表
            this.stopAutoUpdate()
            this.chartData = {
                timeData: [],
                rateBpsData: [],
                avgBpsData: []
            }
            this.latestData = {}
            this.maxRateBps = 0
            this.avgRateBps5Min = 0
            this.updateChart()
        },

        // 格式化字节数
        formatBytes(bytes) {
            if (bytes === 0) return '0 B'
            const k = 1024
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        },

        // 格式化时间
        formatTime(timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
            if (!timestamp || isNaN(timestamp)) {
                return '--:--:--'
            }

            const date = new Date(parseInt(timestamp))

            // 检查日期是否有效
            if (isNaN(date.getTime())) {
                return '--:--:--'
            }

            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')

            if (format === 'HH:mm:ss') {
                return `${hours}:${minutes}:${seconds}`
            }
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },

        // IP段排名相关方法
        async loadCClassData() {
            if (!this.showCurrentCClass) {
                return
            }

            try {
                this.cClassRankLoading = true

                // 构建时间范围，获取最近5分钟的数据
                const endTime = Date.now()
                const startTime = endTime - 5 * 60 * 1000

                const data = {
                    ip: this.queryParams.ip,
                    condition: {
                        begin: startTime,
                        end: endTime
                    },
                    page: {
                        pageSize: 0 // 显示TOP10
                    }
                }

                const response = await getCClassIpTop(data)

                if (response.code === '000000') {
                    this.cclassIpList = response.body
                    this.cClassRankLoading = false
                } else {
                    this.cclassIpList = []
                    console.warn('获取IP段排名数据失败:', response.msg)
                }
            } catch (error) {
                console.error('加载IP段排名数据失败:', error)
                this.cclassIpList = []
            } finally {
                this.cClassRankLoading = false
            }
        },

        // 刷新IP段排名数据
        refreshCClassData() {
            if (this.cClassRankTimer) {
                clearInterval(this.cClassRankTimer)
            }

            if (this.currentCClass) {
                this.loadCClassData()
                // 每30秒刷新一次IP段排名
                this.cClassRankTimer = setInterval(() => {
                    this.loadCClassData()
                }, 30000)
            }
        },

        // 点击IP段排名中的IP，切换到该IP的流量查看
        switchToIp(ip) {
            // 更新路由参数，切换到新的IP
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ip: ip,
                    cclass: '' // 清除IP段参数，显示单个IP的流量
                }
            })
        },

        // 获取排名样式类名
        getCClassRankClass(index) {
            if (index === 0) return 'rank-first'
            if (index === 1) return 'rank-second'
            if (index === 2) return 'rank-third'
            return 'rank-normal'
        },

    }
}
</script>

<style lang="scss" scoped>
.realtime-flow-container {
    margin-top: 10px;
    padding: 0;
}

.filter-container {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-container {
    margin-bottom: 20px;
}

.status-card {
    /* background: #fff; */
    /* border-radius: 4px; */
    /* padding: 20px; */
    text-align: center;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

/* IP段排名相关样式 */
.cclass-rank-container {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cclass-rank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
}

.cclass-rank-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
}

.cclass-rank-list {
    max-height: 400px;
    overflow-y: auto;
}

.cclass-rank-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f7fa;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cclass-rank-item:hover {
    background-color: #f8f9fa;
}

.cclass-rank-item:last-child {
    border-bottom: none;
}

.ranking-list {
    max-height: 520px;
    overflow-y: auto;
}

.ranking-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: #e9ecef;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.rank-number {
    min-width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-weight: bold;
    font-size: 14px;
    margin-right: 12px;

    &.rank-first {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #8b5a00;
    }

    &.rank-second {
        background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
        color: #666;
    }

    &.rank-third {
        background: linear-gradient(135deg, #cd7f32, #daa560);
        color: #fff;
    }

    &.rank-normal {
        background: #e3f2fd;
        color: #1976d2;
    }
}

.ip-info {
    flex: 1;

    .flow-stats {
        margin-top: 8px;
        display: flex;
        gap: 25px;
    }

    .ip-address {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
    }

    .flow-rate {
        font-size: 16px;
        font-weight: bold;
        color: #67c23a;
    }
}


.current-flow {
    color: #e6a23c;
}

.avg-flow {
    color: #67c23a;
}

.max-flow {
    color: #f56c6c;
}

.update-time {
    text-align: right;
    font-size: 12px;
    color: #c0c4cc;
    min-width: 80px;
}

/* 空状态样式 */
.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #909399;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .cclass-rank-item {
        flex-wrap: wrap;
    }

    .flow-stats {
        flex-direction: column;
        gap: 4px;
        width: 100%;
        margin-top: 8px;
    }

    .update-time {
        width: 100%;
        text-align: left;
        margin-top: 4px;
    }
}
</style>
