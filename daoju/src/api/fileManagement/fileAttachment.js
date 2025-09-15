import request from '@/utils/request'

// 查询文件附件列表
export function listFileAttachment(query) {
  return request({
    url: '/fileManagement/fileAttachment/list',
    method: 'get',
    params: query
  })
}

// 查询文件附件详细
export function getFileAttachment(id) {
  return request({
    url: '/fileManagement/fileAttachment/' + id,
    method: 'get'
  })
}

// 新增文件附件
export function addFileAttachment(data) {
  return request({
    url: '/fileManagement/fileAttachment',
    method: 'post',
    data: data
  })
}

// 修改文件附件
export function updateFileAttachment(data) {
  return request({
    url: '/fileManagement/fileAttachment',
    method: 'put',
    data: data
  })
}

// 删除文件附件
export function delFileAttachment(id) {
  return request({
    url: '/fileManagement/fileAttachment/' + id,
    method: 'delete'
  })
}

// 上传文件附件
export function uploadFileAttachment(data) {
  return request({
    url: '/fileManagement/fileAttachment/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 下载文件附件
export function downloadFileAttachment(id) {
  return request({
    url: '/fileManagement/fileAttachment/download/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
