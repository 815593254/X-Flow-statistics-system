<template>
  <div class="history-flow-container">
    <el-card style="margin-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-date-picker v-model="queryParams.dateRange" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"  @change="handleQuery"/>
        </el-col>

        <el-col :span="6">
          <el-input v-model="queryParams.hostName" placeholder="请输入主机名" clearable />
        </el-col>

        <el-col :span="6">
          <el-input v-model="queryParams.interfaceName" placeholder="请输入接口名（PCIe地址）" clearable />
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
              <div class="stat-value">{{ formatPps(statistics.avgPps) }}</div>
              <div class="stat-label">平均包量 (pps)</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <div class="stat-value">{{ formatPps(statistics.peakPps) }}</div>
              <div class="stat-label">峰值包量 (pps)</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chart-wrapper">
            <div class="chart-title">历史流量趋势</div>
            <div id="historyChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getTrafficApi } from '@/api/flow-analysis/interface-flow'

export default {
  name: 'InterfaceFlowHistory',
  data() {
    return {
      loading: false,
      chart: null,
      queryParams: {
        hostName: '',
        interfaceName: '',
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
        avgPps: 0,
        peakPps: 0
      },
      chartData: {
        timeData: [],
        rateBpsData: [],
        ppsData: []
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
      if (!this.queryParams.dateRange || this.queryParams.dateRange.length !== 2) {
        this.$message.warning('请选择时间范围')
        return
      }

      try {
        this.loading = true
        const startTime = new Date(this.queryParams.dateRange[0]).getTime()
        const endTime = new Date(this.queryParams.dateRange[1]).getTime()

        const data = {
          condition: {
            begin: startTime,
            end: endTime
          },
          page: {
            pageSize: 0 // 全量查询
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
          avgPps: 0,
          peakPps: 0
        }
        this.chartData = {
          timeData: [],
          rateBpsData: [],
          ppsData: []
        }
        return
      }

      // 重置图表数据
      this.chartData.timeData = []
      this.chartData.rateBpsData = []
      this.chartData.ppsData = []

      let totalRateBps = 0
      let totalPps = 0
      let maxRateBps = 0
      let maxPps = 0

      results.forEach(item => {
        const rateBps = item.rate_bps || 0
        const pps = item.pps || 0
        const rateBpsAvg = item.rate_bps_avg || 0
        const ppsAvg = item.pps_avg || 0

        this.chartData.timeData.push(item.ts_ms)
        this.chartData.rateBpsData.push(rateBpsAvg)
        this.chartData.ppsData.push(ppsAvg)

        totalRateBps += rateBpsAvg
        totalPps += rateBpsAvg
        maxRateBps = Math.max(maxRateBps, rateBps)
        maxPps = Math.max(maxPps, pps)
      })

      // 计算统计信息
      const count = results.length
      this.statistics = {
        avgRateBps: count > 0 ? Math.round(totalRateBps / count) : 0,
        peakRateBps: maxRateBps,
        avgPps: count > 0 ? Math.round(totalPps / count) : 0,
        peakPps: maxPps
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
            { data: this.chartData.ppsData }
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
        hostName: '',
        interfaceName: '',
        dateRange: []
      }
      this.setDefaultTimeRange()
      this.loadData()
    },

    // 初始化图表
    initCharts() {
      this.chart = this.$echarts.init(document.getElementById('historyChart'))

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
            //   color: {
            //     type: 'linear',
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [{
            //       offset: 0, color: 'rgba(64, 158, 255, 0.3)'
            //     }, {
            //       offset: 1, color: 'rgba(64, 158, 255, 0.1)'
            //     }]
            //   }
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

      // 加载初始数据
      this.loadData()
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

      if (format === 'MM-dd HH:mm') {
        return `${month}-${day} ${hours}:${minutes}`
      }
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.history-flow-container {
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
