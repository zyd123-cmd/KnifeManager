<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请出入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="刀具柜名称:" prop="cabinetName">
          <el-input v-model="formInline.cabinetName" placeholder="请出入刀具柜名称" clearable/>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
              v-model="formInline.createTime"
              type="date"
              placeholder="请选择创建时间"
              clearable
          />
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model="formInline.createUser" placeholder="请出入创建人" clearable/>
        </el-form-item>
        <el-form-item label="刀具类型:" prop="cutterType">
          <el-input v-model="formInline.cutterType" placeholder="请出入刀具类型" clearable/>
        </el-form-item>
        <el-form-item label="刀具型号:" prop="cutterCode">
          <el-input v-model="formInline.cutterCode" placeholder="请出入刀具型号" clearable/>
        </el-form-item>
        <el-form-item label="价格区间:" prop="priceRange">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-input-number
              v-model="formInline.minPrice"
              placeholder="最低价格"
              :min="0"
              :precision="2"
              controls-position="right"
              style="width: 120px;"
            />
            <span>-</span>
            <el-input-number
              v-model="formInline.maxPrice"
              placeholder="最高价格"
              :min="0"
              :precision="2"
              controls-position="right"
              style="width: 120px;"
            />
            <span>元</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    新增按钮、批量上传、下载模版-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增</el-button>
      <el-button type="primary" icon="upload" @click="openBatchUploadDialog">批量上传</el-button>
      <el-button type="info" icon="download">下载模版</el-button>
    </div>
    <!--    中部表格显示刀头简略信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="刀头ID" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center"/>
        <el-table-column prop="cabinetName" label="刀具柜名称" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column prop="createUser" label="创建人" align="center"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center"/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <div style="display: flex; align-items: center;justify-content: center; gap: 8px;">
              <el-button type="info" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: center;"
      />
    </div>

    <!-- 新增刀头信息对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑刀头信息' : '新增刀头信息'"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-select
                v-model="addForm.brandName"
                placeholder="请选择品牌名称"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option label="山特维克" value="山特维克" />
                <el-option label="肯纳" value="肯纳" />
                <el-option label="伊斯卡" value="伊斯卡" />
                <el-option label="瓦尔特" value="瓦尔特" />
                <el-option label="京瓷" value="京瓷" />
                <el-option label="三菱" value="三菱" />
                <el-option label="住友" value="住友" />
                <el-option label="钨钢世家" value="钨钢世家" />
                <el-option label="株洲钻石" value="株洲钻石" />
                <el-option label="厦门金鹭" value="厦门金鹭" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刀具柜名称" prop="cabinetName">
              <el-select
                v-model="addForm.cabinetName"
                placeholder="请选择刀具柜名称"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option label="A区-01号刀具柜" value="A区-01号刀具柜" />
                <el-option label="A区-02号刀具柜" value="A区-02号刀具柜" />
                <el-option label="A区-03号刀具柜" value="A区-03号刀具柜" />
                <el-option label="B区-01号刀具柜" value="B区-01号刀具柜" />
                <el-option label="B区-02号刀具柜" value="B区-02号刀具柜" />
                <el-option label="B区-03号刀具柜" value="B区-03号刀具柜" />
                <el-option label="C区-01号刀具柜" value="C区-01号刀具柜" />
                <el-option label="C区-02号刀具柜" value="C区-02号刀具柜" />
                <el-option label="D区-01号刀具柜" value="D区-01号刀具柜" />
                <el-option label="D区-02号刀具柜" value="D区-02号刀具柜" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀具类型" prop="cutterCode">
              <el-select
                v-model="addForm.cutterCode"
                placeholder="请选择刀具类型"
                clearable
                style="width: 100%"
              >
                <el-option label="铣刀" value="mill" />
                <el-option label="钻头" value="drill" />
                <el-option label="车刀" value="turning" />
                <el-option label="镗刀" value="boring" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刀具型号" prop="cutterType">
              <el-input
                v-model="addForm.cutterType"
                placeholder="请输入刀具型号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="addForm.price"
                placeholder="请输入价格"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人" prop="createUser">
              <el-input
                v-model="addForm.createUser"
                placeholder="请输入创建人"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀头图片" prop="images">
              <div class="image-upload-container">
                <el-upload
                  v-model:file-list="addForm.images"
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-change="handleImageChange"
                  :on-remove="handleImageRemove"
                  :before-upload="beforeImageUpload"
                  accept="image/*"
                  :limit="1"
                >
                  <el-icon><Plus /></el-icon>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持jpg/png格式，单张图片不超过2MB，只能上传1张
                    </div>
                  </template>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="addForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitAddForm"
            :loading="addLoading"
          >
            {{ addLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量上传对话框 -->
    <el-dialog
      v-model="batchUploadDialogVisible"
      title="批量上传刀头信息"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-container">
        <div class="upload-tips">
          <el-alert
            title="上传说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>1. 请选择Excel文件进行上传（支持.xlsx、.xls格式）</p>
                <p>2. 文件大小不超过10MB</p>
                <p>3. 请确保Excel文件格式正确，可先下载模板参考</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="upload-area">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将Excel文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传xlsx/xls文件，且不超过10MB
              </div>
            </template>
          </el-upload>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeBatchUploadDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitUpload"
            :loading="uploadLoading"
            :disabled="fileList.length === 0"
          >
            {{ uploadLoading ? '上传中...' : '确认上传' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 刀头详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="刀头详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentCutterHead">
        <el-descriptions title="刀头基本信息" :column="2" border>
          <el-descriptions-item label="刀头ID">{{ currentCutterHead.id }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentCutterHead.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具柜名称">{{ currentCutterHead.cabinetList?.cabinetName }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCutterHead.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentCutterHead.createUser }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentCutterHead.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentCutterHead.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ currentCutterHead.price }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentCutterHead.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 刀头图片展示 -->
        <div class="detail-images-section" v-if="currentCutterHead.images && currentCutterHead.images.length > 0">
          <h3 class="section-title">
            <el-icon><Picture /></el-icon>
            刀头图片
          </h3>
          <div class="single-image-container">
            <div class="image-item" @click="previewImage(currentCutterHead.images[0])">
              <el-image
                :src="currentCutterHead.images[0].url || currentCutterHead.images[0].response?.url || getImagePreview(currentCutterHead.images[0])"
                alt="刀头图片"
                fit="cover"
                class="detail-image"
                :preview-src-list="[getImagePreview(currentCutterHead.images[0])]"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>加载失败</span>
                  </div>
                </template>
              </el-image>
              <div class="image-overlay">
                <el-icon><ZoomIn /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 无图片提示 -->
        <div v-else class="no-images">
          <el-empty description="暂无图片" :image-size="80">
            <template #image>
              <el-icon size="80" color="#c0c4cc"><Picture /></el-icon>
            </template>
          </el-empty>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {reactive, ref, nextTick, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Plus, Picture, ZoomIn } from '@element-plus/icons-vue'
import { getCutterList, uploadCutterData, getUploadToken, saveCutter, updateCutter, deleteCutter, getCabinetList } from '@/api/tool/cutterManagement.js'

const formInlineRes = ref()
const uploadRef = ref()
const addFormRef = ref()
// 顶部查询数据
const formInline = reactive({
  brandName: '', //品牌名称
  cabinetName: "", //刀具柜名称
  createTime: "",//创建时间
  createUser: "",//创建人
  cutterType: "",//刀具类型
  cutterCode: "",//刀具型号
  minPrice: null, //最低价格
  maxPrice: null, //最高价格
  current: 1 //当前页
  // 移除了size字段
})

// 分页数据
const pagination = reactive({
  current: 1,    // 当前页
  size: 10,      // 每页数量
  total: 0,      // 总记录数
  pages: 0       // 总页数
})

// 表格数据
const tableData = ref([])

// 新增/编辑相关数据
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)

// 刀具柜信息
const cabinetList = ref([])

// 详情相关数据
const detailDialogVisible = ref(false)
const currentCutterHead = ref(null)

// 新增表单数据
const addForm = reactive({
  brandName: '',
  cabinetName: '',
  cutterCode: '',
  cutterType: '',
  price: null,
  createUser: null,
  remark: '',
  images: [],
  // 刀具柜信息
  cabinetList: [],
  // 新增字段
  brandCode: '',
  specification: '',
  materialCode: '',
  materialType: '',
  packQty: null,
  packUnit: '',
  inventoryWarning: null,
  numberLife: null,
  timeLife: null,
  isUniqueCode: 0
})

// 表单验证规则
const addFormRules = reactive({
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  cabinetName: [
    { required: true, message: '请输入刀具柜名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  cutterCode: [
    { required: true, message: '请输入刀具型号', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  createUser: [
    { required: true, message: '请输入创建人ID', trigger: 'blur' },
    { type: 'number', message: '创建人ID必须是数字', trigger: 'blur' }
  ]
})

// 批量上传相关数据
const batchUploadDialogVisible = ref(false)
const uploadLoading = ref(false)
const fileList = ref([])

// 打开新增对话框
const openAddDialog = () => {
  isEdit.value = false
  editId.value = null
  resetAddForm()
  addDialogVisible.value = true
}

// 关闭新增对话框
const closeAddDialog = () => {
  addDialogVisible.value = false
  resetAddForm()
  addLoading.value = false
}

// 重置新增表单
const resetAddForm = () => {
  Object.assign(addForm, {
    brandName: '',
    cabinetName: '',
    cutterCode: '',
    cutterType: '',
    price: null,
    createUser: null,
    remark: '',
    cabinetList: [],
    // 重置新增字段
    brandCode: '',
    specification: '',
    materialCode: '',
    materialType: '',
    packQty: null,
    packUnit: '',
    inventoryWarning: null,
    numberLife: null,
    timeLife: null,
    isUniqueCode: 0
  })
  // 清除表单验证
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 提交新增表单
const submitAddForm = async () => {
  try {
    // 表单验证
    const valid = await addFormRef.value.validate()
    if (!valid) return

    addLoading.value = true

    // 准备提交数据，根据后端接口要求构建数据结构
    let submitData = {
      // 必填字段
      brandName: addForm.brandName,
      cabinetName: addForm.cabinetName,
      cutterCode: addForm.cutterCode,
      price: addForm.price,
      createUser: addForm.createUser,
      // 可选字段
      brandCode: addForm.brandCode || undefined,
      cutterType: addForm.cutterType || undefined,
      specification: addForm.specification || undefined,
      materialCode: addForm.materialCode || undefined,
      materialType: addForm.materialType || undefined,
      packQty: addForm.packQty || undefined,
      packUnit: addForm.packUnit || undefined,
      inventoryWarning: addForm.inventoryWarning || undefined,
      numberLife: addForm.numberLife || undefined,
      timeLife: addForm.timeLife || undefined,
      isUniqueCode: addForm.isUniqueCode
    }

    // 处理刀具柜信息
    if (addForm.cabinetList && addForm.cabinetList.length > 0) {
      submitData.cabinetList = addForm.cabinetList.map(item => ({
        cabinetCode: item.cabinetCode,
        cabinetName: item.cabinetName,
        cutterId: item.cutterId,
        locSurplus: item.locSurplus,
        stockLoc: item.stockLoc
      }))
    }

    // 如果有图片，添加图片信息
    if (addForm.images && addForm.images.length > 0) {
      submitData.imageUrlList = addForm.images.map(image => {
        return {
          name: image.name,
          url: image.url || (image.response ? image.response.url : ''),
          newFilename: 'new_' + image.name
        }
      })
    }

    console.log('提交数据:', submitData)

    let response
    if (isEdit.value) {
      // 编辑模式调用编辑接口
      response = await updateCutter(editId.value, submitData)
      console.log('编辑返回数据:', response)
    } else {
      // 新增模式调用新增接口
      response = await saveCutter(submitData)
      console.log('新增返回数据:', response)
    }

    // 处理返回结果
    if (response.success) {
      ElMessage.success(isEdit.value ? '编辑成功!' : '新增成功!')
      closeAddDialog()
      // 刷新表格数据
      await onSubmit()
    } else {
      ElMessage.error(isEdit.value ? '编辑失败: ' + response.msg : '新增失败: ' + response.msg)
    }

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '新增失败，请重试')
  } finally {
    addLoading.value = false
  }
}

// 打开批量上传对话框
const openBatchUploadDialog = () => {
  batchUploadDialogVisible.value = true
  fileList.value = []
}

// 关闭批量上传对话框
const closeBatchUploadDialog = () => {
  batchUploadDialogVisible.value = false
  fileList.value = []
  uploadLoading.value = false
}

// 文件选择变化
const handleFileChange = (file, files) => {
  fileList.value = files
}

// 文件移除
const handleFileRemove = (file, files) => {
  fileList.value = files
}

// 上传前验证
const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('只能上传Excel文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过10MB!')
    return false
  }
  return true
}

// 提交上传
const submitUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  try {
    uploadLoading.value = true

    // 创建FormData对象
    const formData = new FormData()
    // 添加文件，使用后端期望的字段名
    formData.append('file', fileList.value[0].raw)
    
    // 调用上传接口
    const response = await uploadCutterData(formData)

    // 处理返回的数据
    console.log('上传返回数据:', response)
    
    if (response.success) {
      ElMessage.success('批量上传成功!')
      closeBatchUploadDialog()
      
      // 上传成功后刷新表格数据
      await onSubmit()
    } else {
      ElMessage.error('上传失败: ' + response.msg)
    }

  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

const onSubmit = async () => {
  try {
    // 重置页码为第一页
    formInline.current = 1
    pagination.current = 1
    
    // 构建搜索参数
    const searchParams = {
      ...formInline,
      size: pagination.size // 添加分页大小参数
    }

    console.log('搜索参数:', searchParams)
    
    // 调用后端接口获取数据
    const response = await getCutterList(searchParams)
    
    // 处理返回的数据
    console.log('接口返回数据:', response)
    
    // 根据实际返回的数据结构更新表格数据
    if (response.data && response.data.records) {
      tableData.value = response.data.records
      pagination.total = response.data.total || 0
      pagination.current = response.data.current || 1
      pagination.size = response.data.size || 10
      pagination.pages = response.data.pages || 0
      // 确保分页参数与后端返回一致
      formInline.current = response.data.current || 1
    } else {
      tableData.value = []
      pagination.total = 0
      pagination.pages = 0
    }
    
    ElMessage.success('搜索完成!')
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
  }
}

// 处理页面大小变化
const handleSizeChange = (val) => {
  pagination.size = val
  formInline.current = 1
  pagination.current = 1
  onSubmit()
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  formInline.current = val
  pagination.current = val
  onSubmit()
}

// 重置表单
const reFreshForm = (formInlineRes) => {
  // 重置搜索表单
  formInlineRes.resetFields()
  // 重置分页参数
  formInline.current = 1
  pagination.current = 1
  pagination.total = 0
  pagination.pages = 0
  // 重新加载数据
  onSubmit()
}

// 页面加载时获取数据
onMounted(() => {
  onSubmit()
  fetchCabinetList()
})

// 获取刀具柜列表
const fetchCabinetList = async () => {
  try {
    const response = await getCabinetList()
    if (response.data && Array.isArray(response.data)) {
      cabinetList.value = response.data
    }
  } catch (error) {
    console.error('获取刀具柜列表失败:', error)
    ElMessage.error('获取刀具柜列表失败')
  }
}

// 编辑操作
const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id

  // 填充表单数据
  Object.assign(addForm, {
    brandName: row.brandName,
    cabinetName: row.cabinetName || row.cabinetList?.cabinetName || '',
    cutterCode: row.cutterCode,
    cutterType: row.cutterType,
    price: parseFloat(row.price) || null,
    createUser: row.createUser,
    remark: row.remark || '',
    // 填充新增字段
    brandCode: row.brandCode || '',
    specification: row.specification || '',
    materialCode: row.materialCode || '',
    materialType: row.materialType || '',
    packQty: row.packQty || null,
    packUnit: row.packUnit || '',
    inventoryWarning: row.inventoryWarning || null,
    numberLife: row.numberLife || null,
    timeLife: row.timeLife || null,
    isUniqueCode: row.isUniqueCode || 0
  })

  // 处理刀具柜信息
  if (row.cabinetList && Array.isArray(row.cabinetList)) {
    addForm.cabinetList = row.cabinetList.map(item => ({
      cabinetCode: item.cabinetCode || '',
      cabinetName: item.cabinetName || '',
      cutterId: item.cutterId || null,
      locSurplus: item.locSurplus || null,
      stockLoc: item.stockLoc || ''
    }))
  } else {
    addForm.cabinetList = []
  }

  // 如果有图片信息，需要处理图片数据
  if (row.imageUrlList && Array.isArray(row.imageUrlList)) {
    addForm.images = row.imageUrlList.map(image => {
      return {
        name: image.name || 'image.jpg',
        url: image.url || '',
        newFilename: image.newFilename || 'new_image.jpg'
      }
    })
  } else if (row.imageUrl) {
    // 如果只有一张图片
    addForm.images = [{
      name: 'image.jpg',
      url: row.imageUrl,
      newFilename: 'new_image.jpg'
    }]
  } else {
    addForm.images = []
  }

  addDialogVisible.value = true
}

// 查看详情
const handleDetail = (row) => {
  // 处理详情数据，确保字段正确显示
  const detailData = { ...row }
  
  // 处理刀具柜名称字段
  if (!detailData.cabinetName && detailData.cabinetList && detailData.cabinetList.length > 0) {
    detailData.cabinetName = detailData.cabinetList[0].cabinetName
  }
  
  // 处理刀具柜信息
  if (detailData.cabinetList && Array.isArray(detailData.cabinetList)) {
    detailData.cabinetInfo = detailData.cabinetList.map(item => ({
      cabinetCode: item.cabinetCode || '',
      cabinetName: item.cabinetName || '',
      cutterId: item.cutterId || null,
      locSurplus: item.locSurplus || null,
      stockLoc: item.stockLoc || ''
    }))
  } else {
    detailData.cabinetInfo = []
  }
  
  // 处理图片信息
  if (detailData.imageUrlList && Array.isArray(detailData.imageUrlList)) {
    detailData.images = detailData.imageUrlList
  } else if (detailData.imageUrl) {
    detailData.images = [{
      name: 'image.jpg',
      url: detailData.imageUrl,
      newFilename: 'new_image.jpg'
    }]
  } else {
    detailData.images = []
  }
  
  currentCutterHead.value = detailData
  detailDialogVisible.value = true
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 调用删除接口
      const response = await deleteCutter(row.id.toString());
      
      if (response.success) {
        ElMessage.success('删除成功!')
        // 刷新表格数据
        await onSubmit()
      } else {
        ElMessage.error('删除失败: ' + response.msg)
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 图片上传处理函数
const handleImageChange = (file, fileList) => {
  console.log('图片变更:', file, fileList)
  addForm.images = fileList
}

const handleImageRemove = (file, fileList) => {
  console.log('移除图片:', file, fileList)
  addForm.images = fileList
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 图片预览相关函数
const getImagePreview = (image) => {
  if (image.url) return image.url
  if (image.response?.url) return image.response.url
  if (image.raw) {
    return URL.createObjectURL(image.raw)
  }
  return ''
}

const getImagePreviewList = (images) => {
  return images.map(image => getImagePreview(image)).filter(url => url)
}

const previewImage = (image) => {
  console.log('预览图片:', image)
}

</script>


<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 5px 10px;

  .topSearchDiv {
    margin-top: 10px;
    width: 100%;
  }
  .buttonDiv{
    width: 100%;
    margin-bottom: 20px;
  }
}

// 批量上传对话框样式
.upload-container {
  .upload-tips {
    margin-bottom: 20px;

    :deep(.el-alert__content) {
      p {
        margin: 5px 0;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }

  .upload-area {
    .upload-demo {
      width: 100%;

      :deep(.el-upload) {
        width: 100%;
      }

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      :deep(.el-icon--upload) {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 16px;
      }

      :deep(.el-upload__text) {
        font-size: 14px;
        color: #606266;

        em {
          color: #409eff;
          font-style: normal;
        }
      }

      :deep(.el-upload__tip) {
        font-size: 12px;
        color: #909399;
        margin-top: 10px;
      }
    }
  }
}

// 新增对话框样式
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

// 表单样式优化
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

// 价格区间样式
.price-range-container {
  display: flex;
  align-items: center;
  gap: 8px;

  .price-separator {
    color: #606266;
    font-weight: 500;
  }

  .price-unit {
    color: #909399;
    font-size: 14px;
  }
}

// 图片上传样式
.image-upload-container {
  width: 100%;

  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    border-radius: 8px;
  }

  :deep(.el-upload-list--picture-card) {
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border-radius: 8px;
    }
  }

  :deep(.el-upload__tip) {
    margin-top: 10px;
    font-size: 12px;
    color: #909399;
    text-align: center;
  }
}

// 详情页面图片展示样式
.detail-images-section {
  margin-top: 30px;

  .section-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;

    .el-icon {
      margin-right: 8px;
      color: #409eff;
    }
  }
}

// 单张图片容器
.single-image-container {
  display: flex;
  justify-content: flex-start;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;

  .image-item {
    position: relative;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

      .image-overlay {
        opacity: 1;
      }
    }

    .detail-image {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      border: 1px solid #e4e7ed;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 12px;

      .el-icon {
        color: white;
        font-size: 28px;
      }
    }

    .image-error {
      width: 150px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #909399;
      border: 1px solid #e4e7ed;
      border-radius: 12px;

      .el-icon {
        font-size: 36px;
        margin-bottom: 10px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}

.no-images {
  margin-top: 30px;
  padding: 40px;
  text-align: center;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
</style>