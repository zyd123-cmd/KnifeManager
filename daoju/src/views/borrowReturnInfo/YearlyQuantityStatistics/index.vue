<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>全年取刀数量统计</h3>
        <p>统计全年统计全年各项取刀数量指标</p>
      </div>
      <div class="content-body">
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
  </div>
</template>

<script setup name="YearlyQuantityStatistics">
import { ref, onMounted } from 'vue'

// 全年取刀数量数据
const yearlyQuantityData = ref([])

// 页面挂载时加载数据
onMounted(() => {
  loadYearlyQuantityData()
})

// 加载全年取刀数量数据
const loadYearlyQuantityData = () => {
  console.log('加载全年取刀数量数据')
  // 模拟数据（实际项目中可替换为接口请求）
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

.statistics-content {
  margin-top: 10px;
}
</style>