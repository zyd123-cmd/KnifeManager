<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="耗材主键:" prop="cutterId">
          <el-input v-model="formInline.cutterId" placeholder="请输入耗材主键" clearable/>
        </el-form-item>
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="刀具型号:" prop="cutterCode">
          <el-input v-model="formInline.cutterCode" placeholder="请输入刀具型号" clearable/>
        </el-form-item>
        <el-form-item label="刀具类型:" prop="cutterType">
          <el-select v-model="formInline.cutterType" placeholder="请选择刀具类型" clearable>
            <el-option
              v-for="type in cutterTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型:" prop="stockType">
          <el-select v-model="formInline.stockType" placeholder="请选择操作类型" clearable>
            <el-option label="入库" :value="0"/>
            <el-option label="出库" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人:" prop="operator">
          <el-input v-model="formInline.operator" placeholder="请输入操作人" clearable/>
        </el-form-item>
        <el-form-item label="工厂名称:" prop="factoryName">
          <el-select v-model="formInline.factoryName" placeholder="请选择工厂" clearable>
            <el-option
              v-for="factory in factoryList"
              :key="factory.value"
              :label="factory.label"
              :value="factory.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车间名称:" prop="workshopName">
          <el-select v-model="formInline.workshopName" placeholder="请选择车间" clearable>
            <el-option
              v-for="workshop in workshopList"
              :key="workshop.value"
              :label="workshop.label"
              :value="workshop.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
            v-model="formInline.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    中部表格显示出入库信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="记录ID" align="center" width="100"/>
        <el-table-column prop="cutterId" label="耗材主键" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="stockType" label="操作类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.stockType === 0 ? 'success' : 'warning'">
              {{ scope.row.stockType === 0 ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" align="center" width="100"/>
        <el-table-column prop="price" label="单价" align="center" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" align="center" width="100"/>
        <el-table-column prop="factoryName" label="工厂名称" align="center" width="120"/>
        <el-table-column prop="workshopName" label="车间名称" align="center" width="120"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="status" label="业务状态" align="center" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleUploadImage(scope.row)">图片上传</el-button>
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
      title="出入库详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentRecord">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="记录ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="耗材主键">{{ currentRecord.cutterId }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentRecord.account }}</el-descriptions-item>
          <el-descriptions-item label="用户名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentRecord.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="currentRecord.stockType === 0 ? 'success' : 'warning'">
              {{ currentRecord.stockType === 0 ? '入库' : '出库' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentRecord.price }}</el-descriptions-item>
          <el-descriptions-item label="历史单价">¥{{ currentRecord.oldPrice }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentRecord.operator }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="currentRecord.status === 'active' ? 'success' : 'danger'">
              {{ currentRecord.status === 'active' ? '正常' : '异常' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否已删除">
            <el-tag :type="currentRecord.isDeleted === 0 ? 'success' : 'danger'">
              {{ currentRecord.isDeleted === 0 ? '否' : '是' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 位置信息 -->
        <el-descriptions title="位置信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具柜名称">{{ currentRecord.cabinetName }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="工厂名称">{{ currentRecord.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="车间名称">{{ currentRecord.workshopName }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentRecord.createDept }}</el-descriptions-item>
        </el-descriptions>

        <!-- 操作信息 -->
        <el-descriptions title="操作信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="操作详情">{{ currentRecord.detailsCode }}</el-descriptions-item>
          <el-descriptions-item label="操作详情名称">{{ currentRecord.detailsName }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentRecord.remake || '无' }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentRecord.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentRecord.createUser }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentRecord.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentRecord.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="图片上传"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-container">
        <div class="upload-tips">
          <el-alert
            title="上传说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>1. 支持jpg、png、gif格式图片</p>
                <p>2. 单个文件大小不超过5MB</p>
                <p>3. 最多可上传5张图片</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="upload-area">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :action="uploadAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :file-list="uploadFileList"
            list-type="picture-card"
            :limit="5"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeUploadDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="图片预览" width="800px">
      <img w-full :src="previewImageUrl" alt="预览图片" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  listStockInOutInfo,
  getStockInOutInfo,
  getStockInOutInfoByCutterId,
  uploadStockImage,
  deleteStockImage,
  exportStockInOutInfo,
  getStockTypeList,
  getFactoryList,
  getWorkshopList
} from '@/api/consumableService/stockInOutInfo'

const formInlineRes = ref()
const uploadRef = ref()

// 顶部查询数据
const formInline = reactive({
  cutterId: '', // 耗材主键
  brandName: '', // 品牌名称
  cutterCode: '', // 刀具型号
  cutterType: '', // 刀具类型
  stockType: '', // 操作类型
  operator: '', // 操作人
  factoryName: '', // 工厂名称
  workshopName: '', // 车间名称
  createTime: '', // 创建时间
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
  cutterId: '',
  brandName: '',
  cutterCode: '',
  cutterType: '',
  stockType: '',
  operator: '',
  factoryName: '',
  workshopName: '',
  createTimeStart: '',
  createTimeEnd: ''
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const currentRecord = ref(null)
const uploadFileList = ref([])
const previewImageUrl = ref('')
const uploadAction = ref('/api/upload') // 上传地址

// 下拉选项数据
const cutterTypeList = ref([])
const factoryList = ref([])
const workshopList = ref([])

// 模拟数据
const mockData = [
  {
    id: 1,
    cutterId: 1,
    account: 'zhangsan',
    name: '张三',
    brandCode: 'MT001',
    brandName: '三菱',
    cabinetCode: 'CAB001',
    cabinetName: 'A区01号刀具柜',
    createDept: '生产部',
    createTime: '2024-12-26 09:30:00',
    createUser: '张工程师',
    cutterCode: 'R390-11T308M-PM',
    cutterType: '铣刀',
    detailsCode: 'IN001',
    detailsName: '采购入库',
    factoryName: '第一工厂',
    isDeleted: 0,
    oldPrice: 280.00,
    operator: '李操作员',
    price: 285.50,
    quantity: 50,
    remake: '新采购的刀具',
    specification: 'Φ10×25×75',
    status: 'active',
    stockLoc: 'A01-01',
    stockType: 0, // 入库
    tenantId: 'T001',
    updateTime: '2024-12-26 09:30:00',
    updateUser: '张工程师',
    workshopName: '机加工车间'
  },
  {
    id: 2,
    cutterId: 2,
    account: 'lisi',
    name: '李四',
    brandCode: 'SV002',
    brandName: '山特维克',
    cabinetCode: 'CAB002',
    cabinetName: 'A区02号刀具柜',
    createDept: '维修部',
    createTime: '2024-12-26 14:15:00',
    createUser: '王技师',
    cutterCode: '880-D1200L20-03',
    cutterType: '钻头',
    detailsCode: 'OUT001',
    detailsName: '生产领用',
    factoryName: '第一工厂',
    isDeleted: 0,
    oldPrice: 156.80,
    operator: '赵操作员',
    price: 156.80,
    quantity: 10,
    remake: '生产线领用',
    specification: 'Φ12×120',
    status: 'active',
    stockLoc: 'A02-03',
    stockType: 1, // 出库
    tenantId: 'T001',
    updateTime: '2024-12-26 14:15:00',
    updateUser: '王技师',
    workshopName: '装配车间'
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据耗材主键筛选
      if (queryParams.cutterId) {
        filteredData = filteredData.filter(item =>
          item.cutterId.toString().includes(queryParams.cutterId)
        )
      }

      // 根据品牌名称筛选
      if (queryParams.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.toLowerCase().includes(queryParams.brandName.toLowerCase())
        )
      }

      // 根据刀具型号筛选
      if (queryParams.cutterCode) {
        filteredData = filteredData.filter(item =>
          item.cutterCode.toLowerCase().includes(queryParams.cutterCode.toLowerCase())
        )
      }

      // 根据刀具类型筛选
      if (queryParams.cutterType) {
        filteredData = filteredData.filter(item =>
          item.cutterType === queryParams.cutterType
        )
      }

      // 根据操作类型筛选
      if (queryParams.stockType !== '') {
        filteredData = filteredData.filter(item =>
          item.stockType === queryParams.stockType
        )
      }

      // 根据操作人筛选
      if (queryParams.operator) {
        filteredData = filteredData.filter(item =>
          item.operator.toLowerCase().includes(queryParams.operator.toLowerCase())
        )
      }

      // 根据工厂名称筛选
      if (queryParams.factoryName) {
        filteredData = filteredData.filter(item =>
          item.factoryName === queryParams.factoryName
        )
      }

      // 根据车间名称筛选
      if (queryParams.workshopName) {
        filteredData = filteredData.filter(item =>
          item.workshopName === queryParams.workshopName
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
  queryParams.cutterId = formInline.cutterId
  queryParams.brandName = formInline.brandName
  queryParams.cutterCode = formInline.cutterCode
  queryParams.cutterType = formInline.cutterType
  queryParams.stockType = formInline.stockType
  queryParams.operator = formInline.operator
  queryParams.factoryName = formInline.factoryName
  queryParams.workshopName = formInline.workshopName

  // 处理时间范围
  if (formInline.createTime && formInline.createTime.length === 2) {
    queryParams.createTimeStart = formInline.createTime[0].toISOString().split('T')[0]
    queryParams.createTimeEnd = formInline.createTime[1].toISOString().split('T')[0]
  } else {
    queryParams.createTimeStart = ''
    queryParams.createTimeEnd = ''
  }

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
    currentRecord.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 图片上传
const handleUploadImage = (row) => {
  currentRecord.value = { ...row }
  uploadFileList.value = []
  uploadDialogVisible.value = true
}

// 关闭上传对话框
const closeUploadDialog = () => {
  uploadDialogVisible.value = false
  uploadFileList.value = []
  currentRecord.value = null
}

// 图片预览
const handlePreview = (file) => {
  previewImageUrl.value = file.url
  previewDialogVisible.value = true
}

// 移除图片
const handleRemove = (file, fileList) => {
  uploadFileList.value = fileList
}

// 上传成功
const handleUploadSuccess = (response, file, fileList) => {
  uploadFileList.value = fileList
  ElMessage.success('图片上传成功!')
}

// 上传失败
const handleUploadError = (error, file, fileList) => {
  ElMessage.error('图片上传失败!')
}

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过5MB!')
    return false
  }
  return true
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

// 初始化下拉选项数据
const initSelectOptions = () => {
  // 模拟下拉选项数据
  cutterTypeList.value = [
    { value: '铣刀', label: '铣刀' },
    { value: '钻头', label: '钻头' },
    { value: '车刀', label: '车刀' },
    { value: '镗刀', label: '镗刀' },
    { value: '刀片', label: '刀片' },
    { value: '面铣刀', label: '面铣刀' }
  ]

  factoryList.value = [
    { value: '第一工厂', label: '第一工厂' },
    { value: '第二工厂', label: '第二工厂' },
    { value: '第三工厂', label: '第三工厂' }
  ]

  workshopList.value = [
    { value: '机加工车间', label: '机加工车间' },
    { value: '装配车间', label: '装配车间' },
    { value: '焊接车间', label: '焊接车间' },
    { value: '喷涂车间', label: '喷涂车间' }
  ]
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
  initSelectOptions()
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

.upload-container {
  .upload-tips {
    margin-bottom: 20px;

    :deep(.el-alert__content) {
      p {
        margin: 5px 0;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }

  .upload-area {
    :deep(.el-upload--picture-card) {
      width: 100px;
      height: 100px;
    }

    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
