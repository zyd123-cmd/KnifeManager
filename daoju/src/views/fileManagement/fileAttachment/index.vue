<template>
  <div class="app-container">
    <!-- 操作按钮区域 -->
    <div class="buttonDiv" style="margin-bottom: 20px;">
      <el-button type="primary" icon="upload" @click="handleUpload">上传附件</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="fileAttachmentList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column label="附件ID" align="center" prop="id"/>
      <el-table-column label="附件名称" align="center" prop="annexName"/>
      <el-table-column label="附件原名" align="center" prop="originalName"/>
      <el-table-column label="附件拓展名" align="center" prop="extension"/>
      <el-table-column label="对象名称" align="center" prop="objectName"/>
      <el-table-column label="创建人" align="center" prop="createDept"/>
      <el-table-column label="更新人" align="center" prop="updateUser"/>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
            <el-button type="danger" size="small" icon="delete" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog v-model="detailDialogVisible" title="附件详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="附件ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="附件名称">{{ currentRecord.annexName }}</el-descriptions-item>
          <el-descriptions-item label="附件原名">{{ currentRecord.originalName }}</el-descriptions-item>
          <el-descriptions-item label="绝对路径">{{ currentRecord.annexUrl }}</el-descriptions-item>
          <el-descriptions-item label="附件拓展名">{{ currentRecord.extension }}</el-descriptions-item>
          <el-descriptions-item label="对象名称">{{ currentRecord.objectName }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createDept }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="所属表主键">{{ currentRecord.subId }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenantId }}</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传附件" width="600px">
      <el-form :model="uploadForm" ref="uploadFormRef" label-width="120px">
        <el-form-item label="附件附属主键" prop="subId" required>
          <el-input v-model="uploadForm.subId" placeholder="请输入附件附属主键" />
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId" required>
          <el-input v-model="uploadForm.tenantId" placeholder="请输入租户ID" />
        </el-form-item>
        <el-form-item label="选择图片" prop="file" required>
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :on-change="handleFileChange"
            :file-list="fileList"
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确定上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="FileAttachment">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(true)
const fileAttachmentList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const currentRecord = ref(null)
const uploadFormRef = ref()
const uploadRef = ref()
const fileList = ref([])

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 查询参数
const queryParams = reactive({
  subId: ''
})

// 上传表单
const uploadForm = reactive({
  subId: '',
  tenantId: '',
  file: null
})

// 模拟数据
const mockFileAttachmentData = [
  {
    id: 1,
    annexName: '产品图片_001.jpg',
    annexUrl: '/uploads/attachments/2024/12/product_001.jpg',
    createDept: '技术部',
    extension: 'jpg',
    objectName: '产品展示图',
    originalName: '产品图片_高清版_001.jpg',
    subId: 'PROD_001',
    tenantId: 'TENANT_001',
    updateUser: '张三'
  },
  {
    id: 2,
    annexName: '设备说明书.pdf',
    annexUrl: '/uploads/attachments/2024/12/equipment_manual.pdf',
    createDept: '设备部',
    extension: 'pdf',
    objectName: '设备文档',
    originalName: '数控设备操作说明书_v2.0.pdf',
    subId: 'EQUIP_002',
    tenantId: 'TENANT_001',
    updateUser: '李四'
  },
  {
    id: 3,
    annexName: '工艺流程图.png',
    annexUrl: '/uploads/attachments/2024/12/process_flow.png',
    createDept: '工艺部',
    extension: 'png',
    objectName: '工艺图纸',
    originalName: '刀具加工工艺流程图_最新版.png',
    subId: 'PROC_003',
    tenantId: 'TENANT_002',
    updateUser: '王五'
  },
  {
    id: 4,
    annexName: '质检报告.xlsx',
    annexUrl: '/uploads/attachments/2024/12/quality_report.xlsx',
    createDept: '质检部',
    extension: 'xlsx',
    objectName: '质检文档',
    originalName: '2024年12月质量检测报告.xlsx',
    subId: 'QC_004',
    tenantId: 'TENANT_001',
    updateUser: '赵六'
  },
  {
    id: 5,
    annexName: '培训视频.mp4',
    annexUrl: '/uploads/attachments/2024/12/training_video.mp4',
    createDept: '人事部',
    extension: 'mp4',
    objectName: '培训资料',
    originalName: '新员工安全培训视频_2024版.mp4',
    subId: 'TRAIN_005',
    tenantId: 'TENANT_002',
    updateUser: '钱七'
  }
]

// 查询列表数据
const getList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size
    
    fileAttachmentList.value = mockFileAttachmentData.slice(start, end)
    pagination.total = mockFileAttachmentData.length
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

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除附件"${row.annexName}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除API调用
    ElMessage.success('删除成功')
    getList()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 上传
const handleUpload = () => {
  uploadForm.subId = ''
  uploadForm.tenantId = ''
  uploadForm.file = null
  fileList.value = []
  uploadDialogVisible.value = true
}

// 文件选择
const handleFileChange = (file) => {
  uploadForm.file = file.raw
}

// 提交上传
const submitUpload = () => {
  if (!uploadForm.subId) {
    ElMessage.warning('请输入附件附属主键')
    return
  }
  if (!uploadForm.tenantId) {
    ElMessage.warning('请输入租户ID')
    return
  }
  if (!uploadForm.file) {
    ElMessage.warning('请选择要上传的图片')
    return
  }
  
  // 模拟上传API调用
  loading.value = true
  setTimeout(() => {
    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    loading.value = false
    getList()
  }, 1000)
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

.buttonDiv {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
