import request from '@/utils/request'

export function updatePassword(data) {
  return request({
    url: '/api/v1/dsoc/auth/oauth/update/login/pwd',
    method: 'post',
    data: data,
  })
}

