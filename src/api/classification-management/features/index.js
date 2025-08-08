import request from '@/utils/request'

export function getCharacterList(data) {
  return request({
    url: '/api/v1/dsoc/data/character/page',
    method: 'post',
    data: data,
  })
}

export function getCharacterDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/character/get',
    method: 'post',
    data: data,
  })
}

export function createCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/insert',
    method: 'post',
    data: data,
  })
}

export function deleteCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/delete',
    method: 'post',
    data: data,
  })
}

export function deleteCharacterManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/deletes',
    method: 'post',
    data: data,
  })
}

export function editCharacterData(data) {
  return request({
    url: '/api/v1/dsoc/data/character/update',
    method: 'post',
    data: data,
  })
}
