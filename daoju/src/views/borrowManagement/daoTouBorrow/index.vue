<template>
  <div class="container">
    <div>刀头借出管理页面</div>
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
        <el-form-item label="刀头品牌:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入刀头品牌" clearable/>
        </el-form-item>
        <el-form-item label="刀头型号:" prop="cutterType">
          <el-input v-model="formInline.cutterType" placeholder="请输入刀头型号" clearable/>
        </el-form-item>
        <el-form-item label="借出状态:" prop="borrowStatus">
          <el-select v-model="formInline.borrowStatus" placeholder="请选择借出状态" clearable style="width: 150px;">
            <el-option label="已借出" value="borrowed" />
            <el-option label="已归还" value="returned" />
            <el-option label="逾期未还" value="overdue" />
            <el-option label="报废" value="scrapped" />
            <el-option label="已暂存" value="temp_stored" />
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
        <el-table-column prop="brandName" label="刀头品牌" align="center"/>
        <el-table-column prop="cutterType" label="刀头型号" align="center"/>
        <el-table-column prop="quantity" label="借出数量" align="center"/>
        <el-table-column prop="borrowDate" label="借出时间" align="center"/>
        <el-table-column prop="expectedReturnDate" label="预计归还时间" align="center"/>
        <el-table-column prop="borrowStatus" label="借出状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.borrowStatus === 'borrowed' ? 'warning' :
                     scope.row.borrowStatus === 'returned' ? 'success' :
                     scope.row.borrowStatus === 'scrapped' ? 'info' :
                     scope.row.borrowStatus === 'temp_stored' ? '' : 'danger'"
            >
              {{ scope.row.borrowStatus === 'borrowed' ? '已借出' :
                 scope.row.borrowStatus === 'returned' ? '已归还' :
                 scope.row.borrowStatus === 'scrapped' ? '报废' :
                 scope.row.borrowStatus === 'temp_stored' ? '已暂存' : '逾期未还' }}
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
      :title="isEdit ? '编辑借出记录' : '新增刀头借出'"
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
            <el-form-item label="刀头品牌" prop="brandName">
              <el-select
                v-model="borrowForm.brandName"
                placeholder="请选择刀头品牌"
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
            <el-form-item label="刀头型号" prop="cutterType">
              <el-select
                v-model="borrowForm.cutterType"
                placeholder="请选择刀头型号"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option 
                  v-for="cutter in availableCutters" 
                  :key="cutter.id"
                  :label="cutter.cutterType" 
                  :value="cutter.cutterType"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
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
  brandName: '', //刀头品牌
  cutterType: '', //刀头型号
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

// 可用刀头列表（模拟数据，实际应从刀头管理接口获取）
const availableCutters = reactive([
  { id: 1, cutterType: 'R390-11T308M-PM', brandName: '三菱' },
  { id: 2, cutterType: '880-D1200L20-03', brandName: '山特维克' },
  { id: 3, cutterType: 'CNMG120408-QM', brandName: '肯纳' },
  { id: 4, cutterType: 'A25T-SCLCR09', brandName: '伊斯卡' },
])

// 表格数据
const tableData = reactive([
  {
    id: 1,
    borrowCode: 'BOR20241227001',
    borrowerName: '张三',
    borrowerCode: 'EMP001',
    brandName: '三菱',
    cutterType: 'R390-11T308M-PM',
    quantity: 2,
    borrowDate: '2024-12-25',
    expectedReturnDate: '2024-12-30',
    actualReturnDate: '',
    borrowStatus: 'borrowed',
    borrowPurpose: '生产线加工使用'
  },
  {
    id: 2,
    borrowCode: 'BOR20241227002',
    borrowerName: '李四',
    borrowerCode: 'EMP002',
    brandName: '山特维克',
    cutterType: '880-D1200L20-03',
    quantity: 1,
    borrowDate: '2024-12-24',
    expectedReturnDate: '2024-12-26',
    actualReturnDate: '2024-12-26',
    borrowStatus: 'returned',
    borrowPurpose: '设备维修使用'
  },
  {
    id: 3,
    borrowCode: 'BOR20241227003',
    borrowerName: '王五',
    borrowerCode: 'EMP003',
    brandName: '肯纳',
    cutterType: 'CNMG120408-QM',
    quantity: 3,
    borrowDate: '2024-12-20',
    expectedReturnDate: '2024-12-25',
    actualReturnDate: '',
    borrowStatus: 'overdue',
    borrowPurpose: '紧急生产任务'
  },
  {
    id: 4,
    borrowCode: 'BOR20241227004',
    borrowerName: '赵六',
    borrowerCode: 'EMP004',
    brandName: '瓦尔特',
    cutterType: 'WCMX080412-53',
    quantity: 1,
    borrowDate: '2024-12-22',
    expectedReturnDate: '2024-12-27',
    actualReturnDate: '2024-12-26',
    borrowStatus: 'scrapped',
    borrowPurpose: '试验加工，刀具损坏报废'
  },
  {
    id: 5,
    borrowCode: 'BOR20241227005',
    borrowerName: '钱七',
    borrowerCode: 'EMP005',
    brandName: '京瓷',
    cutterType: 'CCMT09T304-PM',
    quantity: 2,
    borrowDate: '2024-12-26',
    expectedReturnDate: '2024-12-30',
    actualReturnDate: '',
    borrowStatus: 'temp_stored',
    borrowPurpose: '临时暂存，等待后续加工',
    cabinetCode: 'CAB001',
    tempStoreTime: '2024-12-26 16:30:00',
    tempStoreRemarks: '设备维护期间暂存'
  },
  {
    id: 6,
    borrowCode: 'BOR20241227006',
    borrowerName: '孙八',
    borrowerCode: 'EMP006',
    brandName: '住友',
    cutterType: 'WNMG080408-MS',
    quantity: 3,
    borrowDate: '2024-12-25',
    expectedReturnDate: '2024-12-28',
    actualReturnDate: '2024-12-27 14:30:00',
    borrowStatus: 'returned',
    borrowPurpose: '批量加工完成归还',
    cabinetCode: 'CAB001',
    returnRemarks: '正常归还',
    returnLocations: 'A01-01,A01-02'
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
  cutterType: '',
  quantity: 1,
  expectedReturnDate: '',
  borrowPurpose: ''
})

// 表单验证规则
const borrowFormRules = reactive({
  // 借出人不需要验证，因为是自动填充的当前用户
  brandName: [
    { required: true, message: '请选择刀头品牌', trigger: 'change' }
  ],
  cutterType: [
    { required: true, message: '请选择刀头型号', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入借出数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '借出数量必须大于0', trigger: 'blur' }
  ],
  expectedReturnDate: [
    { required: true, message: '请选择预计归还时间', trigger: 'change' }
  ]
})

// 生成借出单号
const generateBorrowCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const today = `${year}${month}${day}`
  const existingCodes = tableData.filter(record =>
    record.borrowCode && record.borrowCode.startsWith(`BOR${today}`)
  )

  const nextNumber = existingCodes.length + 1
  const sequence = String(nextNumber).padStart(3, '0')

  return `BOR${today}${sequence}`
}

// 打开借出对话框
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

// 关闭借出对话框
const closeBorrowDialog = () => {
  borrowDialogVisible.value = false
  resetBorrowForm()
  borrowLoading.value = false
}

// 重置借出表单
const resetBorrowForm = () => {
  Object.assign(borrowForm, {
    borrowCode: '',
    borrowerName: currentUser.employeeName, // 默认为当前用户
    borrowerCode: currentUser.employeeCode, // 默认为当前用户编号
    brandName: '',
    cutterType: '',
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

// 品牌变更处理
const handleBrandChange = (brandName) => {
  // 根据品牌筛选可用刀头
  // 这里可以添加根据品牌筛选刀头的逻辑
  borrowForm.cutterType = ''
}

// 提交借出表单
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

// 搜索功能
const onSubmit = () => {
  const searchParams = { ...formInline }
  console.log('搜索参数:', searchParams)
  ElMessage.success('搜索完成!')
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
}

// 编辑操作
const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id

  Object.assign(borrowForm, {
    borrowCode: row.borrowCode,
    borrowerName: row.borrowerName,
    borrowerCode: row.borrowerCode,
    brandName: row.brandName,
    cutterType: row.cutterType,
    quantity: row.quantity,
    expectedReturnDate: row.expectedReturnDate,
    borrowPurpose: row.borrowPurpose || ''
  })

  borrowDialogVisible.value = true
}

// 归还操作
const handleReturn = (row) => {
  // 再次检查权限
  if (!canReturn(row)) {
    ElMessage.error('只能归还您本人借出的工具')
    return
  }

  ElMessageBox.prompt('请选择收刀库位号', '归还刀头', {
    confirmButtonText: '确定归还',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入收刀库位号，多个用逗号分隔',
    inputValue: 'A01-01,A01-02' // 默认库位号
  }).then(({ value }) => {
    // 构建归还请求参数
    const returnParams = {
      cabinetCode: row.cabinetCode || 'CAB001', // 刀柜编码
      locList: value ? value.split(',').map(loc => loc.trim()).filter(loc => loc) : ['A01-01'], // 收刀库位号集合

      // 补充的完整参数
      borrowId: row.id, // 借出记录主键
      borrowCode: row.borrowCode, // 借出单号
      borrowerName: row.borrowerName, // 借出人姓名
      borrowerCode: row.borrowerCode, // 借出人编码
      brandName: row.brandName, // 刀头品牌
      cutterType: row.cutterType, // 刀头型号
      quantity: row.quantity, // 归还数量
      borrowDate: row.borrowDate, // 借出日期
      expectedReturnDate: row.expectedReturnDate, // 预期归还日期
      actualReturnDate: new Date().toISOString().replace('T', ' ').substring(0, 19), // 实际归还日期
      borrowPurpose: row.borrowPurpose, // 借出目的
      returnRemarks: '正常归还', // 归还备注
      operationType: 'return', // 操作类型：归还
      operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), // 操作时间
      operateUser: currentUser.employeeCode, // 操作人

      // 库位分配详情
      locationDetails: value ? value.split(',').map((loc, index) => ({
        locationCode: loc.trim(),
        quantity: Math.ceil(row.quantity / value.split(',').length), // 平均分配数量
        cutterType: row.cutterType,
        brandName: row.brandName
      })).filter(detail => detail.locationCode) : [{
        locationCode: 'A01-01',
        quantity: row.quantity,
        cutterType: row.cutterType,
        brandName: row.brandName
      }]
    }

    console.log('归还请求参数:', returnParams)

    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态
      row.borrowStatus = 'returned'
      row.actualReturnDate = returnParams.actualReturnDate
      row.returnRemarks = returnParams.returnRemarks

      ElMessage.success('归还成功!')
      getList() // 刷新列表
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消归还')
  })
}

// 暂存操作
const handleTempStore = (row) => {
  ElMessageBox.prompt('请输入暂存备注', '暂存刀头', {
    confirmButtonText: '确定暂存',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入暂存原因或备注',
    inputType: 'textarea'
  }).then(({ value }) => {
    // 构建暂存请求参数
    const tempStoreParams = {
      cabinetCode: row.cabinetCode || 'CAB001', // 刀柜编码
      itemList: [
        {
          borrowId: row.id, // 取刀信息主键
          cutterType: row.cutterType, // 刀头类型
          brandName: row.brandName, // 品牌名称
          quantity: row.quantity, // 数量
          borrowCode: row.borrowCode // 借出单号
        }
      ], // 暂存详情
      borrowQty: row.quantity, // 还刀数量（暂存数量）
      borrowRemarks: value || '暂存操作', // 还刀备注（暂存备注）
      borrowId: row.id, // 取刀信息主键
      borrowerName: row.borrowerName, // 借出人姓名
      borrowerCode: row.borrowerCode, // 借出人编码
      borrowDate: row.borrowDate, // 借出日期
      expectedReturnDate: row.expectedReturnDate, // 预期归还日期
      borrowPurpose: row.borrowPurpose, // 借出目的
      operationType: 'temp_store', // 操作类型：暂存
      operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19) // 操作时间
    }

    console.log('暂存请求参数:', tempStoreParams)

    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态为暂存状态
      row.borrowStatus = 'temp_stored' // 添加暂存状态
      row.tempStoreTime = tempStoreParams.operateTime
      row.tempStoreRemarks = value || '暂存操作'

      ElMessage.success('暂存成功!')
      getList() // 刷新列表
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消暂存')
  })
}

// 详情查看
const handleDetail = (row) => {
  ElMessageBox.alert(`
    借出单号: ${row.borrowCode}
    借出人: ${row.borrowerName} (${row.borrowerCode})
    刀头信息: ${row.brandName} - ${row.cutterType}
    借出数量: ${row.quantity}
    借出时间: ${row.borrowDate}
    预计归还: ${row.expectedReturnDate}
    借出用途: ${row.borrowPurpose || '无'}
  `, '借出详情', {
    confirmButtonText: '确定'
  })
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 检查是否可以归还（只能本人归还）
const canReturn = (row) => {
  return row.borrowerCode === currentUser.employeeCode
}

// 批量归还
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

  ElMessageBox.prompt('请输入收刀库位号', '批量归还刀头', {
    confirmButtonText: '确定归还',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入收刀库位号，多个用逗号分隔',
    inputValue: 'A01-01,A01-02,A01-03,A01-04', // 默认多个库位号
    inputType: 'textarea'
  }).then(({ value }) => {
    const locList = value ? value.split(',').map(loc => loc.trim()).filter(loc => loc) : ['A01-01']

    // 构建批量归还请求参数
    const batchReturnParams = {
      cabinetCode: borrowedItems[0]?.cabinetCode || 'CAB001', // 刀柜编码（取第一个记录的刀柜编码）
      locList: locList, // 收刀库位号集合

      // 批量归还详情
      returnList: borrowedItems.map((item, index) => ({
        borrowId: item.id, // 借出记录主键
        borrowCode: item.borrowCode, // 借出单号
        borrowerName: item.borrowerName, // 借出人姓名
        borrowerCode: item.borrowerCode, // 借出人编码
        brandName: item.brandName, // 刀头品牌
        cutterType: item.cutterType, // 刀头型号
        quantity: item.quantity, // 归还数量
        borrowDate: item.borrowDate, // 借出日期
        expectedReturnDate: item.expectedReturnDate, // 预期归还日期
        actualReturnDate: new Date().toISOString().replace('T', ' ').substring(0, 19), // 实际归还日期
        borrowPurpose: item.borrowPurpose, // 借出目的
        assignedLocation: locList[index % locList.length] || locList[0] // 分配的库位号（循环分配）
      })),

      // 操作信息
      operationType: 'batch_return', // 操作类型：批量归还
      operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), // 操作时间
      operateUser: currentUser.employeeCode, // 操作人
      returnRemarks: '批量归还操作', // 归还备注
      totalQuantity: borrowedItems.reduce((sum, item) => sum + item.quantity, 0), // 总归还数量

      // 库位分配策略
      allocationStrategy: 'round_robin', // 分配策略：轮询分配
      locationDetails: locList.map((loc, index) => {
        const assignedItems = borrowedItems.filter((_, itemIndex) => itemIndex % locList.length === index)
        return {
          locationCode: loc,
          totalQuantity: assignedItems.reduce((sum, item) => sum + item.quantity, 0),
          itemCount: assignedItems.length,
          items: assignedItems.map(item => ({
            cutterType: item.cutterType,
            brandName: item.brandName,
            quantity: item.quantity,
            borrowCode: item.borrowCode
          }))
        }
      })
    }

    console.log('批量归还请求参数:', batchReturnParams)

    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态
      borrowedItems.forEach(item => {
        item.borrowStatus = 'returned'
        item.actualReturnDate = batchReturnParams.operateTime
        item.returnRemarks = batchReturnParams.returnRemarks
      })

      ElMessage.success(`成功归还 ${borrowedItems.length} 条记录!`)
      getList() // 刷新列表
    }, 1000)
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
