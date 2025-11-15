<template>
  <div class="app-container">
    <!-- 顶部查询条件区域 -->
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
      <el-form-item label="库位号" prop="stockLoc">
        <el-input
          v-model="queryParams.stockLoc"
          placeholder="请输入库位号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" icon="Search">搜索</el-button>
        <el-button @click="resetQuery" icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" icon="Download" @click="handleExport" v-hasPermi="['borrowReturnInfo:returnInfo:export']">导出</el-button>
      </el-col>
    </el-row>

    <!-- 中部表格显示还刀信息 -->
    <el-table 
      v-loading="loading"
      :data="returnInfoList" 
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="borrowStatus" label="还刀状态" align="center" width="120">
        <template #default="scope">
          <el-tag :type="getBorrowStatusType(scope.row.borrowStatus)">
            {{ getBorrowStatusText(scope.row.borrowStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
      <el-table-column prop="borrowTime" label="还刀时间" align="center" width="180"/>
      <el-table-column prop="borrowUserName" label="还刀人" align="center" width="120"/>
      <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
      <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
      <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
      <el-table-column prop="lendTime" label="取刀时间" align="center" width="180"/>
      <el-table-column prop="lendUserName" label="借刀人" align="center" width="120"/>
      <el-table-column prop="recordStatus" label="记录状态" align="center" width="120">
        <template #default="scope">
          <el-tag :type="getRecordStatusType(scope.row.recordStatus)">
            {{ getRecordStatusText(scope.row.recordStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="specification" label="规格" align="center" width="120"/>
      <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)" icon="View">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      v-model:page="queryPageNum"
      v-model:limit="queryPageSize"
      @pagination="getList"
    />

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

<script setup name="RestockRecord">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listReturnInfo, exportReturnInfo } from '@/api/borrowReturnInfo/returnInfo'
import Pagination from '@/components/Pagination'

// 响应式数据
const loading = ref(false)
const showSearch = ref(true)
const returnInfoList = ref([])      // 展开后的还刀详情列表
const returnInfoGroups = ref([])    // 后端返回的分组数据
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)
const queryRef = ref(null)

// 查询参数
const queryParams = reactive({
  borrowCode: '',   // 还刀码
  cabinetCode: '',  // 刀柜编码
  stockLoc: ''      // 库位号
})

// 分页数据
const queryPageNum = ref(1)
const queryPageSize = ref(20)
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 模拟数据（匹配后端收刀柜还刀数据结构）
const mockReturnInfoGroups = [
  {
    borrowStatus: '0',              // 还刀状态（字符串形式）
    cabinetCode: 'CAB20250106001',  // 刀柜编码
    recordStatus: 1,                // 记录状态：0-取刀，1-还刀，2-收刀，3-暂存
    list: [                         // 还刀详情列表
      {
        id: 1,
        borrowStatus: 0,
        borrowTime: '2025-01-06 14:30:00',
        borrowUserName: '张三',
        brandName: '三菱',
        cutterCode: 'MT-D10-001',
        cutterType: '铣刀',
        lendTime: '2025-01-06 08:30:00',
        lendUserName: '李四',
        recordStatus: 1,
        specification: 'Φ10×25×75',
        stockLoc: 'A01-001'
      },
      {
        id: 3,
        borrowStatus: 0,
        borrowTime: '2025-01-06 16:20:00',
        borrowUserName: '孙七',
        brandName: '住友',
        cutterCode: 'SU-C12-003',
        cutterType: '车刀片',
        lendTime: '2025-01-06 10:00:00',
        lendUserName: '周八',
        recordStatus: 1,
        specification: 'CNMG120408',
        stockLoc: 'C03-008'
      }
    ]
  },
  {
    borrowStatus: '1',
    cabinetCode: 'CAB20250106002',
    recordStatus: 2,
    list: [
      {
        id: 2,
        borrowStatus: 1,
        borrowTime: '2025-01-06 15:45:00',
        borrowUserName: '王五',
        brandName: '京瓷',
        cutterCode: 'KY-Z08-002',
        cutterType: '钻头',
        lendTime: '2025-01-06 09:15:00',
        lendUserName: '赵六',
        recordStatus: 2,
        specification: 'Φ8×30×80',
        stockLoc: 'B02-015'
      },
      {
        id: 5,
        borrowStatus: 1,
        borrowTime: '2025-01-06 18:00:00',
        borrowUserName: '陈一',
        brandName: '伊斯卡',
        cutterCode: 'IS-Z06-005',
        cutterType: '钻头',
        lendTime: '2025-01-06 12:45:00',
        lendUserName: '刘二',
        recordStatus: 2,
        specification: 'Φ6×25×70',
        stockLoc: 'B05-020'
      }
    ]
  },
  {
    borrowStatus: '2',
    cabinetCode: 'CAB20250106003',
    recordStatus: 0,
    list: [
      {
        id: 4,
        borrowStatus: 2,
        borrowTime: '2025-01-06 17:10:00',
        borrowUserName: '吴九',
        brandName: '山特维克',
        cutterCode: 'SV-M12-004',
        cutterType: '铣刀',
        lendTime: '2025-01-06 11:30:00',
        lendUserName: '郑十',
        recordStatus: 0,
        specification: 'Φ12×30×100',
        stockLoc: 'A04-012'
      }
    ]
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
      borrowCode: queryParams.borrowCode || undefined,
      cabinetCode: queryParams.cabinetCode || undefined,
      stockLoc: queryParams.stockLoc || undefined
    }
    
    console.log('请求废刀回收统计信息，参数:', params)
    
    // 调用真实API接口
    const response = await listReturnInfo(params)
    
    console.log('后端响应:', response)
    
    // 检查响应状态（WasteKnifeRecycleResponse 统一响应格式）
    if (response.code === 200 && response.success) {
      // data 是单个 ReturnKnifeData 对象，不是数组
      const data = response.data || {}
      
      // 存储单个分组数据（转换为数组格式）
      returnInfoGroups.value = data.list ? [data] : []
      
      // 将分组数据展开为列表（用于表格显示）
      const list = data.list || []
      const expandedList = list.map(item => ({
        ...item,
        cabinetCode: data.cabinetCode,        // 添加刀柜编码
        groupBorrowStatus: data.borrowStatus, // 分组的还刀状态
        groupRecordStatus: data.recordStatus  // 分组的记录状态
      }))
      
      // 分页处理
      const start = (queryPageNum.value - 1) * queryPageSize.value
      const end = start + queryPageSize.value
      
      returnInfoList.value = expandedList.slice(start, end)
      pagination.total = expandedList.length
      
      console.log('废刀回收统计数据加载成功，共', expandedList.length, '条记录')
      console.log('还刀数据:', data)
      console.log('展开后的列表:', expandedList)
      
      ElMessage.success('数据加载成功')
    } else {
      ElMessage.error(response.msg || '获取数据失败')
      returnInfoList.value = []
      pagination.total = 0
    }
    
    loading.value = false
  } catch (error) {
    console.error('获取还刀信息列表失败:', error)
    ElMessage.error('获取数据失败')
    returnInfoList.value = []
    pagination.total = 0
    loading.value = false
  }
}

const handleQuery = () => {
  queryPageNum.value = 1
  getList()
}

const resetQuery = () => {
  queryRef.value?.resetFields()
  handleQuery()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
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
    const params = {
      ...queryParams
    }
    await exportReturnInfo(params)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 还刀状态映射（支持数字和字符串）
const getBorrowStatusText = (status) => {
  // 转换为字符串进行匹配
  const statusStr = String(status)
  const statusMap = {
    '0': '修磨',
    '1': '报废',
    '2': '换线',
    '3': '错领'
  }
  return statusMap[statusStr] ?? '未知'
}

const getBorrowStatusType = (status) => {
  // 转换为字符串进行匹配
  const statusStr = String(status)
  const typeMap = {
    '0': 'info',
    '1': 'success',
    '2': 'warning',
    '3': 'danger'
  }
  return typeMap[statusStr] ?? 'info'
}

// 记录状态映射
const getRecordStatusText = (status) => {
  const statusMap = {
    0: '取刀',
    1: '还刀',
    2: '收刀',
    3: '暂存'
  }
  return statusMap[status] ?? '未知'
}

const getRecordStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return typeMap[status] ?? 'info'
}
</script>

<style scoped>
.detail-content {
  margin-top: 20px;
}
</style>

