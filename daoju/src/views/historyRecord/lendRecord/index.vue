<template>
  <div class="container">
    <!-- <div>领用领出记录</div> -->
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="开始时间:" prop="startTime">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item label="记录状态:" prop="recordStatus">
          <el-select v-model="searchForm.recordStatus" placeholder="请选择记录状态" clearable>
            <el-option label="取刀" :value="0"/>
            <el-option label="还刀" :value="1"/>
            <el-option label="收刀" :value="2"/>
            <el-option label="暂存" :value="3"/>
            <el-option label="完成" :value="4"/>
            <el-option label="违规还刀" :value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序类型:" prop="rankingType">
          <el-select v-model="searchForm.rankingType" placeholder="请选择排序类型" clearable>
            <el-option label="数量" :value="0"/>
            <el-option label="金额" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式:" prop="order">
          <el-select v-model="searchForm.order" placeholder="请选择排序方式" clearable>
            <el-option label="从大到小" :value="0"/>
            <el-option label="从小到大" :value="1"/>
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
      <el-button type="success" icon="download" @click="handleExport">导出记录</el-button>
    </div>

    <!-- 中部表格显示领刀记录 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="lendUserName" label="取刀人" align="center" width="100"/>
        <el-table-column prop="borrowUserName" label="还刀人" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="specification" label="规格" align="center" width="120"/>
        <el-table-column prop="price" label="单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lendStock" label="借刀库位号" align="center" width="120"/>
        <el-table-column prop="borrowStock" label="还刀库位号" align="center" width="120"/>
        <el-table-column prop="lendTime" label="借时间" align="center" width="160"/>
        <el-table-column prop="borrowTime" label="还刀时间" align="center" width="160"/>
        <el-table-column prop="recordStatus" label="记录状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.recordStatus)">
              {{ getStatusText(scope.row.recordStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="borrowStatus" label="还刀状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getBorrowStatusTagType(scope.row.borrowStatus)" v-if="scope.row.borrowStatus !== null">
              {{ getBorrowStatusText(scope.row.borrowStatus) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="finalCollectStatus" label="最终确认" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.finalCollectStatus === 0 ? 'success' : 'danger'" v-if="scope.row.finalCollectStatus !== null">
              {{ scope.row.finalCollectStatus === 0 ? '通过' : '未通过' }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="view">详情</el-button>
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
    <el-dialog v-model="detailDialogVisible" title="领刀记录详情" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="取刀人">{{ currentRecord.lendUserName }}</el-descriptions-item>
          <el-descriptions-item label="还刀人">{{ currentRecord.borrowUserName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentRecord.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentRecord.materialCode }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ currentRecord.price ? currentRecord.price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="借刀库位号">{{ currentRecord.lendStock }}</el-descriptions-item>
          <el-descriptions-item label="还刀库位号">{{ currentRecord.borrowStock || '-' }}</el-descriptions-item>
          <el-descriptions-item label="借时间">{{ currentRecord.lendTime }}</el-descriptions-item>
          <el-descriptions-item label="还刀时间">{{ currentRecord.borrowTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="记录状态">
            <el-tag :type="getStatusTagType(currentRecord.recordStatus)">
              {{ getStatusText(currentRecord.recordStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="还刀状态" v-if="currentRecord.borrowStatus !== null">
            <el-tag :type="getBorrowStatusTagType(currentRecord.borrowStatus)">
              {{ getBorrowStatusText(currentRecord.borrowStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最终确认状态" v-if="currentRecord.finalCollectStatus !== null">
            <el-tag :type="currentRecord.finalCollectStatus === 0 ? 'success' : 'danger'">
              {{ currentRecord.finalCollectStatus === 0 ? '通过' : '未通过' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最终确认时间" v-if="currentRecord.finalCollectTime">{{ currentRecord.finalCollectTime }}</el-descriptions-item>
          <el-descriptions-item label="还刀备注" v-if="currentRecord.borrowRemarks">{{ currentRecord.borrowRemarks }}</el-descriptions-item>
          <el-descriptions-item label="最终确认结果" v-if="currentRecord.finalCollectRemarks">{{ currentRecord.finalCollectRemarks }}</el-descriptions-item>
          <el-descriptions-item label="管理员确认结果" v-if="currentRecord.collectStatus">{{ currentRecord.collectStatus }}</el-descriptions-item>
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

<script setup name="LendRecord">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getLendRecordList, exportLendRecord } from '@/api/historyRecord/lendRecord'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 搜索表单
const searchForm = reactive({
  startTime: '',
  endTime: '',
  recordStatus: null,
  rankingType: null,
  order: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const searchFormRef = ref()

// 模拟数据
const mockData = [
  {
    lendUser: 1001,
    lendUserName: '张三',
    borrowUserName: '张三',
    brandCode: 'BRAND001',
    brandName: '三菱',
    cabinetCode: 'CAB001',
    collectStatus: '管理员已确认',
    cutterCode: 'APMT1135PDER-M2',
    cutterType: '车刀片',
    finalCollectRemarks: '刀具状态良好',
    finalCollectStatus: 0,
    finalCollectTime: '2024-12-27 16:30:00',
    lendStock: 'A01-001',
    lendTime: '2024-12-27 08:30:00',
    materialCode: 'MAT001',
    price: 125.50,
    recordStatus: 4,
    specification: 'APMT1135PDER-M2',
    borrowRemarks: '正常使用完毕',
    borrowStatus: 0,
    borrowStock: 'A01-001',
    borrowTime: '2024-12-27 16:00:00'
  },
  {
    lendUser: 1002,
    lendUserName: '李四',
    borrowUserName: '李四',
    brandCode: 'BRAND002',
    brandName: '京瓷',
    cabinetCode: 'CAB002',
    collectStatus: '待管理员确认',
    cutterCode: 'DCMT11T304-HQ',
    cutterType: '铣刀',
    finalCollectRemarks: '',
    finalCollectStatus: null,
    finalCollectTime: '',
    lendStock: 'B02-015',
    lendTime: '2024-12-27 09:15:00',
    materialCode: 'MAT002',
    price: 89.30,
    recordStatus: 1,
    specification: 'DCMT11T304-HQ',
    borrowRemarks: '',
    borrowStatus: null,
    borrowStock: '',
    borrowTime: ''
  },
  {
    lendUser: 1003,
    lendUserName: '王五',
    borrowUserName: '',
    brandCode: 'BRAND003',
    brandName: '山特维克',
    cabinetCode: 'CAB001',
    collectStatus: '',
    cutterCode: 'CNMG120408-PM',
    cutterType: '钻头',
    finalCollectRemarks: '',
    finalCollectStatus: null,
    finalCollectTime: '',
    lendStock: 'C03-008',
    lendTime: '2024-12-27 10:45:00',
    materialCode: 'MAT003',
    price: 156.80,
    recordStatus: 0,
    specification: 'CNMG120408-PM',
    borrowRemarks: '',
    borrowStatus: null,
    borrowStock: '',
    borrowTime: ''
  },
  {
    lendUser: 1004,
    lendUserName: '赵六',
    borrowUserName: '赵六',
    brandCode: 'BRAND004',
    brandName: '瓦尔特',
    cabinetCode: 'CAB003',
    collectStatus: '管理员已确认',
    cutterCode: 'WNMG080408-MS3',
    cutterType: '车刀片',
    finalCollectRemarks: '刀具有轻微磨损',
    finalCollectStatus: 0,
    finalCollectTime: '2024-12-26 17:20:00',
    lendStock: 'D04-012',
    lendTime: '2024-12-26 07:30:00',
    materialCode: 'MAT004',
    price: 98.60,
    recordStatus: 4,
    specification: 'WNMG080408-MS3',
    borrowRemarks: '使用过程中有轻微磨损',
    borrowStatus: 0,
    borrowStock: 'D04-012',
    borrowTime: '2024-12-26 17:00:00'
  },
  {
    lendUser: 1005,
    lendUserName: '孙七',
    borrowUserName: '孙七',
    brandCode: 'BRAND005',
    brandName: '伊斯卡',
    cabinetCode: 'CAB002',
    collectStatus: '违规操作',
    cutterCode: 'ADKT1505PDR-HM',
    cutterType: '铣刀',
    finalCollectRemarks: '刀具损坏严重，违规操作',
    finalCollectStatus: 1,
    finalCollectTime: '2024-12-25 15:45:00',
    lendStock: 'E05-020',
    lendTime: '2024-12-25 08:00:00',
    materialCode: 'MAT005',
    price: 234.90,
    recordStatus: 5,
    specification: 'ADKT1505PDR-HM',
    borrowRemarks: '刀具在使用过程中损坏',
    borrowStatus: 1,
    borrowStock: 'E05-020',
    borrowTime: '2024-12-25 15:30:00'
  }
]

// 生命周期
onMounted(() => {
  getList()
})

// 方法
const getList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 这里可以根据搜索条件过滤数据
    let filteredData = [...mockData]
    
    // 根据recordStatus过滤
    if (searchForm.recordStatus !== null) {
      filteredData = filteredData.filter(item => item.recordStatus === searchForm.recordStatus)
    }
    
    // 根据时间范围过滤
    if (searchForm.startTime) {
      filteredData = filteredData.filter(item => item.lendTime >= searchForm.startTime)
    }
    if (searchForm.endTime) {
      filteredData = filteredData.filter(item => item.lendTime <= searchForm.endTime)
    }
    
    // 排序
    if (searchForm.rankingType !== null && searchForm.order !== null) {
      filteredData.sort((a, b) => {
        let valueA, valueB
        if (searchForm.rankingType === 0) {
          // 按数量排序（这里用recordStatus代替）
          valueA = a.recordStatus
          valueB = b.recordStatus
        } else {
          // 按金额排序
          valueA = a.price
          valueB = b.price
        }
        
        if (searchForm.order === 0) {
          // 从大到小
          return valueB - valueA
        } else {
          // 从小到大
          return valueA - valueB
        }
      })
    }
    
    tableData.value = filteredData
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.current = 1
  getList()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    startTime: '',
    endTime: '',
    recordStatus: null,
    rankingType: null,
    order: null
  })
  nextTick(() => {
    searchFormRef.value?.clearValidate()
  })
  getList()
}

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

const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  // 实际导出逻辑
  console.log('导出数据:', selectedRows.value)
}

// 状态文本和样式
const getStatusText = (status) => {
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

const getStatusTagType = (status) => {
  const typeMap = {
    0: 'primary',
    1: 'warning',
    2: 'info',
    3: 'warning',
    4: 'success',
    5: 'danger'
  }
  return typeMap[status] || 'info'
}

const getBorrowStatusText = (status) => {
  const statusMap = {
    0: '修磨',
    1: '报废',
    2: '换线',
    3: '错领'
  }
  return statusMap[status] || '未知'
}

const getBorrowStatusTagType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'danger',
    2: 'warning',
    3: 'warning'
  }
  return typeMap[status] || 'info'
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.topSearchDiv {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.buttonDiv {
  margin-bottom: 20px;
}

.tableDiv {
  margin-bottom: 20px;
}

.paginationDiv {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}
</style>
