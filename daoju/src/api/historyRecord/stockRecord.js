import request from '@/utils/request'

// 分页查询出入库记录
export function getStockRecordList(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/stockRecord',
    method: 'get',
    params: query
  })
}

// 导出出入库记录
export function exportStockRecord(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/exportStockRecord',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取出入库记录详情
export function getStockRecordDetail(id) {
  return request({
    url: `/qw/knife/web/from/mes/record/stockRecord/${id}`,
    method: 'get'
  })
}

// 查询出入库记录统计信息
export function getStockRecordStats(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/stockRecord/stats',
    method: 'get',
    params: query
  })
}

// 批量删除出入库记录
export function deleteStockRecords(ids) {
  return request({
    url: '/qw/knife/web/from/mes/record/stockRecord',
    method: 'delete',
    data: ids
  })
}
