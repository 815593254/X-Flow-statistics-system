<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="实时流量" name="realtime"></el-tab-pane>
        <el-tab-pane label="历史流量" name="history"></el-tab-pane>
      </el-tabs>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterfaceFlow',
  data() {
    return {
      activeTab: 'realtime'
    }
  },
  mounted() {
    this.setActiveTab()
  },
  methods: {
    handleTabClick(tab) {
      this.$router.push(`/flow-analysis/interface-flow/${tab.name}`)
    },
    setActiveTab() {
      const path = this.$route.path
      if (path.includes('realtime')) {
        this.activeTab = 'realtime'
      } else if (path.includes('history')) {
        this.activeTab = 'history'
      }
    }
  },
  watch: {
    '$route'() {
      this.setActiveTab()
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;

}

.tab-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-container ::v-deep .el-tabs__header {
  margin: 0;
}

.tab-container ::v-deep .el-tabs__nav-wrap::after {
  height: 1px;
}

.tab-container ::v-deep .el-tabs__item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #606266;
}

.tab-container ::v-deep .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 500;
}

.tab-container ::v-deep .el-tabs__active-bar {
  background-color: #409eff;
}
</style>
