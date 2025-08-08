import request from '@/utils/request'

export function getTemplateList(data) {
  return request({
    url: '/api/v1/dsoc/data/template/page',
    method: 'post',
    data: data,
  })
}

export function getTemplateDetail(data) {
  return request({
    url: '/api/v1/dsoc/data/template/get',
    method: 'post',
    data: data,
  })
}

export function createTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/data/template/insert',
    method: 'post',
    data: data,
  })
}

export function updateTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/data/template/update',
    method: 'post',
    data: data,
  })
}

export function deleteTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/data/template/delete/cascade',
    method: 'post',
    data: data,
  })
}

export function deleteTemplateManyData(data) {
  return request({
    url: '/api/v1/dsoc/data/template/deletes',
    method: 'post',
    data: data,
  })
}

export function applicationTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/data/template/update/default',
    method: 'post',
    data: data,
  })
}
