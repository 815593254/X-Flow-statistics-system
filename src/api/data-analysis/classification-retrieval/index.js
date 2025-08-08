import request from '@/utils/request'

export function getStructureList(data) {
  return request({
    url: '/api/v1/dsoc/data/structure/page',
    method: 'post',
    data: data,
  })
}
