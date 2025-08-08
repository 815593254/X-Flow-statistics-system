/**
 * Created by PanJiaChen on 16/11/18.
 */

import i18n from '@/lang'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername() {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * IPV4 IP 地址格式检查
 * @param {string} ip
 * @returns {Boolean}
 */
export function validIpv4(ip) {
  const reg = /^([1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])(\.([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
  return reg.test(ip)
}

/**
 * 密码复杂度过滤
 * @param {string} password
 * @returns {Boolean}
 */
export function validatePassword(password) {
  // 至少8位
  var pattern1 = /^.{8,16}$/
  if (!pattern1.test(password)) {
    return { success: false, msg: i18n.t('密码至少8位') }
  }

  // 大小写+数字+字符
  var pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).*$/
  if (!pattern.test(password)) {
    return { success: false, msg: i18n.t('密码要包含大小写，数字和字符') }
  }
  return { success: true, msg: '' }
}

/**
 * 简单校验密码
 * @param {string} password
 * @returns {Boolean}
 */
export function simpleValidatePassword(password) {
  // 至少6位
  var pattern1 = /^.{6,16}$/
  if (!pattern1.test(password)) {
    return { success: false, msg: i18n.t('密码至少6位') }
  }
  return { success: true, msg: '' }
}

/**
 * 检查密码是否一致
 * @param {string} password1  密码
 * @param {string} password2  确认密码
 * @returns {Boolean}
 */
export function validatePassword2(password1, password2) {
  if (password1 !== password2) {
    return { success: false, msg: i18n.t('valid.user.passwordDiff') }
  } else {
    return { success: true, msg: '' }
  }
}

/**
 * 检查是否合法端口
 * @param {string} port
 * @returns {Boolean}
 */
export function validPort(port) {
  const reg = /^\d+$/
  if (!reg.test(port)) {
    return false
  }
  if (parseInt(port) <= 0 || parseInt(port) > 65535) {
    return false
  }
  return true
}

/**
 * 检查是否合法电话号码
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
  if (!reg.test(phone)) {
    return false
  }
  return true
}

