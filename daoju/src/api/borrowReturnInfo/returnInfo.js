import request from '@/utils/request'

// 查询还刀信息列表
export function listReturnInfo(query) {
  return request({
    url: '/borrowReturnInfo/returnInfo/list',
    method: 'get',
    params: query
  })
}

// 查询还刀信息详细
export function getReturnInfo(id) {
  return request({
    url: '/borrowReturnInfo/returnInfo/' + id,
    method: 'get'
  })
}

// 新增还刀信息
export function addReturnInfo(data) {
  return request({
    url: '/borrowReturnInfo/returnInfo',
    method: 'post',
    data: data
  })
}

// 修改还刀信息
export function updateReturnInfo(data) {
  return request({
    url: '/borrowReturnInfo/returnInfo',
    method: 'put',
    data: data
  })
}

// 删除还刀信息
export function delReturnInfo(id) {
  return request({
    url: '/borrowReturnInfo/returnInfo/' + id,
    method: 'delete'
  })
}

// 导出还刀信息
export function exportReturnInfo(query) {
  return request({
    url: '/borrowReturnInfo/returnInfo/export',
    method: 'get',
    params: query
  })
}
