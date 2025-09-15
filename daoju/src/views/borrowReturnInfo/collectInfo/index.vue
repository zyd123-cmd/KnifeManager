<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-select v-model="formInline.cabinetCode" placeholder="请选择刀柜编码" clearable>
            <el-option
              v-for="cabinet in cabinetCodeList"
              :key="cabinet.value"
              :label="cabinet.label"
              :value="cabinet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收刀库位号:" prop="locList">
          <el-select v-model="formInline.locList" placeholder="请选择收刀库位号" clearable multiple>
            <el-option
              v-for="location in locationList"
              :key="location.value"
              :label="location.label"
              :value="location.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="还刀码:" prop="borrowCode">
          <el-input v-model="formInline.borrowCode" placeholder="请输入还刀码" clearable/>
        </el-form-item>
        <el-form-item label="收刀人:" prop="collectUser">
          <el-input v-model="formInline.collectUser" placeholder="请输入收刀人" clearable/>
        </el-form-item>
        <el-form-item label="收刀状态:" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择收刀状态" clearable>
            <el-option label="通过" :value="0"/>
            <el-option label="异常" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="收刀时间:" prop="collectTime">
          <el-date-picker
            v-model="formInline.collectTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    新增按钮-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增收刀</el-button>
    </div>

    <!--    中部表格显示收刀信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%; table-layout: fixed;" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="borrowCode" label="还刀码" align="center" width="150"/>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="刀柜库位号" align="center" width="120"/>
        <el-table-column prop="collectUser" label="收刀人" align="center" width="100"/>
        <el-table-column prop="collectTime" label="收刀时间" align="center" width="150"/>
        <el-table-column prop="status" label="收刀状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '通过' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="quantity" label="收刀数量" align="center" width="100"/>
        <el-table-column prop="remarks" label="原因" align="center" min-width="150" show-overflow-tooltip/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="default" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button type="primary" size="small" @click="handleConfirm(scope.row)">确认</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <el-dialog
      v-model="detailDialogVisible"
      title="收刀详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentCollectInfo">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="收刀ID">{{ currentCollectInfo.id }}</el-descriptions-item>
          <el-descriptions-item label="还刀码">{{ currentCollectInfo.borrowCode }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentCollectInfo.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="刀柜库位号">{{ currentCollectInfo.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="收刀人">{{ currentCollectInfo.collectUser }}</el-descriptions-item>
          <el-descriptions-item label="收刀时间">{{ currentCollectInfo.collectTime }}</el-descriptions-item>
          <el-descriptions-item label="收刀状态">
            <el-tag :type="currentCollectInfo.status === 0 ? 'success' : 'danger'">
              {{ currentCollectInfo.status === 0 ? '通过' : '异常' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收刀数量">{{ currentCollectInfo.quantity }}</el-descriptions-item>
        </el-descriptions>

        <!-- 刀具信息 -->
        <el-descriptions title="刀具信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="刀具型号">{{ currentCollectInfo.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentCollectInfo.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentCollectInfo.brandName }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentCollectInfo.specification }}</el-descriptions-item>
          <el-descriptions-item label="原因" :span="2">{{ currentCollectInfo.remarks || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 操作信息 -->
        <el-descriptions title="操作信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="创建人">{{ currentCollectInfo.createUser }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCollectInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentCollectInfo.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentCollectInfo.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 确认收刀对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="确认收刀"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="confirmFormRef"
        :model="confirmForm"
        :rules="confirmFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="还刀码" prop="borrowCode">
              <el-input
                v-model="confirmForm.borrowCode"
                placeholder="请输入还刀码"
                clearable
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀柜库位号" prop="stockLoc">
              <el-input
                v-model="confirmForm.stockLoc"
                placeholder="请输入刀柜库位号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="是否通过" prop="status">
              <el-select
                v-model="confirmForm.status"
                placeholder="请选择是否通过"
                style="width: 100%"
              >
                <el-option label="通过" :value="0" />
                <el-option label="异常" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="原因" prop="remarks">
              <el-input
                v-model="confirmForm.remarks"
                type="textarea"
                :rows="4"
                placeholder="请输入原因"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeConfirmDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitConfirm"
            :loading="confirmLoading"
          >
            {{ confirmLoading ? '确认中...' : '确认收刀' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增收刀对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增收刀"
      width="600px"
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
          <el-col :span="24">
            <el-form-item label="刀柜编码" prop="cabinetCode">
              <el-select
                v-model="addForm.cabinetCode"
                placeholder="请选择刀柜编码"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="cabinet in cabinetCodeList"
                  :key="cabinet.value"
                  :label="cabinet.label"
                  :value="cabinet.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="收刀库位号集合" prop="locList">
              <el-select
                v-model="addForm.locList"
                placeholder="请选择收刀库位号"
                clearable
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="location in locationList"
                  :key="location.value"
                  :label="location.label"
                  :value="location.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="还刀码" prop="borrowCode">
              <el-input
                v-model="addForm.borrowCode"
                placeholder="请输入还刀码"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="收刀人" prop="collectUser">
              <el-input
                v-model="addForm.collectUser"
                placeholder="请输入收刀人"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀具型号" prop="cutterCode">
              <el-input
                v-model="addForm.cutterCode"
                placeholder="请输入刀具型号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀具类型" prop="cutterType">
              <el-input
                v-model="addForm.cutterType"
                placeholder="请输入刀具类型"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input
                v-model="addForm.brandName"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="收刀数量" prop="quantity">
              <el-input-number
                v-model="addForm.quantity"
                :min="1"
                :max="999"
                placeholder="请输入收刀数量"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="收刀状态" prop="status">
              <el-select
                v-model="addForm.status"
                placeholder="请选择收刀状态"
                style="width: 100%"
              >
                <el-option label="通过" :value="0" />
                <el-option label="异常" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="原因" prop="remarks">
              <el-input
                v-model="addForm.remarks"
                type="textarea"
                :rows="3"
                placeholder="请输入原因"
                clearable
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
            @click="submitAdd"
            :loading="addLoading"
          >
            {{ addLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCollectInfo,
  getCollectInfo,
  confirmCollect,
  addCollectInfo,
  updateCollectInfo,
  delCollectInfo,
  batchDelCollectInfo,
  exportCollectInfo,
  getCabinetCodeList,
  getLocationList
} from '@/api/borrowReturnInfo/collectInfo'

const formInlineRes = ref()
const confirmFormRef = ref()
const addFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  cabinetCode: '', // 刀柜编码
  locList: [], // 收刀库位号集合
  borrowCode: '', // 还刀码
  collectUser: '', // 收刀人
  status: '', // 收刀状态
  collectTime: '', // 收刀时间
})

// 分页和加载状态
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 查询参数
const queryParams = reactive({
  collectDto: {},
  cabinetCode: '',
  locList: []
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const confirmDialogVisible = ref(false)
const addDialogVisible = ref(false)
const confirmLoading = ref(false)
const addLoading = ref(false)
const currentCollectInfo = ref(null)

// 确认收刀表单数据
const confirmForm = reactive({
  borrowCode: '',
  stockLoc: '',
  status: 0,
  remarks: ''
})

// 确认收刀表单验证规则
const confirmFormRules = reactive({
  borrowCode: [
    { required: true, message: '请输入还刀码', trigger: 'blur' }
  ],
  stockLoc: [
    { required: true, message: '请输入刀柜库位号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择是否通过', trigger: 'change' }
  ],
  remarks: [
    { required: true, message: '请输入原因', trigger: 'blur' }
  ]
})

// 新增收刀表单数据
const addForm = reactive({
  cabinetCode: '',
  locList: [],
  borrowCode: '',
  collectUser: '',
  cutterCode: '',
  cutterType: '',
  brandName: '',
  quantity: 1,
  status: 0,
  remarks: ''
})

// 新增收刀表单验证规则
const addFormRules = reactive({
  cabinetCode: [
    { required: true, message: '请选择刀柜编码', trigger: 'change' }
  ],
  locList: [
    { required: true, message: '请选择收刀库位号', trigger: 'change' }
  ],
  borrowCode: [
    { required: true, message: '请输入还刀码', trigger: 'blur' }
  ],
  collectUser: [
    { required: true, message: '请输入收刀人', trigger: 'blur' }
  ],
  cutterCode: [
    { required: true, message: '请输入刀具型号', trigger: 'blur' }
  ],
  cutterType: [
    { required: true, message: '请输入刀具类型', trigger: 'blur' }
  ],
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入收刀数量', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择收刀状态', trigger: 'change' }
  ],
  remarks: [
    { required: true, message: '请输入原因', trigger: 'blur' }
  ]
})

// 下拉选项数据
const cabinetCodeList = ref([])
const locationList = ref([])

// 模拟数据 - 收刀信息相关
const mockData = [
  {
    id: 1,
    borrowCode: 'RC20241226001',
    cabinetCode: 'CAB001',
    stockLoc: 'A01-01',
    collectUser: '张三',
    collectTime: '2024-12-26 09:30:00',
    status: 0, // 通过
    cutterCode: 'R390-11T308M-PM',
    cutterType: '铣刀',
    brandName: '三菱',
    quantity: 2,
    specification: 'Φ10×25×75',
    remarks: '正常收刀',
    createUser: '系统管理员',
    createTime: '2024-12-26 09:00:00',
    updateUser: '张三',
    updateTime: '2024-12-26 09:30:00'
  },
  {
    id: 2,
    borrowCode: 'RC20241226002',
    cabinetCode: 'CAB002',
    stockLoc: 'B02-03',
    collectUser: '李四',
    collectTime: '2024-12-26 14:15:00',
    status: 1, // 异常
    cutterCode: '880-D1200L20-03',
    cutterType: '钻头',
    brandName: '山特维克',
    quantity: 1,
    specification: 'Φ12×120',
    remarks: '刀具损坏',
    createUser: '系统管理员',
    createTime: '2024-12-26 14:00:00',
    updateUser: '李四',
    updateTime: '2024-12-26 14:15:00'
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据刀柜编码筛选
      if (queryParams.cabinetCode) {
        filteredData = filteredData.filter(item =>
          item.cabinetCode === queryParams.cabinetCode
        )
      }

      // 根据收刀库位号筛选
      if (queryParams.locList && queryParams.locList.length > 0) {
        filteredData = filteredData.filter(item =>
          queryParams.locList.includes(item.stockLoc)
        )
      }

      // 分页处理
      const start = (pagination.current - 1) * pagination.size
      const end = start + pagination.size

      tableData.value = filteredData.slice(start, end)
      pagination.total = filteredData.length
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    loading.value = false
  }
}

// 搜索功能
const onSubmit = () => {
  // 复制搜索条件到查询参数
  queryParams.collectDto = {
    cabinetCode: formInline.cabinetCode,
    locList: formInline.locList,
    borrowCode: formInline.borrowCode,
    collectUser: formInline.collectUser,
    status: formInline.status,
    collectTime: formInline.collectTime
  }
  queryParams.cabinetCode = formInline.cabinetCode
  queryParams.locList = formInline.locList

  pagination.current = 1
  getList()
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
  // 重置所有查询参数
  queryParams.collectDto = {}
  queryParams.cabinetCode = ''
  queryParams.locList = []
  pagination.current = 1
  getList()
}

// 查看详情
const handleDetail = (row) => {
  // 使用模拟数据
  const detailData = mockData.find(item => item.id === row.id)
  if (detailData) {
    currentCollectInfo.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 确认收刀操作
const handleConfirm = (row) => {
  currentCollectInfo.value = { ...row }
  resetConfirmForm()
  // 预填充数据
  confirmForm.borrowCode = row.borrowCode
  confirmForm.stockLoc = row.stockLoc
  confirmForm.status = row.status
  confirmForm.remarks = row.remarks || ''
  confirmDialogVisible.value = true
}

// 关闭确认对话框
const closeConfirmDialog = () => {
  confirmDialogVisible.value = false
  resetConfirmForm()
  confirmLoading.value = false
}

// 重置确认表单
const resetConfirmForm = () => {
  Object.assign(confirmForm, {
    borrowCode: '',
    stockLoc: '',
    status: 0,
    remarks: ''
  })
  nextTick(() => {
    confirmFormRef.value?.clearValidate()
  })
}

// 提交确认收刀
const submitConfirm = async () => {
  try {
    const valid = await confirmFormRef.value.validate()
    if (!valid) return

    confirmLoading.value = true

    // 准备提交数据
    const confirmData = {
      borrowCode: confirmForm.borrowCode,
      stockLoc: confirmForm.stockLoc,
      status: confirmForm.status,
      remarks: confirmForm.remarks
    }

    // 模拟API调用
    setTimeout(() => {
      console.log('确认收刀数据:', confirmData)
      ElMessage.success('确认收刀成功!')
      closeConfirmDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('确认收刀失败:', error)
    ElMessage.error('确认收刀失败，请重试')
  } finally {
    confirmLoading.value = false
  }
}

// 打开新增对话框
const openAddDialog = () => {
  resetAddForm()
  addDialogVisible.value = true
}

// 关闭新增对话框
const closeAddDialog = () => {
  addDialogVisible.value = false
  resetAddForm()
  addLoading.value = false
}

// 重置新增表单
const resetAddForm = () => {
  Object.assign(addForm, {
    cabinetCode: '',
    locList: [],
    borrowCode: '',
    collectUser: '',
    cutterCode: '',
    cutterType: '',
    brandName: '',
    quantity: 1,
    status: 0,
    remarks: ''
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 提交新增收刀
const submitAdd = async () => {
  try {
    const valid = await addFormRef.value.validate()
    if (!valid) return

    addLoading.value = true

    // 准备提交数据
    const addData = {
      collectDto: {
        cabinetCode: addForm.cabinetCode,
        locList: addForm.locList,
        borrowCode: addForm.borrowCode,
        collectUser: addForm.collectUser,
        cutterCode: addForm.cutterCode,
        cutterType: addForm.cutterType,
        brandName: addForm.brandName,
        quantity: addForm.quantity,
        status: addForm.status,
        remarks: addForm.remarks,
        collectTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createUser: '当前用户',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateUser: '当前用户',
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      },
      cabinetCode: addForm.cabinetCode,
      locList: addForm.locList
    }

    // 模拟API调用
    setTimeout(() => {
      // 添加到模拟数据
      const newCollectInfo = {
        id: Date.now(),
        borrowCode: addForm.borrowCode,
        cabinetCode: addForm.cabinetCode,
        stockLoc: addForm.locList.join(','),
        collectUser: addForm.collectUser,
        collectTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: addForm.status,
        cutterCode: addForm.cutterCode,
        cutterType: addForm.cutterType,
        brandName: addForm.brandName,
        quantity: addForm.quantity,
        specification: 'Φ10×25×75',
        remarks: addForm.remarks,
        createUser: '当前用户',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateUser: '当前用户',
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }

      mockData.push(newCollectInfo)

      console.log('新增收刀数据:', addData)
      ElMessage.success('新增收刀成功!')
      closeAddDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('新增收刀失败:', error)
    ElMessage.error('新增收刀失败，请重试')
  } finally {
    addLoading.value = false
  }
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
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

// 初始化下拉选项数据
const initSelectOptions = () => {
  // 模拟刀柜编码列表
  cabinetCodeList.value = [
    { value: 'CAB001', label: 'CAB001 - A区01号刀具柜' },
    { value: 'CAB002', label: 'CAB002 - A区02号刀具柜' },
    { value: 'CAB003', label: 'CAB003 - B区01号刀具柜' },
    { value: 'CAB004', label: 'CAB004 - B区02号刀具柜' },
    { value: 'CAB005', label: 'CAB005 - C区01号刀具柜' }
  ]

  // 模拟库位列表
  locationList.value = [
    { value: 'A01-01', label: 'A01-01' },
    { value: 'A01-02', label: 'A01-02' },
    { value: 'A01-03', label: 'A01-03' },
    { value: 'B02-01', label: 'B02-01' },
    { value: 'B02-02', label: 'B02-02' },
    { value: 'B02-03', label: 'B02-03' },
    { value: 'C03-01', label: 'C03-01' },
    { value: 'C03-02', label: 'C03-02' }
  ]
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
  initSelectOptions()
})

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  .topSearchDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px 20px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
  }

  .buttonDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }

  .tableDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;
  }

  .paginationDiv {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 0 20px 20px;
  }
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

:deep(.el-descriptions__label) {
  font-weight: 600;
}

.detail-container {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>
