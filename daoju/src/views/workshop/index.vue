<template>
  <div class="container">
    <div>车间信息管理</div>
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="车间名称:" prop="workshopName">
          <el-input
            v-model="searchForm.workshopName"
            placeholder="请输入车间名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="工厂名称:" prop="factoryName">
          <el-input
            v-model="searchForm.factoryName"
            placeholder="请输入工厂名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="业务状态:" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择业务状态" clearable>
            <el-option label="启用" :value="1"/>
            <el-option label="禁用" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
          <el-button @click="resetSearch" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="handleAdd">新增车间</el-button>
      <el-button type="danger" icon="delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出数据</el-button>
    </div>

    <!-- 中部表格显示车间信息 -->
    <div class="tableDiv">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :scroll-x="true"
        table-layout="auto"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="ID" align="center" width="80"/>
        <el-table-column prop="workshopName" label="车间名称" align="center" width="150"/>
        <el-table-column prop="factoryName" label="工厂名称" align="center" width="150"/>
        <el-table-column prop="factory" label="工厂编码" align="center" width="120"/>
        <el-table-column prop="status" label="业务状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDept" label="创建部门" align="center" width="120"/>
        <el-table-column prop="createUser" label="创建人" align="center" width="100"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="160"/>
        <el-table-column prop="updateUser" label="更新人" align="center" width="100"/>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="160"/>
        <el-table-column prop="tenantId" label="租户ID" align="center" width="120"/>
        <el-table-column prop="isDeleted" label="删除状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isDeleted === 0 ? 'success' : 'danger'">
              {{ scope.row.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
              <el-button type="warning" size="small" @click="handleEdit(scope.row)" icon="edit">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)" icon="delete">删除</el-button>
            </div>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item label="车间名称" prop="workshopName">
          <el-input v-model="formData.workshopName" placeholder="请输入车间名称"/>
        </el-form-item>
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model="formData.factoryName" placeholder="请输入工厂名称"/>
        </el-form-item>
        <el-form-item label="工厂编码" prop="factory">
          <el-input v-model="formData.factory" placeholder="请输入工厂编码"/>
        </el-form-item>
        <el-form-item label="业务状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择业务状态" style="width: 100%">
            <el-option label="启用" :value="1"/>
            <el-option label="禁用" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="formData.tenantId" placeholder="请输入租户ID"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="车间信息详情" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="车间名称">{{ currentRecord.workshopName }}</el-descriptions-item>
          <el-descriptions-item label="工厂名称">{{ currentRecord.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="工厂编码">{{ currentRecord.factory }}</el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="currentRecord.status === 1 ? 'success' : 'danger'">
              {{ currentRecord.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="删除状态">
            <el-tag :type="currentRecord.isDeleted === 0 ? 'success' : 'danger'">
              {{ currentRecord.isDeleted === 0 ? '正常' : '已删除' }}
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

<script setup name="Workshop">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getWorkshopList, addWorkshop, updateWorkshop, deleteWorkshop, exportWorkshop } from '@/api/workshop'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const dialogTitle = ref('')
const currentRecord = ref(null)
const isEdit = ref(false)

// 搜索表单
const searchForm = reactive({
  workshopName: '',
  factoryName: '',
  status: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 表单数据
const formData = reactive({
  id: null,
  workshopName: '',
  factoryName: '',
  factory: '',
  status: 1,
  tenantId: '',
  createDept: null,
  createUser: null,
  updateUser: null
})

// 表单验证规则
const formRules = {
  workshopName: [
    { required: true, message: '请输入车间名称', trigger: 'blur' }
  ],
  factoryName: [
    { required: true, message: '请输入工厂名称', trigger: 'blur' }
  ],
  factory: [
    { required: true, message: '请输入工厂编码', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ],
  tenantId: [
    { required: true, message: '请输入租户ID', trigger: 'blur' }
  ]
}

const searchFormRef = ref()
const formRef = ref()

// 模拟数据
const mockData = [
  {
    id: 1,
    workshopName: '第一车间',
    factoryName: '主工厂',
    factory: 'FACTORY001',
    status: 1,
    createDept: 1,
    createUser: 1001,
    createTime: '2024-12-27 08:30:00',
    updateUser: 1001,
    updateTime: '2024-12-27 08:30:00',
    tenantId: 'T001',
    isDeleted: 0
  },
  {
    id: 2,
    workshopName: '第二车间',
    factoryName: '主工厂',
    factory: 'FACTORY001',
    status: 1,
    createDept: 1,
    createUser: 1002,
    createTime: '2024-12-26 10:15:00',
    updateUser: 1002,
    updateTime: '2024-12-26 10:15:00',
    tenantId: 'T001',
    isDeleted: 0
  },
  {
    id: 3,
    workshopName: '第三车间',
    factoryName: '分工厂A',
    factory: 'FACTORY002',
    status: 0,
    createDept: 2,
    createUser: 1003,
    createTime: '2024-12-25 14:20:00',
    updateUser: 1003,
    updateTime: '2024-12-25 14:20:00',
    tenantId: 'T001',
    isDeleted: 0
  },
  {
    id: 4,
    workshopName: '精密加工车间',
    factoryName: '分工厂B',
    factory: 'FACTORY003',
    status: 1,
    createDept: 3,
    createUser: 1004,
    createTime: '2024-12-24 16:45:00',
    updateUser: 1004,
    updateTime: '2024-12-24 16:45:00',
    tenantId: 'T002',
    isDeleted: 0
  },
  {
    id: 5,
    workshopName: '装配车间',
    factoryName: '主工厂',
    factory: 'FACTORY001',
    status: 1,
    createDept: 1,
    createUser: 1005,
    createTime: '2024-12-23 09:30:00',
    updateUser: 1005,
    updateTime: '2024-12-23 09:30:00',
    tenantId: 'T001',
    isDeleted: 0
  }
]

// 生命周期
onMounted(() => {
  getList()
})

// 方法
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 这里可以根据搜索条件过滤数据
    let filteredData = [...mockData]

    // 根据车间名称过滤
    if (searchForm.workshopName) {
      filteredData = filteredData.filter(item =>
        item.workshopName.includes(searchForm.workshopName)
      )
    }

    // 根据工厂名称过滤
    if (searchForm.factoryName) {
      filteredData = filteredData.filter(item =>
        item.factoryName.includes(searchForm.factoryName)
      )
    }

    // 根据状态过滤
    if (searchForm.status !== null) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }

    tableData.value = filteredData
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.current = 1
  getList()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    workshopName: '',
    factoryName: '',
    status: null
  })
  nextTick(() => {
    searchFormRef.value?.clearValidate()
  })
  getList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增车间'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑车间'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除车间"${row.workshopName}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实际删除逻辑
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
      getList()
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的${selectedRows.value.length}条记录吗？`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实际批量删除逻辑
    const ids = selectedRows.value.map(row => row.id)
    for (let i = mockData.length - 1; i >= 0; i--) {
      if (ids.includes(mockData[i].id)) {
        mockData.splice(i, 1)
      }
    }
    getList()
    ElMessage.success('批量删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  // 实际导出逻辑
  console.log('导出数据:', selectedRows.value)
}

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑逻辑
        const index = mockData.findIndex(item => item.id === formData.id)
        if (index > -1) {
          Object.assign(mockData[index], {
            ...formData,
            updateTime: new Date().toLocaleString(),
            updateUser: 1001 // 模拟当前用户ID
          })
          ElMessage.success('编辑成功')
        }
      } else {
        // 新增逻辑
        const newId = Math.max(...mockData.map(item => item.id)) + 1
        mockData.push({
          ...formData,
          id: newId,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString(),
          createUser: 1001, // 模拟当前用户ID
          updateUser: 1001,
          createDept: 1, // 模拟当前部门ID
          isDeleted: 0
        })
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      getList()
    }
  })
}

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    workshopName: '',
    factoryName: '',
    factory: '',
    status: 1,
    tenantId: '',
    createDept: null,
    createUser: null,
    updateUser: null
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.topSearchDiv {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.buttonDiv {
  margin-bottom: 20px;
}

.tableDiv {
  margin-bottom: 20px;
  overflow-x: auto;
}

.tableDiv .el-table {
  min-width: 1400px;
}

.paginationDiv {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}
</style>
