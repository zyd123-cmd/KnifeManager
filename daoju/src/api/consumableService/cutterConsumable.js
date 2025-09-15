import request from '@/utils/request'

// 查询刀具耗材列表
export function listCutterConsumable(query) {
  return request({
    url: '/consumableService/cutterConsumable/list',
    method: 'get',
    params: query
  })
}

// 查询刀具耗材详细
export function getCutterConsumable(id) {
  return request({
    url: '/consumableService/cutterConsumable/' + id,
    method: 'get'
  })
}

// 新增刀具耗材
export function addCutterConsumable(data) {
  return request({
    url: '/consumableService/cutterConsumable',
    method: 'post',
    data: data
  })
}

// 修改刀具耗材
export function updateCutterConsumable(data) {
  return request({
    url: '/consumableService/cutterConsumable',
    method: 'put',
    data: data
  })
}

// 删除刀具耗材
export function delCutterConsumable(id) {
  return request({
    url: '/consumableService/cutterConsumable/' + id,
    method: 'delete'
  })
}

// 批量删除刀具耗材
export function batchDelCutterConsumable(ids) {
  return request({
    url: '/consumableService/cutterConsumable/batch',
    method: 'delete',
    data: ids
  })
}

// 导出刀具耗材
export function exportCutterConsumable(query) {
  return request({
    url: '/consumableService/cutterConsumable/export',
    method: 'get',
    params: query
  })
}

// 批量导入刀具耗材
export function importCutterConsumable(data) {
  return request({
    url: '/consumableService/cutterConsumable/import',
    method: 'post',
    data: data
  })
}

// 下载导入模板
export function downloadTemplate() {
  return request({
    url: '/consumableService/cutterConsumable/template',
    method: 'get'
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/consumableService/cutterConsumable/brands',
    method: 'get'
  })
}

// 获取刀具柜列表
export function getCabinetList() {
  return request({
    url: '/consumableService/cutterConsumable/cabinets',
    method: 'get'
  })
}

// 获取物料类型列表
export function getMaterialTypeList() {
  return request({
    url: '/consumableService/cutterConsumable/materialTypes',
    method: 'get'
  })
}

// 获取刀具类型列表
export function getCutterTypeList() {
  return request({
    url: '/consumableService/cutterConsumable/cutterTypes',
    method: 'get'
  })
}

// 上传图片
export function uploadImage(data) {
  return request({
    url: '/consumableService/cutterConsumable/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除图片
export function deleteImage(imageId) {
  return request({
    url: '/consumableService/cutterConsumable/image/' + imageId,
    method: 'delete'
  })
}

// 更新库存
export function updateStock(data) {
  return request({
    url: '/consumableService/cutterConsumable/stock',
    method: 'put',
    data: data
  })
}

// 库存预警设置
export function setInventoryWarning(data) {
  return request({
    url: '/consumableService/cutterConsumable/warning',
    method: 'put',
    data: data
  })
}

// 获取库存统计
export function getStockStatistics() {
  return request({
    url: '/consumableService/cutterConsumable/statistics',
    method: 'get'
  })
}
