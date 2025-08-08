<template>
  <div class="ip-history-flow-container">
    <el-card style="margin-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-date-picker v-model="queryParams.dateRange" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" />
        </el-col>

        <el-col :span="6">
          <el-input v-model="queryParams.ip" placeholder="请输入IP地址" clearable />
        </el-col>

        <el-col :span="4">
          <div>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-value">{{ formatBytes(statistics.avgRateBps) }}</div>
              <div class="stat-label">平均流量 (bps)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-value">{{ formatBytes(statistics.peakRateBps) }}</div>
              <div class="stat-label">峰值流量 (bps)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-value">{{ formatBytes(statistics.avgAvgBps) }}</div>
              <div class="stat-label">平均流量均值 (bps)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-value">{{ formatBytes(statistics.peakMaxBps) }}</div>
              <div class="stat-label">峰值最大流量 (bps)</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chart-wrapper">
            <div class="chart-title">IP流量历史趋势</div>
            <div id="ipHistoryChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getIpFlowApi } from '@/api/flow-analysis/ip-flow'

export default {
  name: 'IpFlowHistory',
  data() {
    return {
      loading: false,
      chart: null,
      queryParams: {
        ip: '',
        dateRange: []
      },
      // 时间选择器配置
      pickerOptions: {
        disabledDate(time) {
          // 禁用今天之后的日期
          return time.getTime() > Date.now()
        }
      },
      statistics: {
        avgRateBps: 0,
        peakRateBps: 0,
        avgAvgBps: 0,
        peakMaxBps: 0
      },
      chartData: {
        timeData: [],
        rateBpsData: [],
        avgBpsData: [],
        maxBpsData: []
      }
    }
  },
  mounted() {
    // 设置默认时间范围为最近24小时
    this.setDefaultTimeRange()
    this.initCharts()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    // 设置默认时间范围
    setDefaultTimeRange() {
      const end = new Date()
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000) // 24小时前
      this.queryParams.dateRange = [
        this.formatDateTime(start),
        this.formatDateTime(end)
      ]
    },

    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 加载数据
    async loadData() {
      if (!this.queryParams.ip) {
        this.$message.warning('请输入IP地址')
        return
      }

      if (!this.queryParams.dateRange || this.queryParams.dateRange.length !== 2) {
        this.$message.warning('请选择时间范围')
        return
      }

      try {
        this.loading = true
        const startTime = new Date(this.queryParams.dateRange[0]).getTime()
        const endTime = new Date(this.queryParams.dateRange[1]).getTime()

        const data = {
          ip: this.queryParams.ip, // IP是必填参数
          condition: {
            begin: startTime,
            end: endTime
          },
          page: {
            pageNo: 0 // 全量查询
          }
        }

        const response = await getIpFlowApi(data)
        if (response.code === '000000' && response.body.results) {
          this.processData(response.body.results)
          this.updateChart()
        } else {
          this.$message.error('获取数据失败')
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },

    // 处理数据并计算统计信息
    processData(results) {
      if (!results || results.length === 0) {
        this.statistics = {
          avgRateBps: 0,
          peakRateBps: 0,
          avgAvgBps: 0,
          peakMaxBps: 0
        }
        this.chartData = {
          timeData: [],
          rateBpsData: [],
          avgBpsData: [],
          maxBpsData: []
        }
        return
      }

      // 重置图表数据
      this.chartData.timeData = []
      this.chartData.rateBpsData = []
      this.chartData.avgBpsData = []
      this.chartData.maxBpsData = []

      let totalRateBps = 0
      let totalAvgBps = 0
      let maxRateBps = 0
      let maxAvgBps = 0
      let maxMaxBps = 0
      let avgBpsCount = 0
      let maxBpsCount = 0

      results.forEach(item => {
        const rateBps = item.rate_bps || 0
        const avgBps = item.avg_bps || null
        const maxBps = item.max_bps || null

        this.chartData.timeData.push(item.ts_ms)
        this.chartData.rateBpsData.push(rateBps)
        this.chartData.avgBpsData.push(avgBps)
        this.chartData.maxBpsData.push(maxBps)

        totalRateBps += rateBps
        maxRateBps = Math.max(maxRateBps, rateBps)

        if (avgBps !== null) {
          totalAvgBps += avgBps
          avgBpsCount++
          maxAvgBps = Math.max(maxAvgBps, avgBps)
        }

        if (maxBps !== null) {
          maxBpsCount++
          maxMaxBps = Math.max(maxMaxBps, maxBps)
        }
      })

      // 计算统计信息
      const count = results.length
      this.statistics = {
        avgRateBps: count > 0 ? Math.round(totalRateBps / count) : 0,
        peakRateBps: maxRateBps,
        avgAvgBps: avgBpsCount > 0 ? Math.round(totalAvgBps / avgBpsCount) : 0,
        peakMaxBps: maxMaxBps
      }
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
            { data: this.chartData.avgBpsData },
            { data: this.chartData.maxBpsData }
          ]
        })
      }
    },

    // 查询
    handleQuery() {
      this.loadData()
    },

    // 重置
    resetQuery() {
      this.queryParams = {
        ip: '',
        dateRange: []
      }
      this.setDefaultTimeRange()
      // 重置后清空图表和统计数据
      this.statistics = {
        avgRateBps: 0,
        peakRateBps: 0,
        avgAvgBps: 0,
        peakMaxBps: 0
      }
      this.chartData = {
        timeData: [],
        rateBpsData: [],
        avgBpsData: [],
        maxBpsData: []
      }
      this.updateChart()
    },

    // 初始化图表
    initCharts() {
      this.chart = this.$echarts.init(document.getElementById('ipHistoryChart'))

      const option = {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => {
            const timeStr = this.formatTime(params[0].axisValue)
            let tooltip = `时间: ${timeStr}<br/>`
            params.forEach(param => {
              if (param.value !== null && param.value !== undefined) {
                const value = this.formatBytes(param.value)
                tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`
              }
            })
            return tooltip
          }
        },
        legend: {
          data: ['当前流量(bps)', '平均流量(bps)', '最大流量(bps)'],
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
              return this.formatTime(value, 'MM-dd HH:mm')
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
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(64, 158, 255, 0.3)'
                }, {
                  offset: 1, color: 'rgba(64, 158, 255, 0.1)'
                }]
              }
            }
          },
          {
            name: '平均流量(bps)',
            type: 'line',
            yAxisIndex: 0,
            data: this.chartData.avgBpsData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              color: '#67C23A',
              width: 2
            },
            connectNulls: false // 不连接空值点
          },
          {
            name: '最大流量(bps)',
            type: 'line',
            yAxisIndex: 0,
            data: this.chartData.maxBpsData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              color: '#E6A23C',
              width: 2
            },
            connectNulls: false // 不连接空值点
          }
        ]
      }

      this.chart.setOption(option)

      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
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
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      if (format === 'MM-dd HH:mm') {
        return `${month}-${day} ${hours}:${minutes}`
      }
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.ip-history-flow-container {
  padding: 0;
}

.filter-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.statistics-container {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
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

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}
</style>
