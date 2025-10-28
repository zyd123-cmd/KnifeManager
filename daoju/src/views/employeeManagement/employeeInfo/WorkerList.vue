<template>
  <div class="container">
    <!-- 顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="员工姓名:" prop="employeeName">
          <el-input v-model="formInline.employeeName" placeholder="请输入员工姓名" clearable />
        </el-form-item>
        <el-form-item label="员工编号:" prop="employeeCode">
          <el-input v-model="formInline.employeeCode" placeholder="请输入员工编号" clearable />
        </el-form-item>
        <el-form-item label="部门:" prop="department">
          <el-input v-model="formInline.department" placeholder="请输入部门" clearable />
        </el-form-item>
        <el-form-item label="IC卡号:" prop="icCardNumber">
          <el-input v-model="formInline.icCardNumber" placeholder="请输入IC卡号" clearable />
        </el-form-item>
        <el-form-item label="入职时间:" prop="hireDate">
          <el-date-picker
            v-model="formInline.hireDate"
            type="date"
            placeholder="请选择入职时间"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增按钮、批量上传、下载模版 -->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增工人</el-button>
      <el-button type="primary" icon="upload" @click="openBatchUploadDialog">批量上传</el-button>
      <el-button type="info" icon="download">下载模版</el-button>
    </div>
    <!-- 中部表格显示工人信息 -->
    <div class="tableDiv">
      <el-table :data="filteredWorkerData" border style="width: 100%">
        <el-table-column prop="employeeCode" label="员工编号" align="center" />
        <el-table-column prop="employeeName" label="员工姓名" align="center" />
        <el-table-column prop="employeeRole" label="员工角色" align="center">
          <template #default="scope">
            <el-tag type="primary">工人</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" align="center" />
        <el-table-column prop="icCardNumber" label="IC卡号" align="center" />
        <el-table-column prop="phone" label="联系电话" align="center" />
        <el-table-column prop="hireDate" label="入职时间" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button 
                :type="scope.row.status === 'active' ? 'warning' : 'success'" 
                size="small" 
                @click="handleStatusChange(scope.row)"
              >
                {{ scope.row.status === 'active' ? '离职' : '复职' }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增工人信息对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑工人信息' : '新增工人信息'"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="employeeName">
              <el-input
                v-model="addForm.employeeName"
                placeholder="请输入员工姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isEdit">
            <el-form-item label="员工编号" prop="employeeCode">
              <el-input
                v-model="addForm.employeeCode"
                placeholder="系统自动生成"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工角色" prop="employeeRole">
              <el-select
                v-model="addForm.employeeRole"
                placeholder="请选择员工角色"
                clearable
                style="width: 100%"
                disabled
              >
                <el-option label="工人" value="worker" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input
                v-model="addForm.department"
                placeholder="请输入部门"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="IC卡号" prop="icCardNumber">
              <el-input
                v-model="addForm.icCardNumber"
                placeholder="请输入IC卡号"
                clearable
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="addForm.phone"
                placeholder="请输入联系电话"
                clearable
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入职时间" prop="hireDate">
              <el-date-picker
                v-model="addForm.hireDate"
                type="date"
                placeholder="请选择入职时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工状态" prop="status">
              <el-select
                v-model="addForm.status"
                placeholder="请选择员工状态"
                style="width: 100%"
              >
                <el-option label="在职" value="active" />
                <el-option label="离职" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="家庭住址" prop="address">
              <el-input
                v-model="addForm.address"
                placeholder="请输入家庭住址"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="addForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitAddForm"
            :loading="addLoading"
          >
            {{ addLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量上传对话框 -->
    <el-dialog
      v-model="batchUploadDialogVisible"
      title="批量上传工人信息"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-container">
        <div class="upload-tips">
          <el-alert
            title="上传说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>1. 请选择Excel文件进行上传（支持.xlsx、.xls格式）</p>
                <p>2. 文件大小不超过10MB</p>
                <p>3. 请确保Excel文件格式正确，可先下载模板参考</p>
                <p>4. IC卡号必须唯一，不能重复</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="upload-area">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将Excel文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传xlsx/xls文件，且不超过10MB
              </div>
            </template>
          </el-upload>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeBatchUploadDialog">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitUpload"
            :loading="uploadLoading"
            :disabled="fileList.length === 0"
          >
            {{ uploadLoading ? '上传中...' : '确认上传' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const formInlineRes = ref()
const uploadRef = ref()
const addFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  employeeName: '', // 员工姓名
  employeeCode: '', // 员工编号
  department: '', // 部门
  icCardNumber: '', // IC卡号
  hireDate: '', // 入职时间
  pageNum: 1,
  pageSize: 10
})

// 表格数据 - 仅包含工人
const tableData = reactive([
  {
    id: 2,
    employeeName: '李四',
    employeeCode: 'EMP002',
    employeeRole: 'worker',
    department: '生产一部',
    icCardNumber: 'IC20240002',
    phone: '13800138002',
    hireDate: '2023-03-20',
    status: 'active',
    address: '北京市海淀区xxx街道xxx号',
    remark: '技术熟练的工人'
  },
  {
    id: 3,
    employeeName: '王五',
    employeeCode: 'EMP003',
    employeeRole: 'worker',
    department: '生产二部',
    icCardNumber: 'IC20240003',
    phone: '13800138003',
    hireDate: '2023-05-10',
    status: 'active',
    address: '北京市西城区xxx街道xxx号',
    remark: '新入职员工，学习能力强'
  },
  {
    id: 5,
    employeeName: '孙七',
    employeeCode: 'EMP005',
    employeeRole: 'worker',
    department: '质检部',
    icCardNumber: 'IC20240005',
    phone: '13800138005',
    hireDate: '2023-07-01',
    status: 'inactive',
    address: '北京市丰台区xxx街道xxx号',
    remark: '已离职'
  },
  {
    id: 6,
    employeeName: '周八',
    employeeCode: 'EMP006',
    employeeRole: 'worker',
    department: '维修部',
    icCardNumber: 'IC20240006',
    phone: '13800138006',
    hireDate: '2023-09-12',
    status: 'active',
    address: '北京市石景山区xxx街道xxx号',
    remark: '设备维修专家'
  }
])

// 过滤出工人数据并应用搜索条件
const filteredWorkerData = computed(() => {
  return tableData.filter(emp => {
    // 只显示工人
    if (emp.employeeRole !== 'worker') return false
    
    // 应用搜索条件
    if (formInline.employeeName && !emp.employeeName.includes(formInline.employeeName)) return false
    if (formInline.employeeCode && !emp.employeeCode.includes(formInline.employeeCode)) return false
    if (formInline.department && !emp.department.includes(formInline.department)) return false
    if (formInline.icCardNumber && !emp.icCardNumber.includes(formInline.icCardNumber)) return false
    if (formInline.hireDate && emp.hireDate !== formInline.hireDate) return false
    
    return true
  })
})

// 新增/编辑相关数据
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)

// 新增表单数据
const addForm = reactive({
  employeeName: '',
  employeeCode: '',
  employeeRole: 'worker', // 固定为工人
  department: '',
  icCardNumber: '',
  phone: '',
  hireDate: '',
  status: 'active',
  address: '',
  remark: ''
})

// 表单验证规则
const addFormRules = reactive({
  employeeName: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入部门', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  icCardNumber: [
    { required: true, message: '请输入IC卡号', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^[A-Z0-9]+$/, message: 'IC卡号只能包含大写字母和数字', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  hireDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择员工状态', trigger: 'change' }
  ]
})

// 批量上传相关数据
const batchUploadDialogVisible = ref(false)
const uploadLoading = ref(false)
const fileList = ref([])

// 生成员工编号
const generateEmployeeCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  // 获取当天已有的员工编号，计算序号
  const today = `${year}${month}${day}`
  const existingCodes = tableData.filter(emp =>
    emp.employeeCode && emp.employeeCode.startsWith(`EMP${today}`)
  )

  const nextNumber = existingCodes.length + 1
  const sequence = String(nextNumber).padStart(3, '0')

  return `EMP${today}${sequence}`
}

const openAddDialog = () => {
  isEdit.value = false
  editId.value = null
  resetAddForm()
  // 新增时自动生成员工编号
  addForm.employeeCode = generateEmployeeCode()
  addDialogVisible.value = true
}

const closeAddDialog = () => {
  addDialogVisible.value = false
  resetAddForm()
  addLoading.value = false
}

const resetAddForm = () => {
  Object.assign(addForm, {
    employeeName: '',
    employeeCode: '',
    employeeRole: 'worker', // 固定为工人
    department: '',
    icCardNumber: '',
    phone: '',
    hireDate: '',
    status: 'active',
    address: '',
    remark: ''
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

const submitAddForm = async () => {
  try {
    const valid = await addFormRef.value.validate()
    if (!valid) return

    addLoading.value = true

    // 检查IC卡号是否重复
    const existingEmployee = tableData.find(emp =>
      emp.icCardNumber === addForm.icCardNumber
      && (!isEdit.value || emp.id !== editId.value)
    )

    if (existingEmployee) {
      ElMessage.error('IC卡号已存在，请使用其他卡号')
      return
    }

    const submitData = {
      ...addForm,
      hireDate: addForm.hireDate ? new Date(addForm.hireDate).toISOString().split('T')[0] : ''
    }

    if (isEdit.value) {
      // 编辑操作
      const index = tableData.findIndex(item => item.id === editId.value)
      if (index !== -1) {
        tableData[index] = { ...tableData[index], ...submitData }
      }
      ElMessage.success('编辑成功!')
    } else {
      // 新增操作
      const newId = Math.max(...tableData.map(item => item.id), 0) + 1
      tableData.push({ ...submitData, id: newId })
      ElMessage.success('新增工人成功!')
    }

    closeAddDialog()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '新增失败，请重试')
  } finally {
    addLoading.value = false
  }
}

const openBatchUploadDialog = () => {
  batchUploadDialogVisible.value = true
  fileList.value = []
}

const closeBatchUploadDialog = () => {
  batchUploadDialogVisible.value = false
  fileList.value = []
  uploadLoading.value = false
}

const handleFileChange = (file, files) => {
  fileList.value = files
}

const handleFileRemove = (file, files) => {
  fileList.value = files
}

const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('只能上传Excel文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过10MB!')
    return false
  }
  return true
}

const submitUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  try {
    uploadLoading.value = true
    const formData = new FormData()
    formData.append('file', fileList.value[0].raw)
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('批量上传工人信息成功!')
    closeBatchUploadDialog()
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

const onSubmit = () => {
  const searchParams = { ...formInline }
  console.log('搜索参数:', searchParams)
  ElMessage.success('搜索完成!')
}

const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
}

const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(addForm, {
    employeeName: row.employeeName,
    employeeCode: row.employeeCode,
    employeeRole: row.employeeRole,
    department: row.department,
    icCardNumber: row.icCardNumber,
    phone: row.phone,
    hireDate: row.hireDate,
    status: row.status,
    address: row.address || '',
    remark: row.remark || ''
  })
  addDialogVisible.value = true
}

const handleStatusChange = (row) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  const actionText = newStatus === 'inactive' ? '离职' : '复职'

  ElMessageBox.confirm(`确定要将工人 ${row.employeeName} 设置为${actionText}状态吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData[index].status = newStatus
    }
    ElMessage.success(`${actionText}操作成功!`)
  }).catch(() => {
    ElMessage.info(`已取消${actionText}操作`)
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除工人 ${row.employeeName} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.splice(index, 1)
    }
    ElMessage.success('删除成功!')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 5px 10px;

  .topSearchDiv {
    width: 100%;
  }
  .buttonDiv{
    width: 100%;
    margin-bottom: 20px;
  }
}

.upload-container {
  .upload-tips {
    margin-bottom: 20px;

    :deep(.el-alert__content) {
      p {
        margin: 5px 0;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }

  .upload-area {
    .upload-demo {
      width: 100%;

      :deep(.el-upload) {
        width: 100%;
      }

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      :deep(.el-icon--upload) {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 16px;
      }

      :deep(.el-upload__text) {
        font-size: 14px;
        color: #606266;

        em {
          color: #409eff;
          font-style: normal;
        }
      }

      :deep(.el-upload__tip) {
        font-size: 12px;
        color: #909399;
        margin-top: 10px;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-table) {
  .el-tag {
    font-weight: 500;
  }
}
</style>