<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="还刀码" prop="borrowCode">
        <el-input
          v-model="queryParams.borrowCode"
          placeholder="请输入还刀码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="刀柜编码" prop="cabinetCode">
        <el-input
          v-model="queryParams.cabinetCode"
          placeholder="请输入刀柜编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="刀柜库位号" prop="stockLoc">
        <el-input
          v-model="queryParams.stockLoc"
          placeholder="请输入刀柜库位号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv" style="margin-top: 20px; margin-bottom: 20px;">
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="returnInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="还刀状态" align="center" prop="borrowStatus" width="120">
        <template #default="scope">
          <el-tag :type="getBorrowStatusType(scope.row.borrowStatus)">
            {{ getBorrowStatusText(scope.row.borrowStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="刀柜编码" align="center" prop="cabinetCode" width="150"/>
      <el-table-column label="还刀时间" align="center" prop="borrowTime" width="180"/>
      <el-table-column label="还刀人" align="center" prop="borrowUserName" width="120"/>
      <el-table-column label="品牌名称" align="center" prop="brandName" width="120"/>
      <el-table-column label="刀具型号" align="center" prop="cutterCode" width="150"/>
      <el-table-column label="刀具类型" align="center" prop="cutterType" width="120"/>
      <el-table-column label="取刀时间" align="center" prop="lendTime" width="180"/>
      <el-table-column label="借刀人" align="center" prop="lendUserName" width="120"/>
      <el-table-column label="记录状态" align="center" prop="recordStatus" width="120">
        <template #default="scope">
          <el-tag :type="getRecordStatusType(scope.row.recordStatus)">
            {{ getRecordStatusText(scope.row.recordStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center" prop="specification" width="120"/>
      <el-table-column label="库位号" align="center" prop="stockLoc" width="120"/>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
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
    <el-dialog v-model="detailDialogVisible" title="还刀信息详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="取刀主键">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="还刀状态">
            <el-tag :type="getBorrowStatusType(currentRecord.borrowStatus)">
              {{ getBorrowStatusText(currentRecord.borrowStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="还刀时间">{{ currentRecord.borrowTime }}</el-descriptions-item>
          <el-descriptions-item label="还刀人">{{ currentRecord.borrowUserName }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="取刀时间">{{ currentRecord.lendTime }}</el-descriptions-item>
          <el-descriptions-item label="借刀人">{{ currentRecord.lendUserName }}</el-descriptions-item>
          <el-descriptions-item label="记录状态">
            <el-tag :type="getRecordStatusType(currentRecord.recordStatus)">
              {{ getRecordStatusText(currentRecord.recordStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
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

<script setup name="ReturnInfo">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(true)
const showSearch = ref(true)
const returnInfoList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 查询参数
const queryParams = reactive({
  borrowCode: '',
  cabinetCode: '',
  stockLoc: ''
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const queryRef = ref()

// 模拟数据
const mockReturnInfoData = [
  {
    id: 1,
    borrowStatus: 1,
    cabinetCode: 'CAB20241227001',
    borrowTime: '2024-12-27 14:30:00',
    borrowUserName: '张三',
    brandName: '三菱',
    cutterCode: 'MT001',
    cutterType: '铣刀',
    lendTime: '2024-12-27 08:30:00',
    lendUserName: '李四',
    recordStatus: 1,
    specification: 'Φ10×25×75',
    stockLoc: 'A01'
  },
  {
    id: 2,
    borrowStatus: 2,
    cabinetCode: 'CAB20241227002',
    borrowTime: '2024-12-27 15:45:00',
    borrowUserName: '王五',
    brandName: '京瓷',
    cutterCode: 'KY002',
    cutterType: '钻头',
    lendTime: '2024-12-27 09:15:00',
    lendUserName: '赵六',
    recordStatus: 2,
    specification: 'Φ8×30×80',
    stockLoc: 'B02'
  },
  {
    id: 3,
    borrowStatus: 0,
    cabinetCode: 'CAB20241227003',
    borrowTime: '2024-12-27 16:20:00',
    borrowUserName: '孙七',
    brandName: '住友',
    cutterCode: 'SU003',
    cutterType: '车刀',
    lendTime: '2024-12-27 10:00:00',
    lendUserName: '周八',
    recordStatus: 0,
    specification: 'CNMG120408',
    stockLoc: 'C03'
  },
  {
    id: 4,
    borrowStatus: 3,
    cabinetCode: 'CAB20241227001',
    borrowTime: '2024-12-27 17:10:00',
    borrowUserName: '吴九',
    brandName: '山特维克',
    cutterCode: 'SV004',
    cutterType: '铣刀',
    lendTime: '2024-12-27 11:30:00',
    lendUserName: '郑十',
    recordStatus: 3,
    specification: 'Φ12×30×100',
    stockLoc: 'A04'
  },
  {
    id: 5,
    borrowStatus: 1,
    cabinetCode: 'CAB20241227002',
    borrowTime: '2024-12-27 18:00:00',
    borrowUserName: '陈一',
    brandName: '伊斯卡',
    cutterCode: 'IS005',
    cutterType: '钻头',
    lendTime: '2024-12-27 12:45:00',
    lendUserName: '刘二',
    recordStatus: 1,
    specification: 'Φ6×25×70',
    stockLoc: 'B05'
  }
]

// 获取还刀状态类型
const getBorrowStatusType = (status) => {
  const statusMap = {
    0: 'info',    // 修磨
    1: 'success', // 报废
    2: 'warning', // 换线
    3: 'danger'   // 错领
  }
  return statusMap[status] || 'info'
}

// 获取还刀状态文本
const getBorrowStatusText = (status) => {
  const statusMap = {
    0: '修磨',
    1: '报废',
    2: '换线',
    3: '错领'
  }
  return statusMap[status] || '未知'
}

// 获取记录状态类型
const getRecordStatusType = (status) => {
  const statusMap = {
    0: 'info',    // 取刀
    1: 'success', // 还刀
    2: 'warning', // 收刀
    3: 'danger'   // 暂存
  }
  return statusMap[status] || 'info'
}

// 获取记录状态文本
const getRecordStatusText = (status) => {
  const statusMap = {
    0: '取刀',
    1: '还刀',
    2: '收刀',
    3: '暂存'
  }
  return statusMap[status] || '未知'
}

// 查询列表数据
const getList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟分页和搜索
    let filteredData = [...mockReturnInfoData]
    
    // 搜索过滤
    if (queryParams.borrowCode) {
      filteredData = filteredData.filter(item => 
        item.id.toString().includes(queryParams.borrowCode)
      )
    }
    if (queryParams.cabinetCode) {
      filteredData = filteredData.filter(item => 
        item.cabinetCode.includes(queryParams.cabinetCode)
      )
    }
    if (queryParams.stockLoc) {
      filteredData = filteredData.filter(item => 
        item.stockLoc.includes(queryParams.stockLoc)
      )
    }
    
    // 分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    returnInfoList.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

// 搜索
const handleQuery = () => {
  pagination.current = 1
  getList()
}

// 重置搜索
const resetQuery = () => {
  queryRef.value?.resetFields()
  handleQuery()
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 详情
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 导出
const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  // 实际导出逻辑
  console.log('导出数据:', selectedRows.value)
  ElMessage.success('导出成功')
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
}

.detail-content {
  margin-top: 20px;
}

.paginationDiv {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
