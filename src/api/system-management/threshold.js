import request from '@/utils/request'

// 阈值查询
export function getThreshold() {
  return request({
    url: '/api/v1/dsoc/system/config/get',
    method: 'post',
    data: {
      systemConfKey: 'DSOC_SYSTEM_CONF_WARNING_THRESHOLD'
    }
  })
}

// 阈值修改
export function updateThreshold(data) {
  return request({
    url: '/api/v1/dsoc/system/config/update',
    method: 'post',
    data: {
      systemConfKey: 'DSOC_SYSTEM_CONF_WARNING_THRESHOLD',
      systemConfValue: data.systemConfValue
    }
  })
}
