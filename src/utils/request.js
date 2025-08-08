import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import i18n from '@/lang'
import moment from 'moment'

// create an axios instance
var tips_count = 0
// var baseUrl = window.location.protocol + '//' + window.location.hostname + ':8008'
// var baseUrl = 'http://my.pinghome.cn:8096'
var baseUrl = 'http://47.113.145.208:8098'
// var baseUrl = 'http://127.0.0.1:8096'
// var baseUrl = 'http://10.1.25.99:8116'
// var baseUrl = 'http://10.1.25.85:8116'
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: baseUrl,
  // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 检查是否超过超时时间
    var login_timeout_seconds = store.state.user.login_timeout_minute * 60
    var last_login_time = store.state.user.user_info.last_login_time
    if ((login_timeout_seconds + last_login_time) < moment().unix()) {
      // 重新登录
      MessageBox.alert(i18n.t('operation.illegalToken'), i18n.t('common.tips'), {
        confirmButtonText: i18n.t('button.reLogin'),
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      store.commit('app/SET_LAST_REQUEST', moment().unix())
      if (store.getters.token) {
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
      return config
    }
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.headers['content-type'].indexOf('application/json') !== -1) {
      if (response.data) {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== '000000') {
          if (res.code === '200010') {
            // 重新登录
            MessageBox.alert('账号信息已过期，请重新登录。', '提示', {
              confirmButtonText: '重新登录',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          } else {
            Message({
              message: res.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
            return Promise.reject(new Error(res.message || 'Error'))
          }
        } else {
          return res
        }
      }
    } else {
      return response
    }
  },
  error => {
    if (error.response.status === 401) {
      // 重新登录
      MessageBox.alert(i18n.t('operation.illegalToken'), i18n.t('common.tips'), {
        confirmButtonText: i18n.t('button.reLogin'),
        type: 'warning',
        showClose: false
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      // return Promise.reject(new Error(error.response.data.errors || 'Error'))
    } else if (error.response.status === 412) {
      tips_count += 1
      if (tips_count === 1) {
        store.dispatch('app/setShowPasswordClose', false)
        store.dispatch('app/setShowPassword', true)
        Message({
          message: '密码已过期，请重置！',
          type: 'error',
          duration: 5 * 1000,
          customClass: 'zZindex'
        })
      }
      return Promise.reject(new Error(error.response.data.errors || 'Error'))
    } else if (error.response.data.code === 50001) { // 参数校验错误
      Message({
        message: i18n.t('valid.args_error'),
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    } else {
      Message({
        message: error.response.data.errors,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
