<template>
  <div class="ip-realtime-flow-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="IP地址">
          <el-input v-model="queryParams.ipAddress" placeholder="请输入IP地址" clearable />
        </el-form-item>
        <el-form-item label="地区">
          <el-select v-model="queryParams.region" placeholder="请选择地区" clearable>
            <el-option label="北京" value="beijing" />
            <el-option label="上海" value="shanghai" />
            <el-option label="广东" value="guangdong" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="queryParams.riskLevel" placeholder="请选择风险等级" clearable>
            <el-option label="高危" value="high" />
            <el-option label="中危" value="medium" />
            <el-option label="低危" value="low" />
            <el-option label="正常" value="normal" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-wrapper">
            <div class="chart-title">IP访问量Top10</div>
            <div id="ipTopChart" style="width: 100%; height: 300px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <div class="chart-title">地区分布统计</div>
            <div id="regionChart" style="width: 100%; height: 300px;"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'requestCount', order: 'descending'}"
      >
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
        <el-table-column prop="requestCount" label="请求次数" width="120" sortable />
        <el-table-column prop="region" label="地区" width="120" />
        <el-table-column prop="isp" label="运营商" width="120" />
        <el-table-column prop="riskLevel" label="风险等级" width="100">
          <template slot-scope="scope">
            <el-tag 
              :type="getRiskLevelType(scope.row.riskLevel)"
              size="small"
            >
              {{ getRiskLevelText(scope.row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastAccessTime" label="最后访问时间" width="180" />
        <el-table-column prop="totalFlow" label="总流量" width="120" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button 
              type="text" 
              size="small" 
              @click="viewDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              style="color: #f56c6c"
              @click="blockIp(scope.row)"
            >
              拉黑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IpFlowRealtime',
  data() {
    return {
      loading: false,
      queryParams: {
        ipAddress: '',
        region: '',
        riskLevel: ''
      },
      tableData: [
        {
          ipAddress: '192.168.1.100',
          requestCount: 1250,
          region: '北京',
          isp: '电信',
          riskLevel: 'normal',
          lastAccessTime: '2025-08-07 14:30:25',
          totalFlow: '2.5MB'
        },
        {
          ipAddress: '203.125.45.67',
          requestCount: 890,
          region: '上海',
          isp: '联通',
          riskLevel: 'low',
          lastAccessTime: '2025-08-07 14:30:20',
          totalFlow: '1.8MB'
        },
        {
          ipAddress: '45.123.67.89',
          requestCount: 3456,
          region: '美国',
          isp: '未知',
          riskLevel: 'high',
          lastAccessTime: '2025-08-07 14:29:45',
          totalFlow: '15.6MB'
        },
        {
          ipAddress: '118.89.45.23',
          requestCount: 567,
          region: '广东',
          isp: '移动',
          riskLevel: 'medium',
          lastAccessTime: '2025-08-07 14:28:30',
          totalFlow: '3.2MB'
        }
      ]
    }
  },
  mounted() {
    this.initCharts()
    this.startRealTimeUpdate()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    handleQuery() {
      this.loading = true
      // 模拟查询接口
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    resetQuery() {
      this.queryParams = {
        ipAddress: '',
        region: '',
        riskLevel: ''
      }
      this.handleQuery()
    },
    getRiskLevelType(level) {
      const typeMap = {
        high: 'danger',
        medium: 'warning',
        low: 'info',
        normal: 'success'
      }
      return typeMap[level] || 'info'
    },
    getRiskLevelText(level) {
      const textMap = {
        high: '高危',
        medium: '中危',
        low: '低危',
        normal: '正常'
      }
      return textMap[level] || '未知'
    },
    viewDetail(row) {
      this.$message.info(`查看 ${row.ipAddress} 的详细信息`)
    },
    blockIp(row) {
      this.$confirm(`确定要拉黑IP ${row.ipAddress} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('拉黑成功')
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    initCharts() {
      // 这里需要引入 echarts 来初始化图表
      console.log('初始化IP流量图表')
    },
    startRealTimeUpdate() {
      // 每30秒更新一次数据
      this.timer = setInterval(() => {
        this.updateRealTimeData()
      }, 30000)
    },
    updateRealTimeData() {
      // 更新实时数据
      console.log('更新IP实时数据')
    }
  }
}
</script>

<style scoped>
.ip-realtime-flow-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-wrapper {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.table-container {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}
</style>
