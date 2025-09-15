import request from '@/utils/request'

// 查询收刀信息列表
export function listCollectInfo(query) {
  return request({
    url: '/borrowReturnInfo/collectInfo/list',
    method: 'get',
    params: query
  })
}

// 查询收刀信息详细
export function getCollectInfo(id) {
  return request({
    url: '/borrowReturnInfo/collectInfo/' + id,
    method: 'get'
  })
}

// 确认收刀操作
export function confirmCollect(data) {
  return request({
    url: '/borrowReturnInfo/collectInfo/confirm',
    method: 'post',
    data: data
  })
}

// 新增收刀信息
export function addCollectInfo(data) {
  return request({
    url: '/borrowReturnInfo/collectInfo',
    method: 'post',
    data: data
  })
}

// 修改收刀信息
export function updateCollectInfo(data) {
  return request({
    url: '/borrowReturnInfo/collectInfo',
    method: 'put',
    data: data
  })
}

// 删除收刀信息
export function delCollectInfo(id) {
  return request({
    url: '/borrowReturnInfo/collectInfo/' + id,
    method: 'delete'
  })
}

// 批量删除收刀信息
export function batchDelCollectInfo(ids) {
  return request({
    url: '/borrowReturnInfo/collectInfo/batch',
    method: 'delete',
    data: ids
  })
}

// 导出收刀信息
export function exportCollectInfo(query) {
  return request({
    url: '/borrowReturnInfo/collectInfo/export',
    method: 'get',
    params: query
  })
}

// 获取刀柜编码列表
export function getCabinetCodeList() {
  return request({
    url: '/borrowReturnInfo/collectInfo/cabinetCodes',
    method: 'get'
  })
}

// 获取库位列表
export function getLocationList(cabinetCode) {
  return request({
    url: '/borrowReturnInfo/collectInfo/locations',
    method: 'get',
    params: { cabinetCode }
  })
}
