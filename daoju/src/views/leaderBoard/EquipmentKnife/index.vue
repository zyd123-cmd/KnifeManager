<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>设备用刀排行</h3>
        <p>统计设备用刀数量排行</p>
      </div>

      <!-- 搜索表单 -->
      <el-form :model="equipmentQueryParams" ref="equipmentQueryRef" :inline="true" label-width="100px" class="search-form">
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

      <div class="content-body">
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
  </div>
</template>

<script setup name="EquipmentRanking">
import { reactive, ref, onMounted } from 'vue'

// 设备用刀排行数据
const equipmentRankingData = ref([])

// 设备用刀排行查询参数
const equipmentQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

const equipmentQueryRef = ref()

// 页面挂载时加载数据
onMounted(() => {
  loadEquipmentRankingData()
})

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

// 处理搜索
const handleEquipmentQuery = () => {
  loadEquipmentRankingData()
}

// 重置搜索条件
const resetEquipmentQuery = () => {
  equipmentQueryRef.value.resetFields()
  loadEquipmentRankingData()
}
</script>

<style scoped>
.content-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
}

.content-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.search-form {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.statistics-content {
  margin-top: 10px;
}
</style>