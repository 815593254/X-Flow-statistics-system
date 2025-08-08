import request from '@/utils/request'

export function getTrafficApi(data) {
  return request({
    url: '/api/v1/dsoc/report/traffic/page',
    method: 'POST',
    data: data
  })
}

