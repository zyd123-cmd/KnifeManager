<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="刀具柜名称:" prop="cabinetList.cabinetName">
          <el-input v-model="formInline.cabinetList.cabinetName" placeholder="请输入刀具柜名称" clearable/>
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
          <el-input v-model="formInline.createUser" placeholder="请输入创建人" clearable/>
        </el-form-item>
        <el-form-item label="刀柄类型:" prop="handleType">
          <el-input v-model="formInline.handleType" placeholder="请输入刀柄类型" clearable/>
        </el-form-item>
        <el-form-item label="刀柄规格:" prop="handleSpec">
          <el-input v-model="formInline.handleSpec" placeholder="请输入刀柄规格" clearable/>
        </el-form-item>
        <el-form-item label="价格区间:" prop="priceRange">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-input-number
              v-model="formInline.priceRange.min"
              placeholder="最低价格"
              :min="0"
              :precision="2"
              controls-position="right"
              style="width: 120px;"
            />
            <span>-</span>
            <el-input-number
              v-model="formInline.priceRange.max"
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
    <!--    中部表格显示刀柄简略信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="刀柄ID" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center"/>
        <el-table-column prop="cabinetList.cabinetName" label="刀具柜名称" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column prop="createUser" label="创建人" align="center"/>
        <el-table-column prop="handleType" label="刀柄类型" align="center"/>
        <el-table-column prop="handleSpec" label="刀柄规格" align="center"/>
        <el-table-column prop="price" label="价格" align="center">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
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
    </div>

    <!-- 新增刀柄信息对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑刀柄信息' : '新增刀柄信息'"
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
            <el-form-item label="刀柄类型" prop="handleType">
              <el-select
                v-model="addForm.handleType"
                placeholder="请选择刀柄类型"
                clearable
                style="width: 100%"
              >
                <el-option label="BT刀柄" value="BT" />
                <el-option label="HSK刀柄" value="HSK" />
                <el-option label="CAT刀柄" value="CAT" />
                <el-option label="SK刀柄" value="SK" />
                <el-option label="ER刀柄" value="ER" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刀柄规格" prop="handleSpec">
              <el-input
                v-model="addForm.handleSpec"
                placeholder="请输入刀柄规格"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="锥度" prop="taper">
              <el-select
                v-model="addForm.taper"
                placeholder="请选择锥度"
                clearable
                style="width: 100%"
              >
                <el-option label="BT30" value="BT30" />
                <el-option label="BT40" value="BT40" />
                <el-option label="BT50" value="BT50" />
                <el-option label="HSK-A63" value="HSK-A63" />
                <el-option label="HSK-A100" value="HSK-A100" />
                <el-option label="CAT40" value="CAT40" />
                <el-option label="CAT50" value="CAT50" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="长度(mm)" prop="length">
              <el-input-number
                v-model="addForm.length"
                placeholder="请输入长度"
                :min="0"
                :precision="1"
                style="width: 100%"
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
            <el-form-item label="刀柄图片" prop="images">
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
      title="批量上传刀柄信息"
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

    <!-- 刀柄详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="刀柄详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentCutterHandle">
        <el-descriptions title="刀柄基本信息" :column="2" border>
          <el-descriptions-item label="刀柄ID">{{ currentCutterHandle.id }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentCutterHandle.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具柜名称">{{ currentCutterHandle.cabinetList?.cabinetName }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCutterHandle.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentCutterHandle.createUser }}</el-descriptions-item>
          <el-descriptions-item label="刀柄类型">{{ currentCutterHandle.handleType }}</el-descriptions-item>
          <el-descriptions-item label="刀柄规格">{{ currentCutterHandle.handleSpec }}</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ currentCutterHandle.price }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentCutterHandle.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 刀柄图片展示 -->
        <div class="detail-images-section" v-if="currentCutterHandle.images && currentCutterHandle.images.length > 0">
          <h3 class="section-title">
            <el-icon><Picture /></el-icon>
            刀柄图片
          </h3>
          <div class="single-image-container">
            <div class="image-item" @click="previewImage(currentCutterHandle.images[0])">
              <el-image
                :src="currentCutterHandle.images[0].url || currentCutterHandle.images[0].response?.url || getImagePreview(currentCutterHandle.images[0])"
                alt="刀柄图片"
                fit="cover"
                class="detail-image"
                :preview-src-list="[getImagePreview(currentCutterHandle.images[0])]"
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
import {reactive, ref, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Plus, Picture, ZoomIn } from '@element-plus/icons-vue'

const formInlineRes = ref()
const uploadRef = ref()
const addFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  brandName: '', //品牌名称
  cabinetList: { //刀具柜名称
    cabinetName: ""
  },
  createTime: "",//创建时间
  createUser: "",//创建人
  handleType: "",//刀柄类型
  handleSpec: "",//刀柄规格
  priceRange: { //价格区间
    min: null,
    max: null
  },
  pageNum: 1,
  pageSize: 10
})

// 表格数据
const tableData = reactive([
  {
    id: 1,
    brandName: '三菱', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "A区-01号刀具柜"
    },
    createTime: "2024-01-15",//创建时间
    createUser: "张工程师",//创建人
    handleType: "BT",//刀柄类型
    handleSpec: "BT40-ER32-100",//刀柄规格
    taper: "BT40",//锥度
    length: 100.0,//长度
    price: "450.00", //价格
    remark: "高精度BT刀柄，适用于铣削加工"
  },
  {
    id: 2,
    brandName: '山特维克', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "A区-02号刀具柜"
    },
    createTime: "2024-01-18",//创建时间
    createUser: "李技师",//创建人
    handleType: "HSK",//刀柄类型
    handleSpec: "HSK-A63-ER25-80",//刀柄规格
    taper: "HSK-A63",//锥度
    length: 80.0,//长度
    price: "680.50", //价格
    remark: "HSK高速刀柄，适用于高速加工",
    images: [
      {
        name: 'handle1.jpg',
        url: 'https://picsum.photos/400/300?random=10',
        uid: 10
      }
    ]
  },
  {
    id: 3,
    brandName: '肯纳', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "B区-01号刀具柜"
    },
    createTime: "2024-01-20",//创建时间
    createUser: "王师傅",//创建人
    handleType: "CAT",//刀柄类型
    handleSpec: "CAT40-ER20-60",//刀柄规格
    taper: "CAT40",//锥度
    length: 60.0,//长度
    price: "320.80", //价格
    remark: "CAT刀柄，通用型"
  },
  {
    id: 4,
    brandName: '伊斯卡', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "B区-03号刀具柜"
    },
    createTime: "2024-01-22",//创建时间
    createUser: "陈主管",//创建人
    handleType: "SK",//刀柄类型
    handleSpec: "SK40-ER16-70",//刀柄规格
    taper: "SK40",//锥度
    length: 70.0,//长度
    price: "280.00", //价格
    remark: "SK刀柄，经济型选择"
  },
  {
    id: 5,
    brandName: '住友', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "C区-01号刀具柜"
    },
    createTime: "2024-01-25",//创建时间
    createUser: "刘工程师",//创建人
    handleType: "ER",//刀柄类型
    handleSpec: "ER32-20-150",//刀柄规格
    taper: "ER32",//锥度
    length: 150.0,//长度
    price: "180.90", //价格
    remark: "ER弹性夹头刀柄，夹持力强"
  },
  {
    id: 6,
    brandName: '瓦尔特', //品牌名称
    cabinetList: { //刀具柜名称
      cabinetName: "C区-02号刀具柜"
    },
    createTime: "2024-01-28",//创建时间
    createUser: "赵技师",//创建人
    handleType: "HSK",//刀柄类型
    handleSpec: "HSK-A100-ER40-120",//刀柄规格
    taper: "HSK-A100",//锥度
    length: 120.0,//长度
    price: "890.60", //价格
    remark: "大规格HSK刀柄，重载加工专用"
  }
])

// 新增/编辑相关数据
const addDialogVisible = ref(false)
const addLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)

// 详情相关数据
const detailDialogVisible = ref(false)
const currentCutterHandle = ref(null)

// 新增表单数据
const addForm = reactive({
  brandName: '',
  cabinetName: '',
  handleType: '',
  handleSpec: '',
  taper: '',
  length: null,
  price: null,
  createUser: '',
  remark: '',
  images: []
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
  handleType: [
    { required: true, message: '请选择刀柄类型', trigger: 'change' }
  ],
  handleSpec: [
    { required: true, message: '请输入刀柄规格', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  taper: [
    { required: true, message: '请选择锥度', trigger: 'change' }
  ],
  length: [
    { required: true, message: '请输入长度', trigger: 'blur' },
    { type: 'number', min: 0, message: '长度必须大于等于0', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  createUser: [
    { required: true, message: '请输入创建人', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
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
    handleType: '',
    handleSpec: '',
    taper: '',
    length: null,
    price: null,
    createUser: '',
    remark: ''
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

    // 准备提交数据
    const submitData = {
      ...addForm,
      createTime: new Date().toISOString().split('T')[0]
    }

    if (isEdit.value) {
      // 编辑模式
      submitData.id = editId.value
      // 这里调用编辑接口
      // const response = await updateHandle(submitData)
      console.log('编辑数据:', submitData)
      ElMessage.success('编辑成功!')
    } else {
      // 新增模式
      // 这里调用新增接口
      // const response = await addHandle(submitData)
      console.log('新增数据:', submitData)
      ElMessage.success('新增成功!')
    }

    closeAddDialog()

    // 刷新表格数据
    // await loadTableData()

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
    formData.append('file', fileList.value[0].raw)

    // 这里调用上传接口
    // const response = await uploadBatchHandleData(formData)

    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('批量上传成功!')
    closeBatchUploadDialog()

    // 上传成功后刷新表格数据
    // await loadTableData()

  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

const onSubmit = () => {
  // 构建搜索参数
  const searchParams = {
    ...formInline,
    // 处理价格区间
    minPrice: formInline.priceRange.min,
    maxPrice: formInline.priceRange.max
  }

  // 移除priceRange对象，使用分离的min/max参数
  delete searchParams.priceRange

  console.log('搜索参数:', searchParams)

  // 这里调用搜索接口
  // const response = await searchHandles(searchParams)

  ElMessage.success('搜索完成!')
}

const reFreshForm = (formInlineRes) => {
//   重置搜索表单
  formInlineRes.resetFields()
}

// 编辑操作
const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id

  // 填充表单数据
  Object.assign(addForm, {
    brandName: row.brandName,
    cabinetName: row.cabinetList?.cabinetName || '',
    handleType: row.handleType,
    handleSpec: row.handleSpec,
    taper: row.taper,
    length: parseFloat(row.length) || null,
    price: parseFloat(row.price) || null,
    createUser: row.createUser,
    remark: row.remark || ''
  })

  addDialogVisible.value = true
}

// 查看详情
const handleDetail = (row) => {
  currentCutterHandle.value = { ...row }
  detailDialogVisible.value = true
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里调用删除接口
    ElMessage.success('删除成功!')
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