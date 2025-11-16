<template>
  <div class="container">
    <!-- <div>暂存记录</div> -->
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="开始时间:" prop="start_time">
          <el-date-picker
            v-model="searchForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="end_time">
          <el-date-picker
            v-model="searchForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </el-form-item>
        <el-form-item label="记录状态:" prop="record_status">
          <el-select v-model="searchForm.record_status" placeholder="请选择记录状态" clearable>
            <el-option label="取刀" :value="0"/>
            <el-option label="还刀" :value="1"/>
            <el-option label="收刀" :value="2"/>
            <el-option label="暂存" :value="3"/>
            <el-option label="完成" :value="4"/>
            <el-option label="违规还刀" :value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序类型:" prop="ranking_type">
          <el-select v-model="searchForm.ranking_type" placeholder="请选择排序类型" clearable>
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
        <el-table-column prop="lend_user_name" label="取出人" align="center" width="100"/>
        <el-table-column prop="storage_user_name" label="暂存人" align="center" width="100"/>
        <el-table-column prop="brand_name" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutter_code" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="specification" label="规格" align="center" width="120"/>
        <el-table-column prop="quantity" label="数量" align="center" width="80"/>
        <el-table-column prop="old_price" label="老单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.old_price ? scope.row.old_price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="new_price" label="新单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.new_price ? scope.row.new_price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="old_stock_num" label="操作前库存数" align="center" width="120"/>
        <el-table-column prop="new_stock_num" label="操作后库存数" align="center" width="120"/>
        <el-table-column prop="stock_loc" label="库位号" align="center" width="120"/>
        <el-table-column prop="log_status" label="日志类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getLogStatusTagType(scope.row.log_status)">
              {{ getLogStatusText(scope.row.log_status) }}
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
        <el-table-column prop="cabinet_code" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="create_time" label="创建时间" align="center" width="160"/>
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
          <el-descriptions-item label="取出人">{{ currentRecord.lend_user_name }}</el-descriptions-item>
          <el-descriptions-item label="暂存人">{{ currentRecord.storage_user_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brand_name }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutter_code }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentRecord.material_code }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="老单价">{{ currentRecord.old_price ? currentRecord.old_price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="新单价">{{ currentRecord.new_price ? currentRecord.new_price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="操作前库存数">{{ currentRecord.old_stock_num }}</el-descriptions-item>
          <el-descriptions-item label="操作后库存数">{{ currentRecord.new_stock_num }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stock_loc }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinet_code }}</el-descriptions-item>
          <el-descriptions-item label="日志类型">
            <el-tag :type="getLogStatusTagType(currentRecord.log_status)">
              {{ getLogStatusText(currentRecord.log_status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="getStatusTagType(currentRecord.status)">
              {{ getStatusText(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.create_dept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.create_user }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.update_user }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRecord.operator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.create_time }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.update_time }}</el-descriptions-item>
          <el-descriptions-item label="操作详情">{{ currentRecord.details_code }}</el-descriptions-item>
          <el-descriptions-item label="备注" v-if="currentRecord.remake">{{ currentRecord.remake }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenant_id }}</el-descriptions-item>
          <el-descriptions-item label="是否删除">
            <el-tag :type="currentRecord.is_deleted === 0 ? 'success' : 'danger'">
              {{ currentRecord.is_deleted === 0 ? '正常' : '已删除' }}
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
import { getPublicStorageList, exportPublicStorage } from '@/api/historyRecord/publicStorage'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 搜索表单
const searchForm = reactive({
  start_time: '',
  end_time: '',
  record_status: null,
  ranking_type: null,
  order: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const searchFormRef = ref()

// 生命周期
onMounted(() => {
  getList()
})

// 方法
const getList = async () => {
  loading.value = true
  
  try {
    // 构建请求参数
    const params = {
      current: pagination.current,
      size: pagination.size,
      start_time: searchForm.start_time,
      end_time: searchForm.end_time,
      record_status: searchForm.record_status,
      ranking_type: searchForm.ranking_type,
      order: searchForm.order
    }
    
    // 移除空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getPublicStorageList(params)
    
    if (response.success) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.msg || '获取公共暂存记录失败')
    }
    
    loading.value = false
  } catch (error) {
    console.error('获取公共暂存记录失败:', error)
    ElMessage.error('获取公共暂存记录失败')
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  getList()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    start_time: '',
    end_time: '',
    record_status: null,
    ranking_type: null,
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

const handleExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  try {
    // 构建导出参数
    const params = {
      start_time: searchForm.start_time,
      end_time: searchForm.end_time,
      record_status: searchForm.record_status,
      ranking_type: searchForm.ranking_type,
      order: searchForm.order
    }
    
    // 移除空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await exportPublicStorage(params)
    
    // 处理导出响应
    const blob = new Blob([response])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '公共暂存记录.xlsx'
    link.click()
    URL.revokeObjectURL(link.href)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
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