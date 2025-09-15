<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px" class="search-form">
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option label="启动" :value="0"/>
          <el-option label="禁用" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="车间名称" prop="workshopName">
        <el-input
          v-model="queryParams.workshopName"
          placeholder="请输入车间名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column label="设备ID" align="center" prop="id"/>
      <el-table-column label="设备编码" align="center" prop="deviceCode"/>
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="设备类型" align="center" prop="deviceType"/>
      <el-table-column label="设备位置" align="center" prop="devicePlace"/>
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.deviceStatus)">
            {{ getStatusText(scope.row.deviceStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="车间名称" align="center" prop="workshopName"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" width="240" fixed="right">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
            <el-button type="success" size="small" icon="edit" @click="handleUpdate(scope.row)">修改</el-button>
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
    <el-dialog v-model="detailDialogVisible" title="设备详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="设备编码">{{ currentRecord.deviceCode }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ currentRecord.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">{{ currentRecord.deviceType }}</el-descriptions-item>
          <el-descriptions-item label="设备位置">{{ currentRecord.devicePlace }}</el-descriptions-item>
          <el-descriptions-item label="设备状态">
            <el-tag :type="getStatusType(currentRecord.deviceStatus)">
              {{ getStatusText(currentRecord.deviceStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="车间名称">{{ currentRecord.workshopName }}</el-descriptions-item>
          <el-descriptions-item label="车间主键">{{ currentRecord.factoryId }}</el-descriptions-item>
          <el-descriptions-item label="IC卡号">{{ currentRecord.icCardNo }}</el-descriptions-item>
          <el-descriptions-item label="显示顺序">{{ currentRecord.orderNum }}</el-descriptions-item>
          <el-descriptions-item label="业务状态">{{ currentRecord.status }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ currentRecord.operateSys }}</el-descriptions-item>
          <el-descriptions-item label="是否已删除">{{ currentRecord.isDeleted ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/修改对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="deviceCode">
              <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-input v-model="form.deviceType" placeholder="请输入设备类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备位置" prop="devicePlace">
              <el-input v-model="form.devicePlace" placeholder="请输入设备位置" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备状态" prop="deviceStatus">
              <el-select v-model="form.deviceStatus" placeholder="请选择设备状态" style="width: 100%">
                <el-option label="启动" :value="0"/>
                <el-option label="禁用" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刀柜编码" prop="cabinetCode">
              <el-input v-model="form.cabinetCode" placeholder="请输入刀柜编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车间名称" prop="workshopName">
              <el-input v-model="form.workshopName" placeholder="请输入车间名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间主键" prop="factoryId">
              <el-input v-model="form.factoryId" placeholder="请输入车间主键" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="IC卡号" prop="icCardNo">
              <el-input v-model="form.icCardNo" placeholder="请输入IC卡号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人" prop="createUser">
              <el-input v-model="form.createUser" placeholder="请输入创建人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新人" prop="updateUser">
              <el-input v-model="form.updateUser" placeholder="请输入更新人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" prop="updateTime">
              <el-date-picker
                v-model="form.updateTime"
                type="datetime"
                placeholder="请选择更新时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DeviceManagement">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const loading = ref(true)
const showSearch = ref(true)
const deviceList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)
const open = ref(false)
const title = ref("")
const deviceRef = ref()

// 查询参数
const queryParams = reactive({
  deviceCode: '',
  deviceName: '',
  deviceStatus: '',
  workshopName: ''
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 表单数据
const form = reactive({
  id: null,
  cabinetCode: '',
  createUser: '',
  deviceCode: '',
  deviceName: '',
  devicePlace: '',
  deviceStatus: 0,
  deviceType: '',
  factoryId: '',
  icCardNo: '',
  updateTime: '',
  updateUser: '',
  workshopName: ''
})

// 表单验证规则
const rules = reactive({
  deviceCode: [
    { required: true, message: "设备编码不能为空", trigger: "blur" }
  ],
  deviceName: [
    { required: true, message: "设备名称不能为空", trigger: "blur" }
  ],
  deviceType: [
    { required: true, message: "设备类型不能为空", trigger: "blur" }
  ],
  devicePlace: [
    { required: true, message: "设备位置不能为空", trigger: "blur" }
  ],
  workshopName: [
    { required: true, message: "车间名称不能为空", trigger: "blur" }
  ],
  createUser: [
    { required: true, message: "创建人不能为空", trigger: "blur" }
  ]
})

// 模拟数据
const mockDeviceData = [
  {
    id: 1,
    cabinetCode: 'CAB001',
    createDept: '技术部',
    createTime: '2024-12-27 09:30:00',
    createUser: '张三',
    deviceCode: 'DEV001',
    deviceName: '数控机床A1',
    devicePlace: '车间A区域1',
    deviceStatus: 0,
    deviceType: '数控机床',
    factoryId: 'FACTORY001',
    icCardNo: 'IC001234567',
    isDeleted: false,
    operateSys: 'Linux',
    orderNum: 1,
    status: 1,
    tenantId: 'TENANT001',
    updateTime: '2024-12-27 09:30:00',
    updateUser: '张三',
    workshopName: '第一车间'
  },
  {
    id: 2,
    cabinetCode: 'CAB002',
    createDept: '设备部',
    createTime: '2024-12-26 14:20:00',
    createUser: '李四',
    deviceCode: 'DEV002',
    deviceName: '激光切割机B1',
    devicePlace: '车间B区域2',
    deviceStatus: 1,
    deviceType: '激光切割机',
    factoryId: 'FACTORY002',
    icCardNo: 'IC002345678',
    isDeleted: false,
    operateSys: 'Windows',
    orderNum: 2,
    status: 1,
    tenantId: 'TENANT001',
    updateTime: '2024-12-26 14:20:00',
    updateUser: '李四',
    workshopName: '第二车间'
  },
  {
    id: 3,
    cabinetCode: 'CAB003',
    createDept: '生产部',
    createTime: '2024-12-25 16:45:00',
    createUser: '王五',
    deviceCode: 'DEV003',
    deviceName: '铣床C1',
    devicePlace: '车间C区域3',
    deviceStatus: 0,
    deviceType: '铣床',
    factoryId: 'FACTORY003',
    icCardNo: 'IC003456789',
    isDeleted: false,
    operateSys: 'Linux',
    orderNum: 3,
    status: 1,
    tenantId: 'TENANT002',
    updateTime: '2024-12-25 16:45:00',
    updateUser: '王五',
    workshopName: '第三车间'
  }
]

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    0: 'success', // 启动
    1: 'danger'   // 禁用
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '启动',
    1: '禁用'
  }
  return statusMap[status] || '未知'
}

// 查询列表数据
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    // 模拟搜索过滤
    let filteredData = mockDeviceData.filter(item => {
      return (!queryParams.deviceCode || item.deviceCode.includes(queryParams.deviceCode)) &&
             (!queryParams.deviceName || item.deviceName.includes(queryParams.deviceName)) &&
             (queryParams.deviceStatus === '' || item.deviceStatus === queryParams.deviceStatus) &&
             (!queryParams.workshopName || item.workshopName.includes(queryParams.workshopName))
    })

    // 模拟分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    deviceList.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 搜索
const handleQuery = () => {
  pagination.current = 1
  getList()
}

// 重置搜索
const resetQuery = () => {
  queryParams.deviceCode = ''
  queryParams.deviceName = ''
  queryParams.deviceStatus = ''
  queryParams.workshopName = ''
  handleQuery()
}

// 详情
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 新增
const handleAdd = () => {
  reset()
  open.value = true
  title.value = "添加设备"
}

// 修改
const handleUpdate = (row) => {
  reset()
  const deviceId = row.id
  // 模拟获取设备详情
  const device = mockDeviceData.find(item => item.id === deviceId)
  if (device) {
    Object.assign(form, device)
  }
  open.value = true
  title.value = "修改设备"
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除设备"${row.deviceName}"吗？`,
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

// 导出
const handleExport = () => {
  ElMessage.info('导出功能暂未实现')
}

// 提交表单
const submitForm = () => {
  deviceRef.value?.validate((valid) => {
    if (valid) {
      // 设置默认值
      if (title.value === "添加设备") {
        form.createUser = form.createUser || '系统管理员'
        form.updateUser = form.updateUser || '系统管理员'
        form.updateTime = form.updateTime || new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      // 模拟API调用
      loading.value = true
      setTimeout(() => {
        ElMessage.success(title.value.includes('添加') ? '新增成功' : '修改成功')
        open.value = false
        loading.value = false
        getList()
      }, 1000)
    } else {
      ElMessage.error('请填写完整的表单信息')
    }
  })
}

// 取消
const cancel = () => {
  open.value = false
  reset()
}

// 重置表单
const reset = () => {
  form.id = null
  form.cabinetCode = ''
  form.createUser = ''
  form.deviceCode = ''
  form.deviceName = ''
  form.devicePlace = ''
  form.deviceStatus = 0
  form.deviceType = ''
  form.factoryId = ''
  form.icCardNo = ''
  form.updateTime = ''
  form.updateUser = ''
  form.workshopName = ''

  // 清除表单验证
  deviceRef.value?.clearValidate()
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

.search-form {
  margin-bottom: 20px;
}

.paginationDiv {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
