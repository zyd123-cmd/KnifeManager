import request from '@/utils/request'

// 查询全年取刀数量统计
export function getYearlyQuantityStatistics() {
  return request({
    url: '/api/v1/auditor/charts-lend-by-year',
    method: 'get'
  })
}

// 查询全年取刀金额统计
export function getYearlyAmountStatistics() {
  return request({
    url: '/api/v1/auditor/charts-lend-price-by-year',
    method: 'get'
  })
}

// 查询今年累计使用统计（刀具消耗统计）
export function getYearlyUsageStatistics() {
  return request({
    url: '/api/v1/auditor/charts-accumulated',
    method: 'get'
  })
}

// 查询员工领刀排行
export function getEmployeeRankingStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/employeeRanking',
    method: 'get',
    params: query
  })
}

// 查询设备用刀排行
export function getEquipmentRankingStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/equipmentRanking',
    method: 'get',
    params: query
  })
}

// 查询刀具型号排行
export function getCutterModelRankingStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/cutterModelRanking',
    method: 'get',
    params: query
  })
}

// 查询工单排行
export function getWorkOrderRankingStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/workOrderRanking',
    method: 'get',
    params: query
  })
}

// 查询异常还刀排行
export function getAbnormalReturnRankingStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/abnormalReturnRanking',
    method: 'get',
    params: query
  })
}
