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

export function getAssertData() {
  return request({
    url: '/api/v1/dsoc/system/informant/get/source/stat',
    method: 'post',
  })
}

