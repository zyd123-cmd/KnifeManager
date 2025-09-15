import request from '@/utils/request'

// 查询品牌信息列表
export function listBrandInfo(query) {
  return request({
    url: '/consumableService/brandInfo/list',
    method: 'get',
    params: query
  })
}

// 查询品牌信息详细
export function getBrandInfo(id) {
  return request({
    url: '/consumableService/brandInfo/' + id,
    method: 'get'
  })
}

// 新增品牌信息
export function addBrandInfo(data) {
  return request({
    url: '/consumableService/brandInfo',
    method: 'post',
    data: data
  })
}

// 修改品牌信息
export function updateBrandInfo(data) {
  return request({
    url: '/consumableService/brandInfo',
    method: 'put',
    data: data
  })
}

// 删除品牌信息
export function delBrandInfo(id) {
  return request({
    url: '/consumableService/brandInfo/' + id,
    method: 'delete'
  })
}

// 批量删除品牌信息
export function batchDelBrandInfo(ids) {
  return request({
    url: '/consumableService/brandInfo/batch',
    method: 'delete',
    data: ids
  })
}

// 导出品牌信息
export function exportBrandInfo(query) {
  return request({
    url: '/consumableService/brandInfo/export',
    method: 'get',
    params: query
  })
}

// 根据品牌编码查询品牌信息
export function getBrandInfoByCode(brandCode) {
  return request({
    url: '/consumableService/brandInfo/code/' + brandCode,
    method: 'get'
  })
}

// 获取供应商列表
export function getSupplierList() {
  return request({
    url: '/consumableService/brandInfo/suppliers',
    method: 'get'
  })
}

// 获取公司列表
export function getCorporateList() {
  return request({
    url: '/consumableService/brandInfo/corporates',
    method: 'get'
  })
}
