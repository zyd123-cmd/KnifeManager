import request from '@/utils/request'

// 查询总库存统计列表
export function listTotalInventoryStats(query) {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/list',
    method: 'get',
    params: query
  })
}

// 查询刀具库存统计
export function getCutterInventoryStats(query) {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/cutter',
    method: 'get',
    params: query
  })
}

// 查询刀柄库存统计
export function getHandleInventoryStats(query) {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/handle',
    method: 'get',
    params: query
  })
}

// 获取库存汇总数据
export function getInventorySummary(type) {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/summary',
    method: 'get',
    params: { type }
  })
}

// 导出库存统计
export function exportInventoryStats(query) {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/export',
    method: 'get',
    params: query
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/brands',
    method: 'get'
  })
}

// 获取刀具类型列表
export function getCutterTypeList() {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/cutterTypes',
    method: 'get'
  })
}

// 获取刀柄类型列表
export function getHandleTypeList() {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/handleTypes',
    method: 'get'
  })
}

// 获取刀柜列表
export function getCabinetList() {
  return request({
    url: '/borrowReturnInfo/totalInventoryStats/cabinets',
    method: 'get'
  })
}
