<template>
    <div class="realtime-flow-container">
        <!-- 筛选条件 -->
        <el-card >
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="queryForm.hostName" placeholder="请输入主机名" clearable />
                </el-col>
                <el-col :span="6">
                    <el-input v-model="queryForm.interfaceName" placeholder="请输入接口名（PCIe地址）" clearable />
                </el-col>
                <el-col :span="6">
                    <div>
                        <el-button type="primary" @click="handleQuery">查询</el-button>
                        <el-button @click="resetQuery">重置</el-button>
                    </div>
                </el-col>
            </el-row>
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
                            <div class="status-value">{{ formatPps(latestData.pps || 0) }}</div>
                            <div class="status-label">当前包量 (pps)</div>
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
        <el-card style="margin-top: 10px;">
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="chart-wrapper">
                        <div class="chart-header">
                            <div class="chart-title">接口流量监控（最近5分钟）</div>
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
import { getTrafficApi } from '@/api/flow-analysis/interface-flow'

export default {
    name: 'InterfaceFlowRealtime',
    data() {
        return {
            loading: false,
            timer: null, // 定时器
            chart: null,
            queryForm: {
                hostName: '',
                interfaceName: ''
            },
            queryParams: {
                hostName: '',
                interfaceName: ''
            },
            chartData: {
                timeData: [], // 时间轴数据
                rateBpsData: [], // 流量数据
                ppsData: [] // 包量数据
            },
            latestData: {}, // 最新的一条数据
            maxRateBps: 0, // 5分钟内的峰值
            lastUpdateTime: ''
        }
    },
    mounted() {
        this.initChart()
        this.loadInitialData()
        this.startAutoUpdate()
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
                            const value = param.seriesName === '流量(bps)'
                                ? this.formatBytes(param.value)
                                : this.formatPps(param.value)
                            tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`
                        })
                        return tooltip
                    }
                },
                legend: {
                    data: ['流量(bps)', '包量(pps)'],
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
                    },
                    {
                        type: 'value',
                        name: '包量(pps)',
                        position: 'right',
                        axisLabel: {
                            formatter: (value) => this.formatPps(value)
                        }
                    }
                ],
                series: [
                    {
                        name: '流量(bps)',
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
                    {
                        name: '包量(pps)',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.chartData.ppsData,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 4,
                        lineStyle: {
                            color: '#67C23A',
                            width: 2
                        }
                    }
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
            const endTime = Date.now()
            const startTime = endTime - 5 * 60 * 1000 // 5分钟前

            try {
                this.loading = true
                const data = {
                    condition: {
                        begin: startTime,
                        end: endTime
                    },
                    page: {
                        pageSize: 0, // 全量查询
                    }
                }

                // 添加筛选条件
                if (this.queryParams.hostName) {
                    data.host_name = this.queryParams.hostName
                }
                if (this.queryParams.interfaceName) {
                    data.if_name = this.queryParams.interfaceName
                }

                const response = await getTrafficApi(data)
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
            this.chartData.ppsData = []

            results.forEach(item => {
                this.chartData.timeData.push(item.ts_ms)
                this.chartData.rateBpsData.push(item.rate_bps || 0)
                this.chartData.ppsData.push(item.pps || 0)
            })

            // 更新最新数据和峰值
            if (results.length > 0) {
                this.latestData = results[results.length - 1]
                this.maxRateBps = Math.max(...this.chartData.rateBpsData)
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
                        { data: this.chartData.ppsData }
                    ]
                })
            }
        },

        // 应用筛选
        handleQuery() {
            this.queryParams.hostName = this.queryForm.hostName
            this.queryParams.interfaceName = this.queryForm.interfaceName
            this.stopAutoUpdate()
            this.loadInitialData()
            this.startAutoUpdate()
        },

        // 启动自动更新
        startAutoUpdate() {
            this.stopAutoUpdate() // 先清理已有的定时器
            this.timer = setInterval(() => {
                this.loadInitialData()
            }, 1000) // 每秒更新一次
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
                hostName: '',
                interfaceName: ''
            }
            this.queryParams = {
                hostName: '',
                interfaceName: ''
            }
            this.handleQuery()
        },

        // 格式化字节数
        formatBytes(bytes) {
            if (bytes === 0) return '0 B'
            const k = 1024
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        },

        // 格式化包量数
        formatPps(pps) {
            if (pps === 0) return '0'
            const k = 1000
            const sizes = ['', 'K', 'M', 'G', 'T']
            const i = Math.floor(Math.log(pps) / Math.log(k))
            return parseFloat((pps / Math.pow(k, i)).toFixed(2)) + sizes[i]
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
