<template>
  <div class="container">
    <div>收刀具货道管理</div>
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-input
            v-model="searchForm.cabinetCode"
            placeholder="请输入刀柜编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="库位号:" prop="stockLoc">
          <el-input
            v-model="searchForm.stockLoc"
            placeholder="请输入库位号"
            clearable
          />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="searchForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A面" value="A"/>
            <el-option label="B面" value="B"/>
            <el-option label="C面" value="C"/>
            <el-option label="D面" value="D"/>
            <el-option label="E面" value="E"/>
          </el-select>
        </el-form-item>
        <el-form-item label="库位状态:" prop="stockStatus">
          <el-select v-model="searchForm.stockStatus" placeholder="请选择库位状态" clearable>
            <el-option label="空闲" :value="0"/>
            <el-option label="占用" :value="1"/>
            <el-option label="维护" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定状态:" prop="isBound">
          <el-select v-model="searchForm.isBound" placeholder="请选择绑定状态" clearable>
            <el-option label="已绑定" :value="true"/>
            <el-option label="未绑定" :value="false"/>
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
      <el-button type="warning" icon="warning" @click="handleAlarmSettings">预警设置</el-button>
      <el-button type="primary" icon="bar-chart" @click="handleStatistics">货道统计</el-button>
    </div>

    <!-- 货道信息表格 -->
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
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80">
          <template #default="scope">
            <el-tag :type="getLocPrefixTagType(scope.row.locPrefix)">
              {{ scope.row.locPrefix }}面
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
        <el-table-column prop="locCapacity" label="货道容量" align="center" width="100"/>
        <el-table-column prop="locSurplus" label="剩余数量" align="center" width="100"/>
        <el-table-column prop="packQty" label="包装数量" align="center" width="100"/>
        <el-table-column prop="stockStatus" label="库位状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockStatusTagType(scope.row.stockStatus)">
              {{ getStockStatusText(scope.row.stockStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isBound" label="绑定状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isBound ? 'success' : 'info'">
              {{ scope.row.isBound ? '已绑定' : '未绑定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cutterCode" label="绑定刀具型号" align="center" width="150"/>
        <el-table-column prop="warehouseInTime" label="最近更新时间" align="center" width="160"/>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button
                :type="scope.row.stockStatus === 2 ? 'success' : 'danger'"
                size="small"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.stockStatus === 2 ? '启用' : '禁用' }}
              </el-button>
              <el-button
                :type="scope.row.isBound ? 'danger' : 'warning'"
                size="small"
                @click="handleToggleBind(scope.row)"
              >
                {{ scope.row.isBound ? '解绑' : '绑定' }}
              </el-button>
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

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="货道详情" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="货道ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="柜子面">{{ currentRecord.locPrefix }}面</el-descriptions-item>
          <el-descriptions-item label="货道容量">{{ currentRecord.locCapacity }}</el-descriptions-item>
          <el-descriptions-item label="剩余数量">{{ currentRecord.locSurplus }}</el-descriptions-item>
          <el-descriptions-item label="包装数量">{{ currentRecord.packQty }}</el-descriptions-item>
          <el-descriptions-item label="库位类型">
            <el-tag :type="currentRecord.locType === 0 ? 'primary' : 'warning'">
              {{ currentRecord.locType === 0 ? '取刀柜' : '收刀柜' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="库位状态">
            <el-tag :type="getStockStatusTagType(currentRecord.stockStatus)">
              {{ getStockStatusText(currentRecord.stockStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="绑定状态">
            <el-tag :type="currentRecord.isBound ? 'success' : 'info'">
              {{ currentRecord.isBound ? '已绑定' : '未绑定' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="绑定刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具ID">{{ currentRecord.cutterId || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="是否禁用">
            <el-tag :type="currentRecord.isBan === 0 ? 'success' : 'danger'">
              {{ currentRecord.isBan === 0 ? '非禁用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最近更新时间">{{ currentRecord.warehouseInTime }}</el-descriptions-item>
          <el-descriptions-item label="预警数量">{{ currentRecord.warningNum }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 统计对话框 -->
    <el-dialog v-model="statisticsDialogVisible" title="货道统计" width="600px">
      <el-form :inline="true" :model="statisticsForm" ref="statisticsFormRef" class="statistics-form">
        <el-form-item label="刀柜编码:" prop="cabinetCode" :rules="[{ required: true, message: '请输入刀柜编码', trigger: 'blur' }]">
          <el-input v-model="statisticsForm.cabinetCode" placeholder="请输入刀柜编码" />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="statisticsForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A面" value="A"/>
            <el-option label="B面" value="B"/>
            <el-option label="C面" value="C"/>
            <el-option label="D面" value="D"/>
            <el-option label="E面" value="E"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStatistics" :loading="statisticsLoading">查询统计</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="statisticsData" class="statistics-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="货道总数">{{ statisticsData.cabinetNum }}</el-descriptions-item>
          <el-descriptions-item label="禁用数量">{{ statisticsData.disableNum }}</el-descriptions-item>
          <el-descriptions-item label="空闲数量">{{ statisticsData.freeNum }}</el-descriptions-item>
          <el-descriptions-item label="占用数量">{{ statisticsData.workNum }}</el-descriptions-item>
          <el-descriptions-item label="库存告警值">{{ statisticsData.makeAlarm }}</el-descriptions-item>
          <el-descriptions-item label="总库存金额">{{ statisticsData.priceNum ? statisticsData.priceNum.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statisticsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绑定对话框 -->
    <el-dialog v-model="bindDialogVisible" title="绑定货道" width="600px">
      <el-form :model="bindForm" ref="bindFormRef" label-width="120px">
        <el-form-item label="耗材主键:" prop="cutterId" :rules="[{ required: true, message: '请输入耗材主键', trigger: 'blur' }]">
          <el-input v-model="bindForm.cutterId" placeholder="请输入耗材主键" />
        </el-form-item>
        <el-form-item label="是否禁用:" prop="isBan" :rules="[{ required: true, message: '请选择是否禁用', trigger: 'change' }]">
          <el-select v-model="bindForm.isBan" placeholder="请选择是否禁用">
            <el-option label="非禁用" :value="0"/>
            <el-option label="禁用" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="货道容量:" prop="locCapacity" :rules="[{ required: true, message: '请输入货道容量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locCapacity" :min="1" placeholder="请输入货道容量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="包装数量:" prop="locPackQty" :rules="[{ required: true, message: '请输入包装数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locPackQty" :min="1" placeholder="请输入包装数量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="当前数量:" prop="locSurplus" :rules="[{ required: true, message: '请输入当前数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locSurplus" :min="0" placeholder="请输入当前数量" style="width: 100%" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBind" :loading="bindLoading">确定绑定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 解绑对话框 -->
    <el-dialog v-model="unbindDialogVisible" title="解绑货道" width="400px">
        <div class="unbind-content">
        <el-icon class="warning-icon" size="48" color="#E6A23C">
            <Warning />
        </el-icon>
        <p class="unbind-message">确定要解绑该货道吗？</p>
        <p class="unbind-tip">解绑后将清除该货道与刀具的绑定关系</p>
        <p class="unbind-tip">库位号: {{ currentUnbindRow?.stockLoc }}</p>
        </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="submitUnbind" :loading="unbindLoading">确定解绑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CollectCutterChannelManage">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const bindDialogVisible = ref(false)
const unbindDialogVisible = ref(false)

const statisticsLoading = ref(false)
const bindLoading = ref(false)
const unbindLoading = ref(false)

const currentRecord = ref(null)
const statisticsData = ref(null)
const currentUnbindRow = ref(null)

// 搜索表单 - 专注于货道相关查询条件
const searchForm = reactive({
  cabinetCode: '',
  stockLoc: '',
  locPrefix: '',
  stockStatus: null,
  isBound: null
})

// 统计表单
const statisticsForm = reactive({
  cabinetCode: '',
  locPrefix: ''
})

// 绑定表单
const bindForm = reactive({
  cutterId: '',
  isBan: 0,
  locCapacity: null,
  locPackQty: null,
  locSurplus: null,
  stockId: ''
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const searchFormRef = ref()
const statisticsFormRef = ref()
const bindFormRef = ref()

// 货道模拟数据
const mockData = [
  {
    id: 1,
    cabinetCode: 'CAB20241227001',
    stockLoc: 'A01-001',
    locPrefix: 'A',
    locCapacity: 50,
    locSurplus: 35,
    packQty: 10,
    stockStatus: 1,
    isBound: true,
    cutterCode: 'APMT1135PDER-M2',
    cutterId: 1001,
    isBan: 0,
    locType: 1,
    warehouseInTime: '2024-12-27 08:30:00',
    warningNum: 5
  },
  {
    id: 2,
    cabinetCode: 'CAB20241227002',
    stockLoc: 'B02-015',
    locPrefix: 'B',
    locCapacity: 40,
    locSurplus: 28,
    packQty: 5,
    stockStatus: 0,
    isBound: false,
    cutterCode: '',
    cutterId: null,
    isBan: 0,
    locType: 1,
    warehouseInTime: '2024-12-26 15:20:00',
    warningNum: 3
  },
  {
    id: 3,
    cabinetCode: 'CAB20241227003',
    stockLoc: 'C03-008',
    locPrefix: 'C',
    locCapacity: 60,
    locSurplus: 42,
    packQty: 8,
    stockStatus: 1,
    isBound: true,
    cutterCode: 'CNMG120408-PM',
    cutterId: 1003,
    isBan: 0,
    locType: 1,
    warehouseInTime: '2024-12-25 09:45:00',
    warningNum: 8
  },
  {
    id: 4,
    cabinetCode: 'CAB20241227004',
    stockLoc: 'D04-012',
    locPrefix: 'D',
    locCapacity: 30,
    locSurplus: 15,
    packQty: 6,
    stockStatus: 2,
    isBound: false,
    cutterCode: '',
    cutterId: null,
    isBan: 1,
    locType: 1,
    warehouseInTime: '2024-12-24 14:15:00',
    warningNum: 2
  },
  {
    id: 5,
    cabinetCode: 'CAB20241227005',
    stockLoc: 'E05-020',
    locPrefix: 'E',
    locCapacity: 45,
    locSurplus: 30,
    packQty: 12,
    stockStatus: 0,
    isBound: true,
    cutterCode: 'ADKT1505PDR-HM',
    cutterId: 1005,
    isBan: 0,
    locType: 1,
    warehouseInTime: '2024-12-23 11:30:00',
    warningNum: 6
  }
]

// 货道统计模拟数据
const mockStatisticsData = {
  'CAB20241227001-A': {
    cabinetNum: 50,
    disableNum: 3,
    freeNum: 15,
    makeAlarm: 10,
    priceNum: 18750.50,
    workNum: 32
  },
  'CAB20241227002-B': {
    cabinetNum: 40,
    disableNum: 2,
    freeNum: 10,
    makeAlarm: 8,
    priceNum: 10716.00,
    workNum: 28
  },
  'CAB20241227003-C': {
    cabinetNum: 60,
    disableNum: 5,
    freeNum: 20,
    makeAlarm: 12,
    priceNum: 28224.00,
    workNum: 35
  }
}

// 生命周期
onMounted(() => {
  getList()
})

// 货道列表查询
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    let filteredData = [...mockData]

    // 货道相关筛选条件
    if (searchForm.cabinetCode) {
      filteredData = filteredData.filter(item =>
        item.cabinetCode.includes(searchForm.cabinetCode)
      )
    }
    if (searchForm.stockLoc) {
      filteredData = filteredData.filter(item =>
        item.stockLoc.includes(searchForm.stockLoc)
      )
    }
    if (searchForm.locPrefix) {
      filteredData = filteredData.filter(item => item.locPrefix === searchForm.locPrefix)
    }
    if (searchForm.stockStatus !== null) {
      filteredData = filteredData.filter(item => item.stockStatus === searchForm.stockStatus)
    }
    if (searchForm.isBound !== null) {
      filteredData = filteredData.filter(item => item.isBound === searchForm.isBound)
    }

    tableData.value = filteredData
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

// 搜索与重置
const handleSearch = () => {
  pagination.current = 1
  getList()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    cabinetCode: '',
    stockLoc: '',
    locPrefix: '',
    stockStatus: null,
    isBound: null
  })
  nextTick(() => {
    searchFormRef.value?.clearValidate()
  })
  getList()
}

// 分页处理
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

// 货道详情
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 货道统计
const handleStatistics = () => {
  statisticsDialogVisible.value = true
  statisticsData.value = null
}

const getStatistics = () => {
  if (!statisticsForm.cabinetCode) {
    ElMessage.warning('请输入刀柜编码')
    return
  }

  statisticsLoading.value = true

  // 模拟API调用
  setTimeout(() => {
    const key = `${statisticsForm.cabinetCode}-${statisticsForm.locPrefix || 'A'}`
    statisticsData.value = mockStatisticsData[key] || {
      cabinetNum: 0,
      disableNum: 0,
      freeNum: 0,
      makeAlarm: 0,
      priceNum: 0,
      workNum: 0
    }
    statisticsLoading.value = false
  }, 500)
}

// 货道绑定/解绑
const handleToggleBind = (row) => {
  if (row.isBound) {
    // 解绑操作
    currentUnbindRow.value = row
    unbindDialogVisible.value = true
  } else {
    // 绑定操作
    Object.assign(bindForm, {
      cutterId: row.cutterId || '',
      isBan: row.isBan || 0,
      locCapacity: row.locCapacity || null,
      locPackQty: row.packQty || null,
      locSurplus: row.locSurplus || null,
      stockId: row.id || ''
    })
    bindDialogVisible.value = true
  }
}

const submitBind = () => {
  bindFormRef.value?.validate((valid) => {
    if (valid) {
      bindLoading.value = true
      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('货道绑定成功')
        bindDialogVisible.value = false
        getList()
        bindLoading.value = false
      }, 1000)
    }
  })
}

const submitUnbind = () => {
  unbindLoading.value = true
  // 模拟API调用
  setTimeout(() => {
    ElMessage.success('货道解绑成功')
    unbindDialogVisible.value = false
    getList()
    unbindLoading.value = false
  }, 1000)
}

// 货道状态切换（启用/禁用）
const handleToggleStatus = (row) => {
  const isDisabled = row.stockStatus === 2
  const action = isDisabled ? '启用' : '禁用'
  const newStatus = isDisabled ? 1 : 2

  ElMessageBox.confirm(`确定要${action}库位号 ${row.stockLoc} 吗?`, `确认${action}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      row.stockStatus = newStatus
      ElMessage.success(`${action}成功`)
    }, 500)
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

// 预警设置
const handleAlarmSettings = () => {
  ElMessage.info('货道预警设置功能开发中...')
}

// 状态显示转换方法
const getStockStatusText = (status) => {
  const statusMap = {
    0: '空闲',
    1: '占用',
    2: '维护'
  }
  return statusMap[status] || '未知'
}

const getStockStatusTagType = (status) => {
  const typeMap = {
    0: 'success',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const getLocPrefixTagType = (prefix) => {
  const typeMap = {
    'A': 'primary',
    'B': 'success',
    'C': 'warning',
    'D': 'danger',
    'E': 'info'
  }
  return typeMap[prefix] || 'info'
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
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

.statistics-form {
  margin-bottom: 20px;
}

.statistics-content {
  margin-top: 20px;
}

.unbind-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  margin-bottom: 16px;
}

.unbind-message {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
}

.unbind-tip {
  font-size: 14px;
  color: #909399;
  margin: 0;
}
</style>