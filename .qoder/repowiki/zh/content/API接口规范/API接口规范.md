# API接口规范

<cite>
**本文档引用文件**  
- [request.js](file://daoju/src/utils/request.js)
- [errorCode.js](file://daoju/src/utils/errorCode.js)
- [collectInfo.js](file://daoju/src/api/borrowReturnInfo/collectInfo.js)
- [rankingStatistics.js](file://daoju/src/api/borrowReturnInfo/rankingStatistics.js)
- [returnInfo.js](file://daoju/src/api/borrowReturnInfo/returnInfo.js)
- [totalInventoryStats.js](file://daoju/src/api/borrowReturnInfo/totalInventoryStats.js)
- [unreturnedInfo.js](file://daoju/src/api/borrowReturnInfo/unreturnedInfo.js)
- [collectHandleCabinet.js](file://daoju/src/api/cabinetChannel/collectHandleCabinet.js)
- [handleCabinet.js](file://daoju/src/api/cabinetChannel/handleCabinet.js)
- [brandInfo.js](file://daoju/src/api/consumableService/brandInfo.js)
- [cutterConsumable.js](file://daoju/src/api/consumableService/cutterConsumable.js)
- [stockInOutInfo.js](file://daoju/src/api/consumableService/stockInOutInfo.js)
</cite>

## 目录
1. [简介](#简介)
2. [业务模块接口定义](#业务模块接口定义)
   - [借还信息模块 (borrowReturnInfo)](#借还信息模块-borrowreturninfo)
   - [柜道管理模块 (cabinetChannel)](#柜道管理模块-cabinetchannel)
   - [耗材服务模块 (consumableService)](#耗材服务模块-consumableservice)
3. [请求封装逻辑](#请求封装逻辑)
   - [Axios实例配置](#axios实例配置)
   - [请求拦截器](#请求拦截器)
   - [响应拦截器](#响应拦截器)
   - [通用下载方法](#通用下载方法)
4. [错误码与异常处理](#错误码与异常处理)
   - [后端错误码定义](#后端错误码定义)
   - [前端统一异常处理策略](#前端统一异常处理策略)
5. [API调用示例](#api调用示例)
6. [附录](#附录)

## 简介
本文档旨在详细说明KnifeManager系统的API接口规范，涵盖`src/api`目录下各业务模块的接口定义方式、`utils/request.js`中Axios实例的封装机制、`errorCode.js`中定义的错误码及其前端处理策略，并提供实际调用示例，帮助开发者高效集成和使用系统API。

## 业务模块接口定义

### 借还信息模块 (borrowReturnInfo)

该模块提供刀具借还相关数据的增删改查及统计功能。

#### 收刀信息 (collectInfo)
- `listCollectInfo(query)`：获取收刀信息列表
- `getCollectInfo(id)`：获取收刀信息详情
- `confirmCollect(data)`：确认收刀操作
- `addCollectInfo(data)`：新增收刀信息
- `updateCollectInfo(data)`：修改收刀信息
- `delCollectInfo(id)`：删除收刀信息
- `batchDelCollectInfo(ids)`：批量删除收刀信息
- `exportCollectInfo(query)`：导出收刀信息
- `getCabinetCodeList()`：获取刀柜编码列表
- `getLocationList(cabinetCode)`：根据刀柜编码获取库位列表

#### 还刀信息 (returnInfo)
- `listReturnInfo(query)`：获取还刀信息列表
- `getReturnInfo(id)`：获取还刀信息详情
- `addReturnInfo(data)`：新增还刀信息
- `updateReturnInfo(data)`：修改还刀信息
- `delReturnInfo(id)`：删除还刀信息
- `exportReturnInfo(query)`：导出还刀信息

#### 总库存统计 (totalInventoryStats)
- `listTotalInventoryStats(query)`：获取总库存统计列表
- `getCutterInventoryStats(query)`：查询刀具库存统计
- `getHandleInventoryStats(query)`：查询刀柄库存统计
- `getInventorySummary(type)`：获取库存汇总数据
- `exportInventoryStats(query)`：导出库存统计
- `getBrandList()`：获取品牌列表
- `getCutterTypeList()`：获取刀具类型列表
- `getHandleTypeList()`：获取刀柄类型列表
- `getCabinetList()`：获取刀柜列表

#### 排名统计 (rankingStatistics)
- `getYearlyQuantityStatistics(query)`：全年取刀数量统计
- `getYearlyAmountStatistics(query)`：全年取刀金额统计
- `getYearlyUsageStatistics(query)`：今年累计使用统计
- `getEmployeeRankingStatistics(query)`：员工领刀排行
- `getEquipmentRankingStatistics(query)`：设备用刀排行
- `getCutterModelRankingStatistics(query)`：刀具型号排行
- `getWorkOrderRankingStatistics(query)`：工单排行
- `getAbnormalReturnRankingStatistics(query)`：异常还刀排行

#### 未还信息 (unreturnedInfo)
- `listUnreturnedInfo(query)`：获取未还信息列表
- `getUnreturnedInfo(id)`：获取未还信息详情
- `addUnreturnedInfo(data)`：新增未还信息
- `updateUnreturnedInfo(data)`：修改未还信息
- `delUnreturnedInfo(id)`：删除未还信息
- `exportUnreturnedInfo(query)`：导出未还信息
- `statisticsUnreturnedInfo(query)`：统计未还信息

**Section sources**
- [collectInfo.js](file://daoju/src/api/borrowReturnInfo/collectInfo.js#L1-L89)
- [returnInfo.js](file://daoju/src/api/borrowReturnInfo/returnInfo.js#L1-L54)
- [totalInventoryStats.js](file://daoju/src/api/borrowReturnInfo/totalInventoryStats.js#L1-L79)
- [rankingStatistics.js](file://daoju/src/api/borrowReturnInfo/rankingStatistics.js#L1-L74)
- [unreturnedInfo.js](file://daoju/src/api/borrowReturnInfo/unreturnedInfo.js#L1-L63)

### 柜道管理模块 (cabinetChannel)

该模块用于管理刀柄柜及收刀柄操作。

#### 收刀柄柜 (collectHandleCabinet)
- `listCollectHandleCabinet(query)`：获取收刀柄柜列表
- `getCollectHandleCabinet(id)`：获取收刀柄柜详情
- `addCollectHandleCabinet(data)`：新增收刀柄柜
- `updateCollectHandleCabinet(data)`：修改收刀柄柜
- `delCollectHandleCabinet(id)`：删除收刀柄柜
- `batchDelCollectHandleCabinet(ids)`：批量删除收刀柄柜
- `exportCollectHandleCabinet(query)`：导出收刀柄柜
- `collectHandle(data)`：执行收刀柄操作
- `batchCollectHandle(data)`：批量收刀柄操作
- `getCollectHandleStatistics()`：获取收刀柄统计
- `getBrandList()`：获取品牌列表
- `getHandleTypeList()`：获取刀柄类型列表
- `getCabinetList()`：获取刀柜列表

#### 刀柄柜 (handleCabinet)
- `listHandleCabinet(query)`：获取刀柄柜列表
- `getHandleCabinet(id)`：获取刀柄柜详情
- `addHandleCabinet(data)`：新增刀柄柜
- `updateHandleCabinet(data)`：修改刀柄柜
- `delHandleCabinet(id)`：删除刀柄柜
- `batchDelHandleCabinet(ids)`：批量删除刀柄柜
- `exportHandleCabinet(query)`：导出刀柄柜
- `restockHandleCabinet(data)`：补货操作
- `getHandleTypeList()`：获取刀柄类型列表
- `getBrandList()`：获取品牌列表
- `getSpecificationList()`：获取规格列表

**Section sources**
- [collectHandleCabinet.js](file://daoju/src/api/cabinetChannel/collectHandleCabinet.js#L1-L113)
- [handleCabinet.js](file://daoju/src/api/cabinetChannel/handleCabinet.js#L1-L96)

### 耗材服务模块 (consumableService)

该模块提供耗材品牌、刀具耗材及出入库信息管理。

#### 品牌信息 (brandInfo)
- `listBrandInfo(query)`：获取品牌信息列表
- `getBrandInfo(id)`：获取品牌信息详情
- `addBrandInfo(data)`：新增品牌信息
- `updateBrandInfo(data)`：修改品牌信息
- `delBrandInfo(id)`：删除品牌信息
- `batchDelBrandInfo(ids)`：批量删除品牌信息
- `exportBrandInfo(query)`：导出品牌信息
- `getBrandInfoByCode(brandCode)`：根据品牌编码查询品牌信息
- `getSupplierList()`：获取供应商列表
- `getCorporateList()`：获取公司列表

#### 刀具耗材 (cutterConsumable)
- `listCutterConsumable(query)`：获取刀具耗材列表
- `getCutterConsumable(id)`：获取刀具耗材详情
- `addCutterConsumable(data)`：新增刀具耗材
- `updateCutterConsumable(data)`：修改刀具耗材
- `delCutterConsumable(id)`：删除刀具耗材
- `batchDelCutterConsumable(ids)`：批量删除刀具耗材
- `exportCutterConsumable(query)`：导出刀具耗材
- `importCutterConsumable(data)`：批量导入刀具耗材
- `downloadTemplate()`：下载导入模板
- `getBrandList()`：获取品牌列表
- `getCabinetList()`：获取刀具柜列表
- `getMaterialTypeList()`：获取物料类型列表
- `getCutterTypeList()`：获取刀具类型列表
- `uploadImage(data)`：上传图片（含multipart/form-data头）
- `deleteImage(imageId)`：删除图片
- `updateStock(data)`：更新库存
- `setInventoryWarning(data)`：设置库存预警
- `getStockStatistics()`：获取库存统计

#### 出入库信息 (stockInOutInfo)
- `listStockInOutInfo(query)`：获取出入库信息列表
- `getStockInOutInfo(id)`：获取出入库信息详情
- `getStockInOutInfoByCutterId(cutterId)`：根据耗材主键查询出入库信息
- `uploadStockImage(data)`：上传出入库图片
- `deleteStockImage(imageId)`：删除出入库图片
- `exportStockInOutInfo(query)`：导出出入库信息
- `getStockTypeList()`：获取操作类型列表
- `getFactoryList()`：获取工厂列表
- `getWorkshopList()`：获取车间列表

**Section sources**
- [brandInfo.js](file://daoju/src/api/consumableService/brandInfo.js#L1-L87)
- [cutterConsumable.js](file://daoju/src/api/consumableService/cutterConsumable.js#L1-L158)
- [stockInOutInfo.js](file://daoju/src/api/consumableService/stockInOutInfo.js#L1-L80)

## 请求封装逻辑

### Axios实例配置
系统通过`axios.create()`创建了一个全局请求实例，配置如下：
- `baseURL`：从环境变量`VITE_APP_BASE_API`读取，实现多环境适配
- `timeout`：设置为10秒，防止请求长时间挂起
- `Content-Type`：默认为`application/json;charset=utf-8`

**Section sources**
- [request.js](file://daoju/src/utils/request.js#L14-L21)

### 请求拦截器
请求拦截器主要实现以下功能：

1. **Token注入**：自动从`getToken()`获取JWT令牌，并在请求头中添加`Authorization: Bearer <token>`，除非显式设置`isToken: false`。
2. **GET参数处理**：将`params`对象转换为URL查询字符串。
3. **防重复提交**：对POST/PUT请求进行重复提交校验，通过`sessionObj`缓存最近一次请求的URL、数据和时间，若在1秒内重复提交相同数据则拒绝请求。
4. **大请求限制**：请求数据超过5MB时跳过防重校验并发出警告。

**Section sources**
- [request.js](file://daoju/src/utils/request.js#L23-L68)

### 响应拦截器
响应拦截器负责统一处理服务器响应，主要逻辑如下：

1. **状态码解析**：默认成功码为200，支持401（未授权）、500（服务器错误）、601（警告）等。
2. **错误提示**：
   - `401`：弹出重新登录提示框
   - `500`：显示错误消息
   - `601`：显示警告消息
   - 其他非200状态码：使用`ElNotification`弹出错误通知
3. **二进制数据处理**：对`blob`或`arraybuffer`类型直接返回原始数据，用于文件下载。
4. **网络异常处理**：对`Network Error`、`timeout`等底层错误进行友好提示转换。

**Section sources**
- [request.js](file://daoju/src/utils/request.js#L74-L122)

### 通用下载方法
系统提供`download(url, params, filename, config)`方法用于文件导出：
- 使用`POST`请求发送参数
- 设置`responseType: 'blob'`接收二进制流
- 自动显示“正在下载”加载动画
- 支持`blobValidate`校验是否为有效文件流
- 成功则调用`file-saver`保存文件，失败则提示错误信息

**Section sources**
- [request.js](file://daoju/src/utils/request.js#L125-L149)

## 错误码与异常处理

### 后端错误码定义
`errorCode.js`中定义了常见的后端错误码映射：

| 错误码 | 中文描述 |
|--------|----------|
| '401' | 认证失败，无法访问系统资源 |
| '403' | 当前操作没有权限 |
| '404' | 访问资源不存在 |
| 'default' | 系统未知错误，请反馈给管理员 |

**Section sources**
- [errorCode.js](file://daoju/src/utils/errorCode.js#L1-L5)

### 前端统一异常处理策略
前端通过响应拦截器实现统一异常处理：
- **认证失效**：捕获401状态码，弹出重新登录确认框，用户确认后跳转至登录页。
- **权限不足**：403错误通过全局通知提示。
- **资源不存在**：404错误提示用户访问的资源不存在。
- **服务器异常**：500错误显示具体错误消息。
- **网络异常**：将底层网络错误（如Network Error、timeout）转换为用户可理解的提示。
- **业务警告**：601等业务级警告以黄色消息提示，不影响流程继续。

所有错误均通过Element Plus组件（`ElMessage`、`ElNotification`、`ElMessageBox`）进行可视化反馈，确保用户体验一致。

**Section sources**
- [request.js](file://daoju/src/utils/request.js#L74-L122)
- [errorCode.js](file://daoju/src/utils/errorCode.js#L1-L5)

## API调用示例

以下是在Vue组件中调用API的典型示例：

```javascript
import { listCollectInfo, addCollectInfo } from '@/api/borrowReturnInfo/collectInfo'
import { ElMessage } from 'element-plus'

// 查询收刀信息列表
async function fetchCollectList() {
  try {
    const res = await listCollectInfo({ pageNum: 1, pageSize: 10 })
    console.log('收刀信息列表:', res.rows)
  } catch (error) {
    console.error('获取数据失败:', error.message)
  }
}

// 新增收刀信息
async function handleAdd() {
  const formData = { cabinetCode: 'C001', location: 'A01', cutterId: 1001 }
  try {
    await addCollectInfo(formData)
    ElMessage.success('新增成功')
    fetchCollectList() // 刷新列表
  } catch (error) {
    // 错误已被拦截器处理，此处可做额外逻辑
  }
}

// 导出数据
import { download } from '@/utils/request'
function handleExport() {
  download('/borrowReturnInfo/collectInfo/export', {
    cabinetCode: 'C001'
  }, '收刀信息.xlsx')
}
```

**Section sources**
- [collectInfo.js](file://daoju/src/api/borrowReturnInfo/collectInfo.js#L4-L62)
- [request.js](file://daoju/src/utils/request.js#L125-L149)

## 附录

### 接口命名规范
- URL路径采用`/模块名/功能名/操作`格式，如`/borrowReturnInfo/collectInfo/list`
- 方法名采用`动词+名词`的驼峰命名法，如`listCollectInfo`、`exportStockInOutInfo`
- 批量操作使用`batch`前缀，如`batchDelCollectInfo`

### 安全机制
- 所有请求自动携带JWT Token进行身份认证
- 防重复提交机制防止用户误操作导致数据重复
- 敏感操作（如删除、修改）需后端二次校验权限

### 扩展建议
- 新增模块时应遵循现有API结构，在`src/api`下创建对应目录
- 公共请求逻辑应封装在`utils/request.js`中，避免重复代码
- 错误码应统一维护，前端可根据业务需要扩展`errorCode.js`