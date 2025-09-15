import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/deviceInfo/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDevice(id) {
  return request({
    url: '/deviceInfo/device/' + id,
    method: 'get'
  })
}

// 新增设备
export function addDevice(data) {
  return request({
    url: '/deviceInfo/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/deviceInfo/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delDevice(id) {
  return request({
    url: '/deviceInfo/device/' + id,
    method: 'delete'
  })
}

// 导出设备
export function exportDevice(query) {
  return request({
    url: '/deviceInfo/device/export',
    method: 'get',
    params: query
  })
}

// 启用/禁用设备
export function changeDeviceStatus(id, status) {
  return request({
    url: '/deviceInfo/device/changeStatus',
    method: 'put',
    data: {
      id: id,
      deviceStatus: status
    }
  })
}

// 获取设备类型列表
export function getDeviceTypes() {
  return request({
    url: '/deviceInfo/device/types',
    method: 'get'
  })
}

// 获取车间列表
export function getWorkshopList() {
  return request({
    url: '/deviceInfo/device/workshops',
    method: 'get'
  })
}
