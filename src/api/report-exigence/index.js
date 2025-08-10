import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/v1/dsoc/report/exigence/page',
    method: 'post',
    data: data,
  })
}

export function deleteData(data) {
  return request({
    url: '/api/v1/dsoc/report/exigence/delete',
    method: 'post',
    data: data,
  })
}