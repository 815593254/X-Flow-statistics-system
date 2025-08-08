<template>
  <div class="app-container">
    <div class="tab-container">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="实时流量" name="realtime"></el-tab-pane>
        <el-tab-pane label="历史流量" name="history"></el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'IpFlow',
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
      this.$router.push(`/flow-analysis/ip-flow/${tab.name}`)
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
.tab-container {
  margin-bottom: 20px;
}
</style>
