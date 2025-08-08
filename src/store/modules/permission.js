import { asyncRoutes, constantRoutes } from '@/router'
import _ from 'lodash'
// import store from '@/store'

/**
 * 用路由的 meta.role 属性，判断该权限列表是否有该的路由权限
 * @param roles 权限列表
 * @param route 路由
 * @returns 是否有路由权限
 */
function hasPermission(user_info, route) {
  if (route.meta && route.meta.number) {
    return user_info.permissionList.indexOf(route.meta.number) !== -1
  } else {
    return false
  }
}

/**
 * 过滤获取当前用户有权限的路由
 * @param routes 需要权限的路由列表
 * @param roles  用户权限列表
 * @param isAdmin 是否超级用户
 * @returns 有权限的路由列表
 */
var no_control_permission = ['/monitor']
export function filterAsyncRoutes(routes, user_info) {
  var res = []
  routes.forEach(route => {
    var tmp = { ...route }
    var flag = false
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, user_info)
      if (tmp.children.length > 0) {
        flag = true
      }
    }

    if (no_control_permission.indexOf(tmp.path) !== -1) {
      flag = true
    } else if (hasPermission(user_info, tmp)) {
      flag = true
    }
    // if (user_info.is_admin && user_info.role_type === tmp.meta.role_type) {
    //   flag = true
    // }
    // if (user_info.is_super_admin) {
    //   flag = true
    // }
    if (flag) {
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menuData: [],
  permissionTipVisible: false,
  tipTitle: '',
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION_TIP: (state, value) => {
    state.permissionTipVisible = value
  },
  SET_TIP_TITLE: (state, value) => {
    state.tipTitle = value
  },
  SET_MENU_DATA: (state, value) => {
    state.menuData = value
  },
}

const actions = {
  // 生成权限路由列表
  generateRoutes({ commit }, user_info) {
    return new Promise(resolve => {
      var accessedRoutes = filterAsyncRoutes(asyncRoutes, user_info)
      // var accessedRoutes = asyncRoutes
      commit('SET_MENU_DATA', _.cloneDeep(asyncRoutes))
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // 权限提示
  permissionTip({ commit }, { value, title }) {
    commit('SET_PERMISSION_TIP', value)
    commit('SET_TIP_TITLE', title)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
