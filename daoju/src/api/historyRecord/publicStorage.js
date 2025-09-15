import request from '@/utils/request'

// 分页查询公共暂存记录
export function getPublicStorageList(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage',
    method: 'get',
    params: query
  })
}

// 导出公共暂存记录
export function exportPublicStorage(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/exportPublicStorage',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取公共暂存记录详情
export function getPublicStorageDetail(id) {
  return request({
    url: `/qw/knife/web/from/mes/record/publicStorage/${id}`,
    method: 'get'
  })
}

// 查询公共暂存记录统计信息
export function getPublicStorageStats(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage/stats',
    method: 'get',
    params: query
  })
}

// 批量删除公共暂存记录
export function deletePublicStorageRecords(ids) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage',
    method: 'delete',
    data: ids
  })
}

// 创建公共暂存记录
export function createPublicStorageRecord(data) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage',
    method: 'post',
    data: data
  })
}

// 更新公共暂存记录
export function updatePublicStorageRecord(data) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage',
    method: 'put',
    data: data
  })
}

// 批量处理公共暂存记录
export function batchProcessPublicStorage(data) {
  return request({
    url: '/qw/knife/web/from/mes/record/publicStorage/batch',
    method: 'post',
    data: data
  })
}
