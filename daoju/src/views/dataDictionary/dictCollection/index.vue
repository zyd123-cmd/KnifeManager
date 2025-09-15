<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="字典码:" prop="code">
          <el-input v-model="formInline.code" placeholder="请输入字典码" clearable/>
        </el-form-item>
        <el-form-item label="字典值:" prop="dictKey">
          <el-input v-model="formInline.dictKey" placeholder="请输入字典值" clearable/>
        </el-form-item>
        <el-form-item label="字典名称:" prop="dictValue">
          <el-input v-model="formInline.dictValue" placeholder="请输入字典名称" clearable/>
        </el-form-item>
        <el-form-item label="是否已删除:" prop="isDeleted">
          <el-select v-model="formInline.isDeleted" placeholder="请选择删除状态" clearable>
            <el-option label="正常" :value="0"/>
            <el-option label="已删除" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否已封存:" prop="isSealed">
          <el-select v-model="formInline.isSealed" placeholder="请选择封存状态" clearable>
            <el-option label="正常" :value="0"/>
            <el-option label="已封存" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="父主键:" prop="parentId">
          <el-input v-model="formInline.parentId" placeholder="请输入父主键" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    中部表格显示字典集合信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%; table-layout: fixed;" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="主键" align="center" width="80"/>
        <el-table-column prop="code" label="字典码" align="center" width="120"/>
        <el-table-column prop="dictKey" label="字典值" align="center" width="150"/>
        <el-table-column prop="dictValue" label="字典名称" align="center" width="180"/>
        <el-table-column prop="parentId" label="父主键" align="center" width="100"/>
        <el-table-column prop="sort" label="排序" align="center" width="80"/>
        <el-table-column prop="isDeleted" label="删除状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isDeleted === 0 ? 'success' : 'danger'">
              {{ scope.row.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSealed" label="封存状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isSealed === 0 ? 'success' : 'warning'">
              {{ scope.row.isSealed === 0 ? '正常' : '已封存' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="字典备注" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="tenantId" label="租户ID" align="center" width="100"/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="default" size="small" @click="handleDetail(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
    <el-dialog
      v-model="detailDialogVisible"
      title="字典详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentDict">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="主键">{{ currentDict.id }}</el-descriptions-item>
          <el-descriptions-item label="字典码">{{ currentDict.code }}</el-descriptions-item>
          <el-descriptions-item label="字典值">{{ currentDict.dictKey }}</el-descriptions-item>
          <el-descriptions-item label="字典名称">{{ currentDict.dictValue }}</el-descriptions-item>
          <el-descriptions-item label="父主键">{{ currentDict.parentId || '无' }}</el-descriptions-item>
          <el-descriptions-item label="排序">{{ currentDict.sort }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentDict.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="删除状态">
            <el-tag :type="currentDict.isDeleted === 0 ? 'success' : 'danger'">
              {{ currentDict.isDeleted === 0 ? '正常' : '已删除' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="封存状态">
            <el-tag :type="currentDict.isSealed === 0 ? 'success' : 'warning'">
              {{ currentDict.isSealed === 0 ? '正常' : '已封存' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="字典备注" :span="2">{{ currentDict.remark || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listDictCollection,
  getDictCollection,
  getDictCollectionByCode,
  addDictCollection,
  updateDictCollection,
  delDictCollection,
  batchDelDictCollection,
  exportDictCollection,
  getDictTypeList,
  getParentDictList
} from '@/api/dataDictionary/dictCollection'

const formInlineRes = ref()

// 顶部查询数据
const formInline = reactive({
  code: '', // 字典码
  dictKey: '', // 字典值
  dictValue: '', // 字典名称
  isDeleted: '', // 是否已删除
  isSealed: '', // 是否已封存
  parentId: '', // 父主键
})

// 分页和加载状态
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 查询参数
const queryParams = reactive({
  code: '',
  dictKey: '',
  dictValue: '',
  isDeleted: '',
  isSealed: '',
  parentId: ''
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const currentDict = ref(null)

// 模拟数据
const mockData = [
  {
    id: 1,
    code: 'DICT001',
    dictKey: 'user_status',
    dictValue: '用户状态',
    parentId: null,
    remark: '用户状态字典',
    sort: 1,
    tenantId: 'T001',
    isDeleted: 0,
    isSealed: 0
  },
  {
    id: 2,
    code: 'DICT002',
    dictKey: 'active',
    dictValue: '启用',
    parentId: 1,
    remark: '用户状态-启用',
    sort: 1,
    tenantId: 'T001',
    isDeleted: 0,
    isSealed: 0
  },
  {
    id: 3,
    code: 'DICT003',
    dictKey: 'inactive',
    dictValue: '禁用',
    parentId: 1,
    remark: '用户状态-禁用',
    sort: 2,
    tenantId: 'T001',
    isDeleted: 0,
    isSealed: 0
  },
  {
    id: 4,
    code: 'DICT004',
    dictKey: 'order_status',
    dictValue: '订单状态',
    parentId: null,
    remark: '订单状态字典',
    sort: 2,
    tenantId: 'T001',
    isDeleted: 0,
    isSealed: 1
  },
  {
    id: 5,
    code: 'DICT005',
    dictKey: 'pending',
    dictValue: '待处理',
    parentId: 4,
    remark: '订单状态-待处理',
    sort: 1,
    tenantId: 'T001',
    isDeleted: 0,
    isSealed: 0
  },
  {
    id: 6,
    code: 'DICT006',
    dictKey: 'completed',
    dictValue: '已完成',
    parentId: 4,
    remark: '订单状态-已完成',
    sort: 2,
    tenantId: 'T001',
    isDeleted: 1,
    isSealed: 0
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据字典码筛选
      if (queryParams.code) {
        filteredData = filteredData.filter(item =>
          item.code.toLowerCase().includes(queryParams.code.toLowerCase())
        )
      }

      // 根据字典值筛选
      if (queryParams.dictKey) {
        filteredData = filteredData.filter(item =>
          item.dictKey.toLowerCase().includes(queryParams.dictKey.toLowerCase())
        )
      }

      // 根据字典名称筛选
      if (queryParams.dictValue) {
        filteredData = filteredData.filter(item =>
          item.dictValue.toLowerCase().includes(queryParams.dictValue.toLowerCase())
        )
      }

      // 根据删除状态筛选
      if (queryParams.isDeleted !== '') {
        filteredData = filteredData.filter(item =>
          item.isDeleted === queryParams.isDeleted
        )
      }

      // 根据封存状态筛选
      if (queryParams.isSealed !== '') {
        filteredData = filteredData.filter(item =>
          item.isSealed === queryParams.isSealed
        )
      }

      // 根据父主键筛选
      if (queryParams.parentId) {
        filteredData = filteredData.filter(item =>
          item.parentId && item.parentId.toString().includes(queryParams.parentId)
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

// 搜索功能
const onSubmit = () => {
  // 复制搜索条件到查询参数
  queryParams.code = formInline.code
  queryParams.dictKey = formInline.dictKey
  queryParams.dictValue = formInline.dictValue
  queryParams.isDeleted = formInline.isDeleted
  queryParams.isSealed = formInline.isSealed
  queryParams.parentId = formInline.parentId

  pagination.current = 1
  getList()
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
  // 重置所有查询参数
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = ''
  })
  pagination.current = 1
  getList()
}

// 查看详情
const handleDetail = (row) => {
  // 使用模拟数据
  const detailData = mockData.find(item => item.id === row.id)
  if (detailData) {
    currentDict.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
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

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 5px 10px;

  .topSearchDiv {
    width: 100%;
    margin-bottom: 20px;
  }

  .tableDiv {
    width: 100%;
    margin-bottom: 20px;
  }

  .paginationDiv {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
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

.detail-container {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>
