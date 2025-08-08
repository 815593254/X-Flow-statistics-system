import request from '@/utils/request'

export function getLevelList(data) {
  return request({
    url: '/api/v1/dsoc/data/level/page',
    method: 'post',
    data: data,
  })
}

export function getLevelDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/level/get',
    method: 'post',
    data: data,
  })
}

export function createLevelData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/insert',
    method: 'post',
    data: data,
  })
}

export function deleteLevelData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/delete',
    method: 'post',
    data: data,
  })
}

export function deleteLevelManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/deletes',
    method: 'post',
    data: data,
  })
}

export function editLevelData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/update',
    method: 'post',
    data: data,
  })
}

export function getLevelGroupList(data) {
  return request({
    url: '/api/v1/dsoc/data/level/group/page',
    method: 'post',
    data: data,
  })
}

export function createLevelGroupData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/group/insert',
    method: 'post',
    data: data,
  })
}

export function deleteLevelGroupData(data) {
  return request({
    url: '/api/v1/dsoc/data/level/group/delete',
    method: 'post',
    data: data,
  })
}
