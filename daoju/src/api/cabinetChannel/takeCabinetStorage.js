import request from '@/utils/request'

// 分页查询公共暂存记录
export function getPublicStorageList(query) {
  return request({
    url: '/qw/knife/web/from/mes/cabinet/storage/record/page',
    method: 'get',
    params: query
  })
}

// 查询个人暂存柜信息
export function getPersonalStorageInfo() {
  return request({
    url: '/qw/knife/web/from/mes/cabinet/storage/personal',
    method: 'get'
  })
}

// 设置取刀柜告警值
export function setTakeCabinetAlarm(cabinetCode, alarmValue) {
  return request({
    url: '/qw/knife/web/from/mes/cabinet/alarm/set',
    method: 'post',
    data: { 
      cabinetCode: cabinetCode,
      alarmValue: alarmValue
    }
  })
}

// 获取取刀柜告警值
export function getTakeCabinetAlarm(cabinetCode) {
  return request({
    url: '/qw/knife/web/from/mes/cabinet/alarm/get',
    method: 'get',
    params: { cabinetCode: cabinetCode }
  })
}

// 获取刀柜信息下拉选项
export function getCabinetSelectOptions() {
  return request({
    url: '/qw/knife/web/from/mes/cabinet/select/options',
    method: 'get'
  })
}