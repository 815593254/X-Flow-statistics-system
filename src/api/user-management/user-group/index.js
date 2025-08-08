import request from '@/utils/request'

export function getUserGroupList(data) {
  return request({
    url: '/api/v1/dsoc/system/user/group/page/cascade',
    method: 'post',
    data: data,
  })
}

export function userGroupCreate(data) {
  return request({
    url: '/api/v1/dsoc/system/user/group/insert/cascade',
    method: 'post',
    data: data,
  })
}

export function userGroupUpdate(data) {
  return request({
    url: '/api/v1/dsoc/system/user/group/update/cascade',
    method: 'post',
    data: data,
  })
}

export function userGroupDelete(data) {
  return request({
    url: '/api/v1/dsoc/system/user/group/delete/cascade',
    method: 'post',
    data: data,
  })
}
