<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>员工领刀排行</h3>
        <p>统计员工领刀数量排行</p>
      </div>

      <!-- 搜索表单 -->
      <el-form :model="employeeQueryParams" ref="employeeQueryRef" :inline="true" label-width="100px" class="search-form">
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

      <div class="content-body">
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
  </div>
</template>

<script setup name="EmployeeRanking">
import { reactive, ref, onMounted } from 'vue'

// 员工领刀排行数据
const employeeRankingData = ref([])

// 员工领刀排行查询参数
const employeeQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

const employeeQueryRef = ref()

// 页面挂载时加载数据
onMounted(() => {
  loadEmployeeRankingData()
})

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

// 处理搜索
const handleEmployeeQuery = () => {
  loadEmployeeRankingData()
}

// 重置搜索条件
const resetEmployeeQuery = () => {
  employeeQueryRef.value.resetFields()
  loadEmployeeRankingData()
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