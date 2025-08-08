import request from '@/utils/request'

export function getEchartData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/db/get/cascade',
    method: 'post',
    data: data,
  })
}

export function getOracleData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/oracle/get/cascade',
    method: 'post',
    data: data,
  })
}

export function getDashboardData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/page/msl/cascade',
    method: 'post',
    data: data,
  })
}

export function getOracleDashboardData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/page/oracle/cascade',
    method: 'post',
    data: data,
  })
}

export function saveDashboardData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/inserts/msl/cascade',
    method: 'post',
    data: data,
  })
}

export function saveOracleDashboardData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/inserts/oracle/cascade',
    method: 'post',
    data: data,
  })
}

export function getCPUData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/sys/metric/info',
    method: 'post',
    data: data,
  })
}

export function saveTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/inserts/db/template',
    method: 'post',
    data: data,
  })
}

export function getTemplateData(data) {
  return request({
    url: '/api/v1/dsoc/monitor/panel/page/db/template',
    method: 'post',
    data: data,
  })
}
