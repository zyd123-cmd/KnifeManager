import request from '@/utils/request'

// 分页查询刀具耗材信息
export function getCutterList(query) {
  return request({
    url: '/cutters',
    method: 'get',
    params: query
  })
}

// 批量上传刀具信息
export function uploadCutterData(data) {
  return request({
    url: '/cutters/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取上传Token
export function getUploadToken() {
  return request({
    url: '/cutters/token',
    method: 'get'
  })
}

// 新增刀具耗材
export function saveCutter(data) {
  return request({
    url: '/cutters',
    method: 'post',
    data: data
  })
}

// 编辑刀具耗材
export function updateCutter(cutterId, data) {
  return request({
    url: `/cutters/${cutterId}`,
    method: 'put',
    data: data
  })
}

// 删除刀具耗材
export function deleteCutter(ids) {
  return request({
    url: '/cutters',
    method: 'delete',
    data: { ids: ids },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取刀具柜列表
export function getCabinetList() {
  return request({
    url: '/cabinets',
    method: 'get'
  })
}

// 搜索刀具耗材（同查询接口）
export function searchCutter(query) {
  return request({
    url: '/cutters/search',
    method: 'get',
    params: query
  })
}