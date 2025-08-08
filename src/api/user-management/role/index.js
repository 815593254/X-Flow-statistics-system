import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/api/v1/dsoc/system/role/page',
    method: 'post',
    data: data,
  })
}

export function roleCreate(data) {
  return request({
    url: '/api/v1/dsoc/system/role/insert/cascade',
    method: 'post',
    data: data,
  })
}

export function roleUpdate(data) {
  return request({
    url: '/api/v1/dsoc/system/role/update/cascade',
    method: 'post',
    data: data,
  })
}

export function roleDelete(data) {
  return request({
    url: '/api/v1/dsoc/system/role/delete/cascade',
    method: 'post',
    data: data,
  })
}
