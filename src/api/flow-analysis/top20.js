import request from '@/utils/request'

// 获取实时TOP20流量数据
export function getTop20Flow() {
  return request({
    url: '/api/v1/dsoc/report/flow/rtdb/top',
    method: 'post'
  })
}
