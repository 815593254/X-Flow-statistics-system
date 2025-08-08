import request from '@/utils/request'

export function getDBType() {
  return request({
    url: '/api/v1/dsoc/data/source/attrs',
    method: 'post',
  })
}

export function getList(data) {
  return request({
    url: '/api/v1/dsoc/data/source/page',
    method: 'post',
    data: data,
  })
}

export function getDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/source/get',
    method: 'post',
    data: data,
  })
}

export function createData(data) {
  return request({
    url: '/api/v1/dsoc/data/source/insert',
    method: 'post',
    data: data,
  })
}

export function deleteData(data) {
  return request({
    url: '/api/v1/dsoc/data/source/delete/cascade',
    method: 'post',
    data: data,
  })
}

export function deleteManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/source/deletes',
    method: 'post',
    data: data,
  })
}

export function editData(data) {
  return request({
    url: '/api/v1/dsoc/data/source/update',
    method: 'post',
    data: data,
  })
}
