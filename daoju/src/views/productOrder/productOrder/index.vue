<template>
  <div class="container">
    <div>产品工单页面</div>
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="工单编号:" prop="orderCode">
          <el-input v-model="formInline.orderCode" placeholder="请输入工单编号" clearable/>
        </el-form-item>
        <el-form-item label="工单名称:" prop="orderName">
          <el-input v-model="formInline.orderName" placeholder="请输入工单名称" clearable/>
        </el-form-item>
        <el-form-item label="公司名称:" prop="company">
          <el-input v-model="formInline.company" placeholder="请输入公司名称" clearable/>
        </el-form-item>
        <el-form-item label="创建部门:" prop="createDept">
          <el-input v-model="formInline.createDept" placeholder="请输入创建部门" clearable/>
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model="formInline.createUser" placeholder="请输入创建人" clearable/>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
            v-model="formInline.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item label="刀具ID:" prop="cutterId">
          <el-select
            v-model="formInline.cutterId"
            placeholder="请选择刀具"
            clearable
            filterable
            style="width: 200px;"
          >
            <el-option
              v-for="cutter in cutterList"
              :key="cutter.id"
              :label="`${cutter.id} - ${cutter.cutterName}`"
              :value="cutter.id"
            >
              <span style="float: left">{{ cutter.id }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ cutter.cutterName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单ID:" prop="orderId">
          <el-input v-model="formInline.orderId" placeholder="请输入工单ID" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    新增按钮、批量上传、下载模版-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增工单</el-button>
      <el-button type="primary" icon="upload" @click="openBatchUploadDialog">批量上传工单</el-button>
      <el-button type="info" icon="download" @click="downloadTemplate">下载工单模版</el-button>
      <el-button
        type="danger"
        icon="delete"
        @click="batchDelete"
        :disabled="selectedRows.length === 0"
      >
        批量删除
      </el-button>
      <el-button type="success" icon="setting" @click="downloadToolTemplate">下载刀具配置模板</el-button>
      <el-button type="warning" icon="upload" @click="openToolConfigDialog">导入刀具配置</el-button>
    </div>

    <!--    中部表格显示产品工单信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="orderCode" label="工单编号" align="center" width="150"/>
        <el-table-column prop="orderName" label="工单名称" align="center" width="200"/>
        <el-table-column prop="company" label="公司名称" align="center" width="150"/>
        <el-table-column prop="createDept" label="创建部门" align="center" width="120"/>
        <el-table-column prop="createUser" label="创建人" align="center" width="100"/>
        <el-table-column prop="cutterCode" label="耗材名" align="center" width="120"/>
        <el-table-column prop="modularKey" label="所属模块" align="center" width="120"/>
        <el-table-column prop="productNum" label="产品数量" align="center" width="100"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="150"/>
        <el-table-column prop="orderState" label="工单状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.orderState === 0 ? 'success' : 'danger'">
              {{ scope.row.orderState === 0 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="业务状态" align="center" width="100">
          <template #default="scope">
            <el-tag 
              :type="scope.row.status === 'pending' ? 'warning' : 
                     scope.row.status === 'processing' ? 'primary' : 
                     scope.row.status === 'completed' ? 'success' : 'info'"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remake" label="备注" align="center" width="200" show-overflow-tooltip/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <div style="display: flex; align-items: center;justify-content: center; gap: 8px;">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </div>
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

    <!-- 新增工单对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增工单"
      width="700px"
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
            <el-form-item label="工单名称" prop="orderName">
              <el-input
                v-model="addForm.orderName"
                placeholder="请输入工单名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input
                v-model="addForm.company"
                placeholder="请输入公司名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建部门" prop="createDept">
              <el-select
                v-model="addForm.createDept"
                placeholder="请选择创建部门"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材名" prop="cutterCode">
              <el-select
                v-model="addForm.cutterCode"
                placeholder="请选择耗材"
                clearable
                filterable
                style="width: 100%"
                @change="handleCutterChange"
              >
                <el-option
                  v-for="cutter in cutterList"
                  :key="cutter.id"
                  :label="cutter.cutterName"
                  :value="cutter.cutterName"
                  :cutter-id="cutter.id"
                >
                  <span style="float: left">{{ cutter.cutterName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ cutter.cutterType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="耗材ID" prop="cutterId">
              <el-input
                v-model="addForm.cutterId"
                placeholder="选择耗材后自动填充"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属模块" prop="modularKey">
              <el-select
                v-model="addForm.modularKey"
                placeholder="请选择所属模块"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="module in moduleList"
                  :key="module.value"
                  :label="module.label"
                  :value="module.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品数量" prop="productNum">
              <el-input-number
                v-model="addForm.productNum"
                placeholder="请输入产品数量"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单状态" prop="orderState">
              <el-select
                v-model="addForm.orderState"
                placeholder="请选择工单状态"
                style="width: 100%"
              >
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="addForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="待处理" value="pending" />
                <el-option label="处理中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remake">
              <el-input
                v-model="addForm.remake"
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

    <!-- 工单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentOrder">
        <!-- 工单基本信息 -->
        <el-descriptions title="工单基本信息" :column="2" border>
          <el-descriptions-item label="工单ID">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="工单编号">{{ currentOrder.orderCode }}</el-descriptions-item>
          <el-descriptions-item label="工单名称">{{ currentOrder.orderName }}</el-descriptions-item>
          <el-descriptions-item label="公司名称">{{ currentOrder.company }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentOrder.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentOrder.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentOrder.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="所属模块">{{ currentOrder.modularKey }}</el-descriptions-item>
          <el-descriptions-item label="产品数量">{{ currentOrder.productNum }}</el-descriptions-item>
          <el-descriptions-item label="租户ID">{{ currentOrder.tenantId }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentOrder.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="工单状态">
            <el-tag :type="currentOrder.orderState === 0 ? 'success' : 'danger'">
              {{ currentOrder.orderState === 0 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag
              :type="currentOrder.status === 'pending' ? 'warning' :
                     currentOrder.status === 'processing' ? 'primary' :
                     currentOrder.status === 'completed' ? 'success' : 'info'"
            >
              {{ getStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentOrder.remake || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 关联刀具信息 -->
        <el-descriptions title="关联刀具信息" :column="2" border style="margin-top: 20px;" v-if="relatedCutter">
          <el-descriptions-item label="刀具ID">{{ relatedCutter.id }}</el-descriptions-item>
          <el-descriptions-item label="刀具名称">{{ relatedCutter.cutterName }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ relatedCutter.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="刀具品牌">{{ relatedCutter.brand }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ relatedCutter.model }}</el-descriptions-item>
          <el-descriptions-item label="刀具规格">{{ relatedCutter.spec }}</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ relatedCutter.price }}</el-descriptions-item>
          <el-descriptions-item label="库存数量">{{ relatedCutter.stock }}</el-descriptions-item>
        </el-descriptions>

        <!-- 无关联刀具提示 -->
        <el-alert
          v-else
          title="未找到关联刀具信息"
          type="warning"
          :closable="false"
          style="margin-top: 20px;"
        >
          <template #default>
            <p>该工单未关联有效的刀具信息，刀具ID：{{ currentOrder.cutterId || '无' }}</p>
          </template>
        </el-alert>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑工单对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑工单"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单编号" prop="orderCode">
              <el-input
                v-model="editForm.orderCode"
                placeholder="系统自动生成"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单名称" prop="orderName">
              <el-input
                v-model="editForm.orderName"
                placeholder="请输入工单名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input
                v-model="editForm.company"
                placeholder="请输入公司名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建部门" prop="createDept">
              <el-select
                v-model="editForm.createDept"
                placeholder="请选择创建部门"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="耗材名" prop="cutterCode">
              <el-select
                v-model="editForm.cutterCode"
                placeholder="请选择耗材"
                clearable
                filterable
                style="width: 100%"
                @change="handleEditCutterChange"
              >
                <el-option
                  v-for="cutter in cutterList"
                  :key="cutter.id"
                  :label="cutter.cutterName"
                  :value="cutter.cutterName"
                  :cutter-id="cutter.id"
                >
                  <span style="float: left">{{ cutter.cutterName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ cutter.cutterType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材ID" prop="cutterId">
              <el-input
                v-model="editForm.cutterId"
                placeholder="选择耗材后自动填充"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属模块" prop="modularKey">
              <el-select
                v-model="editForm.modularKey"
                placeholder="请选择所属模块"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="module in moduleList"
                  :key="module.value"
                  :label="module.label"
                  :value="module.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品数量" prop="productNum">
              <el-input-number
                v-model="editForm.productNum"
                placeholder="请输入产品数量"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工单状态" prop="orderState">
              <el-select
                v-model="editForm.orderState"
                placeholder="请选择工单状态"
                style="width: 100%"
              >
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="editForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="待处理" value="pending" />
                <el-option label="处理中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remake">
              <el-input
                v-model="editForm.remake"
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
          <el-button @click="closeEditDialog">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitEditForm"
            :loading="editLoading"
          >
            {{ editLoading ? '保存中...' : '确认' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量上传对话框 -->
    <el-dialog
      v-model="batchUploadDialogVisible"
      title="批量上传工单信息"
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
                <p>4. 工单编号系统会自动生成，请勿在Excel中填写</p>
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

    <!-- 刀具配置导入对话框 -->
    <el-dialog
      v-model="toolConfigDialogVisible"
      title="导入刀具配置"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-container">
        <div class="upload-tips">
          <el-alert
            title="刀具配置导入说明"
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>1. 请选择刀具配置Excel文件进行上传（支持.xlsx、.xls格式）</p>
                <p>2. 文件大小不超过10MB</p>
                <p>3. 请确保Excel文件格式正确，可先下载刀具配置模板参考</p>
                <p>4. 导入的刀具配置将应用到当前工单系统</p>
                <p>5. 重复的刀具配置将被覆盖</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="upload-area">
          <el-upload
            ref="toolUploadRef"
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleToolFileChange"
            :on-remove="handleToolFileRemove"
            :before-upload="beforeToolUpload"
            :file-list="toolFileList"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将刀具配置Excel文件拖到此处，或<em>点击上传</em>
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
          <el-button @click="closeToolConfigDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitToolConfig"
            :loading="toolUploadLoading"
            :disabled="toolFileList.length === 0"
          >
            {{ toolUploadLoading ? '导入中...' : '确认导入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const formInlineRes = ref()
const editFormRef = ref()
const addFormRef = ref()
const uploadRef = ref()
const toolUploadRef = ref()

// 顶部查询数据
const formInline = reactive({
  orderCode: '', //工单编号
  orderName: '', //工单名称
  company: '', //公司名称
  createDept: '', //创建部门
  createUser: '', //创建人
  createTime: '', //创建时间
  cutterId: '', //刀具ID
  orderId: '', //工单ID
})

// 分页和加载状态
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const queryParams = reactive({
  orderCode: '',
  orderName: '',
  company: '',
  createDept: '',
  createUser: '',
  createTimeStart: '',
  createTimeEnd: '',
  cutterId: '',
  orderId: ''
})

// 表格数据
const tableData = ref([])

// 模拟数据
const mockData = [
  {
    id: 1,
    orderCode: 'WO20241227001',
    orderName: '生产线A刀具更换工单',
    company: '精密制造有限公司',
    createDept: '生产部',
    createUser: '张工程师',
    updateUser: '李主管',
    cutterCode: '三菱铣刀',
    cutterId: 'CUTTER001',
    modularKey: '生产模块A',
    productNum: 100,
    createTime: '2024-12-25 09:00:00',
    updateTime: '2024-12-26 14:30:00',
    orderState: 0,
    status: 'processing',
    tenantId: 'T001',
    remake: '紧急生产任务，需要优先处理'
  },
  {
    id: 2,
    orderCode: 'WO20241227002',
    orderName: '设备维护刀柄更换工单',
    company: '智能制造科技公司',
    createDept: '维修部',
    createUser: '王技师',
    updateUser: '赵主管',
    cutterCode: '山特维克钻头',
    cutterId: 'CUTTER002',
    modularKey: '维护模块B',
    productNum: 50,
    createTime: '2024-12-24 10:15:00',
    updateTime: '2024-12-25 16:45:00',
    orderState: 0,
    status: 'completed',
    tenantId: 'T001',
    remake: '定期维护更换'
  },
  {
    id: 3,
    orderCode: 'WO20241227003',
    orderName: '质检部门工具校准工单',
    company: '质量检测中心',
    createDept: '质检部',
    createUser: '陈检验员',
    updateUser: '孙主管',
    cutterCode: '肯纳车刀',
    cutterId: 'CUTTER003',
    modularKey: '质检模块C',
    productNum: 25,
    createTime: '2024-12-23 08:30:00',
    updateTime: '2024-12-24 11:20:00',
    orderState: 1,
    status: 'pending',
    tenantId: 'T002',
    remake: '月度校准计划'
  },
  {
    id: 4,
    orderCode: 'WO20241227004',
    orderName: '新产品试制工单',
    company: '创新研发有限公司',
    createDept: '研发部',
    createUser: '刘工程师',
    updateUser: '周经理',
    cutterCode: '伊斯卡镗刀',
    cutterId: 'CUTTER004',
    modularKey: '研发模块D',
    productNum: 10,
    createTime: '2024-12-22 14:00:00',
    updateTime: '2024-12-23 09:15:00',
    orderState: 0,
    status: 'cancelled',
    tenantId: 'T001',
    remake: '试制方案变更，暂停执行'
  },
  {
    id: 5,
    orderCode: 'WO20241227005',
    orderName: '批量生产刀具配置工单',
    company: '大规模制造集团',
    createDept: '生产部',
    createUser: '马班长',
    updateUser: '吴主任',
    cutterCode: '住友刀片',
    cutterId: 'CUTTER005',
    modularKey: '生产模块E',
    productNum: 500,
    createTime: '2024-12-21 07:45:00',
    updateTime: '2024-12-22 18:30:00',
    orderState: 0,
    status: 'processing',
    tenantId: 'T003',
    remake: '大批量订单，分批次执行'
  }
]

// 对话框相关
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const batchUploadDialogVisible = ref(false)
const toolConfigDialogVisible = ref(false)
const editLoading = ref(false)
const addLoading = ref(false)
const uploadLoading = ref(false)
const toolUploadLoading = ref(false)
const currentOrder = ref(null)
const relatedCutter = ref(null)
const fileList = ref([])
const toolFileList = ref([])
const selectedRows = ref([])

// 编辑表单数据
const editForm = reactive({
  id: null,
  orderCode: '',
  orderName: '',
  company: '',
  createDept: '',
  cutterCode: '',
  cutterId: '',
  modularKey: '',
  productNum: 1,
  orderState: 0,
  status: 'pending',
  remake: ''
})

// 新增表单数据
const addForm = reactive({
  orderName: '',
  company: '',
  createDept: '',
  cutterCode: '',
  cutterId: '',
  modularKey: '',
  productNum: 1,
  orderState: 0,
  status: 'pending',
  remake: ''
})

// 刀具列表数据（模拟数据，实际应从刀具管理接口获取）
const cutterList = reactive([
  {
    id: 'CUTTER001',
    cutterName: '三菱铣刀',
    cutterType: '铣刀',
    brand: '三菱',
    model: 'R390-11T308M-PM',
    spec: 'Φ10×25×75',
    price: 285.50,
    stock: 50
  },
  {
    id: 'CUTTER002',
    cutterName: '山特维克钻头',
    cutterType: '钻头',
    brand: '山特维克',
    model: '880-D1200L20-03',
    spec: 'Φ12×120',
    price: 156.80,
    stock: 30
  },
  {
    id: 'CUTTER003',
    cutterName: '肯纳车刀',
    cutterType: '车刀',
    brand: '肯纳',
    model: 'CNMG120408-QM',
    spec: '12×12×4.76',
    price: 98.60,
    stock: 80
  },
  {
    id: 'CUTTER004',
    cutterName: '伊斯卡镗刀',
    cutterType: '镗刀',
    brand: '伊斯卡',
    model: 'A25T-SCLCR09',
    spec: 'Φ25×150',
    price: 420.30,
    stock: 25
  },
  {
    id: 'CUTTER005',
    cutterName: '住友刀片',
    cutterType: '刀片',
    brand: '住友',
    model: 'WNMG080408-MS',
    spec: '8×8×3.97',
    price: 45.20,
    stock: 200
  },
  {
    id: 'CUTTER006',
    cutterName: '瓦尔特面铣刀',
    cutterType: '面铣刀',
    brand: '瓦尔特',
    model: 'F4042.B22.063.Z04.08',
    spec: 'Φ63×22',
    price: 890.60,
    stock: 15
  }
])

// 部门列表数据
const departmentList = reactive([
  { value: '生产部', label: '生产部' },
  { value: '维修部', label: '维修部' },
  { value: '质检部', label: '质检部' },
  { value: '研发部', label: '研发部' },
  { value: '技术部', label: '技术部' },
  { value: '工艺部', label: '工艺部' },
  { value: '设备部', label: '设备部' },
  { value: '安全部', label: '安全部' },
  { value: '物流部', label: '物流部' },
  { value: '采购部', label: '采购部' }
])

// 模块列表数据
const moduleList = reactive([
  { value: '生产模块A', label: '生产模块A' },
  { value: '生产模块B', label: '生产模块B' },
  { value: '生产模块C', label: '生产模块C' },
  { value: '维护模块A', label: '维护模块A' },
  { value: '维护模块B', label: '维护模块B' },
  { value: '质检模块A', label: '质检模块A' },
  { value: '质检模块B', label: '质检模块B' },
  { value: '质检模块C', label: '质检模块C' },
  { value: '研发模块A', label: '研发模块A' },
  { value: '研发模块B', label: '研发模块B' },
  { value: '研发模块C', label: '研发模块C' },
  { value: '研发模块D', label: '研发模块D' },
  { value: '技术模块A', label: '技术模块A' },
  { value: '技术模块B', label: '技术模块B' },
  { value: '工艺模块A', label: '工艺模块A' },
  { value: '工艺模块B', label: '工艺模块B' },
  { value: '设备模块A', label: '设备模块A' },
  { value: '设备模块B', label: '设备模块B' }
])

// 表单验证规则
const editFormRules = reactive({
  orderName: [
    { required: true, message: '请输入工单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  createDept: [
    { required: true, message: '请选择创建部门', trigger: 'change' }
  ],
  cutterCode: [
    { required: true, message: '请选择耗材', trigger: 'change' }
  ],
  cutterId: [
    { required: true, message: '请选择耗材', trigger: 'change' }
  ],
  modularKey: [
    { required: true, message: '请选择所属模块', trigger: 'change' }
  ],
  productNum: [
    { required: true, message: '请输入产品数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '产品数量必须大于0', trigger: 'blur' }
  ],
  orderState: [
    { required: true, message: '请选择工单状态', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ]
})

// 新增表单验证规则
const addFormRules = reactive({
  orderName: [
    { required: true, message: '请输入工单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  createDept: [
    { required: true, message: '请选择创建部门', trigger: 'change' }
  ],
  cutterCode: [
    { required: true, message: '请选择耗材', trigger: 'change' }
  ],
  cutterId: [
    { required: true, message: '请选择耗材', trigger: 'change' }
  ],
  modularKey: [
    { required: true, message: '请选择所属模块', trigger: 'change' }
  ],
  productNum: [
    { required: true, message: '请输入产品数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '产品数量必须大于0', trigger: 'blur' }
  ],
  orderState: [
    { required: true, message: '请选择工单状态', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ]
})

// 获取业务状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '处理中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取列表数据
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    let filteredData = [...mockData]

    // 根据工单编号筛选
    if (queryParams.orderCode) {
      filteredData = filteredData.filter(item =>
        item.orderCode.toLowerCase().includes(queryParams.orderCode.toLowerCase())
      )
    }

    // 根据工单名称筛选
    if (queryParams.orderName) {
      filteredData = filteredData.filter(item =>
        item.orderName.toLowerCase().includes(queryParams.orderName.toLowerCase())
      )
    }

    // 根据公司名称筛选
    if (queryParams.company) {
      filteredData = filteredData.filter(item =>
        item.company.toLowerCase().includes(queryParams.company.toLowerCase())
      )
    }

    // 根据创建部门筛选
    if (queryParams.createDept) {
      filteredData = filteredData.filter(item =>
        item.createDept.toLowerCase().includes(queryParams.createDept.toLowerCase())
      )
    }

    // 根据创建人筛选
    if (queryParams.createUser) {
      filteredData = filteredData.filter(item =>
        item.createUser.toLowerCase().includes(queryParams.createUser.toLowerCase())
      )
    }

    // 根据创建时间范围筛选
    if (queryParams.createTimeStart && queryParams.createTimeEnd) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createTime)
        const startDate = new Date(queryParams.createTimeStart)
        const endDate = new Date(queryParams.createTimeEnd)
        return itemDate >= startDate && itemDate <= endDate
      })
    }

    // 根据刀具ID筛选
    if (queryParams.cutterId) {
      filteredData = filteredData.filter(item =>
        item.cutterId === queryParams.cutterId
      )
    }

    // 根据工单ID筛选
    if (queryParams.orderId) {
      filteredData = filteredData.filter(item =>
        item.id.toString() === queryParams.orderId.toString()
      )
    }

    // 分页处理
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    tableData.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

// 搜索功能
const onSubmit = () => {
  // 复制搜索条件到查询参数
  queryParams.orderCode = formInline.orderCode
  queryParams.orderName = formInline.orderName
  queryParams.company = formInline.company
  queryParams.createDept = formInline.createDept
  queryParams.createUser = formInline.createUser
  queryParams.cutterId = formInline.cutterId
  queryParams.orderId = formInline.orderId

  // 处理时间范围
  if (formInline.createTime && formInline.createTime.length === 2) {
    queryParams.createTimeStart = formInline.createTime[0].toISOString().split('T')[0]
    queryParams.createTimeEnd = formInline.createTime[1].toISOString().split('T')[0]
  } else {
    queryParams.createTimeStart = ''
    queryParams.createTimeEnd = ''
  }

  pagination.current = 1
  getList()
}

// 重置搜索表单
const reFreshForm = (formInlineRes) => {
  formInlineRes.resetFields()
  // 重置所有查询参数
  queryParams.orderCode = ''
  queryParams.orderName = ''
  queryParams.company = ''
  queryParams.createDept = ''
  queryParams.createUser = ''
  queryParams.createTimeStart = ''
  queryParams.createTimeEnd = ''
  queryParams.cutterId = ''
  queryParams.orderId = ''
  pagination.current = 1
  getList()
}

// 查看详情
const handleDetail = (row) => {
  currentOrder.value = { ...row }

  // 根据工单中的cutterId查找关联的刀具信息
  if (row.cutterId) {
    relatedCutter.value = cutterList.find(cutter => cutter.id === row.cutterId) || null
  } else {
    relatedCutter.value = null
  }

  detailDialogVisible.value = true
}

// 删除单个工单
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除工单 "${row.orderName}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里调用删除接口
    // const response = await deleteOrder(row.id)
    console.log('删除工单:', row)
    ElMessage.success('删除成功!')
    getList() // 刷新列表
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 表格选择变更
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 批量删除
const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的工单')
    return
  }

  const orderNames = selectedRows.value.map(row => row.orderName).join('、')

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个工单吗？\n工单名称：${orderNames}`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    // 这里调用批量删除接口
    // const ids = selectedRows.value.map(row => row.id)
    // const response = await batchDeleteOrders(ids)
    console.log('批量删除工单:', selectedRows.value)
    ElMessage.success(`成功删除 ${selectedRows.value.length} 个工单!`)
    selectedRows.value = []
    getList() // 刷新列表
  }).catch(() => {
    ElMessage.info('已取消批量删除')
  })
}

// 编辑操作
const handleEdit = (row) => {
  Object.assign(editForm, {
    id: row.id,
    orderCode: row.orderCode,
    orderName: row.orderName,
    company: row.company,
    createDept: row.createDept,
    cutterCode: row.cutterCode,
    cutterId: row.cutterId || '', // 如果原数据没有cutterId，设为空
    modularKey: row.modularKey,
    productNum: row.productNum,
    orderState: row.orderState,
    status: row.status,
    remake: row.remake || ''
  })
  editDialogVisible.value = true
}

// 关闭编辑对话框
const closeEditDialog = () => {
  editDialogVisible.value = false
  resetEditForm()
  editLoading.value = false
}

// 重置编辑表单
const resetEditForm = () => {
  Object.assign(editForm, {
    id: null,
    orderCode: '',
    orderName: '',
    company: '',
    createDept: '',
    cutterCode: '',
    cutterId: '',
    modularKey: '',
    productNum: 1,
    orderState: 0,
    status: 'pending',
    remake: ''
  })
  editFormRef.value?.clearValidate()
}

// 编辑表单耗材选择变更处理
const handleEditCutterChange = (cutterName) => {
  const selectedCutter = cutterList.find(cutter => cutter.cutterName === cutterName)
  if (selectedCutter) {
    editForm.cutterId = selectedCutter.id
  } else {
    editForm.cutterId = ''
  }
}

// 提交编辑表单
const submitEditForm = async () => {
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return

    editLoading.value = true

    // 模拟API调用
    setTimeout(() => {
      console.log('编辑工单数据:', editForm)
      ElMessage.success('编辑成功!')
      closeEditDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('编辑失败，请重试')
  } finally {
    editLoading.value = false
  }
}

// 生成工单编号
const generateOrderCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const today = `${year}${month}${day}`
  const existingCodes = mockData.filter(order =>
    order.orderCode && order.orderCode.startsWith(`WO${today}`)
  )

  const nextNumber = existingCodes.length + 1
  const sequence = String(nextNumber).padStart(3, '0')

  return `WO${today}${sequence}`
}

// 打开新增对话框
const openAddDialog = () => {
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
    orderName: '',
    company: '',
    createDept: '',
    cutterCode: '',
    cutterId: '',
    modularKey: '',
    productNum: 1,
    orderState: 0,
    status: 'pending',
    remake: ''
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 新增表单耗材选择变更处理
const handleCutterChange = (cutterName) => {
  const selectedCutter = cutterList.find(cutter => cutter.cutterName === cutterName)
  if (selectedCutter) {
    addForm.cutterId = selectedCutter.id
  } else {
    addForm.cutterId = ''
  }
}

// 提交新增表单
const submitAddForm = async () => {
  try {
    const valid = await addFormRef.value.validate()
    if (!valid) return

    addLoading.value = true

    // 准备提交数据
    const submitData = {
      ...addForm,
      orderCode: generateOrderCode(),
      createUser: '当前用户', // 实际应从用户状态获取
      updateUser: '当前用户',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tenantId: 'T001', // 实际应从用户状态获取
      id: Date.now() // 模拟ID，实际由后端生成
    }

    // 模拟API调用
    setTimeout(() => {
      console.log('新增工单数据:', submitData)
      ElMessage.success('新增成功!')
      closeAddDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('新增失败，请重试')
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
    // const response = await uploadBatchOrderData(formData)

    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('批量上传成功!')
    closeBatchUploadDialog()

    // 上传成功后刷新表格数据
    getList()

  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

// 下载模版
const downloadTemplate = () => {
  // 创建模版数据
  const templateData = [
    {
      '工单名称': '示例工单名称',
      '公司名称': '示例公司名称',
      '创建部门': '示例部门',
      '耗材名': '示例耗材',
      '所属模块': '示例模块',
      '产品数量': 100,
      '工单状态': '0(启用)/1(禁用)',
      '业务状态': 'pending(待处理)/processing(处理中)/completed(已完成)/cancelled(已取消)',
      '备注': '示例备注信息'
    }
  ]

  // 创建工作簿
  const worksheet = []
  const headers = Object.keys(templateData[0])
  worksheet.push(headers)

  templateData.forEach(row => {
    worksheet.push(Object.values(row))
  })

  // 转换为CSV格式并下载
  const csvContent = worksheet.map(row =>
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', '产品工单导入模版.csv')
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('模版下载成功!')
}

// 下载刀具配置模板
const downloadToolTemplate = () => {
  // 创建刀具配置模版数据
  const toolTemplateData = [
    {
      '刀具编号': 'TOOL001',
      '刀具名称': '三菱铣刀',
      '刀具类型': '铣刀',
      '刀具品牌': '三菱',
      '刀具型号': 'R390-11T308M-PM',
      '刀具规格': 'Φ10×25×75',
      '适用材料': '钢材',
      '切削速度': '120m/min',
      '进给量': '0.1mm/r',
      '切削深度': '2mm',
      '冷却方式': '湿式切削',
      '刀具寿命': '8小时',
      '存储位置': 'A区-01号刀具柜',
      '库存数量': 50,
      '单价': '285.50',
      '供应商': '三菱材料',
      '备注': '高精度加工专用'
    },
    {
      '刀具编号': 'TOOL002',
      '刀具名称': '山特维克钻头',
      '刀具类型': '钻头',
      '刀具品牌': '山特维克',
      '刀具型号': '880-D1200L20-03',
      '刀具规格': 'Φ12×120',
      '适用材料': '不锈钢',
      '切削速度': '80m/min',
      '进给量': '0.15mm/r',
      '切削深度': '12mm',
      '冷却方式': '湿式切削',
      '刀具寿命': '6小时',
      '存储位置': 'A区-02号刀具柜',
      '库存数量': 30,
      '单价': '156.80',
      '供应商': '山特维克',
      '备注': '适用于不锈钢钻孔'
    }
  ]

  // 创建工作簿
  const toolWorksheet = []
  const toolHeaders = Object.keys(toolTemplateData[0])
  toolWorksheet.push(toolHeaders)

  toolTemplateData.forEach(row => {
    toolWorksheet.push(Object.values(row))
  })

  // 转换为CSV格式并下载
  const toolCsvContent = toolWorksheet.map(row =>
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n')

  const toolBlob = new Blob(['\ufeff' + toolCsvContent], { type: 'text/csv;charset=utf-8;' })
  const toolLink = document.createElement('a')
  const toolUrl = URL.createObjectURL(toolBlob)

  toolLink.setAttribute('href', toolUrl)
  toolLink.setAttribute('download', '刀具配置导入模版.csv')
  toolLink.style.visibility = 'hidden'

  document.body.appendChild(toolLink)
  toolLink.click()
  document.body.removeChild(toolLink)

  ElMessage.success('刀具配置模版下载成功!')
}

// 打开刀具配置导入对话框
const openToolConfigDialog = () => {
  toolConfigDialogVisible.value = true
  toolFileList.value = []
}

// 关闭刀具配置导入对话框
const closeToolConfigDialog = () => {
  toolConfigDialogVisible.value = false
  toolFileList.value = []
  toolUploadLoading.value = false
}

// 刀具配置文件选择变化
const handleToolFileChange = (file, files) => {
  toolFileList.value = files
}

// 刀具配置文件移除
const handleToolFileRemove = (file, files) => {
  toolFileList.value = files
}

// 刀具配置上传前验证
const beforeToolUpload = (file) => {
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

// 提交刀具配置导入
const submitToolConfig = async () => {
  if (toolFileList.value.length === 0) {
    ElMessage.warning('请选择要导入的刀具配置文件')
    return
  }

  try {
    toolUploadLoading.value = true

    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', toolFileList.value[0].raw)

    // 这里调用刀具配置导入接口
    // const response = await importToolConfig(formData)

    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('刀具配置导入成功!')
    closeToolConfigDialog()

    // 导入成功后可能需要刷新相关数据
    // await loadToolConfigData()

  } catch (error) {
    console.error('刀具配置导入失败:', error)
    ElMessage.error('刀具配置导入失败，请重试')
  } finally {
    toolUploadLoading.value = false
  }
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

  .buttonDiv {
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

.detail-container {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
