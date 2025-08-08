<template>
  <div class="history-flow-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="接口名称">
          <el-input v-model="queryParams.interfaceName" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="statistics-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.totalRequests }}</div>
            <div class="stat-label">总请求数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.avgResponseTime }}ms</div>
            <div class="stat-label">平均响应时间</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.errorRate }}%</div>
            <div class="stat-label">错误率</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.peakQps }}</div>
            <div class="stat-label">峰值QPS</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="chart-wrapper">
            <div class="chart-title">历史流量趋势</div>
            <div id="historyChart" style="width: 100%; height: 400px;"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'requestTime', order: 'descending'}"
      >
        <el-table-column prop="requestTime" label="请求时间" width="180" sortable />
        <el-table-column prop="interfaceName" label="接口名称" min-width="150" />
        <el-table-column prop="requestCount" label="请求次数" width="120" sortable />
        <el-table-column prop="responseTime" label="响应时间(ms)" width="130" sortable />
        <el-table-column prop="statusCode" label="状态码" width="100" />
        <el-table-column prop="clientIp" label="客户端IP" width="130" />
        <el-table-column prop="userAgent" label="用户代理" min-width="200" show-overflow-tooltip />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterfaceFlowHistory',
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        interfaceName: '',
        dateRange: []
      },
      statistics: {
        totalRequests: 125684,
        avgResponseTime: 245,
        errorRate: 3.2,
        peakQps: 450
      },
      tableData: [
        {
          requestTime: '2025-08-07 14:30:25',
          interfaceName: '/api/user/login',
          requestCount: 1,
          responseTime: 120,
          statusCode: 200,
          clientIp: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          requestTime: '2025-08-07 14:30:20',
          interfaceName: '/api/data/query',
          requestCount: 1,
          responseTime: 350,
          statusCode: 200,
          clientIp: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          requestTime: '2025-08-07 14:29:45',
          interfaceName: '/api/file/upload',
          requestCount: 1,
          responseTime: 2800,
          statusCode: 500,
          clientIp: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        }
      ]
    }
  },
  mounted() {
    this.getList()
    this.initCharts()
  },
  methods: {
    getList() {
      this.loading = true
      // 模拟API调用
      setTimeout(() => {
        this.total = 100
        this.loading = false
      }, 1000)
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        interfaceName: '',
        dateRange: []
      }
      this.getList()
    },
    exportData() {
      this.$message.success('导出功能开发中...')
    },
    initCharts() {
      // 这里需要引入 echarts 来初始化图表
      console.log('初始化历史流量图表')
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
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 28px;
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

.table-container {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
