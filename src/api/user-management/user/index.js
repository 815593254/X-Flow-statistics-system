import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/api/v1/oauth/token',
    method: 'post',
    params: params,
  })
}

export function getInfo(data) {
  return request({
    url: '/api/v1/dsoc/system/user/get/detail',
    method: 'post',
    data: data,
  })
}

export function getUserList(data) {
  return request({
    url: '/api/v1/dsoc/system/user/page/cascade',
    method: 'post',
    data: data,
  })
}

export function userCreate(data) {
  return request({
    url: '/api/v1/dsoc/system/user/insert/cascade',
    method: 'post',
    data: data,
  })
}

export function userUpdate(data) {
  return request({
    url: '/api/v1/dsoc/system/user/update/cascade',
    method: 'post',
    data: data,
  })
}

export function userDelete(data) {
  return request({
    url: '/api/v1/dsoc/system/user/delete/cascade',
    method: 'post',
    data: data,
  })
}

export function resetPassword(data) {
  return request({
    url: '/api/v1/dsoc/system/user/update/cascade',
    method: 'post',
    data: data,
  })
}

