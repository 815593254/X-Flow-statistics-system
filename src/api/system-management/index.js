import request from '@/utils/request'

export function getLoginSafety(data) {
  return request({
    url: '/api/v1/dsoc/system/config/get/login/security/content',
    method: 'post',
    data: data
  })
}

export function updateLoginSafety(data) {
  return request({
    url: '/api/v1/dsoc/system/config/update/login/security',
    method: 'post',
    data: data
  })
}
