<template>
  <div class="navbar">
    <!-- 收缩左侧侧边栏的那个按钮 -->
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <div class="left-menu">
      <logo v-if="showLogo" :collapse="isCollapse" />
      <div class="logo-title">
        <p>{{ $t('wafTitle') }}</p>
      </div>
    </div>
    <!-- 面包屑 -->
    <!--<breadcrumb id="breadcrumb-container" class="breadcrumb-container" />-->

    <!-- 右侧按钮 -->
    <div class="right-menu">
      <!-- <search id="header-search" class="right-menu-item" /> -->

      <!--  <error-log class="errLog-container right-menu-item hover-effect" />-->

      <!--<screenfull v-if="device!=='mobile'" id="screenfull" class="right-menu-item hover-effect" />-->

      <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      <!--<lang-select class="right-menu-item hover-effect" />-->

      <el-dropdown class="user-container right-menu-item hover-effect" trigger="click">
        <span class="el-dropdown-link right-menu-item-username">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- 个人中心 -->
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link> -->

          <!-- 首页 -->
          <!-- <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link> -->

          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->

          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->

          <!-- 修改密码 -->
          <el-dropdown-item @click.native="show(true)">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>

          <!-- 退出登录 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import LangSelect from '@/components/LangSelect'
import Logo from '@/layout/components/Sidebar/Logo'

export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    // ErrorLog,
    Logo,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'name',
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    show(val) {
      this.$store.dispatch('app/setShowPassword', val)
      this.$store.dispatch('app/setShowPasswordClose', true)
    },
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push({ name: 'Login' })
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navbarHeight;
  overflow: hidden;
  position: relative;
  background: $navbarBackground;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.40);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-menu {
    float: left;
    display: flex;
    .logo-title{
      color: #ffffff;
      font-size: 20px;
      height: $navbarHeight;
      line-height: $navbarHeight;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #ffffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }

      .right-menu-item-username{
          display: block;
          height: 100%;
      }
    }

    .user-container {
      margin-right: 30px;
    }
  }

  msgbox-fade-enter-active{-webkit-animation:msgbox-fade-in .3s;animation:msgbox-fade-in .3s}
  @-webkit-keyframes msgbox-fade-in{0%{-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0);opacity:0}100%{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}}

}
</style>
