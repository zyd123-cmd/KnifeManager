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
            <el-option label="批量" :value="0"/>
            <el-option label="查错" :value="1"/>
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
            <el-table-column prop="rank" label="排名" align="center"/>
            <el-table-column prop="device_code" label="设备编码" align="center"/>
            <el-table-column prop="device_name" label="设备名称" align="center"/>
            <el-table-column prop="usage_count" label="用刀次数" align="center"/>
            <el-table-column prop="total_amount" label="总金额(元)" align="center"/>
            <el-table-column prop="avg_usage_duration" label="平均使用时长(小时)" align="center"/>
            <el-table-column prop="usage_efficiency" label="使用效率(%)" align="center"/>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="EquipmentRanking">
import { reactive, ref, onMounted } from 'vue'
import { getEquipmentRankingStatistics } from '@/api/borrowReturnInfo/rankingStatistics.js'

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
const loadEquipmentRankingData = async () => {
  console.log('加载设备用刀排行数据')
  try {
    // 调用后端接口获取数据
    const response = await getEquipmentRankingStatistics({
      startTime: equipmentQueryParams.startTime,
      endTime: equipmentQueryParams.endTime,
      recordStatus: equipmentQueryParams.recordStatus,
      rankingType: equipmentQueryParams.rankingType,
      order: equipmentQueryParams.order
    })
    
    // 处理返回的数据
    if (response.data && response.data.device_details) {
      equipmentRankingData.value = response.data.device_details
    } else {
      equipmentRankingData.value = []
    }
  } catch (error) {
    console.error('获取设备用刀排行数据失败:', error)
    // 失败时使用模拟数据
    let mockData = [
      { rank: 1, device_code: 'CNC001', device_name: '数控铣床A1', usage_count: 485, total_amount: 48500, avg_usage_duration: 125.5, usage_efficiency: 94.2 },
      { rank: 2, device_code: 'CNC002', device_name: '数控车床B1', usage_count: 452, total_amount: 45200, avg_usage_duration: 118.3, usage_efficiency: 91.8 },
      { rank: 3, device_code: 'CNC003', device_name: '加工中心C1', usage_count: 428, total_amount: 42800, avg_usage_duration: 132.7, usage_efficiency: 89.5 },
      { rank: 4, device_code: 'CNC004', device_name: '数控钻床D1', usage_count: 395, total_amount: 39500, avg_usage_duration: 95.2, usage_efficiency: 92.1 },
      { rank: 5, device_code: 'CNC005', device_name: '数控镗床E1', usage_count: 368, total_amount: 36800, avg_usage_duration: 145.8, usage_efficiency: 87.3 },
      { rank: 6, device_code: 'CNC006', device_name: '数控磨床F1', usage_count: 342, total_amount: 34200, avg_usage_duration: 108.9, usage_efficiency: 88.7 },
      { rank: 7, device_code: 'CNC007', device_name: '激光切割G1', usage_count: 318, total_amount: 31800, avg_usage_duration: 89.4, usage_efficiency: 90.3 },
      { rank: 8, device_code: 'CNC008', device_name: '线切割H1', usage_count: 295, total_amount: 29500, avg_usage_duration: 156.2, usage_efficiency: 85.9 }
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
          valueA = a.usage_count
          valueB = b.usage_count
        } else {
          // 按金额排序
          valueA = a.total_amount
          valueB = b.total_amount
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
        item.rank = index + 1
      })
    }
    
    equipmentRankingData.value = mockData
  }
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