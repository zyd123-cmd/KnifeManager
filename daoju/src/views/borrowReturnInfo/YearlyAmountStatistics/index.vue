<template>
  <div class="app-container">
    <div class="tab-content">
      <div class="content-header">
        <h3>全年取刀金额统计</h3>
        <p>统计全年各月取刀金额指标</p>
      </div>
      <div class="content-body">
        <el-empty v-if="!yearlyAmountData.length" description="暂无数据" />
        <div v-else class="statistics-content">
          <el-table :data="yearlyAmountData" border style="width: 100%" height="500">
            <el-table-column prop="title" label="月份" align="center" width="200"/>
            <el-table-column prop="data" label="总金额(元)" align="center">
              <template #default="scope">
                <span>¥{{ typeof scope.row.data === 'number' ? scope.row.data.toLocaleString() : scope.row.data }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="YearlyAmountStatistics">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getYearlyAmountStatistics } from '@/api/borrowReturnInfo/rankingStatistics'

// 全年取刀金额数据
const yearlyAmountData = ref([])
const loading = ref(false)

// 页面挂载时加载数据
onMounted(() => {
  loadYearlyAmountData()
})

// 加载全年取刀金额数据
const loadYearlyAmountData = async () => {
  loading.value = true
  
  try {
    // 调用真实API接口（无需请求参数）
    console.log('请求全年取刀金额统计...')
    
    const response = await getYearlyAmountStatistics()
    
    console.log('后端响应:', response)
    
    // 检查响应状态（ChartsResponse 统一响应格式）
    if (response.code === 200 && response.success) {
      // 检查data是否存在
      if (!response.data) {
        ElMessage.warning('数据为空')
        yearlyAmountData.value = []
        return
      }
      
      const { titleList, dataList } = response.data
      
      console.log('月份列表:', titleList)
      console.log('金额列表:', dataList)
      
      // 验证数据完整性
      if (titleList && dataList && titleList.length === dataList.length) {
        // 将titleList和dataList转换为表格数据格式
        yearlyAmountData.value = titleList.map((title, index) => ({
          title: title,
          data: dataList[index]
        }))
        
        // 计算全年总金额
        const totalAmount = dataList.reduce((sum, amount) => sum + amount, 0)
        
        console.log(`全年取刀金额数据加载成功，共${titleList.length}条记录`)
        console.log(`全年总金额: ￥${totalAmount.toLocaleString()}`)
        
        ElMessage.success(`成功加载${titleList.length}个月份的数据，总金额￥${totalAmount.toLocaleString()}`)
      } else {
        ElMessage.warning('数据格式不匹配')
        yearlyAmountData.value = []
      }
    } else {
      // 使用后端返回的msg字段
      ElMessage.error(response.msg || '获取数据失败')
      yearlyAmountData.value = []
    }
  } catch (error) {
    console.error('获取全年取刀金额数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
    yearlyAmountData.value = []
  } finally {
    loading.value = false
  }
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