<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="类型编码:" prop="typeCode">
          <el-input v-model="formInline.typeCode" placeholder="请输入类型编码" clearable/>
        </el-form-item>
        <el-form-item label="类型名称:" prop="typeName">
          <el-input v-model="formInline.typeName" placeholder="请输入类型名称" clearable/>
        </el-form-item>
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="是否已删除:" prop="isDeleted">
          <el-select v-model="formInline.isDeleted" placeholder="请选择删除状态" clearable>
            <el-option label="正常" :value="0"/>
            <el-option label="已删除" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否已封存:" prop="isSealed">
          <el-select v-model="formInline.isSealed" placeholder="请选择封存状态" clearable>
            <el-option label="正常" :value="0"/>
            <el-option label="已封存" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="父主键:" prop="parentId">
          <el-input v-model="formInline.parentId" placeholder="请输入父主键" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="handleAdd">添加</el-button>
<!--      <el-button type="danger" icon="delete" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>-->
<!--      <el-button type="success" icon="download" @click="handleExport">导出</el-button>-->
    </div>

    <!--    中部表格显示刀具类型信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%; table-layout: fixed;" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="typeCode" label="类型编码" align="center" width="120"/>
        <el-table-column prop="typeName" label="类型名称" align="center" width="150"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="specification" label="规格型号" align="center" width="150"/>
        <el-table-column prop="material" label="材质" align="center" width="100"/>
        <el-table-column prop="coating" label="涂层" align="center" width="100"/>
        <el-table-column prop="applicableMaterial" label="适用材料" align="center" width="120"/>
        <el-table-column prop="diameter" label="直径(mm)" align="center" width="100"/>
        <el-table-column prop="length" label="长度(mm)" align="center" width="100"/>
        <el-table-column prop="price" label="单价(¥)" align="center" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" width="80"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="remark" label="备注" align="center" min-width="150" show-overflow-tooltip/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paginationDiv">
      <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="刀具类型详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentCutterType">
        <!-- 基本信息 -->
        <el-descriptions title="刀具类型信息" :column="2" border>
          <el-descriptions-item label="类型编码">{{ currentCutterType.typeCode }}</el-descriptions-item>
          <el-descriptions-item label="类型名称">{{ currentCutterType.typeName }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentCutterType.brandName }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ currentCutterType.specification }}</el-descriptions-item>
          <el-descriptions-item label="材质">{{ currentCutterType.material }}</el-descriptions-item>
          <el-descriptions-item label="涂层">{{ currentCutterType.coating }}</el-descriptions-item>
          <el-descriptions-item label="适用材料">{{ currentCutterType.applicableMaterial }}</el-descriptions-item>
          <el-descriptions-item label="直径(mm)">{{ currentCutterType.diameter }}</el-descriptions-item>
          <el-descriptions-item label="长度(mm)">{{ currentCutterType.length }}</el-descriptions-item>
          <el-descriptions-item label="单价(¥)">¥{{ currentCutterType.price }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentCutterType.status === 1 ? 'success' : 'danger'">
              {{ currentCutterType.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">{{ currentCutterType.sort }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCutterType.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentCutterType.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentCutterType.remark || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑刀具类型' : '添加刀具类型'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="cutterTypeForm"
        :rules="cutterTypeRules"
        ref="cutterTypeFormRef"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典码:" prop="code">
              <el-input v-model="cutterTypeForm.code" placeholder="请输入字典码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典值:" prop="dictKey">
              <el-input v-model="cutterTypeForm.dictKey" placeholder="请输入字典值" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典名称:" prop="dictValue">
              <el-input v-model="cutterTypeForm.dictValue" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父主键:" prop="parentId">
              <el-select v-model="cutterTypeForm.parentId" placeholder="请选择父级类型" clearable>
                <el-option
                  v-for="item in parentCutterTypeList"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序:" prop="sort">
              <el-input-number v-model="cutterTypeForm.sort" :min="0" :max="999" placeholder="请输入排序" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="isDeleted">
              <el-radio-group v-model="cutterTypeForm.isDeleted">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">已删除</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="封存状态:" prop="isSealed">
              <el-radio-group v-model="cutterTypeForm.isSealed">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">已封存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户ID:" prop="tenantId">
              <el-input-number v-model="cutterTypeForm.tenantId" :min="1" placeholder="请输入租户ID" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典备注:" prop="remark">
              <el-input
                v-model="cutterTypeForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入字典备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="submitLoading"
          >
            {{ submitLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCutterType,
  getCutterType,
  addCutterType,
  updateCutterType,
  delCutterType,
  batchDelCutterType,
  exportCutterType,
  getCutterCategoryList,
  getParentCutterTypeList
} from '@/api/dataDictionary/cutterType'

const formInlineRes = ref()

// 顶部查询数据
const formInline = reactive({
  typeCode: '', // 类型编码
  typeName: '', // 类型名称
  brandName: '' // 品牌名称
})

// 分页和加载状态
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 查询参数
const queryParams = reactive({
  typeCode: '',
  typeName: '',
  brandName: ''
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const currentCutterType = ref(null)

// 模拟数据 - 刀具类型相关
const mockData = [
  {
    id: 1,
    typeCode: 'CT001',
    typeName: '立铣刀',
    brandName: '三菱',
    specification: 'R390-11T308M-PM',
    material: '硬质合金',
    coating: 'TiAlN',
    applicableMaterial: '钢材',
    diameter: 12.0,
    length: 75.0,
    price: 285.50,
    status: 1,
    sort: 1,
    createTime: '2024-12-26 08:30:00',
    updateTime: '2024-12-26 15:30:00',
    remark: '高精度立铣刀，适用于钢材加工'
  },
  {
    id: 2,
    typeCode: 'CT002',
    typeName: '钻头',
    brandName: '山特维克',
    specification: '880-D1200L20-03',
    material: '高速钢',
    coating: 'TiN',
    applicableMaterial: '铝合金',
    diameter: 12.0,
    length: 120.0,
    price: 156.80,
    status: 1,
    sort: 2,
    createTime: '2024-12-25 14:20:00',
    updateTime: '2024-12-26 10:15:00',
    remark: '高速钻头，适用于铝合金钻孔'
  },
  {
    id: 3,
    typeCode: 'CT003',
    typeName: '车刀片',
    brandName: '肯纳',
    specification: 'CNMG120408-PM',
    material: '陶瓷',
    coating: 'Al2O3',
    applicableMaterial: '铸铁',
    diameter: 0,
    length: 0,
    price: 198.60,
    status: 1,
    sort: 3,
    createTime: '2024-12-24 09:45:00',
    updateTime: '2024-12-26 09:00:00',
    remark: '陶瓷车刀片，适用于铸铁车削'
  },
  {
    id: 4,
    typeCode: 'CT004',
    typeName: '面铣刀',
    brandName: '瓦尔特',
    specification: 'F4042.B22.063.Z05.08',
    material: '硬质合金',
    coating: 'TiCN',
    applicableMaterial: '不锈钢',
    diameter: 63.0,
    length: 40.0,
    price: 1250.00,
    status: 1,
    sort: 4,
    createTime: '2024-12-23 16:30:00',
    updateTime: '2024-12-26 11:45:00',
    remark: '大型面铣刀，适用于不锈钢面铣'
  },
  {
    id: 5,
    typeCode: 'CT005',
    typeName: '丝锥',
    brandName: '京瓷',
    specification: 'M8×1.25-6H',
    material: '高速钢',
    coating: 'TiCN',
    applicableMaterial: '碳钢',
    diameter: 8.0,
    length: 80.0,
    price: 89.50,
    status: 0,
    sort: 5,
    createTime: '2024-12-22 10:15:00',
    updateTime: '2024-12-26 14:20:00',
    remark: '螺纹丝锥，适用于碳钢攻丝'
  },
  {
    id: 6,
    typeCode: 'CT006',
    typeName: '镗刀',
    brandName: '三菱',
    specification: 'A25R-SDUCR11',
    material: '硬质合金',
    coating: 'PVD',
    applicableMaterial: '合金钢',
    diameter: 25.0,
    length: 200.0,
    price: 680.00,
    status: 1,
    sort: 6,
    createTime: '2024-12-21 13:20:00',
    updateTime: '2024-12-26 16:10:00',
    remark: '精密镗刀，适用于合金钢精镗'
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用（没有请求参数）
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据类型编码筛选
      if (queryParams.typeCode) {
        filteredData = filteredData.filter(item =>
          item.typeCode.toLowerCase().includes(queryParams.typeCode.toLowerCase())
        )
      }

      // 根据类型名称筛选
      if (queryParams.typeName) {
        filteredData = filteredData.filter(item =>
          item.typeName.toLowerCase().includes(queryParams.typeName.toLowerCase())
        )
      }

      // 根据品牌名称筛选
      if (queryParams.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.toLowerCase().includes(queryParams.brandName.toLowerCase())
        )
      }

      // 根据删除状态筛选
      if (queryParams.isDeleted !== '') {
        filteredData = filteredData.filter(item =>
          item.isDeleted === queryParams.isDeleted
        )
      }

      // 根据封存状态筛选
      if (queryParams.isSealed !== '') {
        filteredData = filteredData.filter(item =>
          item.isSealed === queryParams.isSealed
        )
      }



      // 分页处理
      const start = (pagination.current - 1) * pagination.size
      const end = start + pagination.size

      tableData.value = filteredData.slice(start, end)
      pagination.total = filteredData.length
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    loading.value = false
  }
}

// 搜索功能
const onSubmit = () => {
  // 复制搜索条件到查询参数
  queryParams.typeCode = formInline.typeCode
  queryParams.typeName = formInline.typeName
  queryParams.brandName = formInline.brandName

  pagination.current = 1
  getList()
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
  // 重置所有查询参数
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = ''
  })
  pagination.current = 1
  getList()
}

// 查看详情
const handleDetail = (row) => {
  // 使用模拟数据
  const detailData = mockData.find(item => item.id === row.id)
  if (detailData) {
    currentCutterType.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页相关方法
const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 5px 10px;

  .topSearchDiv {
    width: 100%;
    margin-bottom: 20px;
  }

  .tableDiv {
    width: 100%;
    margin-bottom: 20px;
  }

  .paginationDiv {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-table) {
  .el-tag {
    font-weight: 500;
  }
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}

.detail-container {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>
