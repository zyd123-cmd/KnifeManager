import request from '@/utils/request'

// 查询收刀柄柜列表
export function listCollectHandleCabinet(query) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/list',
    method: 'get',
    params: query
  })
}

// 查询收刀柄柜详细
export function getCollectHandleCabinet(id) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/' + id,
    method: 'get'
  })
}

// 新增收刀柄柜
export function addCollectHandleCabinet(data) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet',
    method: 'post',
    data: data
  })
}

// 修改收刀柄柜
export function updateCollectHandleCabinet(data) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet',
    method: 'put',
    data: data
  })
}

// 删除收刀柄柜
export function delCollectHandleCabinet(id) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/' + id,
    method: 'delete'
  })
}

// 批量删除收刀柄柜
export function batchDelCollectHandleCabinet(ids) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/batch',
    method: 'delete',
    data: ids
  })
}

// 导出收刀柄柜
export function exportCollectHandleCabinet(query) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/export',
    method: 'get',
    params: query
  })
}

// 收刀柄操作
export function collectHandle(data) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/collect',
    method: 'post',
    data: data
  })
}

// 批量收刀柄操作
export function batchCollectHandle(data) {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/batchCollect',
    method: 'post',
    data: data
  })
}

// 获取收刀柄统计
export function getCollectHandleStatistics() {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/statistics',
    method: 'get'
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/brands',
    method: 'get'
  })
}

// 获取刀柄类型列表
export function getHandleTypeList() {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/handleTypes',
    method: 'get'
  })
}

// 获取刀柜列表
export function getCabinetList() {
  return request({
    url: '/cabinetChannel/collectHandleCabinet/cabinets',
    method: 'get'
  })
}
