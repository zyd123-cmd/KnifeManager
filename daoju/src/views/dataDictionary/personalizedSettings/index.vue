<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="幻灯片设置:" prop="appSlideType">
          <el-select v-model="formInline.appSlideType" placeholder="请选择幻灯片设置" clearable>
            <el-option label="关闭" :value="0"/>
            <el-option label="近30天" :value="1"/>
            <el-option label="近15天" :value="2"/>
            <el-option label="近7天" :value="3"/>
            <el-option label="本月" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="还刀方式:" prop="borrowType">
          <el-select v-model="formInline.borrowType" placeholder="请选择还刀方式" clearable>
            <el-option label="一次一格" :value="0"/>
            <el-option label="一人一类一格" :value="1"/>
            <el-option label="一人一格" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="违规还刀控制:" prop="errBorrowType">
          <el-select v-model="formInline.errBorrowType" placeholder="请选择违规还刀控制" clearable>
            <el-option label="否" :value="0"/>
            <el-option label="是" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="取刀单价可见:" prop="isAppShowPrice">
          <el-select v-model="formInline.isAppShowPrice" placeholder="请选择取刀单价可见" clearable>
            <el-option label="不可见" :value="0"/>
            <el-option label="可见" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="取刀扣减库存:" prop="isLendStock">
          <el-select v-model="formInline.isLendStock" placeholder="请选择取刀扣减库存" clearable>
            <el-option label="否" :value="0"/>
            <el-option label="是" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="程序取刀:" prop="isProgramLend">
          <el-select v-model="formInline.isProgramLend" placeholder="请选择程序取刀" clearable>
            <el-option label="否" :value="0"/>
            <el-option label="是" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    中部表格显示个性化设置信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%; table-layout: fixed;" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column prop="id" label="设置ID" align="center" width="100"/>
        <el-table-column prop="appSlideType" label="幻灯片设置" align="center" width="140">
          <template #default="scope">
            <el-tag :type="getSlideTypeTag(scope.row.appSlideType)">
              {{ getSlideTypeText(scope.row.appSlideType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="borrowType" label="还刀方式" align="center" width="150">
          <template #default="scope">
            <el-tag :type="getBorrowTypeTag(scope.row.borrowType)">
              {{ getBorrowTypeText(scope.row.borrowType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errBorrowType" label="违规还刀控制" align="center" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.errBorrowType === 1 ? 'warning' : 'success'">
              {{ scope.row.errBorrowType === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errBorrowUpper" label="违规还刀上限" align="center" width="140"/>
        <el-table-column prop="isAppShowPrice" label="取刀单价可见" align="center" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.isAppShowPrice === 1 ? 'success' : 'info'">
              {{ scope.row.isAppShowPrice === 1 ? '可见' : '不可见' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isLendStock" label="取刀扣减库存" align="center" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.isLendStock === 1 ? 'success' : 'info'">
              {{ scope.row.isLendStock === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isProgramLend" label="程序取刀" align="center" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.isProgramLend === 1 ? 'success' : 'info'">
              {{ scope.row.isProgramLend === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lendUpper" label="领刀上限" align="center" width="120"/>
        <el-table-column prop="returnedUpper" label="取用未归还上限" align="center" width="160"/>
        <el-table-column prop="locUpper" label="单格容量上限" align="center" min-width="140"/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="120">
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
      title="个性化设置详情"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentSettings">
        <!-- 显示设置 -->
        <el-descriptions title="显示设置" :column="2" border>
          <el-descriptions-item label="幻灯片设置">
            <el-tag :type="getSlideTypeTag(currentSettings.appSlideType)">
              {{ getSlideTypeText(currentSettings.appSlideType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="取刀单价可见">
            <el-tag :type="currentSettings.isAppShowPrice === 1 ? 'success' : 'info'">
              {{ currentSettings.isAppShowPrice === 1 ? '可见' : '不可见' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="现库存">
            <el-tag :type="currentSettings.isNowStock === 1 ? 'success' : 'info'">
              {{ currentSettings.isNowStock === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀具扫码">
            <el-tag :type="currentSettings.isScanCode === 1 ? 'success' : 'info'">
              {{ currentSettings.isScanCode === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 借还设置 -->
        <el-descriptions title="借还设置" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="还刀方式">
            <el-tag :type="getBorrowTypeTag(currentSettings.borrowType)">
              {{ getBorrowTypeText(currentSettings.borrowType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="违规还刀控制">
            <el-tag :type="currentSettings.errBorrowType === 1 ? 'warning' : 'success'">
              {{ currentSettings.errBorrowType === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="违规还刀上限">{{ currentSettings.errBorrowUpper || '无限制' }}</el-descriptions-item>
          <el-descriptions-item label="支持A借B还">
            <el-tag :type="currentSettings.otherUserBorrow === 1 ? 'success' : 'info'">
              {{ currentSettings.otherUserBorrow === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="以旧换新">
            <el-tag :type="currentSettings.isTradeln === 1 ? 'success' : 'info'">
              {{ currentSettings.isTradeln === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 库存设置 -->
        <el-descriptions title="库存设置" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="取刀扣减刀具总库存">
            <el-tag :type="currentSettings.isLendStock === 1 ? 'success' : 'info'">
              {{ currentSettings.isLendStock === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="货道库存同步刀具总库存">
            <el-tag :type="currentSettings.isSyncStock === 1 ? 'success' : 'info'">
              {{ currentSettings.isSyncStock === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="领刀上限控制">{{ currentSettings.lendUpper || '无限制' }}</el-descriptions-item>
          <el-descriptions-item label="领刀上限控制类型">{{ currentSettings.lendUpperType || '无' }}</el-descriptions-item>
          <el-descriptions-item label="收刀柜单格容量上限">{{ currentSettings.locUpper || '无限制' }}</el-descriptions-item>
          <el-descriptions-item label="取用且未归还刀具上限">{{ currentSettings.returnedUpper || '无限制' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 功能设置 -->
        <el-descriptions title="功能设置" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="群配置">
            <el-tag :type="currentSettings.isNeedCrowd === 1 ? 'success' : 'info'">
              {{ currentSettings.isNeedCrowd === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品/工单">
            <el-tag :type="currentSettings.isNeedOrder === 1 ? 'success' : 'info'">
              {{ currentSettings.isNeedOrder === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="领料单">
            <el-tag :type="currentSettings.isPickLists === 1 ? 'success' : 'info'">
              {{ currentSettings.isPickLists === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="领料单取刀方式">{{ getPickListsTypeText(currentSettings.pickListsType) }}</el-descriptions-item>
          <el-descriptions-item label="程序取刀">
            <el-tag :type="currentSettings.isProgramLend === 1 ? 'success' : 'info'">
              {{ currentSettings.isProgramLend === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否推送消息">
            <el-tag :type="currentSettings.isPush === 1 ? 'success' : 'info'">
              {{ currentSettings.isPush === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
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
  listPersonalizedSettings,
  getPersonalizedSettings,
  addPersonalizedSettings,
  updatePersonalizedSettings,
  delPersonalizedSettings,
  batchDelPersonalizedSettings,
  exportPersonalizedSettings,
  getSettingTypeList,
  getConfigGroupList
} from '@/api/dataDictionary/personalizedSettings'

const formInlineRes = ref()

// 顶部查询数据
const formInline = reactive({
  appSlideType: '', // 幻灯片设置
  borrowType: '', // 还刀方式
  errBorrowType: '', // 违规还刀控制
  isAppShowPrice: '', // 取刀单价可见
  isLendStock: '', // 取刀扣减库存
  isProgramLend: '', // 程序取刀
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
  appSlideType: '',
  borrowType: '',
  errBorrowType: '',
  isAppShowPrice: '',
  isLendStock: '',
  isProgramLend: ''
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const currentSettings = ref(null)

// 模拟数据 - 个性化设置相关
const mockData = [
  {
    id: 1,
    appSlideType: 1, // 近30天
    borrowType: 0, // 一次一格
    errBorrowType: 1, // 是
    errBorrowUpper: 5,
    isAppShowPrice: 1, // 可见
    isLendStock: 1, // 是
    isNeedCrowd: 0, // 否
    isNeedOrder: 1, // 是
    isNowStock: 1, // 是
    isPickLists: 1, // 是
    isProgramLend: 1, // 是
    isPush: 1, // 是
    isScanCode: 1, // 是
    isSyncStock: 1, // 是
    isTradeln: 0, // 否
    lendUpper: 10,
    lendUpperType: '按人员',
    locUpper: 50,
    otherUserBorrow: 1, // 是
    pickListsType: 1, // 自动计算
    returnedUpper: 20
  },
  {
    id: 2,
    appSlideType: 2, // 近15天
    borrowType: 1, // 一人一类一格
    errBorrowType: 0, // 否
    errBorrowUpper: 0,
    isAppShowPrice: 0, // 不可见
    isLendStock: 0, // 否
    isNeedCrowd: 1, // 是
    isNeedOrder: 0, // 否
    isNowStock: 0, // 否
    isPickLists: 0, // 否
    isProgramLend: 0, // 否
    isPush: 0, // 否
    isScanCode: 0, // 否
    isSyncStock: 0, // 否
    isTradeln: 1, // 是
    lendUpper: 15,
    lendUpperType: '按部门',
    locUpper: 30,
    otherUserBorrow: 0, // 否
    pickListsType: 0, // 普通模式
    returnedUpper: 10
  }
]

// 获取幻灯片类型文本
const getSlideTypeText = (type) => {
  const typeMap = {
    0: '关闭',
    1: '近30天',
    2: '近15天',
    3: '近7天',
    4: '本月'
  }
  return typeMap[type] || '未知'
}

// 获取幻灯片类型标签
const getSlideTypeTag = (type) => {
  const tagMap = {
    0: 'info',
    1: 'success',
    2: 'primary',
    3: 'warning',
    4: 'danger'
  }
  return tagMap[type] || 'info'
}

// 获取还刀方式文本
const getBorrowTypeText = (type) => {
  const typeMap = {
    0: '一次一格',
    1: '一人一类一格',
    2: '一人一格'
  }
  return typeMap[type] || '未知'
}

// 获取还刀方式标签
const getBorrowTypeTag = (type) => {
  const tagMap = {
    0: 'success',
    1: 'primary',
    2: 'warning'
  }
  return tagMap[type] || 'info'
}

// 获取领料单取刀方式文本
const getPickListsTypeText = (type) => {
  const typeMap = {
    0: '普通模式',
    1: '自动计算',
    2: '跨柜取刀'
  }
  return typeMap[type] || '普通模式'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用（没有请求参数）
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据幻灯片设置筛选
      if (queryParams.appSlideType !== '') {
        filteredData = filteredData.filter(item =>
          item.appSlideType === queryParams.appSlideType
        )
      }

      // 根据还刀方式筛选
      if (queryParams.borrowType !== '') {
        filteredData = filteredData.filter(item =>
          item.borrowType === queryParams.borrowType
        )
      }

      // 根据违规还刀控制筛选
      if (queryParams.errBorrowType !== '') {
        filteredData = filteredData.filter(item =>
          item.errBorrowType === queryParams.errBorrowType
        )
      }

      // 根据取刀单价可见筛选
      if (queryParams.isAppShowPrice !== '') {
        filteredData = filteredData.filter(item =>
          item.isAppShowPrice === queryParams.isAppShowPrice
        )
      }

      // 根据取刀扣减库存筛选
      if (queryParams.isLendStock !== '') {
        filteredData = filteredData.filter(item =>
          item.isLendStock === queryParams.isLendStock
        )
      }

      // 根据程序取刀筛选
      if (queryParams.isProgramLend !== '') {
        filteredData = filteredData.filter(item =>
          item.isProgramLend === queryParams.isProgramLend
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
  queryParams.appSlideType = formInline.appSlideType
  queryParams.borrowType = formInline.borrowType
  queryParams.errBorrowType = formInline.errBorrowType
  queryParams.isAppShowPrice = formInline.isAppShowPrice
  queryParams.isLendStock = formInline.isLendStock
  queryParams.isProgramLend = formInline.isProgramLend

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
    currentSettings.value = { ...detailData }
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
  padding: 0;
  margin: 0;

  .topSearchDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px 20px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
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
