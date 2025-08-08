<template>
  <section class="app-main app-main-flex">
    <!-- <div class="app-main-title">{{ title }}</div> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    title() {
      if (this.$route.path === '/index') {
        return '首页概览'
      } else {
        return this.$route.meta.title
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  //min-height: calc(100vh - 50px);
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;
  background-color: #eff2f5;
  .app-main-title{
    width: 100%;
    height: 40px;
    background-color: #ffffff;
    position: fixed;
    padding: 12px 25px;
    font-size: 16px;
    z-index: 2;
  }
}

.app-main-flex{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.fixed-header+.app-main {
  padding-top: 60px;
  min-width: $minWidthAppMain;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 93px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 0px;
  }
}
</style>
