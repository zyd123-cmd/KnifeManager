import request from '@/utils/request'

// 查询刀柄柜列表
export function listHandleCabinet(query) {
  return request({
    url: '/cabinetChannel/handleCabinet/list',
    method: 'get',
    params: query
  })
}

// 查询刀柄柜详细
export function getHandleCabinet(id) {
  return request({
    url: '/cabinetChannel/handleCabinet/' + id,
    method: 'get'
  })
}

// 新增刀柄柜
export function addHandleCabinet(data) {
  return request({
    url: '/cabinetChannel/handleCabinet',
    method: 'post',
    data: data
  })
}

// 修改刀柄柜
export function updateHandleCabinet(data) {
  return request({
    url: '/cabinetChannel/handleCabinet',
    method: 'put',
    data: data
  })
}

// 删除刀柄柜
export function delHandleCabinet(id) {
  return request({
    url: '/cabinetChannel/handleCabinet/' + id,
    method: 'delete'
  })
}

// 批量删除刀柄柜
export function batchDelHandleCabinet(ids) {
  return request({
    url: '/cabinetChannel/handleCabinet/batch',
    method: 'delete',
    data: ids
  })
}

// 导出刀柄柜
export function exportHandleCabinet(query) {
  return request({
    url: '/cabinetChannel/handleCabinet/export',
    method: 'get',
    params: query
  })
}

// 补货操作
export function restockHandleCabinet(data) {
  return request({
    url: '/cabinetChannel/handleCabinet/restock',
    method: 'post',
    data: data
  })
}

// 获取刀柄类型列表
export function getHandleTypeList() {
  return request({
    url: '/cabinetChannel/handleCabinet/handleTypes',
    method: 'get'
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/cabinetChannel/handleCabinet/brands',
    method: 'get'
  })
}

// 获取规格列表
export function getSpecificationList() {
  return request({
    url: '/cabinetChannel/handleCabinet/specifications',
    method: 'get'
  })
}
