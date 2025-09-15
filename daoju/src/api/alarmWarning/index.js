import request from '@/utils/request'

// 查询预警警告列表
export function listAlarmWarning(query) {
  return request({
    url: '/alarmWarning/list',
    method: 'get',
    params: query
  })
}

// 查询预警警告详细
export function getAlarmWarning(id) {
  return request({
    url: '/alarmWarning/' + id,
    method: 'get'
  })
}

// 新增预警警告
export function addAlarmWarning(data) {
  return request({
    url: '/alarmWarning',
    method: 'post',
    data: data
  })
}

// 修改预警警告
export function updateAlarmWarning(data) {
  return request({
    url: '/alarmWarning',
    method: 'put',
    data: data
  })
}

// 删除预警警告
export function delAlarmWarning(id) {
  return request({
    url: '/alarmWarning/' + id,
    method: 'delete'
  })
}

// 批量删除预警警告
export function batchDelAlarmWarning(ids) {
  return request({
    url: '/alarmWarning/batch',
    method: 'delete',
    data: ids
  })
}

// 导出预警警告
export function exportAlarmWarning(query) {
  return request({
    url: '/alarmWarning/export',
    method: 'get',
    params: query
  })
}

// 获取预警阈值设置
export function getAlarmThresholds() {
  return request({
    url: '/alarmWarning/thresholds',
    method: 'get'
  })
}

// 更新预警阈值设置
export function updateAlarmThresholds(data) {
  return request({
    url: '/alarmWarning/thresholds',
    method: 'put',
    data: data
  })
}

// 处理预警警告
export function handleAlarmWarning(id, data) {
  return request({
    url: '/alarmWarning/handle/' + id,
    method: 'put',
    data: data
  })
}

// 批量处理预警警告
export function batchHandleAlarmWarning(ids, data) {
  return request({
    url: '/alarmWarning/batchHandle',
    method: 'put',
    data: { ids, ...data }
  })
}

// 获取预警统计
export function getAlarmStatistics() {
  return request({
    url: '/alarmWarning/statistics',
    method: 'get'
  })
}

// 获取刀柜列表
export function getCabinetList() {
  return request({
    url: '/alarmWarning/cabinets',
    method: 'get'
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/alarmWarning/brands',
    method: 'get'
  })
}

// 自动盘存
export function autoInventory(data) {
  return request({
    url: '/alarmWarning/autoInventory',
    method: 'post',
    data: data
  })
}
