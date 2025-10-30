<template>
  <div class="container">
    <!-- <div>收刀柄柜管理</div> -->
    
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
        <el-form-item label="刀柄类型:" prop="handleType">
          <el-select v-model="searchForm.handleType" placeholder="请选择刀柄类型" clearable>
            <el-option label="BT30" value="BT30"/>
            <el-option label="BT40" value="BT40"/>
            <el-option label="BT50" value="BT50"/>
            <el-option label="HSK-A63" value="HSK-A63"/>
            <el-option label="HSK-A100" value="HSK-A100"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌:" prop="brandName">
          <el-input
            v-model="searchForm.brandName"
            placeholder="请输入品牌"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="resetForm" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="success" icon="plus" @click="handleRestock" :loading="restockLoading">补货</el-button>
      <el-button type="warning" icon="warning" @click="handleAlarmSettings">预警设置</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
      <el-button type="primary" icon="upload" @click="handleImport">导入</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="tableDiv">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="刀柜货道主键" align="center" width="120"/>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80"/>
        <el-table-column prop="locCapacity" label="货道容量" align="center" width="100"/>
        <el-table-column prop="locSurplus" label="剩余数量" align="center" width="100"/>
        <el-table-column prop="stockStatus" label="库位状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockStatusTag(scope.row.stockStatus)">
              {{ getStockStatusText(scope.row.stockStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handleType" label="刀柄类型" align="center" width="120"/>
        <el-table-column prop="brandName" label="品牌" align="center" width="120"/>
        <el-table-column prop="specification" label="规格" align="center" width="150"/>
        <el-table-column prop="price" label="单价" align="center" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="150"/>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.stockStatus === 2 ? 'success' : 'danger'"
              size="small"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.stockStatus === 2 ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
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
    <el-dialog v-model="detailDialogVisible" title="刀柄柜详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="刀柜货道主键">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="柜子面">{{ currentRecord.locPrefix }}</el-descriptions-item>
          <el-descriptions-item label="货道容量">{{ currentRecord.locCapacity }}</el-descriptions-item>
          <el-descriptions-item label="剩余数量">{{ currentRecord.locSurplus }}</el-descriptions-item>
          <el-descriptions-item label="库位状态">
            <el-tag :type="getStockStatusTag(currentRecord.stockStatus)">
              {{ getStockStatusText(currentRecord.stockStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀柄类型">{{ currentRecord.handleType }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentRecord.price }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 补货对话框 -->
    <el-dialog v-model="restockDialogVisible" title="补货操作" width="600px">
      <div v-if="selectedRows.length > 0" class="restock-content">
        <el-alert
          title="补货提示"
          :description="`已选择 ${selectedRows.length} 个库位进行补货操作`"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px;"
        />
        
        <el-form :model="restockForm" :rules="restockRules" ref="restockFormRef" label-width="120px">
          <el-form-item label="补货数量:" prop="quantity">
            <el-input-number
              v-model="restockForm.quantity"
              :min="1"
              :max="999"
              placeholder="请输入补货数量"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="补货原因:" prop="reason">
            <el-input
              v-model="restockForm.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入补货原因"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="no-selection">
        <el-empty description="请先选择要补货的库位" />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="restockDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitRestock"
            :loading="restockLoading"
            :disabled="selectedRows.length === 0"
          >
            确认补货
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 统计对话框 -->
    <el-dialog v-model="statisticsDialogVisible" title="刀柄柜统计" width="900px">
      <div v-if="statisticsData" class="statistics-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-statistic title="总库位数" :value="statisticsData.totalSlots" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="已占用库位" :value="statisticsData.occupiedSlots" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="空闲库位" :value="statisticsData.freeSlots" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="维护库位" :value="statisticsData.maintenanceSlots" />
          </el-col>
        </el-row>
        
        <el-divider />
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-statistic title="总刀柄数量" :value="statisticsData.totalHandles" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="库存总价值" :value="statisticsData.totalValue" prefix="¥" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="平均单价" :value="statisticsData.averagePrice" prefix="¥" />
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statisticsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listHandleCabinet,
  getHandleCabinet,
  addHandleCabinet,
  updateHandleCabinet,
  delHandleCabinet,
  restockHandleCabinet,
  exportHandleCabinet
} from '@/api/cabinetChannel/handleCabinet'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const restockDialogVisible = ref(false)
const statisticsLoading = ref(false)
const restockLoading = ref(false)
const disableLoading = ref(false)
const enableLoading = ref(false)
const importLoading = ref(false)
const currentRecord = ref(null)
const statisticsData = ref(null)
const searchFormRef = ref()
const restockFormRef = ref()

// 搜索表单
const searchForm = reactive({
  cabinetCode: '',
  stockLoc: '',
  locPrefix: '',
  stockStatus: '',
  handleType: '',
  brandName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 补货表单
const restockForm = reactive({
  quantity: 1,
  reason: ''
})

// 补货表单验证规则
const restockRules = reactive({
  quantity: [
    { required: true, message: '请输入补货数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 999, message: '补货数量必须在1-999之间', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入补货原因', trigger: 'blur' }
  ]
})

// 模拟数据
const mockData = [
  {
    id: 1,
    cabinetCode: 'HC001',
    stockLoc: 'A01-01',
    locPrefix: 'A',
    locCapacity: 50,
    locSurplus: 35,
    stockStatus: 1,
    handleType: 'BT40',
    brandName: '三菱',
    specification: 'BT40-ER32-100',
    price: 280.50,
    createTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 15:30:00'
  },
  {
    id: 2,
    cabinetCode: 'HC001',
    stockLoc: 'A01-02',
    locPrefix: 'A',
    locCapacity: 50,
    locSurplus: 0,
    stockStatus: 0,
    handleType: 'BT30',
    brandName: '山特维克',
    specification: 'BT30-ER20-80',
    price: 195.00,
    createTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 14:20:00'
  },
  {
    id: 3,
    cabinetCode: 'HC002',
    stockLoc: 'B02-01',
    locPrefix: 'B',
    locCapacity: 30,
    locSurplus: 15,
    stockStatus: 1,
    handleType: 'HSK-A63',
    brandName: '肯纳',
    specification: 'HSK-A63-ER25-90',
    price: 420.00,
    createTime: '2024-12-26 10:00:00',
    updateTime: '2024-12-26 16:10:00'
  }
]

// 获取库位状态文本
const getStockStatusText = (status) => {
  const statusMap = {
    0: '空闲',
    1: '占用',
    2: '维护'
  }
  return statusMap[status] || '未知'
}

// 获取库位状态标签类型
const getStockStatusTag = (status) => {
  const tagMap = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return tagMap[status] || 'info'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据搜索条件筛选
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
        filteredData = filteredData.filter(item =>
          item.locPrefix === searchForm.locPrefix
        )
      }
      if (searchForm.stockStatus !== '') {
        filteredData = filteredData.filter(item =>
          item.stockStatus === searchForm.stockStatus
        )
      }
      if (searchForm.handleType) {
        filteredData = filteredData.filter(item =>
          item.handleType === searchForm.handleType
        )
      }
      if (searchForm.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.includes(searchForm.brandName)
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

// 搜索
const onSubmit = () => {
  pagination.current = 1
  getList()
}

// 重置搜索表单
const resetForm = () => {
  searchFormRef.value.resetFields()
  pagination.current = 1
  getList()
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

// 查看详情
const handleDetail = (row) => {
  currentRecord.value = { ...row }
  detailDialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中...')
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除库位号 ${row.stockLoc} 的记录吗?`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功!')
    getList()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 补货操作
const handleRestock = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要补货的库位')
    return
  }

  // 重置补货表单
  restockForm.quantity = 1
  restockForm.reason = ''
  restockDialogVisible.value = true
}

// 提交补货
const submitRestock = async () => {
  try {
    const valid = await restockFormRef.value.validate()
    if (!valid) return

    restockLoading.value = true

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success(`补货成功！共为 ${selectedRows.value.length} 个库位补货 ${restockForm.quantity} 件`)
      restockDialogVisible.value = false
      getList() // 刷新列表
      restockLoading.value = false
    }, 1000)
  } catch (error) {
    console.error('补货失败:', error)
    ElMessage.error('补货失败，请重试')
    restockLoading.value = false
  }
}

// 预警设置
const handleAlarmSettings = () => {
  ElMessage.info('预警设置功能开发中...')
}

// 切换状态（禁用/启用）
const handleToggleStatus = (row) => {
  const isDisabled = row.stockStatus === 2 // 2表示维护状态（禁用）
  const action = isDisabled ? '启用' : '禁用'
  const newStatus = isDisabled ? 1 : 2 // 1表示占用（正常），2表示维护（禁用）

  ElMessageBox.confirm(`确定要${action}库位号 ${row.stockLoc} 吗?`, `确认${action}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态
      row.stockStatus = newStatus
      ElMessage.success(`${action}成功!`)
    }, 500)
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

// 统计
const handleStatistics = () => {
  statisticsLoading.value = true

  setTimeout(() => {
    // 模拟统计数据
    statisticsData.value = {
      totalSlots: mockData.length,
      occupiedSlots: mockData.filter(item => item.stockStatus === 1).length,
      freeSlots: mockData.filter(item => item.stockStatus === 0).length,
      maintenanceSlots: mockData.filter(item => item.stockStatus === 2).length,
      totalHandles: mockData.reduce((sum, item) => sum + item.locSurplus, 0),
      totalValue: mockData.reduce((sum, item) => sum + (item.locSurplus * item.price), 0).toFixed(2),
      averagePrice: (mockData.reduce((sum, item) => sum + item.price, 0) / mockData.length).toFixed(2)
    }

    statisticsDialogVisible.value = true
    statisticsLoading.value = false
  }, 1000)
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 导入
const handleImport = () => {
  ElMessage.success('导入功能开发中...')
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
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

.detail-content {
  padding: 10px 0;
}

.restock-content {
  padding: 10px 0;
}

.statistics-content {
  padding: 20px 0;
}

.no-selection {
  text-align: center;
  padding: 40px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
