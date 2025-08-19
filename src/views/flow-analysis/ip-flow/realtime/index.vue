<template>
    <div class="realtime-flow-container">
        <!-- 筛选条件 -->
        <el-card >
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
        <el-card style="margin-top: 10px;" v-loading="loading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
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
    </div>
</template>

<script>
import { request } from '@/utils/request'
import { getIpFlowApi } from '@/api/flow-analysis/ip-flow'

export default {
    name: 'IpFlowRealtime',
    data() {
        return {
            loading: false,
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
            lastUpdateTime: ''
        }
    },
    mounted() {
        // 检查路由参数中是否有IP
        if (this.$route.query.ip) {
            this.queryForm.ip = this.$route.query.ip
            this.queryParams.ip = this.$route.query.ip
        }
        
        this.initChart()
        this.loadInitialData()
        this.startAutoUpdate()
    },
    watch: {
        // 监听路由变化，更新IP参数
        '$route'(to, from) {
            if (to.query.ip && to.query.ip !== this.queryParams.ip) {
                this.queryForm.ip = to.query.ip
                this.queryParams.ip = to.query.ip
                // 如果IP改变了，重新加载数据
                this.loadInitialData()
            }
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
            // if (!this.queryParams.ip) {
            //     // this.$message.warning('请输入IP地址进行查询')
            //     return
            // }

            const endTime = Date.now()
            const startTime = endTime - 5 * 60 * 1000 // 5分钟前

            try {
                this.loading = true
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
                this.loading = false
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
            this.startAutoUpdate()
        },

        // 启动自动更新
        startAutoUpdate() {
            this.stopAutoUpdate() // 先清理已有的定时器
            this.timer = setInterval(() => {
                this.loadInitialData()
            }, 10000) // 每秒更新一次
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
        }
    }
}
</script>

<style scoped>
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

.status-value {
    font-size: 24px;
    font-weight: bold;
    color: #409eff;
    margin-bottom: 5px;
}

.status-label {
    font-size: 14px;
    color: #666;
}

.charts-container {
    margin-bottom: 20px;
}

.chart-wrapper {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.chart-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.chart-info {
    font-size: 12px;
    color: #999;
}
</style>