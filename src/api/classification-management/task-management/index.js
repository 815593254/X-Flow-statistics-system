import request from '@/utils/request'

export function getScanList(data) {
  return request({
    url: '/api/v1/dsoc/data/source/page/state',
    method: 'post',
    data: data,
  })
}

export function startScan(data) {
  return request({
    url: '/api/v1/dsoc/data/source/dispatch/task',
    method: 'post',
    data: data,
  })
}

export function getCPUPage(data) {
  return request({
    url: '/api/v1/dsoc/data/sys/metric/page',
    method: 'post',
    data: data,
  })
}
