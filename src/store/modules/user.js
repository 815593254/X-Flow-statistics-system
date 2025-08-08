import { login, getInfo } from '@/api/user-management/user/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import i18n from '@/lang'

const state = {
  token: getToken(),
  name: '',
  user_info: {},
  login_timeout_minute: 1440,
  pwdComplexity: 'complex',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_INFO: (state, user_info) => {
    state.user_info = user_info
  },
  SET_LOGIN_TIMEOUT_MINUTE: (state, login_timeout_minute) => {
    state.login_timeout_minute = login_timeout_minute
  },
  SET_PWD_COMPLEXITY: (state, pwdComplexity) => {
    state.pwdComplexity = pwdComplexity
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        client_id: 'GRG',
        client_secret: 'grg_dsoc',
        grant_type: 'password',
        username: username.trim(),
        password: password,
      }).then(response => {
        // const { data } = response
        commit('SET_TOKEN', response.body.access_token)
        setToken(response.body.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      // commit('SET_USER_INFO', {})
      // commit('SET_NAME', 'admin')
      // resolve({})
      getInfo({}).then(response => {
        const data = response.body
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        // const { username, login_timeout_minute, pwdComplexity } = data
        commit('SET_USER_INFO', data)
        commit('SET_NAME', data.systemUserName)
        commit('SET_LOGIN_TIMEOUT_MINUTE', '1440')
        commit('SET_PWD_COMPLEXITY', 'simple')
        resolve(data)
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', {})
      commit('SET_LOGIN_TIMEOUT_MINUTE', 1440)
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', {})
      commit('SET_LOGIN_TIMEOUT_MINUTE', 1440)
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  // 重置权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
