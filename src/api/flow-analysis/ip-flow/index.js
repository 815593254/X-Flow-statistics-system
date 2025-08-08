import request from '@/utils/request'

export function getIpFlowApi(data) {
  return request({
    url: '/api/v1/dsoc/report/flow/page',
    method: 'POST',
    data: data
  })
}