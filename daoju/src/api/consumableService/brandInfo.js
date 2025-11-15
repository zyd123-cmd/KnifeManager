import request from '@/utils/request'

// 分页查询品牌信息
export function listBrandInfo(query) {
  return request({
    url: '/qw/knife/web/from/mes/cutter/pageListBrand',
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
    url: '/qw/knife/web/from/mes/cutter/submitBrand',
    method: 'post',
    data: data
  })
}

// 修改品牌信息
export function updateBrandInfo(data) {
  return request({
    url: '/qw/knife/web/from/mes/cutter/submitBrand',
    method: 'post',
    data: data
  })
}

// 删除品牌信息
export function delBrandInfo(id) {
  return request({
    url: '/qw/knife/web/from/mes/cutter/delBrand',
    method: 'post',
    data: id
  })
}

// 批量删除品牌信息
export function batchDelBrandInfo(ids) {
  return request({
    url: '/qw/knife/web/from/mes/cutter/delBrand',
    method: 'post',
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