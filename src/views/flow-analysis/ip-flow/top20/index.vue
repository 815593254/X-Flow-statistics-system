<template>
  <div class="components-content">
    <el-row :gutter="20">
      <!-- IP TOP20 排名 -->
      <el-col :span="12">
        <el-card class="top20-card" v-loading="isLoading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
          <div slot="header" class="card-header">
            <span>Top IP 排名</span>
            <el-button type="text" @click="refreshData" :loading="isLoading">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          
          <div class="ranking-list">
            <div 
              v-for="(item, index) in ipTop20" 
              :key="index"
              class="ranking-item"
              @click="navigateToIpFlow(item.ip)"
            >
              <div class="rank-number" :class="getRankClass(index + 1)">
                #{{ index + 1 }}
              </div>
              <div class="ip-info">
                <div class="ip-address">{{ item.ip }}</div>
                <div class="flow-rate">{{ formatBps(item.rate_bps) }}</div>
              </div>
              <div class="timestamp">
                {{ parseTime(item.ts_ms, '{h}:{i}:{s}') }}
              </div>
            </div>
          </div>
          
          <div v-if="ipTop20.length === 0 && !isLoading" class="no-data">
            暂无数据
          </div>
        </el-card>
      </el-col>
      
      <!-- C段 TOP20 排名 -->
      <el-col :span="12">
        <el-card class="top20-card" v-loading="isLoading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
          <div slot="header" class="card-header">
            <span>Top C段 排名</span>
            <el-button type="text" @click="refreshData" :loading="isLoading">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          
          <div class="ranking-list">
            <div 
              v-for="(item, index) in cClass20" 
              :key="index"
              class="ranking-item"
              @click="navigateToIpFlow(item.ip)"
            >
              <div class="rank-number" :class="getRankClass(index + 1)">
                #{{ index + 1 }}
              </div>
              <div class="ip-info">
                <div class="ip-address">{{ item.ip }}</div>
                <div class="flow-rate">{{ formatBps(item.rate_bps) }}</div>
              </div>
              <div class="timestamp">
                {{ parseTime(item.ts_ms, '{h}:{i}:{s}') }}
              </div>
            </div>
          </div>
          
          <div v-if="cClass20.length === 0 && !isLoading" class="no-data">
            暂无数据
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最后更新时间 -->
    <div class="update-info" v-if="lastUpdateTime">
      <i class="el-icon-time"></i>
      最后更新时间：{{ lastUpdateTime }}
    </div>
  </div>
</template>

<script>
import { getTop20Flow } from '@/api/flow-analysis/top20'
import { parseTime } from '@/utils'

export default {
  name: 'Top20Flow',
  data() {
    return {
      parseTime,
      isLoading: false,
      ipTop20: [],
      cClass20: [],
      lastUpdateTime: '',
      refreshTimer: null
    }
  },
  mounted() {
    this.getTop20Data()
    // 设置自动刷新，每30秒刷新一次
    this.startAutoRefresh()
  },
  beforeDestroy() {
    this.stopAutoRefresh()
  },
  methods: {
    // 获取TOP20数据
    async getTop20Data() {
      try {
        this.isLoading = true
        const response = await getTop20Flow()
        
        if (response.code === '000000') {
          this.ipTop20 = response.body.ipTop20 || []
          this.cClass20 = response.body.cClass20 || []
          this.lastUpdateTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
        } else {
          this.$message.error('获取TOP20数据失败：' + response.message)
        }
      } catch (error) {
        console.error('获取TOP20数据失败:', error)
        this.$message.error('获取TOP20数据失败')
      } finally {
        this.isLoading = false
      }
    },
    
    // 刷新数据
    async refreshData() {
      await this.getTop20Data()
      this.$message.success('数据刷新成功')
    },
    
    // 开始自动刷新
    startAutoRefresh() {
      this.refreshTimer = setInterval(() => {
        this.getTop20Data()
      }, 30000) // 30秒刷新一次
    },
    
    // 停止自动刷新
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    },
    
    // 跳转到IP实时流量页面
    navigateToIpFlow(ip) {
      this.$router.push({
        path: '/flow-analysis/ip-flow/realtime',
        query: { ip: ip }
      })
    },
    
    // 格式化流量值
    formatBps(bps) {
      if (!bps) return '0 bps'
      
      if (bps >= 1000000000) {
        return (bps / 1000000000).toFixed(2) + ' Gbps'
      } else if (bps >= 1000000) {
        return (bps / 1000000).toFixed(2) + ' Mbps'
      } else if (bps >= 1000) {
        return (bps / 1000).toFixed(2) + ' Kbps'
      }
      return bps.toFixed(0) + ' bps'
    },
    
    // 获取排名样式类
    getRankClass(rank) {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      return 'rank-normal'
    }
  }
}
</script>

<style lang="scss" scoped>
.components-content {
  padding: 15px 0 0 0;
}

.top20-card {
  height: 600px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
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
  cursor: pointer;
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

.timestamp {
  font-size: 12px;
  color: #909399;
  min-width: 60px;
  text-align: right;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 60px 0;
  font-size: 14px;
}

.update-info {
  margin-top: 20px;
  text-align: center;
  color: #909399;
  font-size: 12px;
  
  i {
    margin-right: 4px;
  }
}

// 滚动条样式
.ranking-list::-webkit-scrollbar {
  width: 6px;
}

.ranking-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.ranking-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  
  &:hover {
    background: #a8a8a8;
  }
}
</style>
