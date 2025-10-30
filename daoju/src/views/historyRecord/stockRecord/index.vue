<template>
  <div class="container">
    <!-- <div>出入库统计</div> -->
    
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

    <!-- 中部表格显示出入库记录 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="account" label="用户名" align="center" width="100"/>
        <el-table-column prop="name" label="用户名称" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="specification" label="规格" align="center" width="120"/>
        <el-table-column prop="quantity" label="数量" align="center" width="80"/>
        <el-table-column prop="price" label="单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oldPrice" label="历史单价(元)" align="center" width="120">
          <template #default="scope">
            <span>{{ scope.row.oldPrice ? scope.row.oldPrice.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
        <el-table-column prop="stocktype" label="库存类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.stocktype === 0 ? 'success' : 'warning'">
              {{ scope.row.stocktype === 0 ? '入库' : '出库' }}
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
        <el-table-column prop="cabinetName" label="刀具柜名称" align="center" width="150"/>
        <el-table-column prop="factoryName" label="工厂名称" align="center" width="120"/>
        <el-table-column prop="workshopName" label="车间名称" align="center" width="120"/>
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
    <el-dialog v-model="detailDialogVisible" title="出入库记录详情" width="800px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ currentRecord.account }}</el-descriptions-item>
          <el-descriptions-item label="用户名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentRecord.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ currentRecord.price ? currentRecord.price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="历史单价">{{ currentRecord.oldPrice ? currentRecord.oldPrice.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="库存类型">
            <el-tag :type="currentRecord.stocktype === 0 ? 'success' : 'warning'">
              {{ currentRecord.stocktype === 0 ? '入库' : '出库' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="getStatusTagType(currentRecord.status)">
              {{ getStatusText(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀具柜名称">{{ currentRecord.cabinetName }}</el-descriptions-item>
          <el-descriptions-item label="刀具柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="工厂名称">{{ currentRecord.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="车间名称">{{ currentRecord.workshopName }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRecord.operator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="操作详情">{{ currentRecord.detailsName }}</el-descriptions-item>
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

<script setup name="StockRecord">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getStockRecordList, exportStockRecord } from '@/api/historyRecord/stockRecord'

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
  current: 1,
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
    id: 1,
    account: 'zhangsan',
    name: '张三',
    brandCode: 'BRAND001',
    brandName: '三菱',
    cabinetCode: 'CAB001',
    cabinetName: '第一车间刀具柜A',
    createDept: 1,
    createTime: '2024-12-27 08:30:00',
    createUser: 1001,
    cutterCode: 'APMT1135PDER-M2',
    cutterId: 2001,
    cutterType: '车刀片',
    detailsCode: 'DET001',
    detailsName: '正常入库操作',
    factoryName: '主工厂',
    isDeleted: 0,
    oldPrice: 120.00,
    operator: '张三',
    price: 125.50,
    quantity: 10,
    remake: '批量入库',
    specification: 'APMT1135PDER-M2',
    status: 1,
    stockLoc: 'A01-001',
    stocktype: 0,
    tenantId: 'T001',
    updateTime: '2024-12-27 08:35:00',
    updateUser: 1001,
    workshopName: '第一车间'
  },
  {
    id: 2,
    account: 'lisi',
    name: '李四',
    brandCode: 'BRAND002',
    brandName: '京瓷',
    cabinetCode: 'CAB002',
    cabinetName: '第二车间刀具柜B',
    createDept: 2,
    createTime: '2024-12-27 09:15:00',
    createUser: 1002,
    cutterCode: 'DCMT11T304-HQ',
    cutterId: 2002,
    cutterType: '铣刀',
    detailsCode: 'DET002',
    detailsName: '工具领用出库',
    factoryName: '主工厂',
    isDeleted: 0,
    oldPrice: 85.00,
    operator: '李四',
    price: 89.30,
    quantity: 5,
    remake: '正常领用',
    specification: 'DCMT11T304-HQ',
    status: 2,
    stockLoc: 'B02-015',
    stocktype: 1,
    tenantId: 'T001',
    updateTime: '2024-12-27 09:20:00',
    updateUser: 1002,
    workshopName: '第二车间'
  },
  {
    id: 3,
    account: 'wangwu',
    name: '王五',
    brandCode: 'BRAND003',
    brandName: '山特维克',
    cabinetCode: 'CAB001',
    cabinetName: '第一车间刀具柜A',
    createDept: 1,
    createTime: '2024-12-27 10:45:00',
    createUser: 1003,
    cutterCode: 'CNMG120408-PM',
    cutterId: 2003,
    cutterType: '钻头',
    detailsCode: 'DET003',
    detailsName: '新品入库',
    factoryName: '主工厂',
    isDeleted: 0,
    oldPrice: 150.00,
    operator: '王五',
    price: 156.80,
    quantity: 8,
    remake: '新采购入库',
    specification: 'CNMG120408-PM',
    status: 1,
    stockLoc: 'C03-008',
    stocktype: 0,
    tenantId: 'T001',
    updateTime: '2024-12-27 10:50:00',
    updateUser: 1003,
    workshopName: '第一车间'
  },
  {
    id: 4,
    account: 'zhaoliu',
    name: '赵六',
    brandCode: 'BRAND004',
    brandName: '瓦尔特',
    cabinetCode: 'CAB003',
    cabinetName: '第三车间刀具柜C',
    createDept: 3,
    createTime: '2024-12-26 17:20:00',
    createUser: 1004,
    cutterCode: 'WNMG080408-MS3',
    cutterId: 2004,
    cutterType: '车刀片',
    detailsCode: 'DET004',
    detailsName: '工具归还入库',
    factoryName: '主工厂',
    isDeleted: 0,
    oldPrice: 95.00,
    operator: '赵六',
    price: 98.60,
    quantity: 3,
    remake: '使用完毕归还',
    specification: 'WNMG080408-MS3',
    status: 4,
    stockLoc: 'D04-012',
    stocktype: 0,
    tenantId: 'T001',
    updateTime: '2024-12-26 17:25:00',
    updateUser: 1004,
    workshopName: '第三车间'
  },
  {
    id: 5,
    account: 'sunqi',
    name: '孙七',
    brandCode: 'BRAND005',
    brandName: '伊斯卡',
    cabinetCode: 'CAB002',
    cabinetName: '第二车间刀具柜B',
    createDept: 2,
    createTime: '2024-12-25 15:45:00',
    createUser: 1005,
    cutterCode: 'ADKT1505PDR-HM',
    cutterId: 2005,
    cutterType: '铣刀',
    detailsCode: 'DET005',
    detailsName: '异常出库处理',
    factoryName: '主工厂',
    isDeleted: 0,
    oldPrice: 230.00,
    operator: '孙七',
    price: 234.90,
    quantity: 2,
    remake: '刀具损坏处理',
    specification: 'ADKT1505PDR-HM',
    status: 5,
    stockLoc: 'E05-020',
    stocktype: 1,
    tenantId: 'T001',
    updateTime: '2024-12-25 15:50:00',
    updateUser: 1005,
    workshopName: '第二车间'
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
