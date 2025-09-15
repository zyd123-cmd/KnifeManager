<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          clearable
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          clearable
        />
      </el-form-item>
      <el-form-item label="记录状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择记录状态" clearable>
          <el-option label="取刀" :value="0"/>
          <el-option label="还刀" :value="1"/>
          <el-option label="收刀" :value="2"/>
          <el-option label="暂存" :value="3"/>
          <el-option label="完成" :value="4"/>
          <el-option label="违规还刀" :value="5"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序类型" prop="rankingType">
        <el-select v-model="queryParams.rankingType" placeholder="请选择排序类型" clearable>
          <el-option label="数量" :value="0"/>
          <el-option label="金额" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序顺序" prop="order">
        <el-select v-model="queryParams.order" placeholder="请选择排序顺序" clearable>
          <el-option label="从大到小" :value="0"/>
          <el-option label="从小到大" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv" style="margin-top: 20px; margin-bottom: 20px;">
      <el-button type="primary" icon="data-analysis" @click="handleStatistics">统计</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="unreturnedInfoList" @selection-change="handleSelectionChange">
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
    <el-dialog v-model="detailDialogVisible" title="未还信息详情" width="800px">
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

<script setup name="UnreturnedInfo">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(true)
const showSearch = ref(true)
const unreturnedInfoList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 查询参数
const queryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const queryRef = ref()

// 模拟数据
const mockUnreturnedInfoData = [
  {
    id: 1,
    borrowStatus: 0,
    cabinetCode: 'CAB20241227001',
    borrowTime: '',
    borrowUserName: '',
    brandName: '三菱',
    cutterCode: 'MT001',
    cutterType: '铣刀',
    lendTime: '2024-12-27 08:30:00',
    lendUserName: '李四',
    recordStatus: 0,
    specification: 'Φ10×25×75',
    stockLoc: 'A01'
  },
  {
    id: 2,
    borrowStatus: 0,
    cabinetCode: 'CAB20241227002',
    borrowTime: '',
    borrowUserName: '',
    brandName: '京瓷',
    cutterCode: 'KY002',
    cutterType: '钻头',
    lendTime: '2024-12-27 09:15:00',
    lendUserName: '赵六',
    recordStatus: 0,
    specification: 'Φ8×30×80',
    stockLoc: 'B02'
  },
  {
    id: 3,
    borrowStatus: 0,
    cabinetCode: 'CAB20241227003',
    borrowTime: '',
    borrowUserName: '',
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
    borrowStatus: 0,
    cabinetCode: 'CAB20241227001',
    borrowTime: '',
    borrowUserName: '',
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
    borrowStatus: 0,
    cabinetCode: 'CAB20241227002',
    borrowTime: '',
    borrowUserName: '',
    brandName: '伊斯卡',
    cutterCode: 'IS005',
    cutterType: '钻头',
    lendTime: '2024-12-27 12:45:00',
    lendUserName: '刘二',
    recordStatus: 0,
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
    3: 'danger',  // 暂存
    4: 'success', // 完成
    5: 'danger'   // 违规还刀
  }
  return statusMap[status] || 'info'
}

// 获取记录状态文本
const getRecordStatusText = (status) => {
  const statusMap = {
    0: '取刀',
    1: '还刀',
    2: '收刀',
    3: '暂存',
    4: '完成',
    5: '违规还刀'
  }
  return statusMap[status] || '未知'
}

// 查询列表数据
const getList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟分页和搜索
    let filteredData = [...mockUnreturnedInfoData]
    
    // 搜索过滤
    if (queryParams.recordStatus !== '') {
      filteredData = filteredData.filter(item => 
        item.recordStatus === queryParams.recordStatus
      )
    }
    
    // 排序
    if (queryParams.rankingType !== '' && queryParams.order !== '') {
      filteredData.sort((a, b) => {
        let valueA, valueB
        if (queryParams.rankingType === 0) {
          // 按数量排序（这里用ID模拟）
          valueA = a.id
          valueB = b.id
        } else {
          // 按金额排序（这里用ID*100模拟）
          valueA = a.id * 100
          valueB = b.id * 100
        }
        
        if (queryParams.order === 0) {
          // 从大到小
          return valueB - valueA
        } else {
          // 从小到大
          return valueA - valueB
        }
      })
    }
    
    // 分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    unreturnedInfoList.value = filteredData.slice(start, end)
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

// 统计
const handleStatistics = () => {
  ElMessage.info('统计功能暂未实现')
}

// 导出
const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  ElMessage.info('导出功能暂未实现')
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
