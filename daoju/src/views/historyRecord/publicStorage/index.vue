<template>
  <div class="container">
    <div>历史记录 - 公共暂存</div>
    
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

    <!-- 中部表格显示公共暂存记录 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="lendUserName" label="取出人" align="center" width="100"/>
        <el-table-column prop="storageUserName" label="暂存人" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="specification" label="规格" align="center" width="120"/>
        <el-table-column prop="quantity" label="数量" align="center" width="80"/>
        <el-table-column prop="oldPrice" label="老单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.oldPrice ? scope.row.oldPrice.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="newPrice" label="新单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.newPrice ? scope.row.newPrice.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oldStockNum" label="操作前库存数" align="center" width="120"/>
        <el-table-column prop="newStockNum" label="操作后库存数" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
        <el-table-column prop="logStatus" label="日志类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getLogStatusTagType(scope.row.logStatus)">
              {{ getLogStatusText(scope.row.logStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="业务状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="160"/>
        <el-table-column prop="operator" label="操作人" align="center" width="100"/>
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
    <el-dialog v-model="detailDialogVisible" title="公共暂存记录详情" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="取出人">{{ currentRecord.lendUserName }}</el-descriptions-item>
          <el-descriptions-item label="暂存人">{{ currentRecord.storageUserName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentRecord.materialCode }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="老单价">{{ currentRecord.oldPrice ? currentRecord.oldPrice.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="新单价">{{ currentRecord.newPrice ? currentRecord.newPrice.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="操作前库存数">{{ currentRecord.oldStockNum }}</el-descriptions-item>
          <el-descriptions-item label="操作后库存数">{{ currentRecord.newStockNum }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="日志类型">
            <el-tag :type="getLogStatusTagType(currentRecord.logStatus)">
              {{ getLogStatusText(currentRecord.logStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="getStatusTagType(currentRecord.status)">
              {{ getStatusText(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRecord.operator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="操作详情">{{ currentRecord.detailsCode }}</el-descriptions-item>
          <el-descriptions-item label="备注" v-if="currentRecord.remake">{{ currentRecord.remake }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="是否删除">
            <el-tag :type="currentRecord.isDeleted === 0 ? 'success' : 'danger'">
              {{ currentRecord.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </el-descriptions-item>
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

<script setup name="PublicStorage">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getPublicStorageList, exportPublicStorage } from '@/api/historyRecord/publicStorage'

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
  order: null,
  size: 20
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
    brandName: '三菱',
    cabinetCode: 'CAB001',
    createDept: 1,
    createTime: '2024-12-27 08:30:00',
    createUser: 1001,
    cutterCode: 'APMT1135PDER-M2',
    detailsCode: '公共暂存-临时存放',
    isDeleted: 0,
    lendUserName: '张三',
    logStatus: 1,
    materialCode: 'MAT001',
    newPrice: 125.50,
    newStockNum: 15,
    oldPrice: 120.00,
    oldStockNum: 10,
    operator: '暂存管理员',
    quantity: 5,
    remake: '临时暂存，等待分配',
    specification: 'APMT1135PDER-M2',
    status: 3,
    stockLoc: 'TEMP-001',
    storageUserName: '李四',
    tenantId: 'T001',
    updateTime: '2024-12-27 08:35:00',
    updateUser: 1001
  },
  {
    brandName: '京瓷',
    cabinetCode: 'CAB002',
    createDept: 2,
    createTime: '2024-12-27 09:15:00',
    createUser: 1002,
    cutterCode: 'DCMT11T304-HQ',
    detailsCode: '公共暂存-待检验',
    isDeleted: 0,
    lendUserName: '李四',
    logStatus: 1,
    materialCode: 'MAT002',
    newPrice: 89.30,
    newStockNum: 8,
    oldPrice: 85.00,
    oldStockNum: 12,
    operator: '质检员',
    quantity: 4,
    remake: '质量检验中，暂存等待',
    specification: 'DCMT11T304-HQ',
    status: 3,
    stockLoc: 'TEMP-002',
    storageUserName: '王五',
    tenantId: 'T001',
    updateTime: '2024-12-27 09:20:00',
    updateUser: 1002
  },
  {
    brandName: '山特维克',
    cabinetCode: 'CAB001',
    createDept: 1,
    createTime: '2024-12-27 10:45:00',
    createUser: 1003,
    cutterCode: 'CNMG120408-PM',
    detailsCode: '公共暂存-维修中',
    isDeleted: 0,
    lendUserName: '王五',
    logStatus: 1,
    materialCode: 'MAT003',
    newPrice: 156.80,
    newStockNum: 20,
    oldPrice: 150.00,
    oldStockNum: 18,
    operator: '维修技师',
    quantity: 2,
    remake: '刀具维修中，暂存处理',
    specification: 'CNMG120408-PM',
    status: 3,
    stockLoc: 'TEMP-003',
    storageUserName: '赵六',
    tenantId: 'T001',
    updateTime: '2024-12-27 10:50:00',
    updateUser: 1003
  },
  {
    brandName: '瓦尔特',
    cabinetCode: 'CAB003',
    createDept: 3,
    createTime: '2024-12-26 17:20:00',
    createUser: 1004,
    cutterCode: 'WNMG080408-MS3',
    detailsCode: '公共暂存-等待归还',
    isDeleted: 0,
    lendUserName: '赵六',
    logStatus: 1,
    materialCode: 'MAT004',
    newPrice: 98.60,
    newStockNum: 12,
    oldPrice: 95.00,
    oldStockNum: 9,
    operator: '库管员',
    quantity: 3,
    remake: '使用完毕，等待归还入库',
    specification: 'WNMG080408-MS3',
    status: 3,
    stockLoc: 'TEMP-004',
    storageUserName: '孙七',
    tenantId: 'T001',
    updateTime: '2024-12-26 17:25:00',
    updateUser: 1004
  },
  {
    brandName: '伊斯卡',
    cabinetCode: 'CAB002',
    createDept: 2,
    createTime: '2024-12-25 15:45:00',
    createUser: 1005,
    cutterCode: 'ADKT1505PDR-HM',
    detailsCode: '公共暂存-异常处理',
    isDeleted: 0,
    lendUserName: '孙七',
    logStatus: 1,
    materialCode: 'MAT005',
    newPrice: 234.90,
    newStockNum: 5,
    oldPrice: 230.00,
    oldStockNum: 7,
    operator: '异常处理员',
    quantity: 2,
    remake: '异常情况处理，暂存观察',
    specification: 'ADKT1505PDR-HM',
    status: 3,
    stockLoc: 'TEMP-005',
    storageUserName: '管理员',
    tenantId: 'T001',
    updateTime: '2024-12-25 15:50:00',
    updateUser: 1005
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
      filteredData = filteredData.filter(item => item.status === searchForm.recordStatus)
    }
    
    // 根据时间范围过滤
    if (searchForm.startTime) {
      filteredData = filteredData.filter(item => item.createTime >= searchForm.startTime)
    }
    if (searchForm.endTime) {
      filteredData = filteredData.filter(item => item.createTime <= searchForm.endTime)
    }
    
    // 排序
    if (searchForm.rankingType !== null && searchForm.order !== null) {
      filteredData.sort((a, b) => {
        let valueA, valueB
        if (searchForm.rankingType === 0) {
          // 按数量排序
          valueA = a.quantity
          valueB = b.quantity
        } else {
          // 按金额排序
          valueA = a.newPrice
          valueB = b.newPrice
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

const getLogStatusText = (logStatus) => {
  const statusMap = {
    0: '操作日志',
    1: '公共暂存',
    2: '补货'
  }
  return statusMap[logStatus] || '未知'
}

const getLogStatusTagType = (logStatus) => {
  const typeMap = {
    0: 'primary',
    1: 'warning',
    2: 'success'
  }
  return typeMap[logStatus] || 'info'
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
