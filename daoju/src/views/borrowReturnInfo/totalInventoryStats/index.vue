<template>
  <div class="container">
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="统计类型:" prop="inventoryType">
          <el-select v-model="searchForm.inventoryType" placeholder="请选择统计类型" clearable @change="handleTypeChange">
            <el-option label="刀具" value="cutter"/>
            <el-option label="刀柄" value="handle"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌名称:" prop="brandName">
          <el-select v-model="searchForm.brandName" placeholder="请选择品牌" clearable>
            <el-option
              v-for="brand in brandList"
              :key="brand.value"
              :label="brand.label"
              :value="brand.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-select v-model="searchForm.cabinetCode" placeholder="请选择刀柜" clearable>
            <el-option
              v-for="cabinet in cabinetList"
              :key="cabinet.value"
              :label="cabinet.label"
              :value="cabinet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="searchForm.inventoryType === 'cutter'" label="刀具类型:" prop="cutterType">
          <el-select v-model="searchForm.cutterType" placeholder="请选择刀具类型" clearable>
            <el-option
              v-for="type in cutterTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="searchForm.inventoryType === 'handle'" label="刀柄类型:" prop="handleType">
          <el-select v-model="searchForm.handleType" placeholder="请选择刀柄类型" clearable>
            <el-option
              v-for="type in handleTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位状态:" prop="stockStatus">
          <el-select v-model="searchForm.stockStatus" placeholder="请选择库位状态" clearable>
            <el-option label="空闲" :value="0"/>
            <el-option label="占用" :value="1"/>
            <el-option label="维护" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="resetForm" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片区域 -->
    <div class="statsCardsDiv" v-if="summaryData">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="stats-card">
            <el-statistic title="总库存数量" :value="summaryData.totalQuantity" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <el-statistic title="总库存价值" :value="summaryData.totalValue" prefix="¥" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <el-statistic title="平均单价" :value="summaryData.averagePrice" prefix="¥" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="success" icon="download" @click="handleExport">导出统计</el-button>
      <el-button type="primary" icon="refresh" @click="handleRefresh">刷新数据</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="tableDiv">
      <el-table
        :data="tableData"
        border
        style="width: 100%; table-layout: fixed;"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        
        <!-- 刀具相关字段 -->
        <el-table-column v-if="searchForm.inventoryType === 'cutter'" prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column v-if="searchForm.inventoryType === 'cutter'" prop="cutterType" label="刀具类型" align="center" width="120"/>
        
        <!-- 刀柄相关字段 -->
        <el-table-column v-if="searchForm.inventoryType === 'handle'" prop="handleType" label="刀柄类型" align="center" width="120"/>
        
        <el-table-column prop="specification" label="规格" align="center" width="150"/>
        <el-table-column prop="locCapacity" label="库位容量" align="center" width="100"/>
        <el-table-column prop="locSurplus" label="剩余数量" align="center" width="100"/>
        <el-table-column prop="stockStatus" label="库位状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockStatusTag(scope.row.stockStatus)">
              {{ getStockStatusText(scope.row.stockStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="totalValue" label="库存价值" align="center" width="120">
          <template #default="scope">
            ¥{{ (scope.row.locSurplus * scope.row.price).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80"/>
        <el-table-column prop="warehouseInTime" label="入库时间" align="center" width="150"/>
        <el-table-column prop="updateTime" label="更新时间" align="center" min-width="150"/>
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  listTotalInventoryStats,
  getCutterInventoryStats,
  getHandleInventoryStats,
  getInventorySummary,
  exportInventoryStats
} from '@/api/borrowReturnInfo/totalInventoryStats'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const summaryData = ref(null)
const searchFormRef = ref()

// 搜索表单
const searchForm = reactive({
  inventoryType: 'cutter', // 默认显示刀具
  brandName: '',
  cabinetCode: '',
  cutterType: '',
  handleType: '',
  stockStatus: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 下拉选项数据
const brandList = ref([])
const cabinetList = ref([])
const cutterTypeList = ref([])
const handleTypeList = ref([])

// 模拟刀具库存数据
const mockCutterData = [
  {
    id: 1,
    cabinetCode: 'CAB001',
    stockLoc: 'A01-01',
    brandName: '三菱',
    cutterCode: 'R390-11T308M-PM',
    cutterType: '铣刀',
    specification: 'R390-11T308M-PM',
    locCapacity: 50,
    locSurplus: 35,
    stockStatus: 1,
    price: 285.50,
    locPrefix: 'A',
    warehouseInTime: '2024-12-26 08:30:00',
    updateTime: '2024-12-26 15:30:00'
  },
  {
    id: 2,
    cabinetCode: 'CAB002',
    stockLoc: 'B02-03',
    brandName: '山特维克',
    cutterCode: '880-D1200L20-03',
    cutterType: '钻头',
    specification: '880-D1200L20-03',
    locCapacity: 40,
    locSurplus: 28,
    stockStatus: 1,
    price: 156.80,
    locPrefix: 'B',
    warehouseInTime: '2024-12-25 14:20:00',
    updateTime: '2024-12-26 10:15:00'
  },
  {
    id: 3,
    cabinetCode: 'CAB003',
    stockLoc: 'C03-05',
    brandName: '肯纳',
    cutterCode: 'CNMG120408-PM',
    cutterType: '车刀片',
    specification: 'CNMG120408-PM',
    locCapacity: 60,
    locSurplus: 0,
    stockStatus: 0,
    price: 198.60,
    locPrefix: 'C',
    warehouseInTime: '2024-12-24 09:45:00',
    updateTime: '2024-12-26 09:00:00'
  }
]

// 模拟刀柄库存数据
const mockHandleData = [
  {
    id: 4,
    cabinetCode: 'HC001',
    stockLoc: 'A01-01',
    brandName: '三菱',
    handleType: 'BT40',
    specification: 'BT40-ER32-100',
    locCapacity: 50,
    locSurplus: 35,
    stockStatus: 1,
    price: 280.50,
    locPrefix: 'A',
    warehouseInTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 15:30:00'
  },
  {
    id: 5,
    cabinetCode: 'HC001',
    stockLoc: 'A01-02',
    brandName: '山特维克',
    handleType: 'BT30',
    specification: 'BT30-ER20-80',
    locCapacity: 50,
    locSurplus: 0,
    stockStatus: 0,
    price: 195.00,
    locPrefix: 'A',
    warehouseInTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 14:20:00'
  },
  {
    id: 6,
    cabinetCode: 'HC002',
    stockLoc: 'B02-01',
    brandName: '肯纳',
    handleType: 'HSK-A63',
    specification: 'HSK-A63-ER25-90',
    locCapacity: 30,
    locSurplus: 15,
    stockStatus: 1,
    price: 420.00,
    locPrefix: 'B',
    warehouseInTime: '2024-12-26 10:00:00',
    updateTime: '2024-12-26 16:10:00'
  }
]

// 初始化下拉选项数据
const initSelectOptions = () => {
  // 品牌列表
  brandList.value = [
    { label: '三菱', value: '三菱' },
    { label: '山特维克', value: '山特维克' },
    { label: '肯纳', value: '肯纳' },
    { label: '瓦尔特', value: '瓦尔特' },
    { label: '京瓷', value: '京瓷' }
  ]

  // 刀柜列表
  cabinetList.value = [
    { label: 'CAB001', value: 'CAB001' },
    { label: 'CAB002', value: 'CAB002' },
    { label: 'CAB003', value: 'CAB003' },
    { label: 'HC001', value: 'HC001' },
    { label: 'HC002', value: 'HC002' }
  ]

  // 刀具类型列表
  cutterTypeList.value = [
    { label: '铣刀', value: '铣刀' },
    { label: '钻头', value: '钻头' },
    { label: '车刀片', value: '车刀片' },
    { label: '镗刀', value: '镗刀' },
    { label: '丝锥', value: '丝锥' }
  ]

  // 刀柄类型列表
  handleTypeList.value = [
    { label: 'BT30', value: 'BT30' },
    { label: 'BT40', value: 'BT40' },
    { label: 'BT50', value: 'BT50' },
    { label: 'HSK-A63', value: 'HSK-A63' },
    { label: 'HSK-A100', value: 'HSK-A100' }
  ]
}

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

// 统计类型变更
const handleTypeChange = () => {
  // 清空相关搜索条件
  searchForm.cutterType = ''
  searchForm.handleType = ''
  getList()
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = []

      // 根据统计类型选择数据源
      if (searchForm.inventoryType === 'cutter') {
        filteredData = [...mockCutterData]
      } else {
        filteredData = [...mockHandleData]
      }

      // 根据搜索条件筛选
      if (searchForm.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.includes(searchForm.brandName)
        )
      }
      if (searchForm.cabinetCode) {
        filteredData = filteredData.filter(item =>
          item.cabinetCode === searchForm.cabinetCode
        )
      }
      if (searchForm.cutterType && searchForm.inventoryType === 'cutter') {
        filteredData = filteredData.filter(item =>
          item.cutterType === searchForm.cutterType
        )
      }
      if (searchForm.handleType && searchForm.inventoryType === 'handle') {
        filteredData = filteredData.filter(item =>
          item.handleType === searchForm.handleType
        )
      }
      if (searchForm.stockStatus !== '') {
        filteredData = filteredData.filter(item =>
          item.stockStatus === searchForm.stockStatus
        )
      }

      // 分页处理
      const start = (pagination.current - 1) * pagination.size
      const end = start + pagination.size

      tableData.value = filteredData.slice(start, end)
      pagination.total = filteredData.length

      // 计算汇总数据
      calculateSummary(filteredData)

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    loading.value = false
  }
}

// 计算汇总数据
const calculateSummary = (data) => {
  const totalQuantity = data.reduce((sum, item) => sum + item.locSurplus, 0)
  const totalValue = data.reduce((sum, item) => sum + (item.locSurplus * item.price), 0)
  const averagePrice = data.length > 0 ? (data.reduce((sum, item) => sum + item.price, 0) / data.length) : 0

  summaryData.value = {
    totalQuantity,
    totalValue: totalValue.toFixed(2),
    averagePrice: averagePrice.toFixed(2)
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

// 导出统计
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 刷新数据
const handleRefresh = () => {
  getList()
  ElMessage.success('数据已刷新')
}

// 组件挂载时初始化
onMounted(() => {
  initSelectOptions()
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

  .statsCardsDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;

    .stats-card {
      text-align: center;
      
      :deep(.el-statistic__content) {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
      }
      
      :deep(.el-statistic__head) {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }
    }
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
</style>
