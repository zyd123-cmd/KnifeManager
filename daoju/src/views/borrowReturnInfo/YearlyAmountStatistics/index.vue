<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>全年取刀金额统计</h3>
        <p>统计全年各项取刀金额指标</p>
      </div>
      <div class="content-body">
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
  </div>
</template>

<script setup name="YearlyAmountStatistics">
import { ref, onMounted } from 'vue'

// 全年取刀金额数据
const yearlyAmountData = ref([])

// 页面挂载时加载数据
onMounted(() => {
  loadYearlyAmountData()
})

// 加载全年取刀金额数据
const loadYearlyAmountData = () => {
  console.log('加载全年取刀金额数据')
  // 模拟数据（实际项目中可替换为接口请求）
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