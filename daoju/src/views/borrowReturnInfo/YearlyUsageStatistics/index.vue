<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>刀具消耗统计</h3>
        <p>统计今年刀具消耗的各项指标</p>
      </div>
      <div class="content-body">
        <el-empty v-if="!yearlyUsageData.length" description="暂无数据" />
        <div v-else class="statistics-content">
          <el-table :data="yearlyUsageData" border style="width: 100%" height="500">
            <el-table-column prop="title" label="统计项" align="center" width="250"/>
            <el-table-column prop="data" label="数值" align="center">
              <template #default="scope">
                <span>{{ formatDataValue(scope.row.data) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="YearlyUsageStatistics">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getYearlyUsageStatistics } from '@/api/borrowReturnInfo/rankingStatistics'

// 今年累计使用数据
const yearlyUsageData = ref([])
const loading = ref(false)

// 页面挂载时加载数据
onMounted(() => {
  loadYearlyUsageData()
})

// 加载今年累计使用数据
const loadYearlyUsageData = async () => {
  loading.value = true
  
  try {
    // 调用真实API接口（无需请求参数）
    console.log('请求刀具消耗统计...')
    
    const response = await getYearlyUsageStatistics()
    
    console.log('后端响应:', response)
    
    // 检查响应状态（ChartsResponse 统一响应格式）
    if (response.code === 200 && response.success) {
      // 检查data是否存在
      if (!response.data) {
        ElMessage.warning('数据为空')
        yearlyUsageData.value = []
        return
      }
      
      const { titleList, dataList } = response.data
      
      console.log('统计项列表:', titleList)
      console.log('数据列表:', dataList)
      
      // 验证数据完整性
      if (titleList && dataList && titleList.length === dataList.length) {
        // 将titleList和dataList转换为表格数据格式
        yearlyUsageData.value = titleList.map((title, index) => ({
          title: title,
          data: dataList[index]
        }))
        
        console.log(`刀具消耗数据加载成功，共${titleList.length}条记录`)
        
        // 判断数据类型（按刀具类型还是按统计指标）
        const isIndicatorType = titleList.some(title => 
          title.includes('累计') || title.includes('平均') || title.includes('效率') || title.includes('更换')
        )
        
        if (isIndicatorType) {
          console.log('数据类型: 按统计指标展示')
          ElMessage.success(`成功加载${titleList.length}项统计指标`)
        } else {
          console.log('数据类型: 按刀具类型统计')
          ElMessage.success(`成功加载${titleList.length}种刀具类型的数据`)
        }
      } else {
        ElMessage.warning('数据格式不匹配')
        yearlyUsageData.value = []
      }
    } else {
      // 使用后端返回的msg字段
      ElMessage.error(response.msg || '获取数据失败')
      yearlyUsageData.value = []
    }
  } catch (error) {
    console.error('获取刀具消耗数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
    yearlyUsageData.value = []
  } finally {
    loading.value = false
  }
}

// 格式化数据显示
const formatDataValue = (value) => {
  if (typeof value === 'number') {
    // 如果是小数，保疙1位小数
    if (value % 1 !== 0) {
      return value.toFixed(1)
    }
    // 如果是整数，添加千分位分隔
    return value.toLocaleString()
  }
  return value
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