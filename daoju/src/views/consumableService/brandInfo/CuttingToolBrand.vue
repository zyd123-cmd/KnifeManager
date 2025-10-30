<template>
  <div class="container">
    <!-- 页面标题 -->
    <div class="page-title">刀具品牌管理</div>

    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="品牌编码:" prop="brandCode">
          <el-input v-model="formInline.brandCode" placeholder="请输入品牌编码" clearable/>
        </el-form-item>
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="公司名称:" prop="corporateName">
          <el-input v-model="formInline.corporateName" placeholder="请输入公司名称" clearable/>
        </el-form-item>
        <el-form-item label="供应商名称:" prop="supplierName">
          <el-select v-model="formInline.supplierName" placeholder="请选择供应商" clearable>
            <el-option
              v-for="supplier in supplierList"
              :key="supplier.value"
              :label="supplier.label"
              :value="supplier.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态:" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择业务状态" clearable>
            <el-option label="启用" value="active"/>
            <el-option label="禁用" value="inactive"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model="formInline.createUser" placeholder="请输入创建人" clearable/>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
            v-model="formInline.createTime"
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

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增刀具品牌</el-button>
    </div>

    <!-- 中部表格显示品牌信息 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%; table-layout: fixed;" 
        v-loading="loading" 
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="品牌ID" align="center" width="100"/>
        <el-table-column prop="brandCode" label="品牌编码" align="center" width="120"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="150"/>
        <el-table-column prop="corporateName" label="公司名称" align="center" width="180"/>
        <el-table-column prop="supplierName" label="供应商名称" align="center" width="150"/>
        <el-table-column prop="supplierUser" label="供应商联系人" align="center" width="120"/>
        <el-table-column prop="phone" label="联系方式" align="center" width="130"/>
        <el-table-column prop="status" label="业务状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人" align="center" width="100"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="isDeleted" label="删除状态" align="center" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isDeleted === 0 ? 'success' : 'danger'">
              {{ scope.row.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="default" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      title="刀具品牌详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentBrand">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="品牌ID">{{ currentBrand.id }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentBrand.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentBrand.brandName }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag type="warning">刀具品牌</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="公司名称">{{ currentBrand.corporateName }}</el-descriptions-item>
          <el-descriptions-item label="供应商名称">{{ currentBrand.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="供应商联系人">{{ currentBrand.supplierUser }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ currentBrand.phone }}</el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="currentBrand.status === 'active' ? 'success' : 'danger'">
              {{ currentBrand.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="删除状态">
            <el-tag :type="currentBrand.isDeleted === 0 ? 'success' : 'danger'">
              {{ currentBrand.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentBrand.tenantId }}</el-descriptions-item>
        </el-descriptions>

        <!-- 操作信息 -->
        <el-descriptions title="操作信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="创建部门">{{ currentBrand.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentBrand.createUser }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentBrand.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentBrand.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentBrand.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增品牌对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增刀具品牌"
      width="800px"
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
            <el-form-item label="品牌编码" prop="brandCode">
              <el-input
                v-model="addForm.brandCode"
                placeholder="请输入品牌编码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="公司名称" prop="corporateName">
              <el-input
                v-model="addForm.corporateName"
                placeholder="请输入公司名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                v-model="addForm.supplierName"
                placeholder="请输入供应商名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商联系人" prop="supplierUser">
              <el-input
                v-model="addForm.supplierUser"
                placeholder="请输入供应商联系人"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model="addForm.phone"
                placeholder="请输入联系方式"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建部门" prop="createDept">
              <el-input
                v-model="addForm.createDept"
                placeholder="请输入创建部门"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="addForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
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

    <!-- 修改品牌对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改刀具品牌"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌编码" prop="brandCode">
              <el-input
                v-model="editForm.brandCode"
                placeholder="请输入品牌编码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input
                v-model="editForm.brandName"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="corporateName">
              <el-input
                v-model="editForm.corporateName"
                placeholder="请输入公司名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                v-model="editForm.supplierName"
                placeholder="请输入供应商名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商联系人" prop="supplierUser">
              <el-input
                v-model="editForm.supplierUser"
                placeholder="请输入供应商联系人"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model="editForm.phone"
                placeholder="请输入联系方式"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建部门" prop="createDept">
              <el-input
                v-model="editForm.createDept"
                placeholder="请输入创建部门"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="editForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeEditDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitEditForm"
            :loading="editLoading"
          >
            {{ editLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表单引用
const formInlineRes = ref()
const addFormRef = ref()
const editFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  brandCode: '', // 品牌编码
  brandName: '', // 品牌名称
  corporateName: '', // 公司名称
  supplierName: '', // 供应商名称
  status: '', // 业务状态
  createUser: '', // 创建人
  createTime: '', // 创建时间
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
  brandCode: '',
  brandName: '',
  corporateName: '',
  supplierName: '',
  status: '',
  createUser: '',
  createTimeStart: '',
  createTimeEnd: '',
  type: 'cuttingTool' // 固定为刀具品牌
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const addLoading = ref(false)
const editLoading = ref(false)
const currentBrand = ref(null)

// 新增表单数据
const addForm = reactive({
  type: 'cuttingTool', // 固定为刀具品牌
  brandCode: '',
  brandName: '',
  corporateName: '',
  createDept: '',
  phone: '',
  status: 'active',
  supplierName: '',
  supplierUser: '',
  createUser: '',
  createTime: '',
  updateUser: '',
  updateTime: '',
  tenantId: '',
  isDeleted: 0
})

// 修改表单数据
const editForm = reactive({
  id: null,
  type: 'cuttingTool', // 固定为刀具品牌
  brandCode: '',
  brandName: '',
  corporateName: '',
  createDept: '',
  phone: '',
  status: 'active',
  supplierName: '',
  supplierUser: '',
  createUser: '',
  createTime: '',
  updateUser: '',
  updateTime: '',
  tenantId: '',
  isDeleted: 0
})

// 表单验证规则
const addFormRules = reactive({
  brandCode: [
    { required: true, message: '请输入品牌编码', trigger: 'blur' }
  ],
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
  ],
  corporateName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  supplierUser: [
    { required: true, message: '请输入供应商联系人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的联系方式', trigger: 'blur' }
  ],
  createDept: [
    { required: true, message: '请输入创建部门', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ]
})

const editFormRules = reactive({
  ...addFormRules // 复用新增表单的验证规则
})

// 下拉选项数据
const supplierList = ref([])
const corporateList = ref([])

// 刀具品牌模拟数据
const mockData = [
  {
    id: 2,
    type: 'cuttingTool', // 刀具品牌
    brandCode: 'CT002',
    brandName: '山特维克刀具',
    corporateName: '山特维克集团',
    createDept: '采购部',
    createTime: '2024-12-21 10:15:00',
    createUser: '赵采购',
    isDeleted: 0,
    phone: '010-87654321',
    status: 'active',
    supplierName: '北京山特维克工具有限公司',
    supplierUser: '陈经理',
    tenantId: 'T001',
    updateTime: '2024-12-26 16:45:00',
    updateUser: '刘主管'
  },
  {
    id: 4,
    type: 'cuttingTool', // 刀具品牌
    brandCode: 'CT004',
    brandName: '伊斯卡刀具',
    corporateName: '伊斯卡金属加工有限公司',
    createDept: '采购部',
    createTime: '2024-12-23 14:20:00',
    createUser: '郑采购',
    isDeleted: 0,
    phone: '020-65432109',
    status: 'active',
    supplierName: '广州伊斯卡工具有限公司',
    supplierUser: '林经理',
    tenantId: 'T001',
    updateTime: '2024-12-27 10:10:00',
    updateUser: '黄主管'
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 按品牌编码筛选
      if (queryParams.brandCode) {
        filteredData = filteredData.filter(item =>
          item.brandCode.toLowerCase().includes(queryParams.brandCode.toLowerCase())
        )
      }

      // 按品牌名称筛选
      if (queryParams.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.toLowerCase().includes(queryParams.brandName.toLowerCase())
        )
      }

      // 按公司名称筛选
      if (queryParams.corporateName) {
        filteredData = filteredData.filter(item =>
          item.corporateName.toLowerCase().includes(queryParams.corporateName.toLowerCase())
        )
      }

      // 按供应商名称筛选
      if (queryParams.supplierName) {
        filteredData = filteredData.filter(item =>
          item.supplierName === queryParams.supplierName
        )
      }

      // 按业务状态筛选
      if (queryParams.status) {
        filteredData = filteredData.filter(item =>
          item.status === queryParams.status
        )
      }

      // 按创建人筛选
      if (queryParams.createUser) {
        filteredData = filteredData.filter(item =>
          item.createUser.toLowerCase().includes(queryParams.createUser.toLowerCase())
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
  queryParams.brandCode = formInline.brandCode
  queryParams.brandName = formInline.brandName
  queryParams.corporateName = formInline.corporateName
  queryParams.supplierName = formInline.supplierName
  queryParams.status = formInline.status
  queryParams.createUser = formInline.createUser

  // 处理时间范围
  if (formInline.createTime && formInline.createTime.length === 2) {
    queryParams.createTimeStart = formInline.createTime[0].toISOString().split('T')[0]
    queryParams.createTimeEnd = formInline.createTime[1].toISOString().split('T')[0]
  } else {
    queryParams.createTimeStart = ''
    queryParams.createTimeEnd = ''
  }

  pagination.current = 1
  getList()
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
  // 重置所有查询参数
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = ''
  })
  queryParams.type = 'cuttingTool' // 保持为刀具品牌
  pagination.current = 1
  getList()
}

// 查看详情
const handleDetail = (row) => {
  const detailData = mockData.find(item => item.id === row.id)
  if (detailData) {
    currentBrand.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 修改操作
const handleEdit = (row) => {
  const editData = mockData.find(item => item.id === row.id)
  if (editData) {
    Object.assign(editForm, {
      id: editData.id,
      type: 'cuttingTool', // 固定为刀具品牌
      brandCode: editData.brandCode || '',
      brandName: editData.brandName || '',
      corporateName: editData.corporateName || '',
      createDept: editData.createDept || '',
      phone: editData.phone || '',
      status: editData.status || 'active',
      supplierName: editData.supplierName || '',
      supplierUser: editData.supplierUser || '',
      createUser: editData.createUser || '',
      createTime: editData.createTime || '',
      updateUser: editData.updateUser || '',
      updateTime: editData.updateTime || '',
      tenantId: editData.tenantId || '',
      isDeleted: editData.isDeleted || 0
    })
    editDialogVisible.value = true
  } else {
    ElMessage.error('获取数据失败')
  }
}

// 删除单个品牌
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除刀具品牌 "${row.brandName}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    setTimeout(() => {
      const index = mockData.findIndex(item => item.id === row.id)
      if (index > -1) {
        mockData[index].isDeleted = 1 // 标记为已删除
      }
      ElMessage.success('删除成功!')
      getList() // 刷新列表
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 打开新增对话框
const openAddDialog = () => {
  resetAddForm()
  addForm.type = 'cuttingTool' // 固定为刀具品牌
  addDialogVisible.value = true
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
  supplierList.value = [
    { value: '上海三菱工具有限公司', label: '上海三菱工具有限公司' },
    { value: '北京山特维克工具有限公司', label: '北京山特维克工具有限公司' },
    { value: '深圳肯纳工具有限公司', label: '深圳肯纳工具有限公司' },
    { value: '广州伊斯卡工具有限公司', label: '广州伊斯卡工具有限公司' },
    { value: '苏州住友工具有限公司', label: '苏州住友工具有限公司' }
  ]

  corporateList.value = [
    { value: '三菱材料株式会社', label: '三菱材料株式会社' },
    { value: '山特维克集团', label: '山特维克集团' },
    { value: '肯纳金属公司', label: '肯纳金属公司' },
    { value: '伊斯卡金属加工有限公司', label: '伊斯卡金属加工有限公司' },
    { value: '住友电工硬质合金株式会社', label: '住友电工硬质合金株式会社' }
  ]
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
    brandCode: '',
    brandName: '',
    corporateName: '',
    createDept: '',
    phone: '',
    status: 'active',
    supplierName: '',
    supplierUser: '',
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 提交新增表单
const submitAddForm = async () => {
  try {
    const valid = await addFormRef.value.validate()
    if (!valid) return

    addLoading.value = true

    // 准备提交数据
    const submitData = {
      ...addForm,
      id: Date.now(), // 模拟ID
      type: 'cuttingTool', // 固定为刀具品牌
      createUser: '当前用户',
      updateUser: '当前用户',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tenantId: 'T001',
      isDeleted: 0
    }

    // 模拟API调用
    setTimeout(() => {
      mockData.push(submitData)
      console.log('新增刀具品牌数据:', submitData)
      ElMessage.success('新增成功!')
      closeAddDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('新增失败:', error)
    ElMessage.error('新增失败，请重试')
  } finally {
    addLoading.value = false
  }
}

// 关闭修改对话框
const closeEditDialog = () => {
  editDialogVisible.value = false
  resetEditForm()
  editLoading.value = false
}

// 重置修改表单
const resetEditForm = () => {
  Object.assign(editForm, {
    id: null,
    brandCode: '',
    brandName: '',
    corporateName: '',
    createDept: '',
    phone: '',
    status: 'active',
    supplierName: '',
    supplierUser: '',
  })
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

// 提交修改表单
const submitEditForm = async () => {
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return

    editLoading.value = true

    // 准备提交数据
    const submitData = {
      ...editForm,
      updateUser: '当前用户',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }

    // 模拟API调用
    setTimeout(() => {
      const index = mockData.findIndex(item => item.id === editForm.id)
      if (index > -1) {
        Object.assign(mockData[index], submitData)
      }

      console.log('修改刀具品牌数据:', submitData)
      ElMessage.success('修改成功!')
      closeEditDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error('修改失败，请重试')
  } finally {
    editLoading.value = false
  }
}

// 组件挂载时初始化
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

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 15px 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
  }

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