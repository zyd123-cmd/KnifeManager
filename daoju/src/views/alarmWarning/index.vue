<template>
  <div class="container">
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="预警等级:" prop="alarmLevel">
          <el-select v-model="searchForm.alarmLevel" placeholder="请选择预警等级" clearable>
            <el-option label="安全库存量预警" :value="1"/>
            <el-option label="采集阈值存储量预警" :value="2"/>
            <el-option label="紧急补货存储量报警" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型:" prop="deviceType">
          <el-select v-model="searchForm.deviceType" placeholder="请选择设备类型" clearable>
            <el-option label="刀具柜" value="cutter"/>
            <el-option label="刀柄柜" value="handle"/>
          </el-select>
        </el-form-item>
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-select v-model="searchForm.cabinetCode" placeholder="请选择刀柜" clearable>
            <el-option
              v-for="cabinet in cabinetList"
              :key="cabinet.value"
              :label="cabinet.label"
              :value="cabinet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌名称:" prop="brandName">
          <el-select v-model="searchForm.brandName" placeholder="请选择品牌" clearable>
            <el-option
              v-for="brand in brandList"
              :key="brand.value"
              :label="brand.label"
              :value="brand.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态:" prop="handleStatus">
          <el-select v-model="searchForm.handleStatus" placeholder="请选择处理状态" clearable>
            <el-option label="未处理" :value="0"/>
            <el-option label="已处理" :value="1"/>
            <el-option label="已忽略" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="resetForm" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片区域 -->
    <div class="statsCardsDiv" v-if="statisticsData">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card level-1">
            <el-statistic title="安全库存量预警" :value="statisticsData.level1Count" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card level-2">
            <el-statistic title="采集阈值存储量预警" :value="statisticsData.level2Count" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card level-3">
            <el-statistic title="紧急补货存储量报警" :value="statisticsData.level3Count" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card total">
            <el-statistic title="未处理预警总数" :value="statisticsData.unhandledCount" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="primary" icon="setting" @click="openThresholdSettings">阈值设置</el-button>
      <el-button type="success" icon="refresh" @click="handleAutoInventory" :loading="inventoryLoading">自动盘存</el-button>
      <el-button type="warning" icon="tools" @click="handleBatchProcess" :disabled="selectedRows.length === 0">批量处理</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="tableDiv">
      <el-table
        :data="tableData"
        border
        style="width: 100%; table-layout: fixed;"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column prop="id" label="预警ID" align="center" width="100"/>
        <el-table-column prop="alarmLevel" label="预警等级" align="center" width="150">
          <template #default="scope">
            <el-tag :type="getAlarmLevelTag(scope.row.alarmLevel)">
              {{ getAlarmLevelText(scope.row.alarmLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.deviceType === 'cutter' ? 'primary' : 'success'">
              {{ scope.row.deviceType === 'cutter' ? '刀具柜' : '刀柄柜' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="itemCode" label="物品编码" align="center" width="150"/>
        <el-table-column prop="itemType" label="物品类型" align="center" width="120"/>
        <el-table-column prop="currentStock" label="当前库存" align="center" width="100"/>
        <el-table-column prop="thresholdValue" label="阈值" align="center" width="80"/>
        <el-table-column prop="alarmMessage" label="预警信息" align="center" min-width="200"/>
        <el-table-column prop="handleStatus" label="处理状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getHandleStatusTag(scope.row.handleStatus)">
              {{ getHandleStatusText(scope.row.handleStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="预警时间" align="center" width="150"/>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>

            <!-- 未处理状态：显示处理和忽略按钮 -->
            <template v-if="scope.row.handleStatus === 0">
              <el-button
                type="success"
                size="small"
                @click="handleProcess(scope.row)"
              >
                处理
              </el-button>
              <el-button
                type="info"
                size="small"
                @click="handleIgnore(scope.row)"
              >
                忽略
              </el-button>
            </template>

            <!-- 已处理状态：显示重新处理和撤销处理按钮 -->
            <template v-if="scope.row.handleStatus === 1">
              <el-button
                type="warning"
                size="small"
                @click="handleReprocess(scope.row)"
              >
                重新处理
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleCancel(scope.row)"
              >
                撤销处理
              </el-button>
            </template>

            <!-- 已忽略状态：显示重新激活和删除按钮 -->
            <template v-if="scope.row.handleStatus === 2">
              <el-button
                type="success"
                size="small"
                @click="handleReactivate(scope.row)"
              >
                重新激活
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
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

    <!-- 阈值设置对话框 -->
    <el-dialog
      v-model="thresholdDialogVisible"
      title="预警阈值设置"
      width="900px"
      :close-on-click-modal="false"
      class="threshold-dialog"
      top="80px"
      :modal-append-to-body="false"
      :append-to-body="false"
    >
      <div class="threshold-content">
        <!-- 阈值设置表单 -->
        <div class="threshold-settings-section">
          <el-form :model="thresholdForm" :rules="thresholdRules" ref="thresholdFormRef" label-width="140px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="setting-card level-1-setting" shadow="never">
                  <div class="setting-header">
                    <el-icon class="setting-icon"><SuccessFilled /></el-icon>
                    <span class="setting-title">安全库存量预警</span>
                  </div>
                  <el-form-item label="预警阈值:" prop="level1Threshold">
                    <el-input-number
                      v-model="thresholdForm.level1Threshold"
                      :min="1"
                      :max="999"
                      placeholder="请输入阈值"
                      style="width: 100%"
                    />
                    <div class="threshold-hint">库存低于此值时触发预警</div>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="setting-card level-2-setting" shadow="never">
                  <div class="setting-header">
                    <el-icon class="setting-icon"><WarningFilled /></el-icon>
                    <span class="setting-title">采集阈值存储量预警</span>
                  </div>
                  <el-form-item label="预警阈值:" prop="level2Threshold">
                    <el-input-number
                      v-model="thresholdForm.level2Threshold"
                      :min="1"
                      :max="999"
                      placeholder="请输入阈值"
                      style="width: 100%"
                    />
                    <div class="threshold-hint">库存达到此值时触发预警</div>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card class="setting-card level-3-setting" shadow="never">
                  <div class="setting-header">
                    <el-icon class="setting-icon"><CircleCloseFilled /></el-icon>
                    <span class="setting-title">紧急补货存储量报警</span>
                  </div>
                  <el-form-item label="预警阈值:" prop="level3Threshold">
                    <el-input-number
                      v-model="thresholdForm.level3Threshold"
                      :min="0"
                      :max="999"
                      placeholder="请输入阈值"
                      style="width: 100%"
                    />
                    <div class="threshold-hint">库存低于或等于此值时触发紧急报警</div>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="setting-card interval-setting" shadow="never">
                  <div class="setting-header">
                    <el-icon class="setting-icon"><Timer /></el-icon>
                    <span class="setting-title">自动盘存设置</span>
                  </div>
                  <el-form-item label="盘存间隔(分钟):" prop="inventoryInterval">
                    <el-input-number
                      v-model="thresholdForm.inventoryInterval"
                      :min="1"
                      :max="1440"
                      placeholder="请输入间隔时间"
                      style="width: 100%"
                    />
                    <div class="threshold-hint">系统自动检查库存的时间间隔</div>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 预警等级说明 -->
        <div class="warning-levels-section">
          <el-row :gutter="15" class="warning-cards">
            <el-col :span="8">
              <div class="warning-card level-1">
                <div class="card-header">
                  <el-icon class="level-icon"><SuccessFilled /></el-icon>
                  <span class="level-title">安全库存量预警</span>
                </div>
                <p class="level-desc">当库存数量低于设定值时触发，提醒及时补货</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="warning-card level-2">
                <div class="card-header">
                  <el-icon class="level-icon"><WarningFilled /></el-icon>
                  <span class="level-title">采集阈值存储量预警</span>
                </div>
                <p class="level-desc">当库存数量达到采集阈值时触发，提醒注意库存变化</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="warning-card level-3">
                <div class="card-header">
                  <el-icon class="level-icon"><CircleCloseFilled /></el-icon>
                  <span class="level-title">紧急补货存储量报警</span>
                </div>
                <p class="level-desc">当库存数量极低或为0时触发，需要紧急补货</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="thresholdDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            size="large"
            @click="submitThresholdSettings"
            :loading="thresholdLoading"
          >
            <el-icon v-if="!thresholdLoading"><Check /></el-icon>
            {{ thresholdLoading ? '保存中...' : '保存设置' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预警详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预警详情" width="800px">
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions title="预警信息" :column="2" border>
          <el-descriptions-item label="预警ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="预警等级">
            <el-tag :type="getAlarmLevelTag(currentRecord.alarmLevel)">
              {{ getAlarmLevelText(currentRecord.alarmLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="设备类型">
            <el-tag :type="currentRecord.deviceType === 'cutter' ? 'primary' : 'success'">
              {{ currentRecord.deviceType === 'cutter' ? '刀具柜' : '刀柄柜' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="物品编码">{{ currentRecord.itemCode }}</el-descriptions-item>
          <el-descriptions-item label="物品类型">{{ currentRecord.itemType }}</el-descriptions-item>
          <el-descriptions-item label="当前库存">{{ currentRecord.currentStock }}</el-descriptions-item>
          <el-descriptions-item label="预警阈值">{{ currentRecord.thresholdValue }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getHandleStatusTag(currentRecord.handleStatus)">
              {{ getHandleStatusText(currentRecord.handleStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警时间">{{ currentRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="预警信息" :span="2">{{ currentRecord.alarmMessage }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.handleTime" label="处理时间">{{ currentRecord.handleTime }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.handleUser" label="处理人">{{ currentRecord.handleUser }}</el-descriptions-item>
          <el-descriptions-item v-if="currentRecord.handleRemark" label="处理备注" :span="2">{{ currentRecord.handleRemark }}</el-descriptions-item>
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

<script setup>
import { reactive, ref, onMounted, h } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  Warning,
  SuccessFilled,
  WarningFilled,
  CircleCloseFilled,
  Setting,
  Timer,
  DataLine,
  Monitor,
  DataAnalysis,
  Bell,
  User,
  Check
} from '@element-plus/icons-vue'
import {
  listAlarmWarning,
  getAlarmWarning,
  handleAlarmWarning,
  batchHandleAlarmWarning,
  getAlarmThresholds,
  updateAlarmThresholds,
  getAlarmStatistics,
  autoInventory,
  exportAlarmWarning
} from '@/api/alarmWarning/index'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const statisticsData = ref(null)
const detailDialogVisible = ref(false)
const thresholdDialogVisible = ref(false)
const thresholdLoading = ref(false)
const inventoryLoading = ref(false)
const currentRecord = ref(null)
const searchFormRef = ref()
const thresholdFormRef = ref()

// 搜索表单
const searchForm = reactive({
  alarmLevel: '',
  deviceType: '',
  cabinetCode: '',
  brandName: '',
  handleStatus: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 阈值设置表单
const thresholdForm = reactive({
  level1Threshold: 10,
  level2Threshold: 5,
  level3Threshold: 0,
  inventoryInterval: 60
})

// 阈值设置表单验证规则
const thresholdRules = reactive({
  level1Threshold: [
    { required: true, message: '请输入安全库存量预警阈值', trigger: 'blur' }
  ],
  level2Threshold: [
    { required: true, message: '请输入采集阈值存储量预警阈值', trigger: 'blur' }
  ],
  level3Threshold: [
    { required: true, message: '请输入紧急补货存储量报警阈值', trigger: 'blur' }
  ],
  inventoryInterval: [
    { required: true, message: '请输入自动盘存间隔时间', trigger: 'blur' }
  ]
})

// 下拉选项数据
const cabinetList = ref([])
const brandList = ref([])

// 模拟预警数据
const mockAlarmData = [
  {
    id: 1,
    alarmLevel: 3,
    deviceType: 'cutter',
    cabinetCode: 'CAB001',
    stockLoc: 'A01-01',
    brandName: '三菱',
    itemCode: 'R390-11T308M-PM',
    itemType: '铣刀',
    currentStock: 0,
    thresholdValue: 0,
    alarmMessage: '紧急补货：库存已为0，需要立即补货',
    handleStatus: 0,
    createTime: '2024-12-26 09:30:00',
    handleTime: null,
    handleUser: null,
    handleRemark: null
  },
  {
    id: 2,
    alarmLevel: 2,
    deviceType: 'handle',
    cabinetCode: 'HC001',
    stockLoc: 'A01-02',
    brandName: '山特维克',
    itemCode: 'BT40-ER32-100',
    itemType: 'BT40',
    currentStock: 3,
    thresholdValue: 5,
    alarmMessage: '采集阈值预警：库存数量已达到采集阈值，请注意库存变化',
    handleStatus: 0,
    createTime: '2024-12-26 10:15:00',
    handleTime: null,
    handleUser: null,
    handleRemark: null
  },
  {
    id: 3,
    alarmLevel: 1,
    deviceType: 'cutter',
    cabinetCode: 'CAB002',
    stockLoc: 'B02-03',
    brandName: '肯纳',
    itemCode: '880-D1200L20-03',
    itemType: '钻头',
    currentStock: 8,
    thresholdValue: 10,
    alarmMessage: '安全库存预警：库存数量低于安全库存量，建议及时补货',
    handleStatus: 1,
    createTime: '2024-12-26 08:45:00',
    handleTime: '2024-12-26 11:20:00',
    handleUser: '张工程师',
    handleRemark: '已安排补货，预计明天到货'
  },
  {
    id: 4,
    alarmLevel: 3,
    deviceType: 'handle',
    cabinetCode: 'HC002',
    stockLoc: 'B02-01',
    brandName: '瓦尔特',
    itemCode: 'HSK-A63-ER25-90',
    itemType: 'HSK-A63',
    currentStock: 1,
    thresholdValue: 0,
    alarmMessage: '紧急补货：库存极低，仅剩1件，需要紧急补货',
    handleStatus: 2,
    createTime: '2024-12-26 07:20:00',
    handleTime: '2024-12-26 09:10:00',
    handleUser: '李技师',
    handleRemark: '暂时忽略，下周统一补货'
  }
]

// 初始化下拉选项数据
const initSelectOptions = () => {
  // 刀柜列表
  cabinetList.value = [
    { label: 'CAB001', value: 'CAB001' },
    { label: 'CAB002', value: 'CAB002' },
    { label: 'CAB003', value: 'CAB003' },
    { label: 'HC001', value: 'HC001' },
    { label: 'HC002', value: 'HC002' }
  ]

  // 品牌列表
  brandList.value = [
    { label: '三菱', value: '三菱' },
    { label: '山特维克', value: '山特维克' },
    { label: '肯纳', value: '肯纳' },
    { label: '瓦尔特', value: '瓦尔特' },
    { label: '京瓷', value: '京瓷' }
  ]
}

// 获取预警等级文本
const getAlarmLevelText = (level) => {
  const levelMap = {
    1: '安全库存量预警',
    2: '采集阈值存储量预警',
    3: '紧急补货存储量报警'
  }
  return levelMap[level] || '未知'
}

// 获取预警等级标签类型
const getAlarmLevelTag = (level) => {
  const tagMap = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return tagMap[level] || 'info'
}

// 获取处理状态文本
const getHandleStatusText = (status) => {
  const statusMap = {
    0: '未处理',
    1: '已处理',
    2: '已忽略'
  }
  return statusMap[status] || '未知'
}

// 获取处理状态标签类型
const getHandleStatusTag = (status) => {
  const tagMap = {
    0: 'danger',
    1: 'success',
    2: 'info'
  }
  return tagMap[status] || 'info'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockAlarmData]

      // 根据搜索条件筛选
      if (searchForm.alarmLevel !== '') {
        filteredData = filteredData.filter(item =>
          item.alarmLevel === searchForm.alarmLevel
        )
      }
      if (searchForm.deviceType) {
        filteredData = filteredData.filter(item =>
          item.deviceType === searchForm.deviceType
        )
      }
      if (searchForm.cabinetCode) {
        filteredData = filteredData.filter(item =>
          item.cabinetCode === searchForm.cabinetCode
        )
      }
      if (searchForm.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.includes(searchForm.brandName)
        )
      }
      if (searchForm.handleStatus !== '') {
        filteredData = filteredData.filter(item =>
          item.handleStatus === searchForm.handleStatus
        )
      }

      // 分页处理
      const start = (pagination.current - 1) * pagination.size
      const end = start + pagination.size

      tableData.value = filteredData.slice(start, end)
      pagination.total = filteredData.length

      // 计算统计数据
      calculateStatistics(mockAlarmData)

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    loading.value = false
  }
}

// 计算统计数据
const calculateStatistics = (data) => {
  const level1Count = data.filter(item => item.alarmLevel === 1).length
  const level2Count = data.filter(item => item.alarmLevel === 2).length
  const level3Count = data.filter(item => item.alarmLevel === 3).length
  const unhandledCount = data.filter(item => item.handleStatus === 0).length

  statisticsData.value = {
    level1Count,
    level2Count,
    level3Count,
    unhandledCount
  }
}

// 搜索
const onSubmit = () => {
  pagination.current = 1
  getList()
}

// 重置搜索表单
const resetForm = () => {
  searchFormRef.value.resetFields()
  pagination.current = 1
  getList()

  // 弹出预警通知
  showAlarmNotifications()
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页相关
const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

// 查看详情
const handleDetail = (row) => {
  currentRecord.value = { ...row }
  detailDialogVisible.value = true
}

// 打开阈值设置对话框
const openThresholdSettings = () => {
  thresholdDialogVisible.value = true
}

// 提交阈值设置
const submitThresholdSettings = async () => {
  try {
    const valid = await thresholdFormRef.value.validate()
    if (!valid) return

    thresholdLoading.value = true

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('阈值设置保存成功!')
      thresholdDialogVisible.value = false
      thresholdLoading.value = false
    }, 1000)
  } catch (error) {
    console.error('保存阈值设置失败:', error)
    ElMessage.error('保存阈值设置失败，请重试')
    thresholdLoading.value = false
  }
}

// 自动盘存
const handleAutoInventory = () => {
  inventoryLoading.value = true

  setTimeout(() => {
    ElMessage.success('自动盘存完成，发现2个新的预警!')
    inventoryLoading.value = false
    getList() // 刷新列表
  }, 2000)
}

// 处理预警
const handleProcess = (row) => {
  ElMessageBox.prompt('请输入处理备注', '处理预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入处理备注'
  }).then(({ value }) => {
    // 模拟API调用
    setTimeout(() => {
      row.handleStatus = 1
      row.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      row.handleUser = '当前用户'
      row.handleRemark = value || '已处理'

      ElMessage.success('预警处理成功!')
      getList() // 刷新统计数据
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消处理')
  })
}

// 忽略预警
const handleIgnore = (row) => {
  ElMessageBox.prompt('请输入忽略原因', '忽略预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入忽略原因'
  }).then(({ value }) => {
    // 模拟API调用
    setTimeout(() => {
      row.handleStatus = 2
      row.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      row.handleUser = '当前用户'
      row.handleRemark = value || '已忽略'

      ElMessage.success('预警已忽略!')
      getList() // 刷新统计数据
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消忽略')
  })
}

// 批量处理
const handleBatchProcess = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要处理的预警记录')
    return
  }

  ElMessageBox.prompt('请输入批量处理备注', '批量处理预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入处理备注'
  }).then(({ value }) => {
    // 模拟API调用
    setTimeout(() => {
      selectedRows.value.forEach(row => {
        if (row.handleStatus === 0) {
          row.handleStatus = 1
          row.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
          row.handleUser = '当前用户'
          row.handleRemark = value || '批量处理'
        }
      })

      ElMessage.success(`批量处理成功，共处理${selectedRows.value.length}条预警!`)
      getList() // 刷新统计数据
    }, 1000)
  }).catch(() => {
    ElMessage.info('已取消批量处理')
  })
}

// 重新处理预警
const handleReprocess = (row) => {
  ElMessageBox.prompt('请输入重新处理的备注', '重新处理预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入重新处理备注'
  }).then(({ value }) => {
    // 模拟API调用
    setTimeout(() => {
      row.handleStatus = 1
      row.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      row.handleUser = '当前用户'
      row.handleRemark = value || '重新处理'

      ElMessage.success('预警重新处理成功!')
      getList() // 刷新统计数据
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消重新处理')
  })
}

// 撤销处理
const handleCancel = (row) => {
  ElMessageBox.confirm('确定要撤销此预警的处理状态吗？撤销后将变为未处理状态。', '撤销处理', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      row.handleStatus = 0
      row.handleTime = null
      row.handleUser = null
      row.handleRemark = null

      ElMessage.success('预警处理状态已撤销!')
      getList() // 刷新统计数据
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消撤销')
  })
}

// 重新激活预警
const handleReactivate = (row) => {
  ElMessageBox.confirm('确定要重新激活此预警吗？激活后将变为未处理状态。', '重新激活预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      row.handleStatus = 0
      row.handleTime = null
      row.handleUser = null
      row.handleRemark = null

      ElMessage.success('预警已重新激活!')
      getList() // 刷新统计数据
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消激活')
  })
}

// 删除预警
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除预警ID ${row.id} 的记录吗？删除后无法恢复。`, '删除预警', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    setTimeout(() => {
      // 从模拟数据中移除
      const index = mockAlarmData.findIndex(item => item.id === row.id)
      if (index > -1) {
        mockAlarmData.splice(index, 1)
      }

      ElMessage.success('预警删除成功!')
      getList() // 刷新列表
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 显示预警通知
const showAlarmNotifications = () => {
  // 获取未处理的预警数据
  const unhandledAlarms = mockAlarmData.filter(item => item.handleStatus === 0)

  // 依次弹出预警通知，每个间隔500ms
  unhandledAlarms.forEach((alarm, index) => {
    setTimeout(() => {
      const notificationType = getNotificationType(alarm.alarmLevel)
      const notificationTitle = getAlarmLevelText(alarm.alarmLevel)

      ElNotification({
        title: notificationTitle,
        message: h('div', { style: 'line-height: 1.5' }, [
          h('p', { style: 'margin: 0 0 8px 0; font-weight: bold; color: #303133' },
            `${alarm.deviceType === 'cutter' ? '刀具柜' : '刀柄柜'}: ${alarm.cabinetCode}`
          ),
          h('p', { style: 'margin: 0 0 8px 0; color: #606266' },
            `库位: ${alarm.stockLoc} | 品牌: ${alarm.brandName}`
          ),
          h('p', { style: 'margin: 0 0 8px 0; color: #606266' },
            `物品: ${alarm.itemCode} (${alarm.itemType})`
          ),
          h('p', { style: 'margin: 0 0 8px 0; color: #606266' },
            `当前库存: ${alarm.currentStock} | 阈值: ${alarm.thresholdValue}`
          ),
          h('p', { style: 'margin: 0; color: getAlarmLevelColor(alarm.alarmLevel); font-weight: bold' },
            alarm.alarmMessage
          )
        ]),
        type: notificationType,
        duration: alarm.alarmLevel === 3 ? 0 : 8000, // 紧急预警不自动关闭
        position: 'top-right',
        offset: 80, // 从面包屑下方开始显示，大约80px的偏移
        showClose: true,
        onClick: () => {
          // 点击通知跳转到对应的预警详情
          handleDetail(alarm)
        }
      })
    }, index * 500) // 每个通知间隔500ms
  })

  // 如果有未处理预警，显示汇总提示
  if (unhandledAlarms.length > 0) {
    setTimeout(() => {
      ElNotification({
        title: '预警汇总',
        message: h('div', { style: 'line-height: 1.5' }, [
          h('p', { style: 'margin: 0 0 8px 0; font-weight: bold; color: #303133' },
            `共发现 ${unhandledAlarms.length} 个未处理预警`
          ),
          h('p', { style: 'margin: 0 0 8px 0; color: #e6a23c' },
            `其中紧急预警: ${unhandledAlarms.filter(item => item.alarmLevel === 3).length} 个`
          ),
          h('p', { style: 'margin: 0; color: #909399' },
            '请及时处理相关预警，确保生产安全'
          )
        ]),
        type: 'info',
        duration: 10000,
        position: 'top-right',
        offset: 80, // 从面包屑下方开始显示，大约80px的偏移
        showClose: true
      })
    }, unhandledAlarms.length * 500 + 1000) // 在所有预警通知后1秒显示汇总
  }
}

// 获取通知类型
const getNotificationType = (alarmLevel) => {
  const typeMap = {
    1: 'success',
    2: 'warning',
    3: 'error'
  }
  return typeMap[alarmLevel] || 'info'
}

// 获取预警等级颜色
const getAlarmLevelColor = (alarmLevel) => {
  const colorMap = {
    1: '#67c23a',
    2: '#e6a23c',
    3: '#f56c6c'
  }
  return colorMap[alarmLevel] || '#909399'
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 组件挂载时初始化
onMounted(() => {
  initSelectOptions()
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

  .statsCardsDiv {
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;

    .stats-card {
      text-align: center;
      
      &.level-1 {
        border-left: 4px solid #67c23a;
        
        :deep(.el-statistic__content) {
          color: #67c23a;
        }
      }
      
      &.level-2 {
        border-left: 4px solid #e6a23c;
        
        :deep(.el-statistic__content) {
          color: #e6a23c;
        }
      }
      
      &.level-3 {
        border-left: 4px solid #f56c6c;
        
        :deep(.el-statistic__content) {
          color: #f56c6c;
        }
      }
      
      &.total {
        border-left: 4px solid #409eff;
        
        :deep(.el-statistic__content) {
          color: #409eff;
        }
      }
      
      :deep(.el-statistic__content) {
        font-size: 24px;
        font-weight: bold;
      }
      
      :deep(.el-statistic__head) {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }
    }
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

.detail-content {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 0 0 0;
}

// 阈值设置对话框样式
:deep(.threshold-dialog) {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 25px;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
}

.threshold-content {
  padding: 20px;
}

// 预警等级说明卡片
.warning-levels-section {
  margin-top: 20px;

  .warning-cards {
    .warning-card {
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      &.level-1 {
        border-left: 3px solid #67c23a;

        .level-icon {
          color: #67c23a;
        }
      }

      &.level-2 {
        border-left: 3px solid #e6a23c;

        .level-icon {
          color: #e6a23c;
        }
      }

      &.level-3 {
        border-left: 3px solid #f56c6c;

        .level-icon {
          color: #f56c6c;
        }
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .level-icon {
          font-size: 16px;
        }

        .level-title {
          font-size: 13px;
          font-weight: 600;
          color: #303133;
        }
      }

      .level-desc {
        font-size: 12px;
        color: #606266;
        margin: 0;
        line-height: 1.4;
      }
    }
  }
}

// 阈值设置表单
.threshold-settings-section {
  margin-bottom: 20px;

  .setting-card {
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 15px;

    &.level-1-setting {
      border-left: 3px solid #67c23a;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }

    &.level-2-setting {
      border-left: 3px solid #e6a23c;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    &.level-3-setting {
      border-left: 3px solid #f56c6c;
      background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
    }

    &.interval-setting {
      border-left: 3px solid #409eff;
      background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
    }

    .setting-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;

      .setting-icon {
        font-size: 16px;
      }

      .setting-title {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
      }
    }

    .threshold-hint {
      font-size: 11px;
      color: #909399;
      margin-top: 5px;
      line-height: 1.3;
    }
  }
}


</style>
