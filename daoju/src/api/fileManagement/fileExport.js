import request from '@/utils/request'

// 查询文件导出列表
export function listFileExport(query) {
  return request({
    url: '/fileManagement/fileExport/list',
    method: 'get',
    params: query
  })
}

// 查询文件导出详细
export function getFileExport(id) {
  return request({
    url: '/fileManagement/fileExport/' + id,
    method: 'get'
  })
}

// 新增文件导出
export function addFileExport(data) {
  return request({
    url: '/fileManagement/fileExport',
    method: 'post',
    data: data
  })
}

// 修改文件导出
export function updateFileExport(data) {
  return request({
    url: '/fileManagement/fileExport',
    method: 'put',
    data: data
  })
}

// 删除文件导出
export function delFileExport(id) {
  return request({
    url: '/fileManagement/fileExport/' + id,
    method: 'delete'
  })
}

// 导出文件
export function exportFiles(data) {
  return request({
    url: '/fileManagement/fileExport/export',
    method: 'post',
    data: data
  })
}

// 下载文件
export function downloadFile(id) {
  return request({
    url: '/fileManagement/fileExport/download/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
