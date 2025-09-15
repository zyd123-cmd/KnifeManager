<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="fileExportList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column label="文件ID" align="center" prop="id"/>
      <el-table-column label="文件名称" align="center" prop="fileName"/>
      <el-table-column label="文件类型" align="center" prop="fileType"/>
      <el-table-column label="文件大小" align="center" prop="fileSize"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="创建人" align="center" prop="createUser"/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
            <el-button type="success" size="small" icon="download" @click="handleExport">导出</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
    <el-dialog v-model="detailDialogVisible" title="文件详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="文件ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="文件名称">{{ currentRecord.fileName }}</el-descriptions-item>
          <el-descriptions-item label="文件类型">{{ currentRecord.fileType }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">{{ currentRecord.fileSize }}</el-descriptions-item>
          <el-descriptions-item label="文件路径">{{ currentRecord.filePath }}</el-descriptions-item>
          <el-descriptions-item label="文件描述">{{ currentRecord.fileDescription }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentRecord.status)">
              {{ getStatusText(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下载次数">{{ currentRecord.downloadCount }}</el-descriptions-item>
          <el-descriptions-item label="文件版本">{{ currentRecord.fileVersion }}</el-descriptions-item>
          <el-descriptions-item label="文件标签">{{ currentRecord.fileTags }}</el-descriptions-item>
          <el-descriptions-item label="访问权限">{{ currentRecord.accessPermission }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentRecord.remark }}</el-descriptions-item>
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

<script setup name="FileExport">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(true)
const fileExportList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 模拟数据
const mockFileExportData = [
  {
    id: 1,
    fileName: '刀具库存报表_2024年12月.xlsx',
    fileType: 'Excel',
    fileSize: '2.5MB',
    filePath: '/exports/inventory/2024/12/',
    fileDescription: '2024年12月刀具库存统计报表',
    createTime: '2024-12-27 09:30:00',
    createUser: '系统管理员',
    updateTime: '2024-12-27 09:30:00',
    updateUser: '系统管理员',
    status: 1,
    downloadCount: 15,
    fileVersion: 'v1.0',
    fileTags: '库存,报表,月度',
    accessPermission: '管理员,操作员',
    remark: '包含所有刀具的库存数据'
  },
  {
    id: 2,
    fileName: '员工领刀记录_2024Q4.pdf',
    fileType: 'PDF',
    fileSize: '1.8MB',
    filePath: '/exports/records/2024/Q4/',
    fileDescription: '2024年第四季度员工领刀记录',
    createTime: '2024-12-26 14:20:00',
    createUser: '张三',
    updateTime: '2024-12-26 14:20:00',
    updateUser: '张三',
    status: 1,
    downloadCount: 8,
    fileVersion: 'v1.0',
    fileTags: '领刀,记录,季度',
    accessPermission: '管理员',
    remark: '季度汇总报告'
  },
  {
    id: 3,
    fileName: '设备维护日志_202412.csv',
    fileType: 'CSV',
    fileSize: '856KB',
    filePath: '/exports/maintenance/2024/12/',
    fileDescription: '2024年12月设备维护日志',
    createTime: '2024-12-25 16:45:00',
    createUser: '李四',
    updateTime: '2024-12-25 16:45:00',
    updateUser: '李四',
    status: 2,
    downloadCount: 3,
    fileVersion: 'v1.0',
    fileTags: '维护,日志,月度',
    accessPermission: '管理员,技术员',
    remark: '设备维护详细记录'
  },
  {
    id: 4,
    fileName: '异常还刀统计_2024年度.xlsx',
    fileType: 'Excel',
    fileSize: '3.2MB',
    filePath: '/exports/abnormal/2024/',
    fileDescription: '2024年度异常还刀统计分析',
    createTime: '2024-12-24 11:10:00',
    createUser: '王五',
    updateTime: '2024-12-24 11:10:00',
    updateUser: '王五',
    status: 1,
    downloadCount: 22,
    fileVersion: 'v2.1',
    fileTags: '异常,统计,年度',
    accessPermission: '管理员',
    remark: '年度异常情况分析报告'
  },
  {
    id: 5,
    fileName: '刀具采购计划_2025Q1.docx',
    fileType: 'Word',
    fileSize: '1.2MB',
    filePath: '/exports/procurement/2025/Q1/',
    fileDescription: '2025年第一季度刀具采购计划',
    createTime: '2024-12-23 13:30:00',
    createUser: '赵六',
    updateTime: '2024-12-23 13:30:00',
    updateUser: '赵六',
    status: 0,
    downloadCount: 0,
    fileVersion: 'v1.0',
    fileTags: '采购,计划,季度',
    accessPermission: '管理员,采购员',
    remark: '下季度采购需求计划'
  }
]

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    0: 'info',    // 待处理
    1: 'success', // 已完成
    2: 'warning'  // 处理中
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '待处理',
    1: '已完成',
    2: '处理中'
  }
  return statusMap[status] || '未知'
}

// 查询列表数据
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 模拟分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    fileExportList.value = mockFileExportData.slice(start, end)
    pagination.total = mockFileExportData.length
    loading.value = false
  }, 500)
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 详情
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 导出
const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的文件')
    return
  }

  ElMessage.info('导出功能暂未实现')
}

// 分页相关方法
const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped>
.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.detail-content {
  margin-top: 20px;
}

.app-container {
  padding: 20px;
}

/* 确保表格充分利用页面空间 */
:deep(.el-table) {
  width: 100% !important;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

/* 操作列样式优化 */
:deep(.el-table .operation-buttons .el-button) {
  margin: 0;
  padding: 5px 8px;
  font-size: 12px;
}

:deep(.el-table .operation-buttons .el-button + .el-button) {
  margin-left: 8px;
}

.paginationDiv {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
