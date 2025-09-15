import request from '@/utils/request'

// 查询刀具类型列表
export function listCutterType(query) {
  return request({
    url: '/dataDictionary/cutterType/list',
    method: 'get',
    params: query
  })
}

// 查询刀具类型详细
export function getCutterType(id) {
  return request({
    url: '/dataDictionary/cutterType/' + id,
    method: 'get'
  })
}

// 新增刀具类型
export function addCutterType(data) {
  return request({
    url: '/dataDictionary/cutterType',
    method: 'post',
    data: data
  })
}

// 修改刀具类型
export function updateCutterType(data) {
  return request({
    url: '/dataDictionary/cutterType',
    method: 'put',
    data: data
  })
}

// 删除刀具类型
export function delCutterType(id) {
  return request({
    url: '/dataDictionary/cutterType/' + id,
    method: 'delete'
  })
}

// 批量删除刀具类型
export function batchDelCutterType(ids) {
  return request({
    url: '/dataDictionary/cutterType/batch',
    method: 'delete',
    data: ids
  })
}

// 导出刀具类型
export function exportCutterType(query) {
  return request({
    url: '/dataDictionary/cutterType/export',
    method: 'get',
    params: query
  })
}

// 获取刀具分类列表
export function getCutterCategoryList() {
  return request({
    url: '/dataDictionary/cutterType/categories',
    method: 'get'
  })
}

// 获取父级刀具类型列表
export function getParentCutterTypeList() {
  return request({
    url: '/dataDictionary/cutterType/parents',
    method: 'get'
  })
}
