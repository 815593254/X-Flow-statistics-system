import request from '@/utils/request'

export function getCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/page',
    method: 'post',
    data: data,
  })
}

export function getCharacterDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/get',
    method: 'post',
    data: data,
  })
}

export function createCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/insert',
    method: 'post',
    data: data,
  })
}

export function deleteCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/delete',
    method: 'post',
    data: data,
  })
}

export function deleteCharacterManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/deletes',
    method: 'post',
    data: data,
  })
}

export function editCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/banding/update',
    method: 'post',
    data: data,
  })
}
