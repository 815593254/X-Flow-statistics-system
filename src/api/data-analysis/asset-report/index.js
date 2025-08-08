import request from '@/utils/request'

export function getReportDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/task/hit/source/report/state',
    method: 'post',
    data: data,
  })
}

