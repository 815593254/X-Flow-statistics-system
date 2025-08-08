<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

    <!-- 右侧主界面 -->
    <div :class="{hasTagsView:needTagsView}" class="main-container main-container-flex">

      <!-- 面包屑，头部右侧按钮，tag按钮 -->
      <div :class="{'fixed-header':fixedHeader}" class="main-contrainer-flex-shrink">
        <!-- 面包屑及头部右侧按钮 -->
        <navbar @clickAbout="showAbout = true" />
        <!-- tag按钮 -->
        <tags-view v-if="needTagsView" />
      </div>

      <!-- 主要内容界面 -->
      <app-main />
    </div>
    <!-- 左侧导航栏 -->
    <sidebar class="sidebar-container" />

    <about v-if="showAbout" @clickOut="showAbout = false" />
    <Password />
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Sidebar, TagsView, About, Password } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    // RightPanel,
    Sidebar,
    TagsView,
    About,
    Password,
    // License,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showAbout: false,
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      language: state => state.app.language,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    language() {
      if (this.language === 'en') {
        document.getElementsByTagName('body')[0].style.setProperty('--sideBarWidth', '230px')// 括号里写root中定义的变量和改变后的值
      } else {
        document.getElementsByTagName('body')[0].style.setProperty('--sideBarWidth', '210px')
      }
    }
  },
  async mounted() {
    if (this.language === 'en') {
      document.getElementsByTagName('body')[0].style.setProperty('--sideBarWidth', '230px')// 括号里写root中定义的变量和改变后的值
    } else {
      document.getElementsByTagName('body')[0].style.setProperty('--sideBarWidth', '210px')
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/mixin.scss';
  @import '~@/styles/variables.scss';

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 101;
    width: 100%;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: 100%
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .main-container-flex{
    display: flex;
    flex-direction: column;
  }

  .main-contrainer-flex-shrink{
    flex-shrink: 0;
    z-index: 1111;
  }
</style>
