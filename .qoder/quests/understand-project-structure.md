# 废刀页面设计文档（简化版 - 仅表格部分）

## 功能定位

废刀页面用于从收刀柜获取并展示还刀信息。页面采用简洁设计，仅包含一个刀柜编码输入框和数据表格，无复杂查询条件和操作按钮。

## 业务场景

- **场景一**：管理员输入刀柜编码，快速查看该刀柜的废刀信息
- **场景二**：审计员查看特定刀柜的废刀详细记录

## 页面结构设计

### 整体布局

```
┌─────────────────────────────────────────────────┐
│  单个输入框 + 查询按钮                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  数据表格区域（废刀列表）                         │
│                                                 │
├─────────────────────────────────────────────────┤
│  分页组件区域                                    │
└─────────────────────────────────────────────────┘
```

### 查询区域

采用极简设计，仅包含一个输入框和一个查询按钮。

**查询字段**：

| 字段名称 | 字段类型 | 组件类型 | 是否必填 | 说明 |
|---------|---------|---------|---------|------|
| 刀柜编码 | String | el-input | 否 | 支持清空，回车查询 |

**操作按钮**：
- 查询按钮：primary类型，带搜索图标

### 数据表格区域

参考补货记录页面的表格风格，使用 `el-table` 组件，支持多选、边框、loading加载状态。

**表格列配置**：

| 列名称 | 字段名 | 宽度 | 对齐方式 | 是否固定 | 特殊处理 |
|-------|--------|------|---------|---------|----------|
| 复选框 | - | 55 | center | - | 多选列 |
| 还刀状态 | borrowStatus | 100 | center | - | 状态标签渲染 |
| 刀柜编码 | cabinetCode | 120 | center | - | - |
| 库位号 | stockLoc | 100 | center | - | - |
| 还刀时间 | borrowTime | 160 | center | - | - |
| 还刀人 | borrowUserName | 100 | center | - | - |
| 品牌名称 | brandName | 120 | center | - | - |
| 刀具型号 | cutterCode | 150 | center | - | - |
| 刀具类型 | cutterType | 120 | center | - | - |
| 规格 | specification | 120 | center | - | - |
| 取刀时间 | lendTime | 160 | center | - | - |
| 借刀人 | lendUserName | 100 | center | - | - |
| 记录状态 | recordStatus | 100 | center | - | 状态标签渲染 |
| 操作 | - | 120 | center | right | 操作按钮组 |

**状态标签映射**：

还刀状态（borrowStatus）：
- 0: 修磨（warning标签，橙色）
- 1: 报废（danger标签，红色）
- 2: 换线（info标签，灰色）
- 3: 错领（空白标签，灰色）

记录状态（recordStatus）：
- 0: 取刀（primary标签，蓝色）
- 1: 还刀（success标签，绿色）
- 2: 收刀（warning标签，橙色）
- 3: 暂存（info标签，灰色）

**操作列按钮**：

| 按钮名称 | 按钮类型 | 尺寸 | 图标 | 功能说明 |
|---------|---------|------|------|----------|
| 详情 | primary | small | view | 查看废刀详细信息 |

### 分页组件区域

使用 Element Plus 标准分页组件，保持与补货记录一致。

**配置参数**：
- 每页条数选项：[10, 20, 50, 100]
- 默认每页条数：20
- 布局：total, sizes, prev, pager, next, jumper

## 对话框设计

### 详情对话框

参考补货记录的详情对话框风格。

**基本属性**：
- 标题：废刀详细信息
- 宽度：800px

**内容结构**：

采用 `el-descriptions` 组件展示详细信息，2列布局，带边框。

**信息字段**：

| 标签 | 字段 | 说明 |
|------|------|------|
| 取刀主键 | id | - |
| 还刀状态 | borrowStatus | 标签展示 |
| 刀柜编码 | cabinetCode | - |
| 库位号 | stockLoc | - |
| 还刀时间 | borrowTime | - |
| 还刀人 | borrowUserName | - |
| 品牌名称 | brandName | - |
| 刀具型号 | cutterCode | - |
| 刀具类型 | cutterType | - |
| 规格 | specification | - |
| 取刀时间 | lendTime | - |
| 借刀人 | lendUserName | - |
| 记录状态 | recordStatus | 标签展示 |

**对话框底部**：
- 关闭按钮：default类型

## API接口对接

### 接口基本信息

| 项目 | 内容 |
|------|------|
| 接口地址 | /qw/knife/web/from/mes/lend/getLendByStock |
| 请求方式 | GET |
| 请求类型 | application/x-www-form-urlencoded |
| 响应类型 | application/json |

### 请求参数

| 参数名 | 类型 | 是否必填 | 说明 |
|-------|------|---------|------|
| cabinetCode | String | 否 | 刀柜编码 |

### 响应数据结构

**顶层结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| code | Integer | 状态码 |
| success | Boolean | 是否成功 |
| msg | String | 返回消息 |
| data | Object | 业务数据对象 |

**data对象结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| cabinetCode | String | 刀柜编码 |
| borrowStatus | String | 还刀状态 |
| recordStatus | Integer | 记录状态 |
| list | Array | 还刀详情列表 |

**list数组元素结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | Integer | 取刀主键 |
| borrowStatus | Integer | 还刀状态：0-修磨 1-报废 2-换线 3-错领 |
| borrowTime | String | 还刀时间 |
| borrowUserName | String | 还刀人 |
| brandName | String | 品牌名称 |
| cutterCode | String | 刀具型号 |
| cutterType | String | 刀具类型 |
| lendTime | String | 取刀时间 |
| lendUserName | String | 借刀人 |
| recordStatus | Integer | 记录状态：0-取刀 1-还刀 2-收刀 3-暂存 |
| specification | String | 规格 |
| stockLoc | String | 库位号 |

### 响应示例

```javascript
{
  "code": 0,
  "data": {
    "borrowStatus": "",
    "cabinetCode": "",
    "list": [
      {
        "borrowStatus": 0,
        "borrowTime": "2024-12-27 14:30:00",
        "borrowUserName": "张三",
        "brandName": "三菱",
        "cutterCode": "MT001",
        "cutterType": "铣刀",
        "id": 0,
        "lendTime": "2024-12-27 08:30:00",
        "lendUserName": "李四",
        "recordStatus": 0,
        "specification": "Φ10×25×75",
        "stockLoc": "A01"
      }
    ],
    "recordStatus": 0
  },
  "msg": "",
  "success": true
}
```

### 接口调用流程

```
用户输入刀柜编码
    ↓
点击查询按钮 / 回车键
    ↓
组装请求参数（cabinetCode）
    ↓
发起GET请求到接口
    ↓
显示加载状态（loading）
    ↓
接收响应数据
    ↓
判断success字段
    ↓
成功 → 提取data.list渲染表格
    ↓
失败 → 显示错误消息（msg）
    ↓
关闭加载状态
```

## 状态管理

### 页面状态变量

| 变量名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| loading | Boolean | false | 表格加载状态 |
| tableData | Array | [] | 废刀数据列表 |
| selectedRows | Array | [] | 选中的行数据 |
| detailDialogVisible | Boolean | false | 详情对话框显示状态 |
| currentRecord | Object | null | 当前查看的废刀记录 |
| cabinetCode | String | '' | 刀柜编码输入值 |

### 分页参数对象

```javascript
pagination: {
  current: 1,      // 当前页码
  size: 20,        // 每页条数
  total: 0         // 总记录数
}
```

## 交互行为设计

### 查询操作

**触发方式**：
1. 点击查询按钮
2. 输入框回车键

**执行流程**：
1. 设置loading为true
2. 调用API接口
3. 处理响应数据
4. 更新表格数据（data.list）
5. 更新分页总数
6. 设置loading为false

**错误处理**：
- 网络错误：显示"网络连接失败"提示
- 业务错误：显示后端返回的msg信息
- 无数据：显示表格空状态

### 详情查看

**触发方式**：
点击表格行的"详情"按钮

**执行流程**：
1. 获取当前行数据
2. 赋值给currentRecord
3. 打开详情对话框
4. 展示详细信息

### 多选操作

**触发方式**：
勾选表格复选框

**执行流程**：
1. 触发selection-change事件
2. 更新selectedRows数组

### 分页操作

**执行流程**：
1. 监听分页变化事件
2. 更新分页参数
3. 保持当前查询条件
4. 重新加载表格数据

## 样式规范

### 容器类名

参考补货记录页面的样式结构：

| 类名 | 用途 |
|------|------|
| .container | 页面主容器 |
| .topSearchDiv | 顶部查询区域 |
| .tableDiv | 表格容器 |
| .paginationDiv | 分页容器 |

### 间距规范

- 查询区域与表格间距：20px（通过margin实现）
- 表格与分页间距：20px

### 颜色规范

遵循Element Plus主题色系：

| 状态 | 颜色值 | 使用场景 |
|------|-------|----------|
| primary | #409EFF | 查询按钮、详情按钮、取刀状态 |
| success | #67C23A | 还刀状态 |
| warning | #E6A23C | 修磨状态、收刀状态 |
| danger | #F56C6C | 报废状态 |
| info | #909399 | 换线状态、暂存状态、错领状态 |

## 权限控制

### 页面访问权限

| 角色 | 是否可访问 |
|------|----------|
| 操作员 | 否 |
| 班组长 | 是 |
| 管理员 | 是 |
| 审计员 | 是 |

## 异常场景处理

### 无数据场景

**显示内容**：
- 表格空状态提示：使用Element Plus默认空状态

### 接口超时

**处理方式**：
- 显示错误提示："请求超时，请稍后重试"
- 关闭loading状态
- 保持原有数据不变

### 权限不足

**处理方式**：
- 跳转到401错误页面
- 或显示"无权限访问"提示

## 文件组织结构

```
views/borrowReturnInfo/scrapKnife/
└── index.vue              # 页面主组件
```

## 组件命名规范

- 页面组件名：ScrapKnife
- 文件名：index.vue
- 路由path：/borrowReturnInfo/scrapKnife
- 路由name：ScrapKnife

## 依赖组件

| 组件名 | 来源 | 用途 |
|-------|------|------|
| el-form | Element Plus | 查询表单 |
| el-form-item | Element Plus | 表单项 |
| el-input | Element Plus | 输入框 |
| el-button | Element Plus | 按钮 |
| el-table | Element Plus | 数据表格 |
| el-table-column | Element Plus | 表格列 |
| el-pagination | Element Plus | 分页组件 |
| el-dialog | Element Plus | 对话框 |
| el-descriptions | Element Plus | 描述列表 |
| el-descriptions-item | Element Plus | 描述项 |
| el-tag | Element Plus | 状态标签 |

## 工具函数需求

| 函数名 | 功能 | 位置 |
|-------|------|------|
| ElMessage | 消息提示 | element-plus |

## 状态映射函数

### getBorrowStatusText

将borrowStatus数值转换为文本：
- 0 → 修磨
- 1 → 报废
- 2 → 换线
- 3 → 错领

### getBorrowStatusType

将borrowStatus数值转换为标签类型：
- 0 → warning
- 1 → danger
- 2 → info
- 3 → 空字符串（默认样式）

### getRecordStatusText

将recordStatus数值转换为文本：
- 0 → 取刀
- 1 → 还刀
- 2 → 收刀
- 3 → 暂存

### getRecordStatusType

将recordStatus数值转换为标签类型：
- 0 → primary
- 1 → success
- 2 → warning
- 3 → info

## 实现要点

### 查询区域实现

1. 使用 `el-form` 组件，`:inline="true"` 实现内联布局
2. 输入框绑定 `v-model="cabinetCode"`
3. 输入框添加 `@keyup.enter="handleSearch"` 支持回车查询
4. 查询按钮绑定 `@click="handleSearch"`

### 表格区域实现

1. 使用 `el-table` 组件，`:data="tableData"`
2. 添加 `border` 属性显示边框
3. 添加 `v-loading="loading"` 显示加载状态
4. 添加 `@selection-change="handleSelectionChange"` 处理多选
5. 状态列使用 `<template #default="scope">` 渲染标签
6. 操作列设置 `fixed="right"` 固定在右侧

### 分页组件实现

1. 使用 `v-model:current-page` 和 `v-model:page-size` 双向绑定
2. 监听 `@size-change` 和 `@current-change` 事件

### 详情对话框实现

1. 使用 `v-model="detailDialogVisible"` 控制显示
2. 使用 `el-descriptions` 组件展示详情
3. 设置 `:column="2"` 实现2列布局
4. 添加 `border` 属性显示边框

## 代码示例

### 页面主组件 (index.vue)

```vue
<template>
  <div class="container">
    <!-- 顶部查询区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="刀柜编码:">
          <el-input
            v-model="cabinetCode"
            placeholder="请输入刀柜编码"
            clearable
            @keyup.enter="handleSearch"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 中部表格显示废刀信息 -->
    <div class="tableDiv">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="borrowStatus" label="还刀状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getBorrowStatusType(scope.row.borrowStatus)">
              {{ getBorrowStatusText(scope.row.borrowStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120" />
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100" />
        <el-table-column prop="borrowTime" label="还刀时间" align="center" width="160" />
        <el-table-column prop="borrowUserName" label="还刀人" align="center" width="100" />
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120" />
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150" />
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120" />
        <el-table-column prop="specification" label="规格" align="center" width="120" />
        <el-table-column prop="lendTime" label="取刀时间" align="center" width="160" />
        <el-table-column prop="lendUserName" label="借刀人" align="center" width="100" />
        <el-table-column prop="recordStatus" label="记录状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getRecordStatusType(scope.row.recordStatus)">
              {{ getRecordStatusText(scope.row.recordStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="View">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="paginationDiv">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="废刀详细信息" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="取刀主键">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="还刀状态">
            <el-tag :type="getBorrowStatusType(currentRecord.borrowStatus)">
              {{ getBorrowStatusText(currentRecord.borrowStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="还刀时间">{{ currentRecord.borrowTime }}</el-descriptions-item>
          <el-descriptions-item label="还刀人">{{ currentRecord.borrowUserName }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="取刀时间">{{ currentRecord.lendTime }}</el-descriptions-item>
          <el-descriptions-item label="借刀人">{{ currentRecord.lendUserName }}</el-descriptions-item>
          <el-descriptions-item label="记录状态">
            <el-tag :type="getRecordStatusType(currentRecord.recordStatus)">
              {{ getRecordStatusText(currentRecord.recordStatus) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ScrapKnife">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)
const cabinetCode = ref('')

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 查询操作
const handleSearch = async () => {
  if (!cabinetCode.value) {
    ElMessage.warning('请输入刀柜编码')
    return
  }

  loading.value = true
  try {
    const response = await request({
      url: '/qw/knife/web/from/mes/lend/getLendByStock',
      method: 'get',
      params: {
        cabinetCode: cabinetCode.value
      }
    })

    if (response.success) {
      tableData.value = response.data.list || []
      pagination.total = tableData.value.length
      ElMessage.success('查询成功')
    } else {
      ElMessage.error(response.msg || '查询失败')
      tableData.value = []
    }
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('网络连接失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 多选处理
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 详情查看
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 分页 - 每页条数变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
}

// 分页 - 当前页变化
const handleCurrentChange = (current) => {
  pagination.current = current
}

// 还刀状态文本
const getBorrowStatusText = (status) => {
  const statusMap = {
    0: '修磨',
    1: '报废',
    2: '换线',
    3: '错领'
  }
  return statusMap[status] || '未知'
}

// 还刀状态类型
const getBorrowStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'danger',
    2: 'info',
    3: ''
  }
  return typeMap[status] || ''
}

// 记录状态文本
const getRecordStatusText = (status) => {
  const statusMap = {
    0: '取刀',
    1: '还刀',
    2: '收刀',
    3: '暂存'
  }
  return statusMap[status] || '未知'
}

// 记录状态类型
const getRecordStatusType = (status) => {
  const typeMap = {
    0: 'primary',
    1: 'success',
    2: 'warning',
    3: 'info'
  }
  return typeMap[status] || ''
}

// 组件挂载
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.topSearchDiv {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  .demo-form-inline {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}

.tableDiv {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.paginationDiv {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
```

### 说明

**核心功能实现**：

1. **查询功能**：
   - 使用 `request` 工具函数调用API接口
   - 支持回车键触发查询
   - 提供加载状态提示

2. **表格展示**：
   - 使用 `el-table` 组件
   - 支持多选功能
   - 状态列使用标签渲染
   - 操作列固定在右侧

3. **分页功能**：
   - 使用 `el-pagination` 组件
   - 支持每页条数调整
   - 支持页码跳转

4. **详情查看**：
   - 使用 `el-dialog` 对话框
   - 使用 `el-descriptions` 展示详情
   - 支持状态标签展示

5. **状态映射**：
   - `getBorrowStatusText`: 还刀状态文本转换
   - `getBorrowStatusType`: 还刀状态标签类型
   - `getRecordStatusText`: 记录状态文本转换
   - `getRecordStatusType`: 记录状态标签类型

**使用注意事项**：

1. 需要在 `src/api/borrowReturnInfo/` 目录下创建该文件
2. 确保后端接口地址正确
3. 根据实际响应数据结构调整代码
4. 根据项目实际路由配置添加路由

- **场景一**：管理员需要查看某个刀柜中待回收的废刀信息
- **场景二**：审计员需要审核和统计废刀回收记录
- **场景三**：操作员需要了解特定刀柜的废刀详细情况

## 页面结构设计

### 整体布局

```
┌─────────────────────────────────────────────────┐
│  顶部查询条件区域(查询表单)                      │
├─────────────────────────────────────────────────┤
│  操作按钮区域(导出、刷新等)                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  数据表格区域(废刀列表)                         │
│                                                 │
├─────────────────────────────────────────────────┤
│  分页组件区域                                    │
└─────────────────────────────────────────────────┘
```

### 查询条件区域

采用 `el-form` 内联表单布局，保持与项目整体风格一致。

**查询字段**：

| 字段名称 | 字段类型 | 组件类型 | 是否必填 | 说明 |
|---------|---------|---------|---------|------|
| 刀柜编码 | String | el-input | 否 | 支持模糊查询和清空 |

**操作按钮**：
- 搜索按钮：primary类型，带搜索图标
- 重置按钮：default类型，带刷新图标

### 操作按钮区域

位于查询表单下方，提供批量操作功能。

**按钮列表**：

| 按钮名称 | 按钮类型 | 图标 | 权限标识 | 功能说明 |
|---------|---------|------|---------|----------|
| 导出 | success | download | scrapKnife:export | 导出当前查询结果 |
| 刷新 | default | refresh | - | 刷新列表数据 |

### 数据表格区域

使用 `el-table` 组件，支持多选、排序、固定列等功能。

**表格列配置**：

| 列名称 | 字段名 | 宽度 | 对齐方式 | 是否固定 | 特殊处理 |
|-------|--------|------|---------|---------|----------|
| 复选框 | - | 55 | center | - | 多选列 |
| 还刀状态 | borrowStatus | 120 | center | - | 状态标签渲染 |
| 刀柜编码 | cabinetCode | 150 | center | - | - |
| 还刀时间 | borrowTime | 180 | center | - | - |
| 还刀人 | borrowUserName | 120 | center | - | - |
| 品牌名称 | brandName | 120 | center | - | - |
| 刀具型号 | cutterCode | 150 | center | - | - |
| 刀具类型 | cutterType | 120 | center | - | - |
| 规格 | specification | 120 | center | - | - |
| 库位号 | stockLoc | 120 | center | - | - |
| 取刀时间 | lendTime | 180 | center | - | - |
| 借刀人 | lendUserName | 120 | center | - | - |
| 记录状态 | recordStatus | 120 | center | - | 状态标签渲染 |
| 操作 | - | 120 | center | right | 操作按钮组 |

**状态标签映射**：

还刀状态（borrowStatus）：
- 0: 修磨（warning标签，橙色）
- 1: 报废（danger标签，红色）
- 2: 换线（info标签，灰色）
- 3: 错领（default标签，灰色）

记录状态（recordStatus）：
- 0: 取刀（primary标签，蓝色）
- 1: 还刀（success标签，绿色）
- 2: 收刀（warning标签，橙色）
- 3: 暂存（info标签，灰色）

**操作列按钮**：

| 按钮名称 | 按钮类型 | 尺寸 | 图标 | 功能说明 |
|---------|---------|------|------|----------|
| 详情 | primary | small | view | 查看废刀详细信息 |

### 分页组件区域

使用 Element Plus 标准分页组件。

**配置参数**：
- 每页条数选项：[10, 20, 50, 100]
- 默认每页条数：20
- 布局：total, sizes, prev, pager, next, jumper

## 对话框设计

### 详情对话框

**基本属性**：
- 标题：废刀详细信息
- 宽度：800px
- 是否点击遮罩关闭：false

**内容结构**：

采用 `el-descriptions` 组件展示详细信息，分为以下几个部分：

**基本信息区域**：

| 标签 | 字段 | 说明 |
|------|------|------|
| 取刀主键 | id | 唯一标识 |
| 还刀状态 | borrowStatus | 标签展示 |
| 刀柜编码 | cabinetCode | - |
| 库位号 | stockLoc | - |
| 还刀时间 | borrowTime | 格式化时间 |
| 还刀人 | borrowUserName | - |
| 取刀时间 | lendTime | 格式化时间 |
| 借刀人 | lendUserName | - |
| 记录状态 | recordStatus | 标签展示 |

**刀具信息区域**：

| 标签 | 字段 | 说明 |
|------|------|------|
| 刀具型号 | cutterCode | - |
| 刀具类型 | cutterType | - |
| 品牌名称 | brandName | - |
| 规格 | specification | - |

**对话框底部**：
- 关闭按钮：default类型

## API接口对接

### 接口基本信息

| 项目 | 内容 |
|------|------|
| 接口地址 | /qw/knife/web/from/mes/lend/getLendByStock |
| 请求方式 | GET |
| 请求类型 | application/x-www-form-urlencoded |
| 响应类型 | application/json |

### 请求参数

| 参数名 | 类型 | 是否必填 | 说明 |
|-------|------|---------|------|
| cabinetCode | String | 否 | 刀柜编码 |

### 响应数据结构

**顶层结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| code | Integer | 状态码，200表示成功 |
| success | Boolean | 是否成功 |
| msg | String | 返回消息 |
| data | Object | 业务数据对象 |

**data对象结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| cabinetCode | String | 刀柜编码 |
| borrowStatus | String | 还刀状态 |
| recordStatus | Integer | 记录状态 |
| list | Array | 还刀详情列表 |

**list数组元素结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | Integer | 取刀主键 |
| borrowStatus | Integer | 还刀状态：0-修磨 1-报废 2-换线 3-错领 |
| borrowTime | String | 还刀时间 |
| borrowUserName | String | 还刀人 |
| brandName | String | 品牌名称 |
| cutterCode | String | 刀具型号 |
| cutterType | String | 刀具类型 |
| lendTime | String | 取刀时间 |
| lendUserName | String | 借刀人 |
| recordStatus | Integer | 记录状态：0-取刀 1-还刀 2-收刀 3-暂存 |
| specification | String | 规格 |
| stockLoc | String | 库位号 |

### 接口调用流程

```
用户输入查询条件
    ↓
点击搜索按钮
    ↓
组装请求参数（cabinetCode）
    ↓
发起GET请求到接口
    ↓
显示加载状态（loading）
    ↓
接收响应数据
    ↓
判断success字段
    ↓
成功 → 提取data.list渲染表格
    ↓
失败 → 显示错误消息（msg）
    ↓
关闭加载状态
```

## 状态管理

### 页面状态变量

| 变量名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| loading | Boolean | false | 表格加载状态 |
| showSearch | Boolean | true | 是否显示搜索区域 |
| scrapKnifeList | Array | [] | 废刀数据列表 |
| selectedRows | Array | [] | 选中的行数据 |
| detailDialogVisible | Boolean | false | 详情对话框显示状态 |
| currentRecord | Object | null | 当前查看的废刀记录 |

### 查询参数对象

```
queryParams: {
  cabinetCode: ''  // 刀柜编码
}
```

### 分页参数对象

```
pagination: {
  current: 1,      // 当前页码
  size: 20,        // 每页条数
  total: 0         // 总记录数
}
```

## 交互行为设计

### 查询操作

**触发方式**：
1. 点击搜索按钮
2. 输入框回车键

**执行流程**：
1. 验证查询参数（可选）
2. 设置loading为true
3. 调用API接口
4. 处理响应数据
5. 更新表格数据
6. 设置loading为false

**错误处理**：
- 网络错误：显示"网络连接失败"提示
- 业务错误：显示后端返回的msg信息
- 无数据：显示"暂无数据"空状态

### 重置操作

**执行流程**：
1. 清空查询参数对象
2. 重置分页参数为初始状态
3. 清空表格数据

### 导出操作

**前置条件**：
- 表格中有数据

**执行流程**：
1. 获取当前查询条件
2. 调用导出接口
3. 下载Excel文件
4. 显示导出成功提示

**文件命名**：
- 格式：废刀信息_YYYYMMDD_HHmmss.xlsx

### 刷新操作

**执行流程**：
1. 保持当前查询条件
2. 重新调用查询接口
3. 刷新表格数据

### 详情查看

**触发方式**：
点击表格行的"详情"按钮

**执行流程**：
1. 获取当前行数据
2. 赋值给currentRecord
3. 打开详情对话框
4. 展示详细信息

### 多选操作

**触发方式**：
勾选表格复选框

**执行流程**：
1. 触发selection-change事件
2. 更新selectedRows数组
3. 更新批量操作按钮状态

## 样式规范

### 容器类名

| 类名 | 用途 |
|------|------|
| .app-container | 页面主容器 |
| .topSearchDiv | 顶部查询区域 |
| .buttonDiv | 操作按钮区域 |
| .tableDiv | 表格容器 |
| .paginationDiv | 分页容器 |
| .detail-content | 详情内容区域 |

### 间距规范

- 查询表单与按钮区域间距：20px
- 按钮区域与表格间距：20px
- 表格与分页间距：20px
- 对话框内部区域间距：20px

### 颜色规范

遵循Element Plus主题色系：

| 状态 | 颜色值 | 使用场景 |
|------|-------|----------|
| primary | #409EFF | 主要操作按钮、主要状态 |
| success | #67C23A | 成功状态、导出按钮 |
| warning | #E6A23C | 警告状态、修磨状态 |
| danger | #F56C6C | 错误状态、报废状态 |
| info | #909399 | 次要信息、暂存状态 |

## 权限控制

### 页面访问权限

| 角色 | 是否可访问 |
|------|----------|
| 操作员 | 否 |
| 班组长 | 是 |
| 管理员 | 是 |
| 审计员 | 是 |

### 按钮权限

| 按钮 | 权限标识 | 拥有权限的角色 |
|------|---------|---------------|
| 导出 | scrapKnife:export | 管理员、审计员 |
| 详情 | scrapKnife:detail | 全部角色 |

## 数据验证

### 查询参数验证

| 参数 | 验证规则 |
|------|----------|
| cabinetCode | 非必填，最大长度50字符 |

## 异常场景处理

### 无数据场景

**显示内容**：
- 表格空状态提示："暂无废刀数据"
- 导出按钮禁用

### 接口超时

**处理方式**：
- 显示错误提示："请求超时，请稍后重试"
- 关闭loading状态
- 保持原有数据不变

### 权限不足

**处理方式**：
- 跳转到401错误页面
- 或显示"无权限访问"提示

## 性能优化策略

### 列表渲染优化

- 使用虚拟滚动（数据量大于500条时）
- 表格固定高度，启用滚动加载

### 接口请求优化

- 防抖处理搜索输入（300ms）
- 避免重复请求（请求进行中时禁用搜索按钮）

### 数据缓存

- 详情数据缓存（避免重复请求相同记录）
- 查询结果缓存（5分钟内）

## 用户体验优化

### 加载提示

- 表格数据加载：显示骨架屏或loading动画
- 导出操作：显示进度提示

### 操作反馈

- 查询成功：表格数据更新
- 导出成功：显示"导出成功"提示
- 操作失败：显示具体错误信息

### 快捷操作

- 支持回车键触发搜索
- 支持Esc键关闭对话框

## 响应式适配

### 桌面端（>1200px）

- 表格列全部显示
- 查询表单4列布局

### 平板端（768px-1200px）

- 表格部分列隐藏
- 查询表单2列布局

### 移动端（<768px）

- 表格切换为卡片视图
- 查询表单1列布局
- 操作按钮堆叠显示

## 扩展性设计

### 预留扩展点

1. **查询条件扩展**：预留更多查询字段的位置
2. **操作按钮扩展**：预留批量处理、统计分析等功能按钮
3. **表格列扩展**：预留自定义列配置功能
4. **导出格式扩展**：预留PDF、CSV等多种导出格式

### 可配置项

| 配置项 | 默认值 | 说明 |
|-------|-------|------|
| 每页条数 | 20 | 可配置 |
| 表格高度 | auto | 可固定 |
| 是否显示序号列 | false | 可配置 |
| 是否显示操作列 | true | 可配置 |

## 文件组织结构

```
views/borrowReturnInfo/scrapKnife/
├── index.vue              # 页面主组件
└── api.js                 # API接口函数（可选）
```

## 组件命名规范

- 页面组件名：ScrapKnife
- 文件名：index.vue
- 路由path：/borrowReturnInfo/scrapKnife
- 路由name：ScrapKnife

## 依赖组件

| 组件名 | 来源 | 用途 |
|-------|------|------|
| el-form | Element Plus | 查询表单 |
| el-table | Element Plus | 数据表格 |
| el-pagination | Element Plus | 分页组件 |
| el-dialog | Element Plus | 对话框 |
| el-descriptions | Element Plus | 描述列表 |
| el-tag | Element Plus | 状态标签 |
| el-button | Element Plus | 按钮 |

## 工具函数需求

| 函数名 | 功能 | 位置 |
|-------|------|------|
| parseTime | 时间格式化 | @/utils/ruoyi |
| download | 文件下载 | @/utils/request |
| resetForm | 表单重置 | @/utils/ruoyi |

## 状态映射函数

### getBorrowStatusText

将borrowStatus数值转换为文本：
- 0 → 修磨
- 1 → 报废
- 2 → 换线
- 3 → 错领

### getBorrowStatusType

将borrowStatus数值转换为标签类型：
- 0 → warning
- 1 → danger
- 2 → info
- 3 → default

### getRecordStatusText

将recordStatus数值转换为文本：
- 0 → 取刀
- 1 → 还刀
- 2 → 收刀
- 3 → 暂存

### getRecordStatusType

将recordStatus数值转换为标签类型：
- 0 → primary
- 1 → success
- 2 → warning
- 3 → info
