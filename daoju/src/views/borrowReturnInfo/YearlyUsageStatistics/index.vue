<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>刀具消耗统计</h3>
        <p>统计今年刀具消耗累计使用情况</p>
      </div>
      <div class="content-body">
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
  </div>
</template>

<script setup name="YearlyUsageStatistics">
import { ref, onMounted } from 'vue'

// 今年累计使用数据
const yearlyUsageData = ref([])

// 页面挂载时加载数据
onMounted(() => {
  loadYearlyUsageData()
})

// 加载今年累计使用数据
const loadYearlyUsageData = () => {
  console.log('加载今年累计使用数据')
  // 模拟数据（实际项目中可替换为接口请求）
  yearlyUsageData.value = [
    { cutterType: '铣刀', totalUsage: 2850, totalTime: 14250, avgLifespan: 125, replacementCount: 228, efficiency: 92.5 },
    { cutterType: '钻头', totalUsage: 3200, totalTime: 12800, avgLifespan: 80, replacementCount: 400, efficiency: 88.3 },
    { cutterType: '车刀', totalUsage: 2650, totalTime: 15900, avgLifespan: 150, replacementCount: 177, efficiency: 94.2 },
    { cutterType: '镗刀', totalUsage: 1850, totalTime: 11100, avgLifespan: 120, replacementCount: 154, efficiency: 89.7 },
    { cutterType: '丝锥', totalUsage: 1950, totalTime: 7800, avgLifespan: 60, replacementCount: 325, efficiency: 85.1 },
    { cutterType: '铰刀', totalUsage: 1450, totalTime: 8700, avgLifespan: 110, replacementCount: 132, efficiency: 91.8 }
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