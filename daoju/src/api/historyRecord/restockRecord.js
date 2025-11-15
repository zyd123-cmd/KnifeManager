import request from '@/utils/request'

// 分页查询补货记录
export function getRestockRecordList(query) {
  return request({
    url: '/qw/knife/web/from/mes/cabinetStock/preBatchPlug',
    method: 'post',
    data: query
  })
}

// 导出补货记录
export function exportRestockRecord(query) {
  return request({
    url: '/export-restock-record',
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

// 获取预补刀查询结果（包含成功和失败的货道列表）
export function getPreBatchPlugResult(data) {
  return request({
    url: '/qw/knife/web/from/mes/cabinetStock/preBatchPlug',
    method: 'post',
    data: data
  })
}