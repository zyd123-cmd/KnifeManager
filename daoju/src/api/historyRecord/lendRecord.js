import request from '@/utils/request'

// 分页查询领刀记录
export function getLendRecordList(query) {
  return request({
    url: '/list',
    method: 'get',
    params: query
  })
}

// 导出领刀记录
export function exportLendRecord(query) {
  return request({
    url: '/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}