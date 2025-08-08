import { validPort, validEmail, validPhone, validIpv4 } from '@/utils/validate'
import i18n from '@/lang'

/**
 * 检查不能为空
 * @returns {Function}
 */
export function checkNull() {
  function check(rule, value, callback) {
    if (value === '') {
      callback(new Error(i18n.t('valid.null')))
      return
    }  
    callback()
  }
  return check
}

/**
 * 检查是否合法端口
 * @param {boolean} nullable 是否可以为空
 * @returns {Function}
 */
export function checkPort(nullable = false) {
  function check(rule, value, callback) {
    if (nullable && value === '') {
      callback()
      return
    } 
    if (!validPort(value)) {
      callback(new Error(i18n.t('valid.port')))
      return
    }     
    callback()
  }
  return check
}

/**
 * 检查是否合法邮箱地址
 * @param {boolean} nullable 是否可以为空
 * @returns {Function}
 */
export function checkEmail(nullable = false) {
  function check(rule, value, callback) {
    if (nullable && value === '') {
      callback()
      return
    } 
    if (!validEmail(value)) {
      callback(new Error(i18n.t('valid.email')))
      return
    }     
    callback()
  }
  return check
}

/**
 * 检查是否合法电话号码
 * @param {boolean} nullable 是否可以为空
 * @returns {Function}
 */
export function checkPhone(nullable = false) {
  function check(rule, value, callback) {
    if (nullable && value === '') {
      callback()
      return
    } 
    if (!validPhone(value)) {
      callback(new Error(i18n.t('valid.phone')))
      return
    }     
    callback()
  }
  return check
}

/**
 * 检查是否合法 ACL IP
 * @param {boolean} nullable 是否可以为空
 * @returns {Function}
 */
export function checkAclIp(nullable = false) {
  function check(rule, value, callback) {
    if (nullable && value === '') {
      callback()
      return
    } 
    if (value === 'all') {
      callback()
      return
    }
    var ip_list = value.split(/[,-]/)
    ip_list.forEach(i => {
      if (!validIpv4(i)) {
        callback(new Error(i18n.t('valid.ip')))
        return
      }
    })
    callback()
  }
  return check
}

/**
 * 检查是否合法 IP
 * @param {boolean} nullable 是否可以为空
 * @returns {Function}
 */
export function checkIp(nullable = false) {
  function check(rule, value, callback) {
    if (nullable && value === '') {
      callback()
      return
    } 
    if (!validIpv4(value)) {
      callback(new Error(i18n.t('valid.ip')))
      return
    }     
    callback()
  }
  return check
}

