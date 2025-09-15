<template>
  <div class="container">
    <div>刀柜货道 - 取刀柜</div>
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="品牌编码:" prop="brandCode">
          <el-input
            v-model="searchForm.brandCode"
            placeholder="请输入品牌编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-input
            v-model="searchForm.cabinetCode"
            placeholder="请输入刀柜编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀具型号:" prop="cutterCode">
          <el-input
            v-model="searchForm.cutterCode"
            placeholder="请输入刀具型号"
            clearable
          />
        </el-form-item>
        <el-form-item label="耗材型号或品牌:" prop="cutterOrBrand">
          <el-input
            v-model="searchForm.cutterOrBrand"
            placeholder="请输入耗材型号或品牌"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀具类型:" prop="cutterType">
          <el-input
            v-model="searchForm.cutterType"
            placeholder="请输入刀具类型"
            clearable
          />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="searchForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A面" value="A"/>
            <el-option label="B面" value="B"/>
            <el-option label="C面" value="C"/>
            <el-option label="D面" value="D"/>
            <el-option label="E面" value="E"/>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码:" prop="materialCode">
          <el-input
            v-model="searchForm.materialCode"
            placeholder="请输入物料编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="规格:" prop="specification">
          <el-input
            v-model="searchForm.specification"
            placeholder="请输入规格"
            clearable
          />
        </el-form-item>
        <el-form-item label="库位号:" prop="stockLoc">
          <el-input
            v-model="searchForm.stockLoc"
            placeholder="请输入库位号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
          <el-button @click="resetSearch" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="warning" icon="plus" @click="handlePreReplenish">预补刀</el-button>
      <el-button type="info" icon="tools" @click="handleReplenish">补刀</el-button>
      <el-button type="warning" icon="warning" @click="handleAlarmSettings">预警设置</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
      <el-button type="primary" icon="upload" @click="handleImport">导入</el-button>
    </div>

    <!-- 中部表格显示取刀柜信息 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :scroll-x="true"
        table-layout="auto"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="account" label="还刀人账号" align="center" width="120"/>
        <el-table-column prop="name" label="还刀人名称" align="center" width="120"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="specification" label="规格" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80">
          <template #default="scope">
            <el-tag :type="getLocPrefixTagType(scope.row.locPrefix)">
              {{ scope.row.locPrefix }}面
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="locCapacity" label="库位容量" align="center" width="100"/>
        <el-table-column prop="stockStatus" label="库位状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockStatusTagType(scope.row.stockStatus)">
              {{ getStockStatusText(scope.row.stockStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storageType" label="暂存类型" align="center" width="120">
          <template #default="scope">
            <el-tag :type="getStorageTypeTagType(scope.row.storageType)">
              {{ getStorageTypeText(scope.row.storageType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="borrowStatus" label="还刀状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getBorrowStatusTagType(scope.row.borrowStatus)">
              {{ getBorrowStatusText(scope.row.borrowStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseInTime" label="入库时间" align="center" width="160"/>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button
                :type="scope.row.stockStatus === 2 ? 'success' : 'danger'"
                size="small"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.stockStatus === 2 ? '启用' : '禁用' }}
              </el-button>
              <el-button
                :type="scope.row.isBound ? 'danger' : 'warning'"
                size="small"
                @click="handleToggleBind(scope.row)"
              >
                {{ scope.row.isBound ? '解绑' : '绑定' }}
              </el-button>
            </div>
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
    <el-dialog v-model="detailDialogVisible" title="取刀柜详情" width="900px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="通道号主键">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="还刀人账号">{{ currentRecord.account }}</el-descriptions-item>
          <el-descriptions-item label="还刀人名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="还刀编码">{{ currentRecord.borrowCode }}</el-descriptions-item>
          <el-descriptions-item label="还刀状态">
            <el-tag :type="getBorrowStatusTagType(currentRecord.borrowStatus)">
              {{ getBorrowStatusText(currentRecord.borrowStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentRecord.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="耗材主键">{{ currentRecord.cutterId }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="是否禁用">
            <el-tag :type="currentRecord.isBan === 0 ? 'success' : 'danger'">
              {{ currentRecord.isBan === 0 ? '非禁用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="库位容量">{{ currentRecord.locCapacity }}</el-descriptions-item>
          <el-descriptions-item label="柜子面">{{ currentRecord.locPrefix }}面</el-descriptions-item>
          <el-descriptions-item label="库位产品剩余数量">{{ currentRecord.locSurplus }}</el-descriptions-item>
          <el-descriptions-item label="库位类型">
            <el-tag :type="currentRecord.locType === 0 ? 'primary' : 'warning'">
              {{ currentRecord.locType === 0 ? '取刀柜' : '收刀柜' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentRecord.materialCode }}</el-descriptions-item>
          <el-descriptions-item label="物料类型">{{ currentRecord.materialType }}</el-descriptions-item>
          <el-descriptions-item label="最小包装数量">{{ currentRecord.packQty }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ currentRecord.price ? currentRecord.price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="库位状态">
            <el-tag :type="getStockStatusTagType(currentRecord.stockStatus)">
              {{ getStockStatusText(currentRecord.stockStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="暂存类型">
            <el-tag :type="getStorageTypeTagType(currentRecord.storageType)">
              {{ getStorageTypeText(currentRecord.storageType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="入库时间">{{ currentRecord.warehouseInTime }}</el-descriptions-item>
          <el-descriptions-item label="警报数量">{{ currentRecord.warningNum }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 统计对话框 -->
    <el-dialog v-model="statisticsDialogVisible" title="取刀柜" width="600px">
      <div v-if="statisticsData" class="statistics-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="刀具数量">{{ statisticsData.cabinetNum }}</el-descriptions-item>
          <el-descriptions-item label="禁用数量">{{ statisticsData.disableNum }}</el-descriptions-item>
          <el-descriptions-item label="无货数量">{{ statisticsData.freeNum }}</el-descriptions-item>
          <el-descriptions-item label="库存告警值">{{ statisticsData.makeAlarm }}</el-descriptions-item>
          <el-descriptions-item label="刀具金额总数">{{ statisticsData.priceNum ? statisticsData.priceNum.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="有货数量">{{ statisticsData.workNum }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statisticsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绑定对话框 -->
    <el-dialog v-model="bindDialogVisible" title="绑定货道" width="600px">
      <el-form :model="bindForm" ref="bindFormRef" label-width="120px">
        <el-form-item label="耗材主键:" prop="cutterId" :rules="[{ required: true, message: '请输入耗材主键', trigger: 'blur' }]">
          <el-input v-model="bindForm.cutterId" placeholder="请输入耗材主键" />
        </el-form-item>
        <el-form-item label="是否禁用:" prop="isBan" :rules="[{ required: true, message: '请选择是否禁用', trigger: 'change' }]">
          <el-select v-model="bindForm.isBan" placeholder="请选择是否禁用">
            <el-option label="非禁用" :value="0"/>
            <el-option label="禁用" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="货道容量:" prop="locCapacity" :rules="[{ required: true, message: '请输入货道容量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locCapacity" :min="1" placeholder="请输入货道容量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="货道包装数量:" prop="locPackQty" :rules="[{ required: true, message: '请输入货道包装数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locPackQty" :min="1" placeholder="请输入货道包装数量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="货道刀具数量:" prop="locSurplus" :rules="[{ required: true, message: '请输入货道刀具数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locSurplus" :min="0" placeholder="请输入货道刀具数量" style="width: 100%" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBind" :loading="bindLoading">确定绑定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 解绑对话框 -->
    <el-dialog v-model="unbindDialogVisible" title="解绑货道" width="400px">
      <div class="unbind-content">
        <el-icon class="warning-icon" size="48" color="#E6A23C"><Warning /></el-icon>
        <p class="unbind-message">确定要解绑该货道吗？</p>
        <p class="unbind-tip">解绑后将清除该货道的绑定关系</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="submitUnbind" :loading="unbindLoading">确定解绑</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预补刀对话框 -->
    <el-dialog v-model="preReplenishDialogVisible" title="预补刀结果" width="900px">
      <div v-if="preReplenishData && preReplenishData.length > 0" class="pre-replenish-content">
        <el-table :data="preReplenishData" border style="width: 100%">
          <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
          <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
          <el-table-column prop="locCapacity" label="货道容量" align="center" width="100"/>
          <el-table-column prop="locSurplus" label="补货前" align="center" width="100"/>
          <el-table-column prop="plugNum" label="补货后" align="center" width="100"/>
          <el-table-column prop="successStock" label="补刀成功" align="center" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.successStock ? 'success' : 'danger'">
                {{ scope.row.successStock ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="massage" label="原因" align="center" min-width="150"/>
        </el-table>
      </div>
      <div v-else class="no-data">
        <el-empty description="请先选择要预补刀的记录" />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="preReplenishDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入数据" width="500px">
      <el-form :model="importForm" ref="importFormRef" label-width="100px">
        <el-form-item label="刀柜编码:" prop="cabinetCode" :rules="[{ required: true, message: '请输入刀柜编码', trigger: 'blur' }]">
          <el-input v-model="importForm.cabinetCode" placeholder="请输入刀柜编码" />
        </el-form-item>
        <el-form-item label="选择文件:" prop="file" :rules="[{ required: true, message: '请选择要导入的文件', trigger: 'change' }]">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="true"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            accept=".xlsx,.xls,.csv"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 xlsx/xls/csv 文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitImport" :loading="importLoading">确定导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TakeCabinet">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// import { getTakeCabinetList, exportTakeCabinet, getTakeCabinetStatistics } from '@/api/cabinetChannel/takeCabinet'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const bindDialogVisible = ref(false)
const unbindDialogVisible = ref(false)
const preReplenishDialogVisible = ref(false)
const importDialogVisible = ref(false)
const statisticsLoading = ref(false)
const bindLoading = ref(false)
const unbindLoading = ref(false)
const preReplenishLoading = ref(false)
const replenishLoading = ref(false)
const disableLoading = ref(false)
const enableLoading = ref(false)
const importLoading = ref(false)
const currentRecord = ref(null)
const statisticsData = ref(null)
const currentUnbindRow = ref(null)
const preReplenishData = ref([])

// 搜索表单
const searchForm = reactive({
  brandCode: '',
  cabinetCode: '',
  cutterCode: '',
  cutterOrBrand: '',
  cutterType: '',
  locPrefix: '',
  materialCode: '',
  specification: '',
  stockLoc: ''
})

// 统计表单
const statisticsForm = reactive({
  cabinetCode: '',
  locPrefix: ''
})

// 绑定表单
const bindForm = reactive({
  cutterId: '',
  isBan: 0,
  locCapacity: null,
  locPackQty: null,
  locSurplus: null,
  stockId: ''
})

// 导入表单
const importForm = reactive({
  cabinetCode: '',
  file: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const searchFormRef = ref()
const statisticsFormRef = ref()
const bindFormRef = ref()
const importFormRef = ref()
const uploadRef = ref()

// 模拟数据
const mockData = [
  {
    id: 1,
    account: 'user001',
    name: '张三',
    borrowCode: 'BOR20241227001',
    borrowStatus: 0,
    brandCode: 'BR001',
    brandName: '三菱',
    cabinetCode: 'CAB20241227001',
    cutterCode: 'APMT1135PDER-M2',
    cutterId: 1001,
    cutterType: '车刀片',
    isBan: 0,
    locCapacity: 50,
    locPrefix: 'A',
    locSurplus: 35,
    locType: 0,
    materialCode: 'MAT001',
    materialType: '硬质合金',
    packQty: 10,
    price: 125.50,
    specification: 'APMT1135PDER-M2',
    stockLoc: 'A01-001',
    stockStatus: 1,
    storageType: 0,
    warehouseInTime: '2024-12-27 08:30:00',
    warningNum: 5,
    isBound: true
  },
  {
    id: 2,
    account: 'user002',
    name: '李四',
    borrowCode: 'BOR20241227002',
    borrowStatus: 1,
    brandCode: 'BR002',
    brandName: '京瓷',
    cabinetCode: 'CAB20241227002',
    cutterCode: 'DCMT11T304-HQ',
    cutterId: 1002,
    cutterType: '铣刀',
    isBan: 0,
    locCapacity: 40,
    locPrefix: 'B',
    locSurplus: 28,
    locType: 0,
    materialCode: 'MAT002',
    materialType: '陶瓷',
    packQty: 5,
    price: 89.30,
    specification: 'DCMT11T304-HQ',
    stockLoc: 'B02-015',
    stockStatus: 0,
    storageType: 1,
    warehouseInTime: '2024-12-26 15:20:00',
    warningNum: 3,
    isBound: false
  },
  {
    id: 3,
    account: 'user003',
    name: '王五',
    borrowCode: 'BOR20241227003',
    borrowStatus: 2,
    brandCode: 'BR003',
    brandName: '山特维克',
    cabinetCode: 'CAB20241227003',
    cutterCode: 'CNMG120408-PM',
    cutterId: 1003,
    cutterType: '钻头',
    isBan: 0,
    locCapacity: 60,
    locPrefix: 'C',
    locSurplus: 42,
    locType: 0,
    materialCode: 'MAT003',
    materialType: '涂层硬质合金',
    packQty: 8,
    price: 156.80,
    specification: 'CNMG120408-PM',
    stockLoc: 'C03-008',
    stockStatus: 1,
    storageType: 2,
    warehouseInTime: '2024-12-25 09:45:00',
    warningNum: 8,
    isBound: true
  }
]

// 统计数据模拟
const mockStatisticsData = {
  'CAB20241227001-A': {
    cabinetNum: 150,
    disableNum: 5,
    freeNum: 20,
    makeAlarm: 10,
    priceNum: 18750.50,
    workNum: 125
  },
  'CAB20241227002-B': {
    cabinetNum: 120,
    disableNum: 3,
    freeNum: 15,
    makeAlarm: 8,
    priceNum: 10716.00,
    workNum: 102
  },
  'CAB20241227003-C': {
    cabinetNum: 180,
    disableNum: 8,
    freeNum: 25,
    makeAlarm: 12,
    priceNum: 28224.00,
    workNum: 147
  }
}

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

    // 根据品牌编码过滤
    if (searchForm.brandCode) {
      filteredData = filteredData.filter(item =>
        item.brandCode.includes(searchForm.brandCode)
      )
    }

    // 根据刀柜编码过滤
    if (searchForm.cabinetCode) {
      filteredData = filteredData.filter(item =>
        item.cabinetCode.includes(searchForm.cabinetCode)
      )
    }

    // 根据刀具型号过滤
    if (searchForm.cutterCode) {
      filteredData = filteredData.filter(item =>
        item.cutterCode.includes(searchForm.cutterCode)
      )
    }

    // 根据刀具类型过滤
    if (searchForm.cutterType) {
      filteredData = filteredData.filter(item =>
        item.cutterType.includes(searchForm.cutterType)
      )
    }

    // 根据柜子面过滤
    if (searchForm.locPrefix) {
      filteredData = filteredData.filter(item => item.locPrefix === searchForm.locPrefix)
    }

    // 根据物料编码过滤
    if (searchForm.materialCode) {
      filteredData = filteredData.filter(item =>
        item.materialCode.includes(searchForm.materialCode)
      )
    }

    // 根据规格过滤
    if (searchForm.specification) {
      filteredData = filteredData.filter(item =>
        item.specification.includes(searchForm.specification)
      )
    }

    // 根据库位号过滤
    if (searchForm.stockLoc) {
      filteredData = filteredData.filter(item =>
        item.stockLoc.includes(searchForm.stockLoc)
      )
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
    brandCode: '',
    cabinetCode: '',
    cutterCode: '',
    cutterOrBrand: '',
    cutterType: '',
    locPrefix: '',
    materialCode: '',
    specification: '',
    stockLoc: ''
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

const handleStatistics = () => {
  statisticsDialogVisible.value = true
  statisticsData.value = null
}

const handleRowStatistics = (row) => {
  // 自动填充统计表单
  statisticsForm.cabinetCode = row.cabinetCode
  statisticsForm.locPrefix = row.locPrefix

  // 打开统计对话框
  statisticsDialogVisible.value = true

  // 自动执行统计查询
  getStatistics()
}

const getStatistics = () => {
  if (!statisticsForm.cabinetCode) {
    ElMessage.warning('请输入刀柜编码')
    return
  }

  statisticsLoading.value = true

  // 模拟API调用
  setTimeout(() => {
    const key = `${statisticsForm.cabinetCode}-${statisticsForm.locPrefix || 'A'}`
    const stats = mockStatisticsData[key] || {
      cabinetNum: 0,
      disableNum: 0,
      freeNum: 0,
      makeAlarm: 0,
      priceNum: 0,
      workNum: 0
    }

    statisticsData.value = stats
    statisticsLoading.value = false
  }, 500)
}

// 绑定/解绑切换
const handleToggleBind = (row) => {
  const isBound = row.isBound || false
  const action = isBound ? '解绑' : '绑定'

  ElMessageBox.confirm(`确定要${action}库位号 ${row.stockLoc} 吗?`, `确认${action}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态
      row.isBound = !isBound
      ElMessage.success(`${action}成功!`)
    }, 500)
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

const handleBind = (row) => {
  // 重置绑定表单
  Object.assign(bindForm, {
    cutterId: row.cutterId || '',
    isBan: row.isBan || 0,
    locCapacity: row.locCapacity || null,
    locPackQty: row.packQty || null,
    locSurplus: row.locSurplus || null,
    stockId: row.id || ''
  })

  bindDialogVisible.value = true
}

const submitBind = () => {
  bindFormRef.value?.validate((valid) => {
    if (valid) {
      bindLoading.value = true

      // 模拟API调用
      setTimeout(() => {
        // 模拟绑定成功响应
        const response = {
          code: 200,
          data: null,
          msg: '绑定成功',
          success: true
        }

        if (response.success) {
          ElMessage.success(response.msg)
          bindDialogVisible.value = false
          getList() // 刷新列表
        } else {
          ElMessage.error(response.msg || '绑定失败')
        }

        bindLoading.value = false
      }, 1000)
    }
  })
}

const handleUnbind = (row) => {
  currentUnbindRow.value = row
  unbindDialogVisible.value = true
}

const submitUnbind = () => {
  unbindLoading.value = true

  // 模拟API调用，使用刀柜货道主键
  const stockId = currentUnbindRow.value.id

  setTimeout(() => {
    // 模拟解绑成功响应
    const response = {
      code: 200,
      data: null,
      msg: '解绑成功',
      success: true
    }

    if (response.success) {
      ElMessage.success(response.msg)
      unbindDialogVisible.value = false
      getList() // 刷新列表
    } else {
      ElMessage.error(response.msg || '解绑失败')
    }

    unbindLoading.value = false
  }, 1000)
}

const handlePreReplenish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要预补刀的记录')
    return
  }

  preReplenishLoading.value = true

  // 模拟API调用，使用选中行的刀柜货道主键
  const stockIds = selectedRows.value.map(row => row.id)

  setTimeout(() => {
    // 模拟预补刀响应数据
    const mockPreReplenishData = selectedRows.value.map((row, index) => ({
      cabinetCode: row.cabinetCode,
      locCapacity: row.locCapacity,
      locSurplus: row.locSurplus,
      massage: index % 3 === 0 ? '库存充足' : index % 3 === 1 ? '补货成功' : '库存不足',
      plugNum: row.locSurplus + Math.floor(Math.random() * 20) + 5,
      stockLoc: row.stockLoc,
      successStock: index % 4 !== 3 // 75%成功率
    }))

    preReplenishData.value = mockPreReplenishData
    preReplenishDialogVisible.value = true
    preReplenishLoading.value = false

    ElMessage.success(`预补刀操作完成，共处理${selectedRows.value.length}条记录`)
  }, 1500)
}

const handleReplenish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要补刀的记录')
    return
  }

  replenishLoading.value = true

  // 模拟API调用，使用选中行的刀柜货道主键
  const stockIds = selectedRows.value.map(row => row.id)

  setTimeout(() => {
    // 模拟补刀成功响应
    ElMessage.success(`补刀成功，共处理${selectedRows.value.length}条记录`)
    replenishLoading.value = false
    getList() // 刷新列表
  }, 1000)
}

// 预警设置
const handleAlarmSettings = () => {
  ElMessage.info('预警设置功能开发中...')
}

// 切换状态（禁用/启用）
const handleToggleStatus = (row) => {
  const isDisabled = row.stockStatus === 2 // 2表示维护状态（禁用）
  const action = isDisabled ? '启用' : '禁用'
  const newStatus = isDisabled ? 1 : 2 // 1表示占用（正常），2表示维护（禁用）

  ElMessageBox.confirm(`确定要${action}库位号 ${row.stockLoc} 吗?`, `确认${action}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      // 更新本地数据状态
      row.stockStatus = newStatus
      ElMessage.success(`${action}成功!`)
    }, 500)
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

const handleImport = () => {
  importDialogVisible.value = true
  // 重置导入表单
  Object.assign(importForm, {
    cabinetCode: '',
    file: null
  })
  // 清空上传组件
  uploadRef.value?.clearFiles()
}

const handleFileChange = (file) => {
  importForm.file = file.raw
}

const handleFileRemove = () => {
  importForm.file = null
}

const submitImport = () => {
  importFormRef.value?.validate((valid) => {
    if (valid) {
      if (!importForm.file) {
        ElMessage.warning('请选择要导入的文件')
        return
      }

      importLoading.value = true

      // 模拟API调用
      const formData = new FormData()
      formData.append('file', importForm.file)
      formData.append('cabinetCode', importForm.cabinetCode)

      setTimeout(() => {
        // 模拟导入成功响应
        ElMessage.success('导入成功')
        importDialogVisible.value = false
        importLoading.value = false
        getList() // 刷新列表
      }, 2000)
    }
  })
}

// 状态文本和样式方法
const getStockStatusText = (status) => {
  const statusMap = {
    0: '空闲',
    1: '占用',
    2: '维护'
  }
  return statusMap[status] || '未知'
}

const getStockStatusTagType = (status) => {
  const typeMap = {
    0: 'success',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStorageTypeText = (type) => {
  const typeMap = {
    0: '公共暂存',
    1: '个人暂存',
    2: '扩展取刀'
  }
  return typeMap[type] || '未知'
}

const getStorageTypeTagType = (type) => {
  const typeMap = {
    0: 'primary',
    1: 'success',
    2: 'warning'
  }
  return typeMap[type] || 'info'
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
    0: 'primary',
    1: 'danger',
    2: 'warning',
    3: 'info'
  }
  return typeMap[status] || 'info'
}

const getLocPrefixTagType = (prefix) => {
  const typeMap = {
    'A': 'primary',
    'B': 'success',
    'C': 'warning',
    'D': 'danger',
    'E': 'info'
  }
  return typeMap[prefix] || 'info'
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.topSearchDiv {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.buttonDiv {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
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

.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}

.statistics-form {
  margin-bottom: 20px;
}

.statistics-content {
  margin-top: 20px;
}

.unbind-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  margin-bottom: 16px;
}

.unbind-message {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
}

.unbind-tip {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.pre-replenish-content {
  margin-bottom: 20px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
}
</style>
