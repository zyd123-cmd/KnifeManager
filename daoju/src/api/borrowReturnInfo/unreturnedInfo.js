import request from '@/utils/request'

// 查询未还信息列表
export function listUnreturnedInfo(query) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo/list',
    method: 'get',
    params: query
  })
}

// 查询未还信息详细
export function getUnreturnedInfo(id) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo/' + id,
    method: 'get'
  })
}

// 新增未还信息
export function addUnreturnedInfo(data) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo',
    method: 'post',
    data: data
  })
}

// 修改未还信息
export function updateUnreturnedInfo(data) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo',
    method: 'put',
    data: data
  })
}

// 删除未还信息
export function delUnreturnedInfo(id) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo/' + id,
    method: 'delete'
  })
}

// 导出未还信息
export function exportUnreturnedInfo(query) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo/export',
    method: 'get',
    params: query
  })
}

// 统计未还信息
export function statisticsUnreturnedInfo(query) {
  return request({
    url: '/borrowReturnInfo/unreturnedInfo/statistics',
    method: 'get',
    params: query
  })
}
