import request from '@/utils/request'

export function getTypeTreeData(data) {
  return request({
    url: '/api/v1/dsoc/data/type/page/cascade',
    method: 'post',
    data: data,
  })
}

export function getTypeDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/type/get',
    method: 'post',
    data: data,
  })
}

export function createTypeData(data) {
  return request({
    url: '/api/v1/dsoc/data/type/insert',
    method: 'post',
    data: data,
  })
}

export function deleteTypeData(data) {
  return request({
    url: '/api/v1/dsoc/data/type/delete',
    method: 'post',
    data: data,
  })
}

export function deleteTypeManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/type/deletes',
    method: 'post',
    data: data,
  })
}

export function editTypeData(data) {
  return request({
    url: '/api/v1/dsoc/data/type/update',
    method: 'post',
    data: data,
  })
}
