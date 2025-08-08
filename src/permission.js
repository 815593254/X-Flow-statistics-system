import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { getAuthInfoApi } from '@/api/system-management/auth-management/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['Login', 'redirect', 'notLogin', 'updatePassword'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
      // NProgress.done都是特意加上的。router.afterEach并不是一定会执行的。比如当页面在首页的时候手动跳转到login页面，router.afterEach是不会被触发的。
      NProgress.done()
    } else {
      // 判断是否授权
      // await getAuthInfoApi().then(response => {
      //   if (response.data.auth_remain === 0) {
      //     store.dispatch('app/setShowLicense', true)
      //   } else {
      //     store.dispatch("permission/setAuthRoutesShow", response.data.auth_function);
      //     store.dispatch('app/setShowLicense', false)
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.name
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 接口获取用户信息，包括用户权限
          const user_info = await store.dispatch('user/getInfo')
          // 生成路由列表
          const accessRoutes = await store.dispatch('permission/generateRoutes', user_info)
          // 添加路由
          router.addRoutes(accessRoutes)

          // 查看授权情况
          next({ ...to, replace: true })
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next({ path: store.state.permission.addRoutes[0].path })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.name) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
