import request from '@/utils/request'

// 查询时间范围内同一C段TOP IP排行
export function getCClassIpTop(data) {
  return request({
    url: '/api/v1/dsoc/report/flow/cclass/ip/top',
    method: 'post',
    data: data
  })
}
