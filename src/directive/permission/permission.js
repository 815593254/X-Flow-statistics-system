import store from '@/store'

// v-permission="'2-see'" 2是pid值，see是label值
function checkPermission(el, binding) {
  const { value } = binding
  const role_permission = store.getters && store.getters.user_info.permissionList
  if (value && value.length > 0) {
    if (role_permission.indexOf(value) === -1) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-permission="'2-see'"`)
  }
}

export default {
  bind(el, binding) {
    checkPermission(el, binding)
  },
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
