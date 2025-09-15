import request from '@/utils/request'

// 查询出入库信息列表
export function listStockInOutInfo(query) {
  return request({
    url: '/consumableService/stockInOutInfo/list',
    method: 'get',
    params: query
  })
}

// 查询出入库信息详细
export function getStockInOutInfo(id) {
  return request({
    url: '/consumableService/stockInOutInfo/' + id,
    method: 'get'
  })
}

// 根据耗材主键查询出入库信息
export function getStockInOutInfoByCutterId(cutterId) {
  return request({
    url: '/consumableService/stockInOutInfo/cutter/' + cutterId,
    method: 'get'
  })
}

// 上传图片
export function uploadStockImage(data) {
  return request({
    url: '/consumableService/stockInOutInfo/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除图片
export function deleteStockImage(imageId) {
  return request({
    url: '/consumableService/stockInOutInfo/image/' + imageId,
    method: 'delete'
  })
}

// 导出出入库信息
export function exportStockInOutInfo(query) {
  return request({
    url: '/consumableService/stockInOutInfo/export',
    method: 'get',
    params: query
  })
}

// 获取操作类型列表
export function getStockTypeList() {
  return request({
    url: '/consumableService/stockInOutInfo/stockTypes',
    method: 'get'
  })
}

// 获取工厂列表
export function getFactoryList() {
  return request({
    url: '/consumableService/stockInOutInfo/factories',
    method: 'get'
  })
}

// 获取车间列表
export function getWorkshopList() {
  return request({
    url: '/consumableService/stockInOutInfo/workshops',
    method: 'get'
  })
}
