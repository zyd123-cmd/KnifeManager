import request from '@/utils/request'

// 分页查询操作日志
export function getOperationLogList(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/operationLog',
    method: 'get',
    params: query
  })
}

// 导出操作日志数据
export function exportOperationLog(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/exportOperationLog',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取操作日志详情
export function getOperationLogDetail(id) {
  return request({
    url: `/qw/knife/web/from/mes/record/operationLog/${id}`,
    method: 'get'
  })
}

// 查询操作日志统计信息
export function getOperationLogStats(query) {
  return request({
    url: '/qw/knife/web/from/mes/record/operationLog/stats',
    method: 'get',
    params: query
  })
}

// 批量删除操作日志
export function deleteOperationLogs(ids) {
  return request({
    url: '/qw/knife/web/from/mes/record/operationLog',
    method: 'delete',
    data: ids
  })
}

// 清理过期操作日志
export function cleanExpiredLogs(days) {
  return request({
    url: '/qw/knife/web/from/mes/record/operationLog/clean',
    method: 'post',
    params: { days }
  })
}
