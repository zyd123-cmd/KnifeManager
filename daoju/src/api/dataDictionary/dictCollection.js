import request from '@/utils/request'

// 查询字典集合列表
export function listDictCollection(query) {
  return request({
    url: '/dataDictionary/dictCollection/list',
    method: 'get',
    params: query
  })
}

// 查询字典集合详细
export function getDictCollection(id) {
  return request({
    url: '/dataDictionary/dictCollection/' + id,
    method: 'get'
  })
}

// 根据主键集合查询字典集合
export function getDictCollectionByCode(code) {
  return request({
    url: '/dataDictionary/dictCollection/code',
    method: 'get',
    params: { code }
  })
}

// 新增字典集合
export function addDictCollection(data) {
  return request({
    url: '/dataDictionary/dictCollection',
    method: 'post',
    data: data
  })
}

// 修改字典集合
export function updateDictCollection(data) {
  return request({
    url: '/dataDictionary/dictCollection',
    method: 'put',
    data: data
  })
}

// 删除字典集合
export function delDictCollection(id) {
  return request({
    url: '/dataDictionary/dictCollection/' + id,
    method: 'delete'
  })
}

// 批量删除字典集合
export function batchDelDictCollection(ids) {
  return request({
    url: '/dataDictionary/dictCollection/batch',
    method: 'delete',
    data: ids
  })
}

// 导出字典集合
export function exportDictCollection(query) {
  return request({
    url: '/dataDictionary/dictCollection/export',
    method: 'get',
    params: query
  })
}

// 获取字典类型列表
export function getDictTypeList() {
  return request({
    url: '/dataDictionary/dictCollection/types',
    method: 'get'
  })
}

// 获取父级字典列表
export function getParentDictList() {
  return request({
    url: '/dataDictionary/dictCollection/parents',
    method: 'get'
  })
}
