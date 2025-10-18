<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>刀具型号排行</h3>
        <p>统计刀具型号使用排行</p>
      </div>

      <!-- 搜索表单 -->
      <el-form :model="cutterModelQueryParams" ref="cutterModelQueryRef" :inline="true" label-width="100px" class="search-form">
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

      <div class="content-body">
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
  </div>
</template>

<script setup name="CutterModelRanking">
import { reactive, ref, onMounted } from 'vue'

// 刀具型号排行数据
const cutterModelRankingData = ref([])

// 刀具型号排行查询参数
const cutterModelQueryParams = reactive({
  startTime: '',
  endTime: '',
  recordStatus: '',
  rankingType: '',
  order: ''
})

const cutterModelQueryRef = ref()

// 页面挂载时加载数据
onMounted(() => {
  loadCutterModelRankingData()
})

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

// 处理搜索
const handleCutterModelQuery = () => {
  loadCutterModelRankingData()
}

// 重置搜索条件
const resetCutterModelQuery = () => {
  cutterModelQueryRef.value.resetFields()
  loadCutterModelRankingData()
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