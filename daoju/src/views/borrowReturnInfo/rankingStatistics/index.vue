<template>
  <div class="app-container">
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="ranking-tabs">
      <el-tab-pane label="全年取刀数量" name="yearlyQuantity">
        <div class="tab-content">
          <div class="content-header">
            <h3>全年取刀数量统计</h3>
            <p>统计全年各项取刀数量指标</p>
          </div>
          <div class="content-body" v-show="activeTab === 'yearlyQuantity'">
            <el-empty v-if="!yearlyQuantityData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="yearlyQuantityData" border style="width: 100%" height="500">
                <el-table-column prop="month" label="月份" align="center"/>
                <el-table-column prop="quantity" label="取刀数量" align="center"/>
                <el-table-column prop="totalValue" label="总价值(元)" align="center"/>
                <el-table-column prop="avgDaily" label="日均取刀" align="center"/>
                <el-table-column prop="peakDay" label="高峰日期" align="center"/>
                <el-table-column prop="peakQuantity" label="高峰数量" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="全年取刀金额" name="yearlyAmount">
        <div class="tab-content">
          <div class="content-header">
            <h3>全年取刀金额统计</h3>
            <p>统计全年各项取刀金额指标</p>
          </div>
          <div class="content-body" v-show="activeTab === 'yearlyAmount'">
            <el-empty v-if="!yearlyAmountData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="yearlyAmountData" border style="width: 100%" height="500">
                <el-table-column prop="month" label="月份" align="center"/>
                <el-table-column prop="totalAmount" label="总金额(元)" align="center"/>
                <el-table-column prop="avgAmount" label="平均金额(元)" align="center"/>
                <el-table-column prop="maxAmount" label="最高金额(元)" align="center"/>
                <el-table-column prop="minAmount" label="最低金额(元)" align="center"/>
                <el-table-column prop="growthRate" label="增长率(%)" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="今年累计使用" name="yearlyUsage">
        <div class="tab-content">
          <div class="content-header">
            <h3>今年累计使用统计</h3>
            <p>统计今年累计使用情况</p>
          </div>
          <div class="content-body" v-show="activeTab === 'yearlyUsage'">
            <el-empty v-if="!yearlyUsageData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="yearlyUsageData" border style="width: 100%" height="500">
                <el-table-column prop="cutterType" label="刀具类型" align="center"/>
                <el-table-column prop="totalUsage" label="累计使用次数" align="center"/>
                <el-table-column prop="totalTime" label="累计使用时长(小时)" align="center"/>
                <el-table-column prop="avgLifespan" label="平均寿命(小时)" align="center"/>
                <el-table-column prop="replacementCount" label="更换次数" align="center"/>
                <el-table-column prop="efficiency" label="使用效率(%)" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="员工领刀排行" name="employeeRanking">
        <div class="tab-content">
          <div class="content-header">
            <h3>员工领刀排行榜</h3>
            <p>统计员工领刀数量排行</p>
          </div>

          <!-- 搜索表单 -->
          <el-form :model="employeeQueryParams" ref="employeeQueryRef" :inline="true" label-width="100px" class="search-form" v-show="activeTab === 'employeeRanking'">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="employeeQueryParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="employeeQueryParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="记录状态" prop="recordStatus">
              <el-select v-model="employeeQueryParams.recordStatus" placeholder="请选择记录状态" clearable>
                <el-option label="取刀" :value="0"/>
                <el-option label="还刀" :value="1"/>
                <el-option label="收刀" :value="2"/>
                <el-option label="暂存" :value="3"/>
                <el-option label="完成" :value="4"/>
                <el-option label="违规还刀" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型" prop="rankingType">
              <el-select v-model="employeeQueryParams.rankingType" placeholder="请选择排序类型" clearable>
                <el-option label="数量" :value="0"/>
                <el-option label="金额" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序顺序" prop="order">
              <el-select v-model="employeeQueryParams.order" placeholder="请选择排序顺序" clearable>
                <el-option label="从大到小" :value="0"/>
                <el-option label="从小到大" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleEmployeeQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetEmployeeQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="content-body" v-show="activeTab === 'employeeRanking'">
            <el-empty v-if="!employeeRankingData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="employeeRankingData" border style="width: 100%" height="500">
                <el-table-column prop="ranking" label="排名" align="center"/>
                <el-table-column prop="employeeName" label="员工姓名" align="center"/>
                <el-table-column prop="department" label="部门" align="center"/>
                <el-table-column prop="borrowCount" label="领刀次数" align="center"/>
                <el-table-column prop="totalAmount" label="总金额(元)" align="center"/>
                <el-table-column prop="avgAmount" label="平均金额(元)" align="center"/>
                <el-table-column prop="lastBorrowTime" label="最后领刀时间" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="设备用刀排行" name="equipmentRanking">
        <div class="tab-content">
          <div class="content-header">
            <h3>设备用刀排行榜</h3>
            <p>统计设备用刀数量排行</p>
          </div>

          <!-- 搜索表单 -->
          <el-form :model="equipmentQueryParams" ref="equipmentQueryRef" :inline="true" label-width="100px" class="search-form" v-show="activeTab === 'equipmentRanking'">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="equipmentQueryParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="equipmentQueryParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="记录状态" prop="recordStatus">
              <el-select v-model="equipmentQueryParams.recordStatus" placeholder="请选择记录状态" clearable>
                <el-option label="取刀" :value="0"/>
                <el-option label="还刀" :value="1"/>
                <el-option label="收刀" :value="2"/>
                <el-option label="暂存" :value="3"/>
                <el-option label="完成" :value="4"/>
                <el-option label="违规还刀" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型" prop="rankingType">
              <el-select v-model="equipmentQueryParams.rankingType" placeholder="请选择排序类型" clearable>
                <el-option label="数量" :value="0"/>
                <el-option label="金额" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序顺序" prop="order">
              <el-select v-model="equipmentQueryParams.order" placeholder="请选择排序顺序" clearable>
                <el-option label="从大到小" :value="0"/>
                <el-option label="从小到大" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleEquipmentQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetEquipmentQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="content-body" v-show="activeTab === 'equipmentRanking'">
            <el-empty v-if="!equipmentRankingData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="equipmentRankingData" border style="width: 100%" height="500">
                <el-table-column prop="ranking" label="排名" align="center"/>
                <el-table-column prop="equipmentCode" label="设备编码" align="center"/>
                <el-table-column prop="equipmentName" label="设备名称" align="center"/>
                <el-table-column prop="usageCount" label="用刀次数" align="center"/>
                <el-table-column prop="totalAmount" label="总金额(元)" align="center"/>
                <el-table-column prop="avgUsageTime" label="平均使用时长(小时)" align="center"/>
                <el-table-column prop="efficiency" label="使用效率(%)" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="刀具型号排行" name="cutterModelRanking">
        <div class="tab-content">
          <div class="content-header">
            <h3>刀具型号排行榜</h3>
            <p>统计刀具型号使用排行</p>
          </div>

          <!-- 搜索表单 -->
          <el-form :model="cutterModelQueryParams" ref="cutterModelQueryRef" :inline="true" label-width="100px" class="search-form" v-show="activeTab === 'cutterModelRanking'">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="cutterModelQueryParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="cutterModelQueryParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="记录状态" prop="recordStatus">
              <el-select v-model="cutterModelQueryParams.recordStatus" placeholder="请选择记录状态" clearable>
                <el-option label="取刀" :value="0"/>
                <el-option label="还刀" :value="1"/>
                <el-option label="收刀" :value="2"/>
                <el-option label="暂存" :value="3"/>
                <el-option label="完成" :value="4"/>
                <el-option label="违规还刀" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型" prop="rankingType">
              <el-select v-model="cutterModelQueryParams.rankingType" placeholder="请选择排序类型" clearable>
                <el-option label="数量" :value="0"/>
                <el-option label="金额" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序顺序" prop="order">
              <el-select v-model="cutterModelQueryParams.order" placeholder="请选择排序顺序" clearable>
                <el-option label="从大到小" :value="0"/>
                <el-option label="从小到大" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleCutterModelQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetCutterModelQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="content-body" v-show="activeTab === 'cutterModelRanking'">
            <el-empty v-if="!cutterModelRankingData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="cutterModelRankingData" border style="width: 100%" height="500">
                <el-table-column prop="ranking" label="排名" align="center"/>
                <el-table-column prop="cutterCode" label="刀具型号" align="center"/>
                <el-table-column prop="cutterType" label="刀具类型" align="center"/>
                <el-table-column prop="brandName" label="品牌名称" align="center"/>
                <el-table-column prop="usageCount" label="使用次数" align="center"/>
                <el-table-column prop="totalAmount" label="总金额(元)" align="center"/>
                <el-table-column prop="avgLifespan" label="平均寿命(小时)" align="center"/>
                <el-table-column prop="popularityRate" label="受欢迎度(%)" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="工单排行" name="workOrderRanking">
        <div class="tab-content">
          <div class="content-header">
            <h3>工单排行榜</h3>
            <p>统计工单用刀排行</p>
          </div>

          <!-- 搜索表单 -->
          <el-form :model="workOrderQueryParams" ref="workOrderQueryRef" :inline="true" label-width="100px" class="search-form" v-show="activeTab === 'workOrderRanking'">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="workOrderQueryParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="workOrderQueryParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="记录状态" prop="recordStatus">
              <el-select v-model="workOrderQueryParams.recordStatus" placeholder="请选择记录状态" clearable>
                <el-option label="取刀" :value="0"/>
                <el-option label="还刀" :value="1"/>
                <el-option label="收刀" :value="2"/>
                <el-option label="暂存" :value="3"/>
                <el-option label="完成" :value="4"/>
                <el-option label="违规还刀" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型" prop="rankingType">
              <el-select v-model="workOrderQueryParams.rankingType" placeholder="请选择排序类型" clearable>
                <el-option label="数量" :value="0"/>
                <el-option label="金额" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序顺序" prop="order">
              <el-select v-model="workOrderQueryParams.order" placeholder="请选择排序顺序" clearable>
                <el-option label="从大到小" :value="0"/>
                <el-option label="从小到大" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleWorkOrderQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetWorkOrderQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="content-body" v-show="activeTab === 'workOrderRanking'">
            <el-empty v-if="!workOrderRankingData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="workOrderRankingData" border style="width: 100%" height="500">
                <el-table-column prop="ranking" label="排名" align="center"/>
                <el-table-column prop="workOrderCode" label="工单编码" align="center"/>
                <el-table-column prop="productName" label="产品名称" align="center"/>
                <el-table-column prop="cutterUsage" label="用刀数量" align="center"/>
                <el-table-column prop="totalAmount" label="总金额(元)" align="center"/>
                <el-table-column prop="completionRate" label="完成率(%)" align="center"/>
                <el-table-column prop="startTime" label="开始时间" align="center"/>
                <el-table-column prop="endTime" label="结束时间" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="异常还刀排行" name="abnormalReturnRanking">
        <div class="tab-content">
          <div class="content-header">
            <h3>异常还刀排行榜</h3>
            <p>统计异常还刀情况排行</p>
          </div>

          <!-- 搜索表单 -->
          <el-form :model="abnormalReturnQueryParams" ref="abnormalReturnQueryRef" :inline="true" label-width="100px" class="search-form" v-show="activeTab === 'abnormalReturnRanking'">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="abnormalReturnQueryParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="abnormalReturnQueryParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
            <el-form-item label="记录状态" prop="recordStatus">
              <el-select v-model="abnormalReturnQueryParams.recordStatus" placeholder="请选择记录状态" clearable>
                <el-option label="取刀" :value="0"/>
                <el-option label="还刀" :value="1"/>
                <el-option label="收刀" :value="2"/>
                <el-option label="暂存" :value="3"/>
                <el-option label="完成" :value="4"/>
                <el-option label="违规还刀" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型" prop="rankingType">
              <el-select v-model="abnormalReturnQueryParams.rankingType" placeholder="请选择排序类型" clearable>
                <el-option label="数量" :value="0"/>
                <el-option label="金额" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序顺序" prop="order">
              <el-select v-model="abnormalReturnQueryParams.order" placeholder="请选择排序顺序" clearable>
                <el-option label="从大到小" :value="0"/>
                <el-option label="从小到大" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleAbnormalReturnQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetAbnormalReturnQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <div class="content-body" v-show="activeTab === 'abnormalReturnRanking'">
            <el-empty v-if="!abnormalReturnRankingData.length" description="暂无数据" />
            <div v-else class="statistics-content">
              <el-table :data="abnormalReturnRankingData" border style="width: 100%" height="500">
                <el-table-column prop="ranking" label="排名" align="center"/>
                <el-table-column prop="employeeName" label="员工姓名" align="center"/>
                <el-table-column prop="department" label="部门" align="center"/>
                <el-table-column prop="abnormalCount" label="异常次数" align="center"/>
                <el-table-column prop="abnormalType" label="异常类型" align="center"/>
                <el-table-column prop="totalLoss" label="总损失(元)" align="center"/>
                <el-table-column prop="lastAbnormalTime" label="最后异常时间" align="center"/>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="RankingStatistics">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(false)
const activeTab = ref('yearlyQuantity')

// 各个标签页的数据
const yearlyQuantityData = ref([])
const yearlyAmountData = ref([])
const yearlyUsageData = ref([])
const employeeRankingData = ref([])
const equipmentRankingData = ref([])
const cutterModelRankingData = ref([])
const workOrderRankingData = ref([])
const abnormalReturnRankingData = ref([])

// 员工领刀排行查询参数
const employeeQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

// 设备用刀排行查询参数
const equipmentQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

// 刀具型号排行查询参数
const cutterModelQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

// 工单排行查询参数
const workOrderQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

// 异常还刀排行查询参数
const abnormalReturnQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

const employeeQueryRef = ref()
const equipmentQueryRef = ref()
const cutterModelQueryRef = ref()
const workOrderQueryRef = ref()
const abnormalReturnQueryRef = ref()

// 标签页点击事件
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.props.name)
  loadTabData(tab.props.name)
}

// 加载对应标签页的数据
const loadTabData = (tabName) => {
  loading.value = true
  
  setTimeout(() => {
    switch (tabName) {
      case 'yearlyQuantity':
        loadYearlyQuantityData()
        break
      case 'yearlyAmount':
        loadYearlyAmountData()
        break
      case 'yearlyUsage':
        loadYearlyUsageData()
        break
      case 'employeeRanking':
        loadEmployeeRankingData()
        break
      case 'equipmentRanking':
        loadEquipmentRankingData()
        break
      case 'cutterModelRanking':
        loadCutterModelRankingData()
        break
      case 'workOrderRanking':
        loadWorkOrderRankingData()
        break
      case 'abnormalReturnRanking':
        loadAbnormalReturnRankingData()
        break
    }
    loading.value = false
  }, 500)
}

// 加载全年取刀数量数据
const loadYearlyQuantityData = () => {
  console.log('加载全年取刀数量数据')
  // 模拟数据
  yearlyQuantityData.value = [
    { month: '1月', quantity: 1250, totalValue: 125000, avgDaily: 40, peakDay: '2024-01-15', peakQuantity: 85 },
    { month: '2月', quantity: 1180, totalValue: 118000, avgDaily: 42, peakDay: '2024-02-20', peakQuantity: 92 },
    { month: '3月', quantity: 1320, totalValue: 132000, avgDaily: 43, peakDay: '2024-03-10', peakQuantity: 98 },
    { month: '4月', quantity: 1280, totalValue: 128000, avgDaily: 43, peakDay: '2024-04-08', peakQuantity: 89 },
    { month: '5月', quantity: 1350, totalValue: 135000, avgDaily: 44, peakDay: '2024-05-12', peakQuantity: 95 },
    { month: '6月', quantity: 1420, totalValue: 142000, avgDaily: 47, peakDay: '2024-06-18', peakQuantity: 102 },
    { month: '7月', quantity: 1380, totalValue: 138000, avgDaily: 45, peakDay: '2024-07-22', peakQuantity: 88 },
    { month: '8月', quantity: 1450, totalValue: 145000, avgDaily: 47, peakDay: '2024-08-05', peakQuantity: 105 },
    { month: '9月', quantity: 1390, totalValue: 139000, avgDaily: 46, peakDay: '2024-09-14', peakQuantity: 97 },
    { month: '10月', quantity: 1480, totalValue: 148000, avgDaily: 48, peakDay: '2024-10-25', peakQuantity: 110 },
    { month: '11月', quantity: 1520, totalValue: 152000, avgDaily: 51, peakDay: '2024-11-08', peakQuantity: 115 },
    { month: '12月', quantity: 1580, totalValue: 158000, avgDaily: 51, peakDay: '2024-12-20', peakQuantity: 120 }
  ]
}

// 加载全年取刀金额数据
const loadYearlyAmountData = () => {
  console.log('加载全年取刀金额数据')
  // 模拟数据
  yearlyAmountData.value = [
    { month: '1月', totalAmount: 125000, avgAmount: 100, maxAmount: 500, minAmount: 50, growthRate: 5.2 },
    { month: '2月', totalAmount: 118000, avgAmount: 100, maxAmount: 480, minAmount: 45, growthRate: -5.6 },
    { month: '3月', totalAmount: 132000, avgAmount: 100, maxAmount: 520, minAmount: 55, growthRate: 11.9 },
    { month: '4月', totalAmount: 128000, avgAmount: 100, maxAmount: 510, minAmount: 50, growthRate: -3.0 },
    { month: '5月', totalAmount: 135000, avgAmount: 100, maxAmount: 530, minAmount: 60, growthRate: 5.5 },
    { month: '6月', totalAmount: 142000, avgAmount: 100, maxAmount: 550, minAmount: 55, growthRate: 5.2 },
    { month: '7月', totalAmount: 138000, avgAmount: 100, maxAmount: 540, minAmount: 50, growthRate: -2.8 },
    { month: '8月', totalAmount: 145000, avgAmount: 100, maxAmount: 560, minAmount: 65, growthRate: 5.1 },
    { month: '9月', totalAmount: 139000, avgAmount: 100, maxAmount: 545, minAmount: 55, growthRate: -4.1 },
    { month: '10月', totalAmount: 148000, avgAmount: 100, maxAmount: 570, minAmount: 60, growthRate: 6.5 },
    { month: '11月', totalAmount: 152000, avgAmount: 100, maxAmount: 580, minAmount: 65, growthRate: 2.7 },
    { month: '12月', totalAmount: 158000, avgAmount: 100, maxAmount: 600, minAmount: 70, growthRate: 3.9 }
  ]
}

// 加载今年累计使用数据
const loadYearlyUsageData = () => {
  console.log('加载今年累计使用数据')
  // 模拟数据
  yearlyUsageData.value = [
    { cutterType: '铣刀', totalUsage: 2850, totalTime: 14250, avgLifespan: 125, replacementCount: 228, efficiency: 92.5 },
    { cutterType: '钻头', totalUsage: 3200, totalTime: 12800, avgLifespan: 80, replacementCount: 400, efficiency: 88.3 },
    { cutterType: '车刀', totalUsage: 2650, totalTime: 15900, avgLifespan: 150, replacementCount: 177, efficiency: 94.2 },
    { cutterType: '镗刀', totalUsage: 1850, totalTime: 11100, avgLifespan: 120, replacementCount: 154, efficiency: 89.7 },
    { cutterType: '丝锥', totalUsage: 1950, totalTime: 7800, avgLifespan: 60, replacementCount: 325, efficiency: 85.1 },
    { cutterType: '铰刀', totalUsage: 1450, totalTime: 8700, avgLifespan: 110, replacementCount: 132, efficiency: 91.8 }
  ]
}

// 加载员工领刀排行数据
const loadEmployeeRankingData = () => {
  console.log('加载员工领刀排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, employeeName: '张三', department: '生产一部', borrowCount: 285, totalAmount: 28500, avgAmount: 100, lastBorrowTime: '2024-12-27 14:30:00' },
    { ranking: 2, employeeName: '李四', department: '生产二部', borrowCount: 268, totalAmount: 26800, avgAmount: 100, lastBorrowTime: '2024-12-27 13:45:00' },
    { ranking: 3, employeeName: '王五', department: '生产一部', borrowCount: 245, totalAmount: 24500, avgAmount: 100, lastBorrowTime: '2024-12-27 15:20:00' },
    { ranking: 4, employeeName: '赵六', department: '生产三部', borrowCount: 232, totalAmount: 23200, avgAmount: 100, lastBorrowTime: '2024-12-27 12:10:00' },
    { ranking: 5, employeeName: '孙七', department: '生产二部', borrowCount: 218, totalAmount: 21800, avgAmount: 100, lastBorrowTime: '2024-12-27 16:05:00' },
    { ranking: 6, employeeName: '周八', department: '生产一部', borrowCount: 205, totalAmount: 20500, avgAmount: 100, lastBorrowTime: '2024-12-27 11:30:00' },
    { ranking: 7, employeeName: '吴九', department: '生产三部', borrowCount: 198, totalAmount: 19800, avgAmount: 100, lastBorrowTime: '2024-12-27 14:15:00' },
    { ranking: 8, employeeName: '郑十', department: '生产二部', borrowCount: 185, totalAmount: 18500, avgAmount: 100, lastBorrowTime: '2024-12-27 13:20:00' }
  ]

  // 根据查询条件过滤和排序
  if (employeeQueryParams.recordStatus !== '') {
    // 模拟按记录状态过滤
    mockData = mockData.filter(item => Math.random() > 0.3)
  }

  if (employeeQueryParams.rankingType !== '' && employeeQueryParams.order !== '') {
    mockData.sort((a, b) => {
      let valueA, valueB
      if (employeeQueryParams.rankingType === 0) {
        // 按数量排序
        valueA = a.borrowCount
        valueB = b.borrowCount
      } else {
        // 按金额排序
        valueA = a.totalAmount
        valueB = b.totalAmount
      }

      if (employeeQueryParams.order === 0) {
        // 从大到小
        return valueB - valueA
      } else {
        // 从小到大
        return valueA - valueB
      }
    })

    // 重新设置排名
    mockData.forEach((item, index) => {
      item.ranking = index + 1
    })
  }

  employeeRankingData.value = mockData
}

// 加载设备用刀排行数据
const loadEquipmentRankingData = () => {
  console.log('加载设备用刀排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, equipmentCode: 'CNC001', equipmentName: '数控铣床A1', usageCount: 485, totalAmount: 48500, avgUsageTime: 125.5, efficiency: 94.2 },
    { ranking: 2, equipmentCode: 'CNC002', equipmentName: '数控车床B1', usageCount: 452, totalAmount: 45200, avgUsageTime: 118.3, efficiency: 91.8 },
    { ranking: 3, equipmentCode: 'CNC003', equipmentName: '加工中心C1', usageCount: 428, totalAmount: 42800, avgUsageTime: 132.7, efficiency: 89.5 },
    { ranking: 4, equipmentCode: 'CNC004', equipmentName: '数控钻床D1', usageCount: 395, totalAmount: 39500, avgUsageTime: 95.2, efficiency: 92.1 },
    { ranking: 5, equipmentCode: 'CNC005', equipmentName: '数控镗床E1', usageCount: 368, totalAmount: 36800, avgUsageTime: 145.8, efficiency: 87.3 },
    { ranking: 6, equipmentCode: 'CNC006', equipmentName: '数控磨床F1', usageCount: 342, totalAmount: 34200, avgUsageTime: 108.9, efficiency: 88.7 },
    { ranking: 7, equipmentCode: 'CNC007', equipmentName: '激光切割G1', usageCount: 318, totalAmount: 31800, avgUsageTime: 89.4, efficiency: 90.3 },
    { ranking: 8, equipmentCode: 'CNC008', equipmentName: '线切割H1', usageCount: 295, totalAmount: 29500, avgUsageTime: 156.2, efficiency: 85.9 }
  ]

  // 根据查询条件过滤和排序
  if (equipmentQueryParams.recordStatus !== '') {
    // 模拟按记录状态过滤
    mockData = mockData.filter(item => Math.random() > 0.2)
  }

  if (equipmentQueryParams.rankingType !== '' && equipmentQueryParams.order !== '') {
    mockData.sort((a, b) => {
      let valueA, valueB
      if (equipmentQueryParams.rankingType === 0) {
        // 按数量排序
        valueA = a.usageCount
        valueB = b.usageCount
      } else {
        // 按金额排序
        valueA = a.totalAmount
        valueB = b.totalAmount
      }

      if (equipmentQueryParams.order === 0) {
        // 从大到小
        return valueB - valueA
      } else {
        // 从小到大
        return valueA - valueB
      }
    })

    // 重新设置排名
    mockData.forEach((item, index) => {
      item.ranking = index + 1
    })
  }

  equipmentRankingData.value = mockData
}

// 加载刀具型号排行数据
const loadCutterModelRankingData = () => {
  console.log('加载刀具型号排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, cutterCode: 'MT001', cutterType: '铣刀', brandName: '三菱', usageCount: 325, totalAmount: 32500, avgLifespan: 125, popularityRate: 95.2 },
    { ranking: 2, cutterCode: 'KY002', cutterType: '钻头', brandName: '京瓷', usageCount: 298, totalAmount: 29800, avgLifespan: 80, popularityRate: 92.8 },
    { ranking: 3, cutterCode: 'SU003', cutterType: '车刀', brandName: '住友', usageCount: 285, totalAmount: 28500, avgLifespan: 150, popularityRate: 89.5 },
    { ranking: 4, cutterCode: 'SV004', cutterType: '铣刀', brandName: '山特维克', usageCount: 268, totalAmount: 26800, avgLifespan: 135, popularityRate: 87.3 },
    { ranking: 5, cutterCode: 'IS005', cutterType: '钻头', brandName: '伊斯卡', usageCount: 245, totalAmount: 24500, avgLifespan: 75, popularityRate: 85.1 },
    { ranking: 6, cutterCode: 'TG006', cutterType: '镗刀', brandName: '钨钢', usageCount: 228, totalAmount: 22800, avgLifespan: 110, popularityRate: 82.7 },
    { ranking: 7, cutterCode: 'CB007', cutterType: '丝锥', brandName: '钴基', usageCount: 215, totalAmount: 21500, avgLifespan: 65, popularityRate: 80.3 },
    { ranking: 8, cutterCode: 'DM008', cutterType: '铰刀', brandName: '金刚石', usageCount: 198, totalAmount: 19800, avgLifespan: 200, popularityRate: 78.9 }
  ]

  // 根据查询条件过滤和排序
  if (cutterModelQueryParams.recordStatus !== '') {
    // 模拟按记录状态过滤
    mockData = mockData.filter(item => Math.random() > 0.2)
  }

  if (cutterModelQueryParams.rankingType !== '' && cutterModelQueryParams.order !== '') {
    mockData.sort((a, b) => {
      let valueA, valueB
      if (cutterModelQueryParams.rankingType === 0) {
        // 按数量排序
        valueA = a.usageCount
        valueB = b.usageCount
      } else {
        // 按金额排序
        valueA = a.totalAmount
        valueB = b.totalAmount
      }

      if (cutterModelQueryParams.order === 0) {
        // 从大到小
        return valueB - valueA
      } else {
        // 从小到大
        return valueA - valueB
      }
    })

    // 重新设置排名
    mockData.forEach((item, index) => {
      item.ranking = index + 1
    })
  }

  cutterModelRankingData.value = mockData
}

// 加载工单排行数据
const loadWorkOrderRankingData = () => {
  console.log('加载工单排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, workOrderCode: 'WO20241201', productName: '精密齿轮', cutterUsage: 185, totalAmount: 18500, completionRate: 98.5, startTime: '2024-12-01 08:00:00', endTime: '2024-12-15 18:00:00' },
    { ranking: 2, workOrderCode: 'WO20241202', productName: '轴承座', cutterUsage: 168, totalAmount: 16800, completionRate: 95.2, startTime: '2024-12-02 08:00:00', endTime: '2024-12-18 18:00:00' },
    { ranking: 3, workOrderCode: 'WO20241203', productName: '连接器', cutterUsage: 152, totalAmount: 15200, completionRate: 92.8, startTime: '2024-12-03 08:00:00', endTime: '2024-12-20 18:00:00' },
    { ranking: 4, workOrderCode: 'WO20241204', productName: '法兰盘', cutterUsage: 145, totalAmount: 14500, completionRate: 89.5, startTime: '2024-12-04 08:00:00', endTime: '2024-12-22 18:00:00' },
    { ranking: 5, workOrderCode: 'WO20241205', productName: '支撑架', cutterUsage: 138, totalAmount: 13800, completionRate: 87.3, startTime: '2024-12-05 08:00:00', endTime: '2024-12-25 18:00:00' },
    { ranking: 6, workOrderCode: 'WO20241206', productName: '传动轴', cutterUsage: 132, totalAmount: 13200, completionRate: 85.1, startTime: '2024-12-06 08:00:00', endTime: '2024-12-26 18:00:00' },
    { ranking: 7, workOrderCode: 'WO20241207', productName: '密封圈', cutterUsage: 125, totalAmount: 12500, completionRate: 82.7, startTime: '2024-12-07 08:00:00', endTime: '2024-12-27 18:00:00' },
    { ranking: 8, workOrderCode: 'WO20241208', productName: '弹簧座', cutterUsage: 118, totalAmount: 11800, completionRate: 80.3, startTime: '2024-12-08 08:00:00', endTime: '2024-12-28 18:00:00' }
  ]

  // 根据查询条件过滤和排序
  if (workOrderQueryParams.recordStatus !== '') {
    // 模拟按记录状态过滤
    mockData = mockData.filter(item => Math.random() > 0.2)
  }

  if (workOrderQueryParams.rankingType !== '' && workOrderQueryParams.order !== '') {
    mockData.sort((a, b) => {
      let valueA, valueB
      if (workOrderQueryParams.rankingType === 0) {
        // 按数量排序
        valueA = a.cutterUsage
        valueB = b.cutterUsage
      } else {
        // 按金额排序
        valueA = a.totalAmount
        valueB = b.totalAmount
      }

      if (workOrderQueryParams.order === 0) {
        // 从大到小
        return valueB - valueA
      } else {
        // 从小到大
        return valueA - valueB
      }
    })

    // 重新设置排名
    mockData.forEach((item, index) => {
      item.ranking = index + 1
    })
  }

  workOrderRankingData.value = mockData
}

// 加载异常还刀排行数据
const loadAbnormalReturnRankingData = () => {
  console.log('加载异常还刀排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, employeeName: '陈一', department: '生产一部', abnormalCount: 15, abnormalType: '违规还刀', totalLoss: 1500, lastAbnormalTime: '2024-12-25 16:30:00' },
    { ranking: 2, employeeName: '刘二', department: '生产二部', abnormalCount: 12, abnormalType: '损坏还刀', totalLoss: 1200, lastAbnormalTime: '2024-12-24 14:20:00' },
    { ranking: 3, employeeName: '黄三', department: '生产三部', abnormalCount: 10, abnormalType: '超时还刀', totalLoss: 800, lastAbnormalTime: '2024-12-23 15:45:00' },
    { ranking: 4, employeeName: '林四', department: '生产一部', abnormalCount: 8, abnormalType: '错误还刀', totalLoss: 600, lastAbnormalTime: '2024-12-22 13:10:00' },
    { ranking: 5, employeeName: '杨五', department: '生产二部', abnormalCount: 7, abnormalType: '丢失还刀', totalLoss: 700, lastAbnormalTime: '2024-12-21 11:25:00' },
    { ranking: 6, employeeName: '王六', department: '生产三部', abnormalCount: 6, abnormalType: '延迟还刀', totalLoss: 500, lastAbnormalTime: '2024-12-20 10:15:00' },
    { ranking: 7, employeeName: '赵七', department: '生产一部', abnormalCount: 5, abnormalType: '未授权还刀', totalLoss: 400, lastAbnormalTime: '2024-12-19 09:30:00' },
    { ranking: 8, employeeName: '李八', department: '生产二部', abnormalCount: 4, abnormalType: '重复还刀', totalLoss: 300, lastAbnormalTime: '2024-12-18 14:45:00' }
  ]

  // 根据查询条件过滤和排序
  if (abnormalReturnQueryParams.recordStatus !== '') {
    // 模拟按记录状态过滤
    mockData = mockData.filter(item => Math.random() > 0.2)
  }

  if (abnormalReturnQueryParams.rankingType !== '' && abnormalReturnQueryParams.order !== '') {
    mockData.sort((a, b) => {
      let valueA, valueB
      if (abnormalReturnQueryParams.rankingType === 0) {
        // 按数量排序
        valueA = a.abnormalCount
        valueB = b.abnormalCount
      } else {
        // 按金额排序
        valueA = a.totalLoss
        valueB = b.totalLoss
      }

      if (abnormalReturnQueryParams.order === 0) {
        // 从大到小
        return valueB - valueA
      } else {
        // 从小到大
        return valueA - valueB
      }
    })

    // 重新设置排名
    mockData.forEach((item, index) => {
      item.ranking = index + 1
    })
  }

  abnormalReturnRankingData.value = mockData
}

// 员工领刀排行搜索
const handleEmployeeQuery = () => {
  loadEmployeeRankingData()
}

// 员工领刀排行重置
const resetEmployeeQuery = () => {
  employeeQueryRef.value?.resetFields()
  loadEmployeeRankingData()
}

// 设备用刀排行搜索
const handleEquipmentQuery = () => {
  loadEquipmentRankingData()
}

// 设备用刀排行重置
const resetEquipmentQuery = () => {
  equipmentQueryRef.value?.resetFields()
  loadEquipmentRankingData()
}

// 刀具型号排行搜索
const handleCutterModelQuery = () => {
  loadCutterModelRankingData()
}

// 刀具型号排行重置
const resetCutterModelQuery = () => {
  cutterModelQueryRef.value?.resetFields()
  loadCutterModelRankingData()
}

// 工单排行搜索
const handleWorkOrderQuery = () => {
  loadWorkOrderRankingData()
}

// 工单排行重置
const resetWorkOrderQuery = () => {
  workOrderQueryRef.value?.resetFields()
  loadWorkOrderRankingData()
}

// 异常还刀排行搜索
const handleAbnormalReturnQuery = () => {
  loadAbnormalReturnRankingData()
}

// 异常还刀排行重置
const resetAbnormalReturnQuery = () => {
  abnormalReturnQueryRef.value?.resetFields()
  loadAbnormalReturnRankingData()
}

// 页面加载时获取默认标签页数据
onMounted(() => {
  loadTabData(activeTab.value)
})
</script>

<style scoped>
.ranking-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px;
  min-height: 400px;
}

.content-header {
  margin-bottom: 30px;
  text-align: center;
}

.content-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.content-header p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.content-body {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-body p {
  font-size: 16px;
  color: #606266;
  text-align: center;
}

/* 标签页样式优化 */
:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap) {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: 600;
}

:deep(.el-tabs__content) {
  background: #fff;
}

.search-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.statistics-content {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 0;
}
</style>
