import request from '@/utils/request'

// 查询取刀柜列表
export function listTakeCabinet(query) {
  return request({
    url: '/qw/knife/app/from/mes/cabinet/stockTakeList',
    method: 'get',
    params: query
  })
}

// 获取取刀柜统计数据
export function getTakeCabinetStatistics() {
  return request({
    url: '/qw/knife/app/from/mes/cabinet/stockStatisticalNum',
    method: 'get'
  })
}

// 货道解绑耗材（清空刀具数量）
export function unbindCutter(stockId) {
  return request({
    url: '/qw/knife/web/from/mes/cabinetStock/stockUnBindCutter',
    method: 'post',
    data: { stock_id: stockId }
  })
}

// 货道禁用/启用库位
export function changeBan(stockId, isBan) {
  return request({
    url: '/qw/knife/web/from/mes/cabinetStock/changeBan',
    method: 'post',
    data: { 
      stock_id: stockId,
      is_ban: isBan
    }
  })
}

// 预补刀查询（检查是否可以补刀）
export function preBatchPlug(cabinetCode) {
  return request({
    url: `/qw/knife/web/from/mes/cabinetStock/preBatchPlug`,
    method: 'post',
    data: { cabinet_code: cabinetCode }
  })
}

// 批量一键补刀
export function onPreBatchPlug(cabinetCode) {
  return request({
    url: `/qw/knife/web/from/mes/cabinetStock/onPreBatchPlug`,
    method: 'post',
    data: { cabinet_code: cabinetCode }
  })
}

// 分页查询公共暂存记录
export function getPublicStorageList(query) {
  return request({
    url: '/storage-records',
    method: 'get',
    params: query
  })
}

// 查询个人暂存柜信息
export function getPersonalStorageInfo(cabinetCode) {
  return request({
    url: '/personal-storage',
    method: 'get',
    params: { cabinet_code: cabinetCode }
  })
}

// 设置取刀柜告警值
export function setTakeCabinetAlarm(cabinetCode, alarmValue) {
  return request({
    url: '/make-alarm',
    method: 'get',
    params: { 
      cabinet_code: cabinetCode,
      alarm_value: alarmValue
    }
  })
}

// 获取取刀柜告警值
export function getTakeCabinetAlarm(cabinetCode) {
  return request({
    url: '/get-make-alarm',
    method: 'get',
    params: { cabinet_code: cabinetCode }
  })
}