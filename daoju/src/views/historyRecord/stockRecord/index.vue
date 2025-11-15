<template>
  <div class="container">
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
        <el-table-column prop="id" label="记录ID" align="center" width="80"/>
        <el-table-column prop="account" label="用户名" align="center" width="100"/>
        <el-table-column prop="name" label="用户名称" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="brandCode" label="品牌编码" align="center" width="120"/>
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
        <el-table-column prop="stockType" label="库存类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.stockType === 0 ? 'success' : 'warning'">
              {{ scope.row.stockType === 0 ? '入库' : '出库' }}
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
          <el-descriptions-item label="记录ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentRecord.account }}</el-descriptions-item>
          <el-descriptions-item label="用户名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentRecord.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="耗材主键">{{ currentRecord.cutterId }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ currentRecord.price ? currentRecord.price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="历史单价">{{ currentRecord.oldPrice ? currentRecord.oldPrice.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="库存类型">
            <el-tag :type="currentRecord.stockType === 0 ? 'success' : 'warning'">
              {{ currentRecord.stockType === 0 ? '入库' : '出库' }}
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
          <el-descriptions-item label="操作详情编码">{{ currentRecord.detailsCode }}</el-descriptions-item>
          <el-descriptions-item label="操作详情名称">{{ currentRecord.detailsName }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRecord.operator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2" v-if="currentRecord.remake">{{ currentRecord.remake }}</el-descriptions-item>
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
import { getStockRecordList, exportStockRecord, getStockRecordDetail } from '@/api/historyRecord/stockRecord'
import { saveAs } from 'file-saver'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 搜索表单（与后端接口参数完全匹配）
const searchForm = reactive({
  current: 1,
  size: 10,
  startTime: '',
  endTime: '',
  recordStatus: null,
  rankingType: null,
  order: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const searchFormRef = ref()

// 模拟数据（与后端出参字段完全匹配）
const mockData = [
  {
    id: 1,
    account: 'zhangsan',
    name: '张三',
    brandCode: 'BRAND001',
    brandName: '三菱',
    cabinetCode: 'CAB001',
    cabinetName: '第一车间刀具柜A',
    createTime: '2024-12-27 08:30:00',
    cutterCode: 'APMT1135PDER-M2',
    cutterId: 2001,
    cutterType: '车刀片',
    detailsCode: 'DET001',
    detailsName: '正常入库操作',
    factoryName: '主工厂',
    oldPrice: 120.00,
    operator: '张三',
    price: 125.50,
    quantity: 10,
    remake: '批量入库',
    specification: 'APMT1135PDER-M2',
    status: 1,
    stockLoc: 'A01-001',
    stockType: 0,
    updateTime: '2024-12-27 08:35:00',
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
    createTime: '2024-12-27 09:15:00',
    cutterCode: 'DCMT11T304-HQ',
    cutterId: 2002,
    cutterType: '铣刀',
    detailsCode: 'DET002',
    detailsName: '工具领用出库',
    factoryName: '主工厂',
    oldPrice: 85.00,
    operator: '李四',
    price: 89.30,
    quantity: 5,
    remake: '正常领用',
    specification: 'DCMT11T304-HQ',
    status: 2,
    stockLoc: 'B02-015',
    stockType: 1,
    updateTime: '2024-12-27 09:20:00',
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
    createTime: '2024-12-27 10:45:00',
    cutterCode: 'CNMG120408-PM',
    cutterId: 2003,
    cutterType: '钻头',
    detailsCode: 'DET003',
    detailsName: '新品入库',
    factoryName: '主工厂',
    oldPrice: 150.00,
    operator: '王五',
    price: 156.80,
    quantity: 8,
    remake: '新采购入库',
    specification: 'CNMG120408-PM',
    status: 1,
    stockLoc: 'C03-008',
    stockType: 0,
    updateTime: '2024-12-27 10:50:00',
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
    createTime: '2024-12-26 17:20:00',
    cutterCode: 'WNMG080408-MS3',
    cutterId: 2004,
    cutterType: '车刀片',
    detailsCode: 'DET004',
    detailsName: '工具归还入库',
    factoryName: '主工厂',
    oldPrice: 95.00,
    operator: '赵六',
    price: 98.60,
    quantity: 3,
    remake: '使用完毕归还',
    specification: 'WNMG080408-MS3',
    status: 4,
    stockLoc: 'D04-012',
    stockType: 0,
    updateTime: '2024-12-26 17:25:00',
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
    createTime: '2024-12-25 15:45:00',
    cutterCode: 'ADKT1505PDR-HM',
    cutterId: 2005,
    cutterType: '铣刀',
    detailsCode: 'DET005',
    detailsName: '异常出库处理',
    factoryName: '主工厂',
    oldPrice: 230.00,
    operator: '孙七',
    price: 234.90,
    quantity: 2,
    remake: '刀具损坏处理',
    specification: 'ADKT1505PDR-HM',
    status: 5,
    stockLoc: 'E05-020',
    stockType: 1,
    updateTime: '2024-12-25 15:50:00',
    workshopName: '第二车间'
  }
]

// 生命周期
onMounted(() => {
  getList()
})

// 方法
const getList = async () => {
  loading.value = true
  
  try {
    // 构建查询参数（与后端接口完全匹配）
    const params = {
      current: searchForm.current,
      size: searchForm.size,
      startTime: searchForm.startTime || undefined,    // 空字符串转为 undefined
      endTime: searchForm.endTime || undefined,
      recordStatus: searchForm.recordStatus !== null ? searchForm.recordStatus : undefined,
      rankingType: searchForm.rankingType !== null ? searchForm.rankingType : undefined,
      order: searchForm.order !== null ? searchForm.order : undefined
    }
    
    console.log('请求参数:', params)
    
    // 调用API获取数据
    const response = await getStockRecordList(params)
    
    console.log('后端响应:', response)
    
    // 处理响应数据（统一响应格式）
    if (response.code === 200 && response.success) {
      // data中包含分页数据：current, size, total, pages, records
      const { current, size, total, pages, records } = response.data || {}
      
      // 更新表格数据
      tableData.value = records || []
      
      // 更新分页信息
      pagination.current = current || 1
      pagination.size = size || 10
      pagination.total = total || 0
      
      // 同步到搜索表单
      searchForm.current = current || 1
      searchForm.size = size || 10
      
      console.log(`分页信息: 当前页=${current}, 每页${size}条, 总数=${total}, 总页数=${pages}`)
      console.log('表格数据:', records)
      
      ElMessage.success(`成功获取${records?.length || 0}条数据`)
    } else {
      ElMessage.error(response.msg || '获取数据失败')
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  // 同步分页参数到搜索表单
  searchForm.current = pagination.current
  searchForm.size = pagination.size
  getList()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    current: 1,
    size: 10,
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
  searchForm.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  searchForm.current = current
  getList()
}

const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const handleExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  try {
    loading.value = true
    
    // 构建导出参数（与后端接口完全匹配）
    const exportParams = {
      startTime: searchForm.startTime || undefined,
      endTime: searchForm.endTime || undefined,
      recordStatus: searchForm.recordStatus !== null ? searchForm.recordStatus : undefined,
      rankingType: searchForm.rankingType !== null ? searchForm.rankingType : undefined,
      order: searchForm.order !== null ? searchForm.order : undefined
    }
    
    console.log('导出参数:', exportParams)
    
    const response = await exportStockRecord(exportParams)
    
    console.log('导出响应:', response)
    
    // 获取文件名
    const fileName = `出入库记录_${new Date().getTime()}.xlsx`
    
    // 下载文件
    saveAs(new Blob([response]), fileName)
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  } finally {
    loading.value = false
  }
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
