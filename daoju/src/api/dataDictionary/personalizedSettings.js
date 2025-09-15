import request from '@/utils/request'

// 查询个性化设置列表
export function listPersonalizedSettings(query) {
  return request({
    url: '/dataDictionary/personalizedSettings/list',
    method: 'get',
    params: query
  })
}

// 查询个性化设置详细
export function getPersonalizedSettings(id) {
  return request({
    url: '/dataDictionary/personalizedSettings/' + id,
    method: 'get'
  })
}

// 新增个性化设置
export function addPersonalizedSettings(data) {
  return request({
    url: '/dataDictionary/personalizedSettings',
    method: 'post',
    data: data
  })
}

// 修改个性化设置
export function updatePersonalizedSettings(data) {
  return request({
    url: '/dataDictionary/personalizedSettings',
    method: 'put',
    data: data
  })
}

// 删除个性化设置
export function delPersonalizedSettings(id) {
  return request({
    url: '/dataDictionary/personalizedSettings/' + id,
    method: 'delete'
  })
}

// 批量删除个性化设置
export function batchDelPersonalizedSettings(ids) {
  return request({
    url: '/dataDictionary/personalizedSettings/batch',
    method: 'delete',
    data: ids
  })
}

// 导出个性化设置
export function exportPersonalizedSettings(query) {
  return request({
    url: '/dataDictionary/personalizedSettings/export',
    method: 'get',
    params: query
  })
}

// 获取设置类型列表
export function getSettingTypeList() {
  return request({
    url: '/dataDictionary/personalizedSettings/types',
    method: 'get'
  })
}

// 获取配置分组列表
export function getConfigGroupList() {
  return request({
    url: '/dataDictionary/personalizedSettings/groups',
    method: 'get'
  })
}
