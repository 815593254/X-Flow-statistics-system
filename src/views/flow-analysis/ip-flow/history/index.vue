<template>
  <div class="ip-history-flow-container">
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
            <div class="stat-value">{{ statistics.uniqueIps }}</div>
            <div class="stat-label">独立IP数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.totalRequests }}</div>
            <div class="stat-label">总访问量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.riskIps }}</div>
            <div class="stat-label">风险IP数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ statistics.blockedIps }}</div>
            <div class="stat-label">已拉黑IP数</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-wrapper">
            <div class="chart-title">IP访问趋势</div>
            <div id="ipTrendChart" style="width: 100%; height: 350px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrapper">
            <div class="chart-title">地区访问分布</div>
            <div id="regionDistributionChart" style="width: 100%; height: 350px;"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'accessTime', order: 'descending'}"
      >
        <el-table-column prop="accessTime" label="访问时间" width="180" sortable />
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
        <el-table-column prop="requestCount" label="请求次数" width="120" sortable />
        <el-table-column prop="region" label="地区" width="120" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="isp" label="运营商" width="120" />
        <el-table-column prop="userAgent" label="用户代理" min-width="200" show-overflow-tooltip />
        <el-table-column prop="totalFlow" label="总流量" width="120" sortable />
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
  name: 'IpFlowHistory',
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipAddress: '',
        region: '',
        dateRange: []
      },
      statistics: {
        uniqueIps: 2580,
        totalRequests: 125684,
        riskIps: 45,
        blockedIps: 12
      },
      tableData: [
        {
          accessTime: '2025-08-07 14:30:25',
          ipAddress: '192.168.1.100',
          requestCount: 15,
          region: '北京',
          city: '北京',
          isp: '电信',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          totalFlow: '2.5MB',
          riskLevel: 'normal'
        },
        {
          accessTime: '2025-08-07 14:30:20',
          ipAddress: '203.125.45.67',
          requestCount: 8,
          region: '上海',
          city: '上海',
          isp: '联通',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          totalFlow: '1.8MB',
          riskLevel: 'low'
        },
        {
          accessTime: '2025-08-07 14:29:45',
          ipAddress: '45.123.67.89',
          requestCount: 156,
          region: '美国',
          city: '纽约',
          isp: '未知',
          userAgent: 'Bot/Crawler 1.0',
          totalFlow: '25.6MB',
          riskLevel: 'high'
        },
        {
          accessTime: '2025-08-07 14:28:30',
          ipAddress: '118.89.45.23',
          requestCount: 23,
          region: '广东',
          city: '深圳',
          isp: '移动',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          totalFlow: '3.2MB',
          riskLevel: 'medium'
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
        this.total = 500
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
        ipAddress: '',
        region: '',
        dateRange: []
      }
      this.getList()
    },
    exportData() {
      this.$message.success('导出功能开发中...')
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
    initCharts() {
      // 这里需要引入 echarts 来初始化图表
      console.log('初始化IP历史流量图表')
    }
  }
}
</script>

<style scoped>
.ip-history-flow-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
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
