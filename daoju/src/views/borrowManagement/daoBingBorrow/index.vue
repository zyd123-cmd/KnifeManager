<template>
  <div class="container">
    <div>刀柄借出管理页面</div>
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="借出单号:" prop="borrowCode">
          <el-input v-model="formInline.borrowCode" placeholder="请输入借出单号" clearable/>
        </el-form-item>
        <el-form-item label="借出人:" prop="borrowerName">
          <el-input v-model="formInline.borrowerName" placeholder="请输入借出人姓名" clearable/>
        </el-form-item>
        <el-form-item label="借出人编号:" prop="borrowerCode">
          <el-input v-model="formInline.borrowerCode" placeholder="请输入借出人编号" clearable/>
        </el-form-item>
        <el-form-item label="刀柄品牌:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入刀柄品牌" clearable/>
        </el-form-item>
        <el-form-item label="刀柄规格:" prop="handleSpec">
          <el-input v-model="formInline.handleSpec" placeholder="请输入刀柄规格" clearable/>
        </el-form-item>
        <el-form-item label="借出状态:" prop="borrowStatus">
          <el-select v-model="formInline.borrowStatus" placeholder="请选择借出状态" clearable style="width: 150px;">
            <el-option label="已借出" value="borrowed" />
            <el-option label="已归还" value="returned" />
            <el-option label="逾期未还" value="overdue" />
            <el-option label="报废" value="scrapped" />
          </el-select>
        </el-form-item>
        <el-form-item label="借出时间:" prop="borrowDate">
          <el-date-picker
              v-model="formInline.borrowDate"
              type="date"
              placeholder="请选择借出时间"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    新增按钮、批量操作-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openBorrowDialog">新增借出</el-button>
      <el-button type="success" icon="check" @click="batchReturn">批量归还</el-button>
      <el-button type="info" icon="download">导出记录</el-button>
    </div>
    <!--    中部表格显示借出记录-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="borrowCode" label="借出单号" align="center"/>
        <el-table-column prop="borrowerName" label="借出人" align="center"/>
        <el-table-column prop="borrowerCode" label="借出人编号" align="center"/>
        <el-table-column prop="brandName" label="刀柄品牌" align="center"/>
        <el-table-column prop="handleSpec" label="刀柄规格" align="center"/>
        <el-table-column prop="handleType" label="刀柄类型" align="center"/>
        <el-table-column prop="quantity" label="借出数量" align="center"/>
        <el-table-column prop="borrowDate" label="借出时间" align="center"/>
        <el-table-column prop="expectedReturnDate" label="预计归还时间" align="center"/>
        <el-table-column prop="borrowStatus" label="借出状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.borrowStatus === 'borrowed' ? 'warning' :
                     scope.row.borrowStatus === 'returned' ? 'success' :
                     scope.row.borrowStatus === 'scrapped' ? 'info' : 'danger'"
            >
              {{ scope.row.borrowStatus === 'borrowed' ? '已借出' :
                 scope.row.borrowStatus === 'returned' ? '已归还' :
                 scope.row.borrowStatus === 'scrapped' ? '报废' : '逾期未还' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="280">
          <template #default="scope">
            <div style="display: flex; align-items: center;justify-content: center; gap: 6px; flex-wrap: nowrap;">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                v-if="(scope.row.borrowStatus === 'borrowed' || scope.row.borrowStatus === 'overdue') && canReturn(scope.row)"
                type="success"
                size="small"
                @click="handleReturn(scope.row)"
              >
                归还
              </el-button>
              <el-tooltip
                v-else-if="scope.row.borrowStatus === 'borrowed' || scope.row.borrowStatus === 'overdue'"
                content="只能由借出人本人归还"
                placement="top"
              >
                <el-button
                  type="success"
                  size="small"
                  :disabled="true"
                >
                  归还
                </el-button>
              </el-tooltip>
              <el-button type="warning" size="small" @click="handleTempStore(scope.row)">暂存</el-button>
              <el-button type="info" size="small" @click="handleDetail(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增借出对话框 -->
    <el-dialog
      v-model="borrowDialogVisible"
      :title="isEdit ? '编辑借出记录' : '新增刀柄借出'"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="borrowFormRef"
        :model="borrowForm"
        :rules="borrowFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20" v-if="isEdit">
          <el-col :span="12">
            <el-form-item label="借出单号" prop="borrowCode">
              <el-input
                v-model="borrowForm.borrowCode"
                placeholder="系统自动生成"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="借出人" prop="borrowerName">
              <el-input
                v-model="borrowForm.borrowerName"
                placeholder="当前登录用户"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借出人编号" prop="borrowerCode">
              <el-input
                v-model="borrowForm.borrowerCode"
                placeholder="当前用户编号"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀柄品牌" prop="brandName">
              <el-select
                v-model="borrowForm.brandName"
                placeholder="请选择刀柄品牌"
                clearable
                style="width: 100%"
                @change="handleBrandChange"
              >
                <el-option label="三菱" value="三菱" />
                <el-option label="山特维克" value="山特维克" />
                <el-option label="肯纳" value="肯纳" />
                <el-option label="伊斯卡" value="伊斯卡" />
                <el-option label="住友" value="住友" />
                <el-option label="瓦尔特" value="瓦尔特" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刀柄类型" prop="handleType">
              <el-select
                v-model="borrowForm.handleType"
                placeholder="请选择刀柄类型"
                clearable
                style="width: 100%"
              >
                <el-option label="BT刀柄" value="BT" />
                <el-option label="HSK刀柄" value="HSK" />
                <el-option label="CAT刀柄" value="CAT" />
                <el-option label="SK刀柄" value="SK" />
                <el-option label="ER刀柄" value="ER" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀柄规格" prop="handleSpec">
              <el-select
                v-model="borrowForm.handleSpec"
                placeholder="请选择刀柄规格"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option 
                  v-for="handle in availableHandles" 
                  :key="handle.id"
                  :label="handle.handleSpec" 
                  :value="handle.handleSpec"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="借出数量" prop="quantity">
              <el-input-number
                v-model="borrowForm.quantity"
                placeholder="请输入借出数量"
                :min="1"
                :max="99"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计归还时间" prop="expectedReturnDate">
              <el-date-picker
                v-model="borrowForm.expectedReturnDate"
                type="date"
                placeholder="请选择预计归还时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="借出用途" prop="borrowPurpose">
              <el-input
                v-model="borrowForm.borrowPurpose"
                type="textarea"
                :rows="3"
                placeholder="请输入借出用途或备注"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeBorrowDialog">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitBorrowForm"
            :loading="borrowLoading"
          >
            {{ borrowLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {reactive, ref, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const formInlineRes = ref()
const borrowFormRef = ref()

// 当前登录用户信息（模拟数据，实际应从用户状态管理获取）
const currentUser = reactive({
  employeeCode: 'EMP001', // 当前登录用户的员工编号
  employeeName: '张三',   // 当前登录用户的姓名
  role: 'worker'          // 用户角色
})

// 顶部查询数据
const formInline = reactive({
  borrowCode: '', //借出单号
  borrowerName: '', //借出人
  borrowerCode: '', //借出人编号
  brandName: '', //刀柄品牌
  handleSpec: '', //刀柄规格
  borrowStatus: '', //借出状态
  borrowDate: '', //借出时间
  pageNum: 1,
  pageSize: 10
})

// 员工列表（模拟数据，实际应从员工管理接口获取）
const employeeList = reactive([
  { id: 1, employeeName: '张三', employeeCode: 'EMP001' },
  { id: 2, employeeName: '李四', employeeCode: 'EMP002' },
  { id: 3, employeeName: '王五', employeeCode: 'EMP003' },
  { id: 4, employeeName: '赵六', employeeCode: 'EMP004' },
])

// 可用刀柄列表（模拟数据，实际应从刀柄管理接口获取）
const availableHandles = reactive([
  { id: 1, handleSpec: 'BT40-ER32-100', brandName: '三菱', handleType: 'BT' },
  { id: 2, handleSpec: 'HSK-A63-ER25-80', brandName: '山特维克', handleType: 'HSK' },
  { id: 3, handleSpec: 'CAT40-ER20-60', brandName: '肯纳', handleType: 'CAT' },
  { id: 4, handleSpec: 'SK40-ER16-70', brandName: '伊斯卡', handleType: 'SK' },
])

// 表格数据
const tableData = reactive([
  {
    id: 1,
    borrowCode: 'HBR20241227001',
    borrowerName: '张三',
    borrowerCode: 'EMP001',
    brandName: '三菱',
    handleSpec: 'BT40-ER32-100',
    handleType: 'BT',
    quantity: 1,
    borrowDate: '2024-12-25',
    expectedReturnDate: '2024-12-30',
    actualReturnDate: '',
    borrowStatus: 'borrowed',
    borrowPurpose: '生产线装配使用'
  },
  {
    id: 2,
    borrowCode: 'HBR20241227002',
    borrowerName: '李四',
    borrowerCode: 'EMP002',
    brandName: '山特维克',
    handleSpec: 'HSK-A63-ER25-80',
    handleType: 'HSK',
    quantity: 2,
    borrowDate: '2024-12-24',
    expectedReturnDate: '2024-12-26',
    actualReturnDate: '2024-12-26',
    borrowStatus: 'returned',
    borrowPurpose: '设备维修更换'
  },
  {
    id: 3,
    borrowCode: 'HBR20241227003',
    borrowerName: '王五',
    borrowerCode: 'EMP003',
    brandName: '肯纳',
    handleSpec: 'CAT40-ER20-60',
    handleType: 'CAT',
    quantity: 1,
    borrowDate: '2024-12-20',
    expectedReturnDate: '2024-12-25',
    actualReturnDate: '',
    borrowStatus: 'overdue',
    borrowPurpose: '紧急生产任务'
  },
  {
    id: 4,
    borrowCode: 'HBR20241227004',
    borrowerName: '赵六',
    borrowerCode: 'EMP004',
    brandName: '瓦尔特',
    handleSpec: 'BT50-ER40-120',
    handleType: 'BT',
    quantity: 1,
    borrowDate: '2024-12-23',
    expectedReturnDate: '2024-12-28',
    actualReturnDate: '2024-12-27',
    borrowStatus: 'scrapped',
    borrowPurpose: '高速加工测试，刀柄损坏报废'
  }
])

// 借出相关数据
const borrowDialogVisible = ref(false)
const borrowLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const selectedRows = ref([])

// 借出表单数据
const borrowForm = reactive({
  borrowCode: '',
  borrowerName: '',
  borrowerCode: '',
  brandName: '',
  handleType: '',
  handleSpec: '',
  quantity: 1,
  expectedReturnDate: '',
  borrowPurpose: ''
})

// 表单验证规则
const borrowFormRules = reactive({
  // 借出人不需要验证，因为是自动填充的当前用户
  brandName: [
    { required: true, message: '请选择刀柄品牌', trigger: 'change' }
  ],
  handleType: [
    { required: true, message: '请选择刀柄类型', trigger: 'change' }
  ],
  handleSpec: [
    { required: true, message: '请选择刀柄规格', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入借出数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '借出数量必须大于0', trigger: 'blur' }
  ],
  expectedReturnDate: [
    { required: true, message: '请选择预计归还时间', trigger: 'change' }
  ]
})

// 生成借出单号（刀柄用HBR前缀）
const generateBorrowCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const today = `${year}${month}${day}`
  const existingCodes = tableData.filter(record =>
    record.borrowCode && record.borrowCode.startsWith(`HBR${today}`)
  )

  const nextNumber = existingCodes.length + 1
  const sequence = String(nextNumber).padStart(3, '0')

  return `HBR${today}${sequence}`
}

// 所有功能函数
const openBorrowDialog = () => {
  isEdit.value = false
  editId.value = null
  resetBorrowForm()
  borrowForm.borrowCode = generateBorrowCode()
  // 自动填充当前用户信息
  borrowForm.borrowerName = currentUser.employeeName
  borrowForm.borrowerCode = currentUser.employeeCode
  borrowDialogVisible.value = true
}

const closeBorrowDialog = () => {
  borrowDialogVisible.value = false
  resetBorrowForm()
  borrowLoading.value = false
}

const resetBorrowForm = () => {
  Object.assign(borrowForm, {
    borrowCode: '',
    borrowerName: currentUser.employeeName, // 默认为当前用户
    borrowerCode: currentUser.employeeCode, // 默认为当前用户编号
    brandName: '',
    handleType: '',
    handleSpec: '',
    quantity: 1,
    expectedReturnDate: '',
    borrowPurpose: ''
  })
  nextTick(() => {
    borrowFormRef.value?.clearValidate()
  })
}

// 借出人变更处理（现在不需要了，因为借出人固定为当前用户）
// const handleBorrowerChange = (employeeName) => {
//   const employee = employeeList.find(emp => emp.employeeName === employeeName)
//   if (employee) {
//     borrowForm.borrowerCode = employee.employeeCode
//   } else {
//     borrowForm.borrowerCode = ''
//   }
// }

const handleBrandChange = (brandName) => {
  borrowForm.handleSpec = ''
}

const submitBorrowForm = async () => {
  try {
    const valid = await borrowFormRef.value.validate()
    if (!valid) return

    borrowLoading.value = true

    const submitData = {
      ...borrowForm,
      borrowDate: new Date().toISOString().split('T')[0],
      borrowStatus: 'borrowed',
      expectedReturnDate: borrowForm.expectedReturnDate ?
        new Date(borrowForm.expectedReturnDate).toISOString().split('T')[0] : ''
    }

    if (isEdit.value) {
      submitData.id = editId.value
      console.log('编辑借出记录:', submitData)
      ElMessage.success('编辑成功!')
    } else {
      console.log('新增借出记录:', submitData)
      ElMessage.success('借出登记成功!')
    }

    closeBorrowDialog()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '借出登记失败，请重试')
  } finally {
    borrowLoading.value = false
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

  Object.assign(borrowForm, {
    borrowCode: row.borrowCode,
    borrowerName: row.borrowerName,
    borrowerCode: row.borrowerCode,
    brandName: row.brandName,
    handleType: row.handleType,
    handleSpec: row.handleSpec,
    quantity: row.quantity,
    expectedReturnDate: row.expectedReturnDate,
    borrowPurpose: row.borrowPurpose || ''
  })

  borrowDialogVisible.value = true
}

// 检查是否可以归还（只能本人归还）
const canReturn = (row) => {
  return row.borrowerCode === currentUser.employeeCode
}

const handleReturn = (row) => {
  // 再次检查权限
  if (!canReturn(row)) {
    ElMessage.error('只能归还您本人借出的工具')
    return
  }

  ElMessageBox.confirm(`确定要归还借出单号 ${row.borrowCode} 的刀柄吗?`, '确认归还', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log(`归还借出记录: ${row.borrowCode}`)
    ElMessage.success('归还成功!')
  }).catch(() => {
    ElMessage.info('已取消归还')
  })
}

// 暂存操作
const handleTempStore = (row) => {
  ElMessageBox.confirm(`确定要暂存借出单号 ${row.borrowCode} 的刀柄吗?`, '确认暂存', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log(`暂存借出记录: ${row.borrowCode}`)
    ElMessage.success('暂存成功!')
    // 这里可以添加暂存后的逻辑，比如更新状态等
  }).catch(() => {
    ElMessage.info('已取消暂存')
  })
}

const handleDetail = (row) => {
  ElMessageBox.alert(`
    借出单号: ${row.borrowCode}
    借出人: ${row.borrowerName} (${row.borrowerCode})
    刀柄信息: ${row.brandName} - ${row.handleSpec} (${row.handleType})
    借出数量: ${row.quantity}
    借出时间: ${row.borrowDate}
    预计归还: ${row.expectedReturnDate}
    借出用途: ${row.borrowPurpose || '无'}
  `, '借出详情', {
    confirmButtonText: '确定'
  })
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const batchReturn = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要归还的记录')
    return
  }

  // 筛选出可归还的项目（状态为借出或逾期，且是本人借出的）
  const borrowedItems = selectedRows.value.filter(item =>
    (item.borrowStatus === 'borrowed' || item.borrowStatus === 'overdue') &&
    canReturn(item)
  )

  if (borrowedItems.length === 0) {
    ElMessage.warning('所选记录中没有您本人可归还的项目')
    return
  }

  // 检查是否有不能归还的项目
  const cannotReturnItems = selectedRows.value.filter(item =>
    (item.borrowStatus === 'borrowed' || item.borrowStatus === 'overdue') &&
    !canReturn(item)
  )

  if (cannotReturnItems.length > 0) {
    ElMessage.warning(`选中的记录中有 ${cannotReturnItems.length} 条不是您本人借出的，只能归还自己借出的工具`)
    return
  }

  ElMessageBox.confirm(`确定要批量归还选中的 ${borrowedItems.length} 条记录吗?`, '批量归还', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('批量归还记录:', borrowedItems)
    ElMessage.success(`成功归还 ${borrowedItems.length} 条记录!`)
  }).catch(() => {
    ElMessage.info('已取消批量归还')
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
