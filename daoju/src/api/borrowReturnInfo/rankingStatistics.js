import request from '@/utils/request'

// 查询全年取刀数量统计
export function getYearlyQuantityStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/yearlyQuantity',
    method: 'get',
    params: query
  })
}

// 查询全年取刀金额统计
export function getYearlyAmountStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/yearlyAmount',
    method: 'get',
    params: query
  })
}

// 查询今年累计使用统计
export function getYearlyUsageStatistics(query) {
  return request({
    url: '/borrowReturnInfo/rankingStatistics/yearlyUsage',
    method: 'get',
    params: query
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
