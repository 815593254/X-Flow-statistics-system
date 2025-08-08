import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import moment from 'moment'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  showPassword: false,
  showPasswordClose: true,
  showLicense: false, // 是否弹出激活弹窗
  lastRequest: moment().unix(),
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SHOWPASSWORD: (state, show) => {
    state.showPassword = show
  },
  SET_SHOWPASSWORDCLOSE: (state, show) => {
    state.showPasswordClose = show
  },
  SET_LAST_REQUEST: (state, timestamp) => {
    state.lastRequest = timestamp
  },
  SET_SHOWLICENSE: (state, show) => {
    state.showLicense = show
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setShowPassword({ commit }, show) {
    commit('SET_SHOWPASSWORD', show)
  },
  setShowPasswordClose({ commit }, show) {
    commit('SET_SHOWPASSWORDCLOSE', show)
  },
  setShowLicense({ commit }, show) {
    commit('SET_SHOWLICENSE', show)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
