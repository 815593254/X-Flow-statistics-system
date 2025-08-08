<template>
  <div :class="{'has-logo':showLogo}">
    <el-dialog
      :title="generateTitle(tipTitle)"
      :visible.sync="permissionTipVisible"
      width="450px"
      :before-close="handlePermissionTipClose"
      :append-to-body="true"
    >
      <span />
      <div class="tip-icon">
        <img src="../../../../public/user-offline.svg">

      </div>
      <div slot="footer" class="permission-tip-btn">
        <el-tooltip class="item" effect="dark" :content="$t('navbar.developing') " placement="top">
          <el-button type="primary" size="small" @click="confirm">{{ $t('navbar.applyTrialLicense') }}</el-button>
        </el-tooltip>
        <el-button size="small" @click="cancel">{{ $t('operation.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>

    <div class="hamburder">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Hamburger from '@/components/Hamburger'
import { generateTitle } from '@/utils/i18n'
export default {
  components: { SidebarItem, Hamburger },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'permissionTipVisible',
      'tipTitle',
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    generateTitle,
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handlePermissionTipClose() {
      this.$store.commit('permission/SET_PERMISSION_TIP', false)
    },
    confirm() {
      // this.$store.commit('permission/SET_PERMISSION_TIP', false)
    },
    cancel() {
      this.$store.commit('permission/SET_PERMISSION_TIP', false)
    }
  }
}
</script>
