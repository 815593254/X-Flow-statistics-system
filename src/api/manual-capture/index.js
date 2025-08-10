import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/v1/dsoc/manual/capture/page/cascade',
    method: 'post',
    data: data,
  })
}

export function getDetail(data) {
  return request({
    url: '/api/v1/dsoc/manual/capture/get/detail',
    method: 'post',
    data: data,
  })
}

export function sendDemand(data) {
  return request({
    url: '/api/v1/dsoc/manual/capture/sendDemand',
    method: 'post',
    data: data,
  })
}

export function deleteData(data) {
  return request({
    url: '/api/v1/dsoc/manual/capture/delete/cascade',
    method: 'post',
    data: data,
  })
}

export function editData(data) {
  return request({
    url: '/api/v1/dsoc/manual/capture/update/cascade',
    method: 'post',
    data: data,
  })
}

// export function deleteManyData(data) {
//   return request({
//     url: '/api/v1/dsoc/data/source/deletes',
//     method: 'post',
//     data: data,
//   })
// }

