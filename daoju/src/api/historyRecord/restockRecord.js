import request from '@/utils/request'

// 分页查询补货记录
export function getRestockRecordList(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/restockRecord',
    method: 'get',
    params: query
  })
}

// 导出补货记录
export function exportRestockRecord(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/exportRestockRecord',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取补货记录详情
export function getRestockRecordDetail(id) {
  return request({
    url: `/qw/knife/web/from/mes/record/restockRecord/${id}`,
    method: 'get'
  })
}

// 查询补货记录统计信息
export function getRestockRecordStats(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/restockRecord/stats',
    method: 'get',
    params: query
  })
}

// 批量删除补货记录
export function deleteRestockRecords(ids) {
  return request({
    url: '/qw/knife/web/from/mes/record/restockRecord',
    method: 'delete',
    data: ids
  })
}

// 创建补货记录
export function createRestockRecord(data) {
  return request({
    url: '/qw/knife/web/from/mes/record/restockRecord',
    method: 'post',
    data: data
  })
}

// 更新补货记录
export function updateRestockRecord(data) {
  return request({
    url: '/qw/knife/web/from/mes/record/restockRecord',
    method: 'put',
    data: data
  })
}
