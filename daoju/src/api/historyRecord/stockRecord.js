import request from '@/utils/request'

// 分页查询出入库记录（出入库统计数据）
export function getStockRecordList(query) {
  return request({
    url: '/api/v1/auditor/storage-statistics',
    method: 'get',
    params: query
  })
}

// 导出出入库记录
export function exportStockRecord(query) {
  return request({
    url: '/api/v1/auditor/export-stock-record',
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
