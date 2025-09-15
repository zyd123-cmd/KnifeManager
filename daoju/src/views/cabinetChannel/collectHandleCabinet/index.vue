<template>
  <div class="container">
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-input v-model="searchForm.cabinetCode" placeholder="请输入刀柜编码" clearable />
        </el-form-item>
        <el-form-item label="库位号:" prop="stockLoc">
          <el-input v-model="searchForm.stockLoc" placeholder="请输入库位号" clearable />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="searchForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A" value="A"/>
            <el-option label="B" value="B"/>
            <el-option label="C" value="C"/>
            <el-option label="D" value="D"/>
            <el-option label="E" value="E"/>
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
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="searchForm.brandName" placeholder="请输入品牌名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="resetForm" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="warning" icon="warning" @click="handleAlarmSettings">预警设置</el-button>
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
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="handleType" label="刀柄类型" align="center" width="120"/>
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
        <el-table-column prop="warehouseInTime" label="入库时间" align="center" width="150"/>
        <el-table-column prop="updateTime" label="更新时间" align="center" min-width="150"/>
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
    <el-dialog v-model="detailDialogVisible" title="收刀柄柜详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="柜子面">{{ currentRecord.locPrefix }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀柄类型">{{ currentRecord.handleType }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="库位容量">{{ currentRecord.locCapacity }}</el-descriptions-item>
          <el-descriptions-item label="剩余数量">{{ currentRecord.locSurplus }}</el-descriptions-item>
          <el-descriptions-item label="库位状态">
            <el-tag :type="getStockStatusTag(currentRecord.stockStatus)">
              {{ getStockStatusText(currentRecord.stockStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentRecord.price }}</el-descriptions-item>
          <el-descriptions-item label="入库时间">{{ currentRecord.warehouseInTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCollectHandleCabinet,
  getCollectHandleCabinet,
  collectHandle,
  batchCollectHandle,
  exportCollectHandleCabinet
} from '@/api/cabinetChannel/collectHandleCabinet'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)
const searchFormRef = ref()

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



// 模拟收刀柄柜数据
const mockData = [
  {
    id: 1,
    cabinetCode: 'HC001',
    stockLoc: 'A01-01',
    locPrefix: 'A',
    brandName: '三菱',
    handleType: 'BT40',
    specification: 'BT40-ER32-100',
    locCapacity: 50,
    locSurplus: 35,
    stockStatus: 1,
    price: 280.50,
    warehouseInTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 15:30:00'
  },
  {
    id: 2,
    cabinetCode: 'HC001',
    stockLoc: 'A01-02',
    locPrefix: 'A',
    brandName: '山特维克',
    handleType: 'BT30',
    specification: 'BT30-ER20-80',
    locCapacity: 50,
    locSurplus: 42,
    stockStatus: 1,
    price: 195.00,
    warehouseInTime: '2024-12-26 09:00:00',
    updateTime: '2024-12-26 14:20:00'
  },
  {
    id: 3,
    cabinetCode: 'HC002',
    stockLoc: 'B02-01',
    locPrefix: 'B',
    brandName: '肯纳',
    handleType: 'HSK-A63',
    specification: 'HSK-A63-ER25-90',
    locCapacity: 30,
    locSurplus: 15,
    stockStatus: 1,
    price: 420.00,
    warehouseInTime: '2024-12-26 10:00:00',
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



// 预警设置
const handleAlarmSettings = () => {
  ElMessage.info('预警设置功能开发中...')
}



// 组件挂载时初始化
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
