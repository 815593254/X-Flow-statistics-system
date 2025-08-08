import request from '@/utils/request'

export function getDatabaseType() {
  return request({
    url: '/api/v1/dsoc/data/source/current/group',
    method: 'post',
  })
}

export function getfeatureData() {
  return request({
    url: '/api/v1/dsoc/data/task/hit/current/group',
    method: 'post',
  })
}

export function getDeviceInfo(data) {
  return request({
    url: '/api/v1/dsoc/monitor/sys/metric/page/cascade',
    method: 'post',
    data: data
  })
}

