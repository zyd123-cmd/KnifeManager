<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>异常还刀排行</h3>
        <p>统计异常还刀情况排行</p>
      </div>

      <!-- 搜索表单 -->
      <el-form :model="abnormalReturnQueryParams" ref="abnormalReturnQueryRef" :inline="true" label-width="100px" class="search-form">
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

      <div class="content-body">
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
  </div>
</template>

<script setup name="AbnormalReturnRanking">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 异常还刀排行数据
const abnormalReturnRankingData = ref([])

// 异常还刀排行查询参数
const abnormalReturnQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

const abnormalReturnQueryRef = ref()

// 页面挂载时加载数据
onMounted(() => {
  loadAbnormalReturnRankingData()
})

// 加载异常还刀排行数据
const loadAbnormalReturnRankingData = () => {
  console.log('加载异常还刀排行数据')
  // 模拟数据
  let mockData = [
    { ranking: 1, employeeName: '张三', department: '生产一部', abnormalCount: 15, abnormalType: '超时还刀', totalLoss: 3200, lastAbnormalTime: '2024-12-26 14:30:00' },
    { ranking: 2, employeeName: '李四', department: '生产二部', abnormalCount: 12, abnormalType: '损坏还刀', totalLoss: 5800, lastAbnormalTime: '2024-12-25 09:15:00' },
    { ranking: 3, employeeName: '王五', department: '生产一部', abnormalCount: 9, abnormalType: '错还刀具', totalLoss: 1500, lastAbnormalTime: '2024-12-27 11:20:00' },
    { ranking: 4, employeeName: '赵六', department: '生产三部', abnormalCount: 8, abnormalType: '超时还刀', totalLoss: 2100, lastAbnormalTime: '2024-12-26 16:40:00' },
    { ranking: 5, employeeName: '孙七', department: '生产二部', abnormalCount: 6, abnormalType: '损坏还刀', totalLoss: 4200, lastAbnormalTime: '2024-12-24 10:50:00' },
    { ranking: 6, employeeName: '周八', department: '生产一部', abnormalCount: 5, abnormalType: '错还刀具', totalLoss: 1200, lastAbnormalTime: '2024-12-27 08:30:00' },
    { ranking: 7, employeeName: '吴九', department: '生产三部', abnormalCount: 4, abnormalType: '超时还刀', totalLoss: 900, lastAbnormalTime: '2024-12-25 15:20:00' },
    { ranking: 8, employeeName: '郑十', department: '生产二部', abnormalCount: 3, abnormalType: '损坏还刀', totalLoss: 2800, lastAbnormalTime: '2024-12-23 13:10:00' }
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

// 处理搜索
const handleAbnormalReturnQuery = () => {
  loadAbnormalReturnRankingData()
}

// 重置搜索条件
const resetAbnormalReturnQuery = () => {
  abnormalReturnQueryRef.value.resetFields()
  loadAbnormalReturnRankingData()
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