<template>
  <div class="container">
    <div>刀柄暂存管理页面</div>
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="暂存单号:" prop="storageCode">
          <el-input v-model="formInline.storageCode" placeholder="请输入暂存单号" clearable/>
        </el-form-item>
        <el-form-item label="暂存人:" prop="borrowerName">
          <el-input v-model="formInline.borrowerName" placeholder="请输入暂存人姓名" clearable/>
        </el-form-item>
        <el-form-item label="暂存人编号:" prop="storageUser">
          <el-input v-model="formInline.storageUser" placeholder="请输入暂存人编号" clearable/>
        </el-form-item>
        <!-- 新增接口 -- 暂存类型 -->
        <el-form-item label="暂存类型:" prop="storageType">
          <el-select v-model="formInline.storageType" placeholder="请选择暂存类型" clearable style="width: 150px;">
            <el-option label="公共暂存" value="0" />
            <el-option label="个人暂存" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="刀柄品牌:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入刀柄品牌" clearable/>
        </el-form-item>
        <el-form-item label="刀柄型号:" prop="handleSpec">
          <el-input v-model="formInline.handleSpec" placeholder="请输入刀柄型号" clearable/>
        </el-form-item>
        <el-form-item label="暂存状态:" prop="borrowStatus">
          <el-select v-model="formInline.borrowStatus" placeholder="请选择暂存状态" clearable style="width: 150px;">
            <el-option label="已暂存" value="borrowed" />
            <el-option label="已归还" value="returned" />
            <el-option label="逾期未还" value="overdue" />
            <el-option label="报废" value="scrapped" />
            <el-option label="已暂存" value="temp_stored" />
          </el-select>
        </el-form-item>
        <el-form-item label="暂存时间:" prop="storageTime">
          <el-date-picker
              v-model="formInline.storageTime"
              type="date"
              placeholder="请选择暂存时间"
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
      <el-button type="primary" icon="plus" @click="openBorrowDialog">新增暂存</el-button>
      <el-button type="success" icon="check" @click="batchReturn">批量归还</el-button>
      <el-button type="info" icon="download">导出记录</el-button>
    </div>
    <!--    中部表格显示暂存记录-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="storageCode" label="暂存单号" align="center"/>
        <el-table-column prop="borrowerName" label="暂存人" align="center"/>
        <el-table-column prop="storageUser" label="暂存人编号" align="center"/>
        <!-- 新增表格绑定 - 柜子面 ~ 暂存类型 -->
        <el-table-column prop="locPrefix" label="柜子面" align="center"/>
        <el-table-column prop="stockLoc" label="库位号" align="center"/>
        <el-table-column prop="storageType" label="暂存类型" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.storageType === 0 ? 'info' : 'warning'">
            {{ scope.row.storageType === 0 ? '公共暂存' : '个人暂存' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="刀柄品牌" align="center"/>
        <el-table-column prop="handleSpec" label="刀柄规格" align="center"/>
        <el-table-column prop="handleType" label="刀柄类型" align="center"/>

        <el-table-column prop="quantity" label="暂存数量" align="center"/>
        <el-table-column prop="storageTime" label="暂存时间" align="center"/>
        <el-table-column prop="expectedReturnDate" label="预计归还时间" align="center"/>
        <el-table-column prop="borrowStatus" label="暂存状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.borrowStatus === 'borrowed' ? 'warning' :
                     scope.row.borrowStatus === 'returned' ? 'success' :
                     scope.row.borrowStatus === 'scrapped' ? 'info' :
                     scope.row.borrowStatus === 'temp_stored' ? '' : 'danger'"
            >
              {{ scope.row.borrowStatus === 'borrowed' ? '已暂存' :
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
                content="只能由暂存人本人归还"
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

    <!-- 新增暂存对话框 -->
    <el-dialog
      v-model="borrowDialogVisible"
      :title="isEdit ? '编辑暂存记录' : '新增刀柄暂存'"
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
            <el-form-item label="暂存单号" prop="borrowCode">
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
            <el-form-item label="暂存人" prop="borrowerName">
              <el-input
                v-model="borrowForm.borrowerName"
                placeholder="当前登录用户"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="暂存人编号" prop="borrowerCode">
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
            <el-form-item label="暂存用途" prop="borrowPurpose">
              <el-input
                v-model="borrowForm.borrowPurpose"
                type="textarea"
                :rows="3"
                placeholder="请输入暂存用途或备注"
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
  storageCode: '', //暂存单号
  borrowerName: '', //暂存人
  storageUser: '', //暂存人编号
  brandName: '', //刀柄品牌
  handleSpec: '', //刀柄规格
  storageType: '', //暂存类型
  storageTime: '', //暂存时间
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
    storageCode: 'HBR20241227001',
    borrowerName: '张三',
    storageUser: 1, // 替换原borrowerCode：暂存用户ID（对应接口storageUser）
    brandName: '三菱',
    handleSpec: 'BT40-ER32-100',
    handleType: 'BT',
    quantity: 1,
    storageTime: '2024-12-25 10:30:00', // 替换原borrowDate：暂存时间（对应接口operateTime）
    expectedReturnDate: '2024-12-30',
    actualReturnDate: '',
    storageType: 1, // 替换原borrowStatus：暂存类型（0-公共/1-个人，对应接口storageType）
    borrowStatus: 'borrowed',
    borrowPurpose: '生产线装配使用',
    cabinetCode: 'CAB001', // 刀柜编码（对应接口cabinetCode）
    locPrefix: 'A', // 新增：柜子ABCDE面（对应接口locPrefix）
    stockLoc: 'A01-01' // 新增：库位号（对应接口stockLoc）
  },
  {
    id: 2,
    storageCode: 'HBR20241227002',
    borrowerName: '李四',
    storageUser: 2, // 替换原borrowerCode：暂存用户ID（对应接口storageUser）
    brandName: '山特维克',
    handleSpec: 'HSK-A63-ER25-80',
    handleType: 'HSK',
    quantity: 2,
    storageTime: '2024-12-24',
    expectedReturnDate: '2024-12-26',
    actualReturnDate: '2024-12-26',
    borrowStatus: 'returned',
    borrowPurpose: '设备维修更换'
  },
  {
    id: 3,
    storageCode: 'HBR20241227003',
    borrowerName: '王五',
    storageUser: 3,
    brandName: '肯纳',
    handleSpec: 'CAT40-ER20-60',
    quantity: 1,
    storageTime: '2024-12-20',
    expectedReturnDate: '2024-12-25',
    actualReturnDate: '',
    borrowStatus: 'overdue',
    borrowPurpose: '紧急生产任务'
  },
  {
    id: 4,
    storageCode: 'HBR20241227004',
    borrowerName: '赵六',
    storageUser: 4,
    brandName: '瓦尔特',
    handleSpec: 'BT50-ER40-120', 
    handleType: 'BT',
    quantity: 1,
    storageTime: '2024-12-22',
    expectedReturnDate: '2024-12-27',
    actualReturnDate: '2024-12-26',
    borrowStatus: 'scrapped',
    borrowPurpose: '高速加工测试，刀柄损坏报废'
  },
])

// 暂存相关数据
const borrowDialogVisible = ref(false)
const borrowLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const selectedRows = ref([])

// 暂存表单数据
const borrowForm = reactive({
  storageCode: '',
  borrowerName: '',
  storageUser: '',
  brandName: '',
  handleType: '',
  handleSpec: '',
  quantity: 1,
  expectedReturnDate: '',
  borrowPurpose: ''
})

// 表单验证规则
const borrowFormRules = reactive({
  // 暂存人不需要验证，因为是自动填充的当前用户
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
    { required: true, message: '请输入暂存数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '暂存数量必须大于0', trigger: 'blur' }
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

// 暂存人变更处理（现在不需要了，因为暂存人固定为当前用户）
// const handleBorrowerChange = (employeeName) => {
//   const employee = employeeList.find(emp => emp.employeeName === employeeName)
//   if (employee) {
//     borrowForm.storageUser = employee.employeeCode
//   } else {
//     borrowForm.storageUser = ''
//   }
// }

// 品牌变更处理
const handleBrandChange = (brandName) => {
  // 根据品牌筛选可用刀柄型号
  // 这里可以添加根据品牌筛选刀柄型号的逻辑
  borrowForm.handleSpec = ''
}

// 提交暂存表单
const submitBorrowForm = async () => {
  try {
    const valid = await borrowFormRef.value.validate()
    if (!valid) return

    borrowLoading.value = true

    const submitData = {
      ...borrowForm,
      storageTime: new Date().toISOString().split('T')[0],
      borrowStatus: 'borrowed',
      expectedReturnDate: borrowForm.expectedReturnDate ?
        new Date(borrowForm.expectedReturnDate).toISOString().split('T')[0] : ''
    }

    if (isEdit.value) {
      submitData.id = editId.value
      console.log('编辑暂存记录:', submitData)
      ElMessage.success('编辑成功!')
    } else {
      console.log('新增暂存记录:', submitData)
      ElMessage.success('暂存登记成功!')
    }

    closeBorrowDialog()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '暂存登记失败，请重试')
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
    storageCode: row.storageCode,
    borrowerName: row.borrowerName,
    storageUser: row.storageUser,
    brandName: row.brandName,
    handleType: row.handleType,
    handleSpec: row.handleSpec,
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
    ElMessage.error('只能归还您本人暂存的工具')
    return
  }
  // 弹出输入备注的对话框
  ElMessageBox.prompt('请选择收刀库位号', '暂存刀柄', {
    confirmButtonText: '确定暂存',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入收刀库位号，多个用逗号分隔',
    inputValue: 'A01-01,A01-02' // 默认库位号
  }).then(({ value }) => {
    // 构建归还请求参数
    const returnParams = {
      cabinetCode: row.cabinetCode || 'CAB001', // 刀柜编码
      locList: value ? value.split(',').map(loc => loc.trim()).filter(loc => loc) : ['A01-01'], // 收刀库位号集合

      // 补充的完整参数
      borrowId: row.id, // 暂存记录主键
      storageCode: row.storageCode, // 暂存单号
      borrowerName: row.borrowerName, // 暂存人姓名
      storageUser: row.storageUser, // 暂存人编码
      brandName: row.brandName, // 刀柄品牌
      handleSpec: row.handleSpec, // 刀柄型号
      quantity: row.quantity, // 归还数量
      storageTime: row.storageTime, // 暂存日期
      expectedReturnDate: row.expectedReturnDate, // 预期归还日期
      actualReturnDate: new Date().toISOString().replace('T', ' ').substring(0, 19), // 实际归还日期
      borrowPurpose: row.borrowPurpose, // 暂存目的
      returnRemarks: '正常归还', // 归还备注
      operationType: 'return', // 操作类型：归还
      operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), // 操作时间
      operateUser: currentUser.employeeCode, // 操作人

      // 库位分配详情
      locationDetails: value ? value.split(',').map((loc, index) => ({
        locationCode: loc.trim(),
        quantity: Math.ceil(row.quantity / value.split(',').length), // 平均分配数量
        handleSpec: row.handleSpec,
        brandName: row.brandName
      })).filter(detail => detail.locationCode) : [{
        locationCode: 'A01-01',
        quantity: row.quantity,
        handleSpec: row.handleSpec,
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
  // 弹出输入备注的对话框
  ElMessageBox.prompt('请输入暂存备注', '暂存刀柄', {
    confirmButtonText: '确定暂存',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入暂存原因或备注',
    inputType: 'textarea'
  }).then(({ value }) => {
    // 调用接口获取空闲库位号
    const getFreeLoc = () => {  
      return axios.get('/qw/knife/app/from/mes/cabinet/freeLoc', {
        params: { cabinetCode: row.cabinetCode || 'CAB001', locType: 0 }
      }).then(res => {
        return res.data.data || 'A01-01';
      }).catch(err => {
        ElMessage.error('获取空闲库位失败，使用默认库位');
        return 'A01-01';
      });
    };


    getFreeLoc().then(stockLoc => {
      // 构建暂存请求参数
      const tempStoreParams = {
        cabinetCode: row.cabinetCode || 'CAB001',
        stockLoc: stockLoc,  // 现在这里有了从接口获取的值
        storageType: 1,
        itemList: [
          {
            borrowId: row.id,
            cutterType: row.cutterType,
            brandName: row.brandName,
            quantity: row.quantity,
            storageCode: row.storageCode,
            storageUser: row.storageUser
          }
        ],
        borrowQty: row.quantity,
        borrowRemarks: value || '暂存操作',
        borrowId: row.id,
        borrowerName: row.borrowerName,
        storageUser: row.storageUser,
        storageTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        borrowPurpose: row.borrowPurpose,
        operationType: 'temp_store',
        operateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      console.log('暂存请求参数:', tempStoreParams);

      // 真实API调用
      axios.post('/your-api-endpoint', tempStoreParams)
        .then(() => {
          row.borrowStatus = 'temp_stored';
          row.tempStoreTime = tempStoreParams.operateTime;
          row.tempStoreRemarks = value || '暂存操作';
          ElMessage.success('暂存成功!');
          getList();
        })
        .catch(error => {
          ElMessage.error('暂存失败: ' + (error.response?.data?.message || error.message));
        });
    });
  }).catch(() => {
    ElMessage.info('已取消暂存');
  });
};


// 详情查看
const handleDetail = (row) => {
  ElMessageBox.alert(`
    暂存单号: ${row.storageCode}
    暂存人: ${row.borrowerName} (${row.storageUser})
    刀柄信息: ${row.brandName} - ${row.handleSpec}
    暂存数量: ${row.quantity}
    暂存时间: ${row.storageTime}
    预计归还: ${row.expectedReturnDate}
    暂存用途: ${row.borrowPurpose || '无'}
  `, '暂存详情', {
    confirmButtonText: '确定'
  })
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 检查是否可以归还（只能本人归还）
const canReturn = (row) => {
  return row.storageUser === currentUser.employeeCode
}

// 批量归还
const batchReturn = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要归还的记录')
    return
  }

  // 筛选出可归还的项目（状态为暂存或逾期，且是本人暂存的）
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
    ElMessage.warning(`选中的记录中有 ${cannotReturnItems.length} 条不是您本人暂存的，只能归还自己暂存的工具`)
    return
  }

  ElMessageBox.prompt('请输入收刀库位号', '批量归还刀柄', {
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
        borrowId: item.id, // 暂存记录主键
        storageCode: item.storageCode, // 暂存单号
        borrowerName: item.borrowerName, // 暂存人姓名
        storageUser: item.storageUser, // 暂存人编码
        brandName: item.brandName, // 刀柄品牌
        handleSpec: item.handleSpec, // 刀柄型号
        quantity: item.quantity, // 归还数量
        storageTime: item.storageTime, // 暂存日期时间
        expectedReturnDate: item.expectedReturnDate, // 预期归还日期
        actualReturnDate: new Date().toISOString().replace('T', ' ').substring(0, 19), // 实际归还日期
        borrowPurpose: item.borrowPurpose, // 暂存目的
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
            handleSpec: item.handleSpec,
            brandName: item.brandName,
            quantity: item.quantity,
            storageCode: item.storageCode
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
