<template>
  <div class="container">
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="品牌名称:" prop="brandName">
          <el-input v-model="formInline.brandName" placeholder="请输入品牌名称" clearable/>
        </el-form-item>
        <el-form-item label="刀具型号:" prop="cutterCode">
          <el-input v-model="formInline.cutterCode" placeholder="请输入刀具型号" clearable/>
        </el-form-item>
        <el-form-item label="刀具类型:" prop="cutterType">
          <el-select v-model="formInline.cutterType" placeholder="请选择刀具类型" clearable>
            <el-option
              v-for="type in cutterTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料类型:" prop="materialType">
          <el-select v-model="formInline.materialType" placeholder="请选择物料类型" clearable>
            <el-option
              v-for="type in materialTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
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
        <el-form-item label="库存状态:" prop="stockStatus">
          <el-select v-model="formInline.stockStatus" placeholder="请选择库存状态" clearable>
            <el-option label="正常" value="normal"/>
            <el-option label="预警" value="warning"/>
            <el-option label="缺货" value="shortage"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    操作按钮区域-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增</el-button>
      <el-button type="info" icon="download" @click="downloadTemplate">导出模版</el-button>
      <el-button type="success" icon="download" @click="exportData">导出数据</el-button>
      <el-button type="primary" icon="upload" @click="openImportDialog">导入数据</el-button>
      <el-button
        type="danger"
        icon="delete"
        @click="batchDelete"
        :disabled="selectedRows.length === 0"
      >
        删除
      </el-button>
    </div>

    <!--    中部表格显示刀具耗材信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="id" label="耗材ID" align="center" width="100"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="materialType" label="物料类型" align="center" width="120"/>
        <el-table-column prop="specification" label="规格" align="center" width="150"/>
        <el-table-column prop="price" label="单价" align="center" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stockNum" label="当前库存" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockTagType(scope.row)">
              {{ scope.row.stockNum }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="packUnit" label="包装单位" align="center" width="100"/>
        <el-table-column prop="isUniqueCode" label="一刀一码" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isUniqueCode === 1 ? 'success' : 'info'">
              {{ scope.row.isUniqueCode === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="业务状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人" align="center" width="100"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <!-- 操作-->
        <el-table-column label="操作" align="center" width="400" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="success" size="small" @click="handleStockIn(scope.row)">入库</el-button>
              <el-button type="warning" size="small" @click="handleStockOut(scope.row)">出库</el-button>
              <el-button type="info" size="small" @click="handleTransfer(scope.row)">调货</el-button>
              <el-button type="default" size="small" @click="handleDetail(scope.row)">详情</el-button>
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

    <!-- 耗材详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="耗材详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentConsumable">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="耗材ID">{{ currentConsumable.id }}</el-descriptions-item>
          <el-descriptions-item label="品牌编码">{{ currentConsumable.brandCode }}</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentConsumable.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentConsumable.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentConsumable.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentConsumable.materialCode }}</el-descriptions-item>
          <el-descriptions-item label="物料类型">{{ currentConsumable.materialType }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentConsumable.specification }}</el-descriptions-item>
          <el-descriptions-item label="单价">¥{{ currentConsumable.price }}</el-descriptions-item>
          <el-descriptions-item label="包装单位">{{ currentConsumable.packUnit }}</el-descriptions-item>
          <el-descriptions-item label="包装数量">{{ currentConsumable.packQty }}</el-descriptions-item>
          <el-descriptions-item label="当前库存">{{ currentConsumable.stockNum }}</el-descriptions-item>
          <el-descriptions-item label="库存警告">{{ currentConsumable.inventoryWarning || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="一刀一码">
            <el-tag :type="currentConsumable.isUniqueCode === 1 ? 'success' : 'info'">
              {{ currentConsumable.isUniqueCode === 1 ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务状态">
            <el-tag :type="currentConsumable.status === 'active' ? 'success' : 'danger'">
              {{ currentConsumable.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="寿命次数">{{ currentConsumable.numberLife || '无限制' }}</el-descriptions-item>
          <el-descriptions-item label="寿命小时">{{ currentConsumable.timeLife || '无限制' }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentConsumable.createUser }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentConsumable.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentConsumable.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentConsumable.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentConsumable.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="版本号">{{ currentConsumable.version }}</el-descriptions-item>
        </el-descriptions>

        <!-- 刀具柜信息 -->
        <el-descriptions title="刀具柜信息" :column="2" border style="margin-top: 20px;" v-if="currentConsumable.cabinetList && currentConsumable.cabinetList.length > 0">
          <template v-for="(cabinet, index) in currentConsumable.cabinetList" :key="index">
            <el-descriptions-item :label="`刀具柜${index + 1}编码`">{{ cabinet.cabinetCode }}</el-descriptions-item>
            <el-descriptions-item :label="`刀具柜${index + 1}名称`">{{ cabinet.cabinetName }}</el-descriptions-item>
            <el-descriptions-item :label="`库位号${index + 1}`">{{ cabinet.stockLoc }}</el-descriptions-item>
            <el-descriptions-item :label="`库位剩余${index + 1}`">{{ cabinet.locSurplus }}</el-descriptions-item>
          </template>
        </el-descriptions>

        <!-- 图片信息 -->
        <div style="margin-top: 20px;" v-if="currentConsumable.imageUrlList && currentConsumable.imageUrlList.length > 0">
          <h4>耗材图片</h4>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <el-image
              v-for="(image, index) in currentConsumable.imageUrlList"
              :key="index"
              :src="image.url"
              :alt="image.name"
              style="width: 100px; height: 100px;"
              fit="cover"
              :preview-src-list="currentConsumable.imageUrlList.map(img => img.url)"
              :initial-index="index"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改耗材对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改耗材"
      width="800px"
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
            <el-form-item label="品牌编码" prop="brandCode">
              <el-input
                v-model="editForm.brandCode"
                placeholder="请输入品牌编码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input
                v-model="editForm.brandName"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀具型号" prop="cutterCode">
              <el-input
                v-model="editForm.cutterCode"
                placeholder="请输入刀具型号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input
                v-model="editForm.materialCode"
                placeholder="请输入物料编码"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料类型" prop="materialType">
              <el-select
                v-model="editForm.materialType"
                placeholder="请选择物料类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="type in materialTypeList"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input
                v-model="editForm.specification"
                placeholder="请输入规格"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="editForm.price"
                placeholder="请输入单价"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前库存" prop="stockNum">
              <el-input-number
                v-model="editForm.stockNum"
                placeholder="请输入当前库存"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="包装数量" prop="packQty">
              <el-input-number
                v-model="editForm.packQty"
                placeholder="请输入包装数量"
                :min="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input
                v-model="editForm.packUnit"
                placeholder="请输入包装单位"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="寿命次数" prop="numberLife">
              <el-input-number
                v-model="editForm.numberLife"
                placeholder="请输入寿命次数"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寿命小时" prop="timeLife">
              <el-input-number
                v-model="editForm.timeLife"
                placeholder="请输入寿命小时"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一刀一码" prop="isUniqueCode">
              <el-select
                v-model="editForm.isUniqueCode"
                placeholder="请选择是否一刀一码"
                style="width: 100%"
              >
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="editForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀具柜信息" prop="cabinetList">
              <div v-for="(cabinet, index) in editForm.cabinetList" :key="index" style="margin-bottom: 10px; border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px;">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item :label="`刀具柜${index + 1}编码`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.cabinetCode"
                        placeholder="请输入刀具柜编码"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`刀具柜${index + 1}名称`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.cabinetName"
                        placeholder="请输入刀具柜名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :label="`库位号${index + 1}`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.stockLoc"
                        placeholder="请输入库位号"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeCabinet(index)"
                      style="margin-top: 32px;"
                    >
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-button type="primary" @click="addCabinet">添加刀具柜</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图片路径" prop="imageUrl">
              <el-input
                v-model="editForm.imageUrl"
                placeholder="请输入图片路径"
                clearable
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

    <!-- 入库对话框 -->
    <el-dialog
      v-model="stockInDialogVisible"
      title="入库操作"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="stockInFormRef"
        :model="stockInForm"
        :rules="stockInFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀柜编码" prop="cabinetCode">
              <el-select
                v-model="stockInForm.cabinetCode"
                placeholder="请选择刀柜编码"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="cabinet in cabinetList"
                  :key="cabinet.value"
                  :label="cabinet.label"
                  :value="cabinet.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库库位号" prop="stockLoc">
              <el-input
                v-model="stockInForm.stockLoc"
                placeholder="请输入出库库位号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="stockInForm.price"
                placeholder="请输入单价"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="quantity">
              <el-input-number
                v-model="stockInForm.quantity"
                placeholder="请输入入库数量"
                :min="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="操作详情" prop="detailsCode">
              <el-input
                v-model="stockInForm.detailsCode"
                placeholder="请输入操作详情"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remake">
              <el-input
                v-model="stockInForm.remake"
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
          <el-button @click="closeStockInDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitStockInForm"
            :loading="stockInLoading"
          >
            {{ stockInLoading ? '入库中...' : '确认入库' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog
      v-model="stockOutDialogVisible"
      title="出库操作"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="stockOutFormRef"
        :model="stockOutForm"
        :rules="stockOutFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀柜编码" prop="cabinetCode">
              <el-select
                v-model="stockOutForm.cabinetCode"
                placeholder="请选择刀柜编码"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="cabinet in cabinetList"
                  :key="cabinet.value"
                  :label="cabinet.label"
                  :value="cabinet.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="quantity">
              <el-input-number
                v-model="stockOutForm.quantity"
                placeholder="请输入出库数量"
                :min="1"
                :max="currentStockNum"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="操作详情" prop="detailsCode">
              <el-input
                v-model="stockOutForm.detailsCode"
                placeholder="请输入操作详情"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remake">
              <el-input
                v-model="stockOutForm.remake"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-alert
              :title="`当前库存：${currentStockNum} 件`"
              type="info"
              :closable="false"
              show-icon
            />
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeStockOutDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitStockOutForm"
            :loading="stockOutLoading"
          >
            {{ stockOutLoading ? '出库中...' : '确认出库' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 调货对话框 -->
    <el-dialog
      v-model="transferDialogVisible"
      title="调货操作"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="transferFormRef"
        :model="transferForm"
        :rules="transferFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="transferForm.price"
                placeholder="请输入单价"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整数量" prop="quantity">
              <el-input-number
                v-model="transferForm.quantity"
                placeholder="请输入调整数量"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="调整后现库存" prop="nowStock">
              <el-input-number
                v-model="transferForm.nowStock"
                placeholder="调整后库存"
                :min="0"
                controls-position="right"
                style="width: 100%"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert
              :title="`当前库存：${currentStockNum} 件`"
              type="info"
              :closable="false"
              show-icon
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="调货原因" prop="detailsCode">
              <el-input
                v-model="transferForm.detailsCode"
                placeholder="请输入调货原因"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="耗材库存信息" prop="cutterStockList">
              <el-input
                v-model="transferForm.cutterStockList"
                type="textarea"
                :rows="3"
                placeholder="请输入耗材库存信息"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeTransferDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitTransferForm"
            :loading="transferLoading"
          >
            {{ transferLoading ? '调货中...' : '确认调货' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增耗材对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增耗材"
      width="800px"
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
            <el-form-item label="品牌编码" prop="brandCode">
              <el-input
                v-model="addForm.brandCode"
                placeholder="请输入品牌编码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input
                v-model="addForm.brandName"
                placeholder="请输入品牌名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀具型号" prop="cutterCode">
              <el-input
                v-model="addForm.cutterCode"
                placeholder="请输入刀具型号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input
                v-model="addForm.materialCode"
                placeholder="请输入物料编码"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料类型" prop="materialType">
              <el-select
                v-model="addForm.materialType"
                placeholder="请选择物料类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="type in materialTypeList"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input
                v-model="addForm.specification"
                placeholder="请输入规格"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input-number
                v-model="addForm.price"
                placeholder="请输入单价"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前库存" prop="stockNum">
              <el-input-number
                v-model="addForm.stockNum"
                placeholder="请输入当前库存"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="包装数量" prop="packQty">
              <el-input-number
                v-model="addForm.packQty"
                placeholder="请输入包装数量"
                :min="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装单位" prop="packUnit">
              <el-input
                v-model="addForm.packUnit"
                placeholder="请输入包装单位"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="寿命次数" prop="numberLife">
              <el-input-number
                v-model="addForm.numberLife"
                placeholder="请输入寿命次数"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寿命小时" prop="timeLife">
              <el-input-number
                v-model="addForm.timeLife"
                placeholder="请输入寿命小时"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建部门" prop="createDept">
              <el-input
                v-model="addForm.createDept"
                placeholder="请输入创建部门"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务状态" prop="status">
              <el-select
                v-model="addForm.status"
                placeholder="请选择业务状态"
                style="width: 100%"
              >
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀具柜信息" prop="cabinetList">
              <div v-for="(cabinet, index) in addForm.cabinetList" :key="index" style="margin-bottom: 10px; border: 1px solid #dcdfe6; padding: 10px; border-radius: 4px;">
                <el-row :gutter="10">
                  <el-col :span="6">
                    <el-form-item :label="`刀具柜${index + 1}编码`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.cabinetCode"
                        placeholder="请输入刀具柜编码"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :label="`刀具柜${index + 1}名称`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.cabinetName"
                        placeholder="请输入刀具柜名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item :label="`库位号${index + 1}`" style="margin-bottom: 10px;">
                      <el-input
                        v-model="cabinet.stockLoc"
                        placeholder="请输入库位号"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item :label="`库位剩余${index + 1}`" style="margin-bottom: 10px;">
                      <el-input-number
                        v-model="cabinet.locSurplus"
                        placeholder="库位剩余"
                        :min="0"
                        controls-position="right"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      type="danger"
                      size="small"
                      @click="removeAddCabinet(index)"
                      style="margin-top: 32px;"
                    >
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-button type="primary" @click="addAddCabinet">添加刀具柜</el-button>
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

    <!-- 导入数据对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入数据"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload-container">
        <div class="upload-tips">
          <el-alert
            title="导入说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>
                <p>1. 请选择Excel文件进行上传（支持.xlsx、.xls格式）</p>
                <p>2. 文件大小不超过10MB</p>
                <p>3. 请确保Excel文件格式正确，可先下载模板参考</p>
                <p>4. 导入的数据将添加到当前系统中</p>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="upload-area">
          <el-upload
            ref="importUploadRef"
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleImportFileChange"
            :on-remove="handleImportFileRemove"
            :before-upload="beforeImportUpload"
            :file-list="importFileList"
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
          <el-button @click="closeImportDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitImport"
            :loading="importLoading"
            :disabled="importFileList.length === 0"
          >
            {{ importLoading ? '导入中...' : '确认导入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, nextTick, watch} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import {
  listCutterConsumable,
  getCutterConsumable,
  addCutterConsumable,
  updateCutterConsumable,
  delCutterConsumable,
  batchDelCutterConsumable,
  exportCutterConsumable,
  importCutterConsumable,
  downloadTemplate as downloadTemplateApi,
  getBrandList,
  getCabinetList,
  getMaterialTypeList,
  getCutterTypeList,
  uploadImage,
  deleteImage,
  updateStock,
  setInventoryWarning,
  getStockStatistics
} from '@/api/consumableService/cutterConsumable'

const formInlineRes = ref()
const editFormRef = ref()
const addFormRef = ref()
const uploadRef = ref()
const stockInFormRef = ref()
const stockOutFormRef = ref()
const transferFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  brandName: '', // 品牌名称
  cutterCode: '', // 刀具型号
  cutterType: '', // 刀具类型
  materialType: '', // 物料类型
  createUser: '', // 创建人
  createTime: '', // 创建时间
  stockStatus: '', // 库存状态
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
  brandName: '',
  cutterCode: '',
  cutterType: '',
  materialType: '',
  createUser: '',
  createTimeStart: '',
  createTimeEnd: '',
  stockStatus: ''
})

// 表格数据
const tableData = ref([])
const selectedRows = ref([])

// 对话框相关
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const importDialogVisible = ref(false)
const stockInDialogVisible = ref(false)
const stockOutDialogVisible = ref(false)
const transferDialogVisible = ref(false)
const editLoading = ref(false)
const addLoading = ref(false)
const importLoading = ref(false)
const stockInLoading = ref(false)
const stockOutLoading = ref(false)
const transferLoading = ref(false)
const currentConsumable = ref(null)
const fileList = ref([])
const importFileList = ref([])
const currentStockNum = ref(0)

// 下拉选项数据
const cutterTypeList = ref([])
const materialTypeList = ref([])
const brandList = ref([])
const cabinetList = ref([])

// 编辑表单数据
const editForm = reactive({
  id: null,
  brandCode: '',
  brandName: '',
  cutterCode: '',
  materialCode: '',
  materialType: '',
  specification: '',
  price: 0,
  stockNum: 0,
  packQty: 1,
  packUnit: '',
  numberLife: 0,
  timeLife: 0,
  isUniqueCode: 0,
  status: 'active',
  imageUrl: '',
  cabinetList: [],
  tenantId: '',
  updateTime: ''
})

// 编辑表单验证规则
const editFormRules = reactive({
  brandCode: [
    { required: true, message: '请输入品牌编码', trigger: 'blur' }
  ],
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
  ],
  cutterCode: [
    { required: true, message: '请输入刀具型号', trigger: 'blur' }
  ],
  materialCode: [
    { required: true, message: '请输入物料编码', trigger: 'blur' }
  ],
  materialType: [
    { required: true, message: '请选择物料类型', trigger: 'change' }
  ],
  specification: [
    { required: true, message: '请输入规格', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ],
  stockNum: [
    { required: true, message: '请输入当前库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' }
  ],
  packQty: [
    { required: true, message: '请输入包装数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '包装数量必须大于0', trigger: 'blur' }
  ],
  packUnit: [
    { required: true, message: '请输入包装单位', trigger: 'blur' }
  ],
  isUniqueCode: [
    { required: true, message: '请选择是否一刀一码', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ]
})

// 入库表单数据
const stockInForm = reactive({
  cutterId: null,
  cabinetCode: '',
  stockLoc: '',
  price: 0,
  quantity: 1,
  detailsCode: '',
  remake: ''
})

// 入库表单验证规则
const stockInFormRules = reactive({
  cabinetCode: [
    { required: true, message: '请选择刀柜编码', trigger: 'change' }
  ],
  stockLoc: [
    { required: true, message: '请输入出库库位号', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  detailsCode: [
    { required: true, message: '请输入操作详情', trigger: 'blur' }
  ]
})

// 出库表单数据
const stockOutForm = reactive({
  cutterId: null,
  cabinetCode: '',
  quantity: 1,
  detailsCode: '',
  remake: ''
})

// 出库表单验证规则
const stockOutFormRules = reactive({
  cabinetCode: [
    { required: true, message: '请选择刀柜编码', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  detailsCode: [
    { required: true, message: '请输入操作详情', trigger: 'blur' }
  ]
})

// 调货表单数据
const transferForm = reactive({
  cutterId: null,
  price: 0,
  quantity: 0,
  nowStock: 0,
  detailsCode: '',
  cutterStockList: ''
})

// 调货表单验证规则
const transferFormRules = reactive({
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入调整数量', trigger: 'blur' },
    { type: 'number', message: '调整数量必须为数字', trigger: 'blur' }
  ],
  detailsCode: [
    { required: true, message: '请输入调货原因', trigger: 'blur' }
  ],
  cutterStockList: [
    { required: true, message: '请输入耗材库存信息', trigger: 'blur' }
  ]
})

// 新增表单数据
const addForm = reactive({
  brandCode: '',
  brandName: '',
  cutterCode: '',
  materialCode: '',
  materialType: '',
  specification: '',
  price: 0,
  stockNum: 0,
  packQty: 1,
  packUnit: '',
  numberLife: 0,
  timeLife: 0,
  createDept: '',
  status: 'active',
  cabinetList: [],
  createUser: '',
  createTime: '',
  updateUser: '',
  updateTime: '',
  tenantId: '',
  version: 1
})

// 新增表单验证规则
const addFormRules = reactive({
  brandCode: [
    { required: true, message: '请输入品牌编码', trigger: 'blur' }
  ],
  brandName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
  ],
  cutterCode: [
    { required: true, message: '请输入刀具型号', trigger: 'blur' }
  ],
  materialCode: [
    { required: true, message: '请输入物料编码', trigger: 'blur' }
  ],
  materialType: [
    { required: true, message: '请选择物料类型', trigger: 'change' }
  ],
  specification: [
    { required: true, message: '请输入规格', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价必须大于等于0', trigger: 'blur' }
  ],
  stockNum: [
    { required: true, message: '请输入当前库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' }
  ],
  packQty: [
    { required: true, message: '请输入包装数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '包装数量必须大于0', trigger: 'blur' }
  ],
  packUnit: [
    { required: true, message: '请输入包装单位', trigger: 'blur' }
  ],
  createDept: [
    { required: true, message: '请输入创建部门', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择业务状态', trigger: 'change' }
  ]
})

// 获取库存标签类型
const getStockTagType = (row) => {
  if (row.stockNum <= 0) return 'danger'
  if (row.inventoryWarning && row.stockNum <= row.inventoryWarning) return 'warning'
  return 'success'
}

// 模拟数据
const mockData = [
  {
    id: 1,
    brandCode: 'MT001',
    brandName: '三菱',
    cutterCode: 'R390-11T308M-PM',
    cutterType: '铣刀',
    materialCode: 'MAT001',
    materialType: '硬质合金',
    specification: 'Φ10×25×75',
    price: 285.50,
    packUnit: '个',
    packQty: 10,
    stockNum: 45,
    inventoryWarning: 10,
    isUniqueCode: 1,
    status: 'active',
    numberLife: 1000,
    timeLife: 8,
    createUser: '张工程师',
    createDept: '生产部',
    createTime: '2024-12-25 09:00:00',
    updateUser: '李主管',
    updateTime: '2024-12-26 14:30:00',
    version: 1,
    tenantId: 'T001',
    cabinetList: [
      {
        cabinetCode: 'CAB001',
        cabinetName: 'A区01号刀具柜',
        cutterId: 1,
        stockLoc: 'A01-01',
        locSurplus: 25
      }
    ],
    imageUrlList: [
      {
        name: '三菱铣刀.jpg',
        newFilename: 'cutter_001.jpg',
        url: '/images/cutter_001.jpg'
      }
    ]
  },
  {
    id: 2,
    brandCode: 'SV002',
    brandName: '山特维克',
    cutterCode: '880-D1200L20-03',
    cutterType: '钻头',
    materialCode: 'MAT002',
    materialType: '高速钢',
    specification: 'Φ12×120',
    price: 156.80,
    packUnit: '个',
    packQty: 5,
    stockNum: 8,
    inventoryWarning: 10,
    isUniqueCode: 0,
    status: 'active',
    numberLife: 500,
    timeLife: 6,
    createUser: '王技师',
    createDept: '维修部',
    createTime: '2024-12-24 10:15:00',
    updateUser: '赵主管',
    updateTime: '2024-12-25 16:45:00',
    version: 1,
    tenantId: 'T001',
    cabinetList: [
      {
        cabinetCode: 'CAB002',
        cabinetName: 'A区02号刀具柜',
        cutterId: 2,
        stockLoc: 'A02-03',
        locSurplus: 8
      }
    ],
    imageUrlList: []
  }
]

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockData]

      // 根据品牌名称筛选
      if (queryParams.brandName) {
        filteredData = filteredData.filter(item =>
          item.brandName.toLowerCase().includes(queryParams.brandName.toLowerCase())
        )
      }

      // 根据刀具型号筛选
      if (queryParams.cutterCode) {
        filteredData = filteredData.filter(item =>
          item.cutterCode.toLowerCase().includes(queryParams.cutterCode.toLowerCase())
        )
      }

      // 根据刀具类型筛选
      if (queryParams.cutterType) {
        filteredData = filteredData.filter(item =>
          item.cutterType === queryParams.cutterType
        )
      }

      // 根据物料类型筛选
      if (queryParams.materialType) {
        filteredData = filteredData.filter(item =>
          item.materialType === queryParams.materialType
        )
      }

      // 根据创建人筛选
      if (queryParams.createUser) {
        filteredData = filteredData.filter(item =>
          item.createUser.toLowerCase().includes(queryParams.createUser.toLowerCase())
        )
      }

      // 根据库存状态筛选
      if (queryParams.stockStatus) {
        filteredData = filteredData.filter(item => {
          if (queryParams.stockStatus === 'shortage') {
            return item.stockNum <= 0
          } else if (queryParams.stockStatus === 'warning') {
            return item.stockNum > 0 && item.stockNum <= (item.inventoryWarning || 0)
          } else if (queryParams.stockStatus === 'normal') {
            return item.stockNum > (item.inventoryWarning || 0)
          }
          return true
        })
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
  queryParams.brandName = formInline.brandName
  queryParams.cutterCode = formInline.cutterCode
  queryParams.cutterType = formInline.cutterType
  queryParams.materialType = formInline.materialType
  queryParams.createUser = formInline.createUser
  queryParams.stockStatus = formInline.stockStatus

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
    currentConsumable.value = { ...detailData }
    detailDialogVisible.value = true
  } else {
    ElMessage.error('获取详情失败')
  }
}

// 删除单个耗材
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除耗材 "${row.cutterCode}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    setTimeout(() => {
      const index = mockData.findIndex(item => item.id === row.id)
      if (index > -1) {
        mockData.splice(index, 1)
      }
      ElMessage.success('删除成功!')
      getList() // 刷新列表
    }, 500)
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
    ElMessage.warning('请选择要删除的耗材')
    return
  }

  const cutterCodes = selectedRows.value.map(row => row.cutterCode).join('、')

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个耗材吗？\n耗材型号：${cutterCodes}`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    // 模拟批量删除操作
    setTimeout(() => {
      const ids = selectedRows.value.map(row => row.id)
      ids.forEach(id => {
        const index = mockData.findIndex(item => item.id === id)
        if (index > -1) {
          mockData.splice(index, 1)
        }
      })
      ElMessage.success(`成功删除 ${selectedRows.value.length} 个耗材!`)
      selectedRows.value = []
      getList() // 刷新列表
    }, 500)
  }).catch(() => {
    ElMessage.info('已取消批量删除')
  })
}

// 修改操作
const handleEdit = (row) => {
  // 填充编辑表单数据
  const editData = mockData.find(item => item.id === row.id)
  if (editData) {
    Object.assign(editForm, {
      id: editData.id,
      brandCode: editData.brandCode || '',
      brandName: editData.brandName || '',
      cutterCode: editData.cutterCode || '',
      materialCode: editData.materialCode || '',
      materialType: editData.materialType || '',
      specification: editData.specification || '',
      price: editData.price || 0,
      stockNum: editData.stockNum || 0,
      packQty: editData.packQty || 1,
      packUnit: editData.packUnit || '',
      numberLife: editData.numberLife || 0,
      timeLife: editData.timeLife || 0,
      isUniqueCode: editData.isUniqueCode || 0,
      status: editData.status || 'active',
      imageUrl: editData.imageUrl || '',
      cabinetList: editData.cabinetList ? [...editData.cabinetList] : [],
      tenantId: editData.tenantId || '',
      updateTime: editData.updateTime || ''
    })
    editDialogVisible.value = true
  } else {
    ElMessage.error('获取数据失败')
  }
}

// 入库操作
const handleStockIn = (row) => {
  // 填充入库表单数据
  Object.assign(stockInForm, {
    cutterId: row.id,
    cabinetCode: '',
    stockLoc: '',
    price: row.price || 0,
    quantity: 1,
    detailsCode: '',
    remake: ''
  })
  currentStockNum.value = row.stockNum
  stockInDialogVisible.value = true
}

// 出库操作
const handleStockOut = (row) => {
  // 填充出库表单数据
  Object.assign(stockOutForm, {
    cutterId: row.id,
    cabinetCode: '',
    quantity: 1,
    detailsCode: '',
    remake: ''
  })
  currentStockNum.value = row.stockNum
  stockOutDialogVisible.value = true
}

// 调货操作
const handleTransfer = (row) => {
  // 填充调货表单数据
  Object.assign(transferForm, {
    cutterId: row.id,
    price: row.price || 0,
    quantity: 0,
    nowStock: row.stockNum,
    detailsCode: '',
    cutterStockList: ''
  })
  currentStockNum.value = row.stockNum
  transferDialogVisible.value = true
}

// 打开新增对话框
const openAddDialog = () => {
  resetAddForm()
  addDialogVisible.value = true
}

// 导出数据
const exportData = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的数据')
    return
  }

  // 准备导出数据
  const exportDataList = selectedRows.value.map(row => ({
    '品牌编码': row.brandCode || '',
    '品牌名称': row.brandName || '',
    '刀具型号': row.cutterCode || '',
    '物料编码': row.materialCode || '',
    '物料类型': row.materialType || '',
    '规格': row.specification || '',
    '单价': row.price || '',
    '当前库存': row.stockNum || '',
    '包装数量': row.packQty || '',
    '包装单位': row.packUnit || '',
    '寿命次数': row.numberLife || '',
    '寿命小时': row.timeLife || '',
    '创建部门': row.createDept || '',
    '创建人': row.createUser || '',
    '创建时间': row.createTime || '',
    '业务状态': row.status === 'active' ? '启用' : '禁用'
  }))

  // 创建工作簿
  const worksheet = []
  const headers = Object.keys(exportDataList[0])
  worksheet.push(headers)

  exportDataList.forEach(row => {
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
  link.setAttribute('download', `刀具耗材数据_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('导出数据成功!')
}

// 打开导入数据对话框
const openImportDialog = () => {
  importFileList.value = []
  importDialogVisible.value = true
}

// 下载模版
const downloadTemplate = () => {
  // 创建模版数据
  const templateData = [
    {
      '品牌编码': 'MT001',
      '品牌名称': '三菱',
      '刀具型号': 'R390-11T308M-PM',
      '刀具类型': '铣刀',
      '物料编码': 'MAT001',
      '物料类型': '硬质合金',
      '规格': 'Φ10×25×75',
      '单价': '285.50',
      '包装单位': '个',
      '包装数量': '10',
      '当前库存': '50',
      '库存警告': '10',
      '是否一刀一码': '1(是)/0(否)',
      '业务状态': 'active(启用)/inactive(禁用)',
      '寿命次数': '1000',
      '寿命小时': '8',
      '创建部门': '生产部',
      '备注': '示例数据'
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
  link.setAttribute('download', '刀具耗材导入模版.csv')
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('模版下载成功!')
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

// 初始化下拉选项数据
const initSelectOptions = () => {
  // 模拟下拉选项数据
  cutterTypeList.value = [
    { value: '铣刀', label: '铣刀' },
    { value: '钻头', label: '钻头' },
    { value: '车刀', label: '车刀' },
    { value: '镗刀', label: '镗刀' },
    { value: '刀片', label: '刀片' },
    { value: '面铣刀', label: '面铣刀' }
  ]

  materialTypeList.value = [
    { value: '硬质合金', label: '硬质合金' },
    { value: '高速钢', label: '高速钢' },
    { value: '陶瓷', label: '陶瓷' },
    { value: '立方氮化硼', label: '立方氮化硼' },
    { value: '金刚石', label: '金刚石' }
  ]

  brandList.value = [
    { value: '三菱', label: '三菱' },
    { value: '山特维克', label: '山特维克' },
    { value: '肯纳', label: '肯纳' },
    { value: '伊斯卡', label: '伊斯卡' },
    { value: '住友', label: '住友' },
    { value: '瓦尔特', label: '瓦尔特' }
  ]

  cabinetList.value = [
    { value: 'CAB001', label: 'A区01号刀具柜' },
    { value: 'CAB002', label: 'A区02号刀具柜' },
    { value: 'CAB003', label: 'B区01号刀具柜' },
    { value: 'CAB004', label: 'B区02号刀具柜' }
  ]
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
    brandCode: '',
    brandName: '',
    cutterCode: '',
    materialCode: '',
    materialType: '',
    specification: '',
    price: 0,
    stockNum: 0,
    packQty: 1,
    packUnit: '',
    numberLife: 0,
    timeLife: 0,
    isUniqueCode: 0,
    status: 'active',
    imageUrl: '',
    cabinetList: [],
    tenantId: '',
    updateTime: ''
  })
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

// 添加刀具柜
const addCabinet = () => {
  editForm.cabinetList.push({
    cabinetCode: '',
    cabinetName: '',
    cutterId: editForm.id,
    stockLoc: '',
    locSurplus: 0
  })
}

// 移除刀具柜
const removeCabinet = (index) => {
  editForm.cabinetList.splice(index, 1)
}

// 提交编辑表单
const submitEditForm = async () => {
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return

    editLoading.value = true

    // 准备提交数据
    const submitData = {
      ...editForm,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }

    // 模拟API调用
    setTimeout(() => {
      // 更新模拟数据
      const index = mockData.findIndex(item => item.id === editForm.id)
      if (index > -1) {
        Object.assign(mockData[index], submitData)
      }

      console.log('修改耗材数据:', submitData)
      ElMessage.success('修改成功!')
      closeEditDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('修改失败，请重试')
  } finally {
    editLoading.value = false
  }
}

// 关闭入库对话框
const closeStockInDialog = () => {
  stockInDialogVisible.value = false
  resetStockInForm()
  stockInLoading.value = false
}

// 重置入库表单
const resetStockInForm = () => {
  Object.assign(stockInForm, {
    cutterId: null,
    cabinetCode: '',
    stockLoc: '',
    price: 0,
    quantity: 1,
    detailsCode: '',
    remake: ''
  })
  nextTick(() => {
    stockInFormRef.value?.clearValidate()
  })
}

// 提交入库表单
const submitStockInForm = async () => {
  try {
    const valid = await stockInFormRef.value.validate()
    if (!valid) return

    stockInLoading.value = true

    // 准备提交数据
    const submitData = {
      cutterId: stockInForm.cutterId,
      cabinetCode: stockInForm.cabinetCode,
      stockLoc: stockInForm.stockLoc,
      price: stockInForm.price,
      quantity: stockInForm.quantity,
      detailsCode: stockInForm.detailsCode,
      remake: stockInForm.remake
    }

    // 模拟API调用
    setTimeout(() => {
      // 更新库存
      const index = mockData.findIndex(item => item.id === stockInForm.cutterId)
      if (index > -1) {
        mockData[index].stockNum += stockInForm.quantity
      }

      console.log('入库数据:', submitData)
      ElMessage.success('入库成功!')
      closeStockInDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('入库失败:', error)
    ElMessage.error('入库失败，请重试')
  } finally {
    stockInLoading.value = false
  }
}

// 关闭出库对话框
const closeStockOutDialog = () => {
  stockOutDialogVisible.value = false
  resetStockOutForm()
  stockOutLoading.value = false
}

// 重置出库表单
const resetStockOutForm = () => {
  Object.assign(stockOutForm, {
    cutterId: null,
    cabinetCode: '',
    quantity: 1,
    detailsCode: '',
    remake: ''
  })
  nextTick(() => {
    stockOutFormRef.value?.clearValidate()
  })
}

// 提交出库表单
const submitStockOutForm = async () => {
  try {
    const valid = await stockOutFormRef.value.validate()
    if (!valid) return

    // 检查库存是否足够
    if (stockOutForm.quantity > currentStockNum.value) {
      ElMessage.error('出库数量不能大于当前库存')
      return
    }

    stockOutLoading.value = true

    // 准备提交数据
    const submitData = {
      cutterId: stockOutForm.cutterId,
      cabinetCode: stockOutForm.cabinetCode,
      quantity: stockOutForm.quantity,
      detailsCode: stockOutForm.detailsCode,
      remake: stockOutForm.remake
    }

    // 模拟API调用
    setTimeout(() => {
      // 更新库存
      const index = mockData.findIndex(item => item.id === stockOutForm.cutterId)
      if (index > -1) {
        mockData[index].stockNum -= stockOutForm.quantity
      }

      console.log('出库数据:', submitData)
      ElMessage.success('出库成功!')
      closeStockOutDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('出库失败:', error)
    ElMessage.error('出库失败，请重试')
  } finally {
    stockOutLoading.value = false
  }
}

// 关闭调货对话框
const closeTransferDialog = () => {
  transferDialogVisible.value = false
  resetTransferForm()
  transferLoading.value = false
}

// 重置调货表单
const resetTransferForm = () => {
  Object.assign(transferForm, {
    cutterId: null,
    price: 0,
    quantity: 0,
    nowStock: 0,
    detailsCode: '',
    cutterStockList: ''
  })
  nextTick(() => {
    transferFormRef.value?.clearValidate()
  })
}

// 提交调货表单
const submitTransferForm = async () => {
  try {
    const valid = await transferFormRef.value.validate()
    if (!valid) return

    transferLoading.value = true

    // 准备提交数据
    const submitData = {
      cutterId: transferForm.cutterId,
      price: transferForm.price,
      quantity: transferForm.quantity,
      nowStock: transferForm.nowStock,
      detailsCode: transferForm.detailsCode,
      cutterStockList: transferForm.cutterStockList
    }

    // 模拟API调用
    setTimeout(() => {
      // 更新库存
      const index = mockData.findIndex(item => item.id === transferForm.cutterId)
      if (index > -1) {
        mockData[index].stockNum = transferForm.nowStock
        mockData[index].price = transferForm.price
      }

      console.log('调货数据:', submitData)
      ElMessage.success('调货成功!')
      closeTransferDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('调货失败:', error)
    ElMessage.error('调货失败，请重试')
  } finally {
    transferLoading.value = false
  }
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
    brandCode: '',
    brandName: '',
    cutterCode: '',
    materialCode: '',
    materialType: '',
    specification: '',
    price: 0,
    stockNum: 0,
    packQty: 1,
    packUnit: '',
    numberLife: 0,
    timeLife: 0,
    createDept: '',
    status: 'active',
    cabinetList: [],
    createUser: '',
    createTime: '',
    updateUser: '',
    updateTime: '',
    tenantId: '',
    version: 1
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 添加刀具柜（新增表单）
const addAddCabinet = () => {
  addForm.cabinetList.push({
    cabinetCode: '',
    cabinetName: '',
    cutterId: null,
    stockLoc: '',
    locSurplus: 0
  })
}

// 移除刀具柜（新增表单）
const removeAddCabinet = (index) => {
  addForm.cabinetList.splice(index, 1)
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
      id: Date.now(), // 模拟ID
      createUser: '当前用户', // 实际应从用户状态获取
      updateUser: '当前用户',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tenantId: 'T001', // 实际应从用户状态获取
      cutterType: addForm.materialType, // 根据物料类型设置刀具类型
      inventoryWarning: Math.floor(addForm.stockNum * 0.2) // 默认设置为库存的20%作为预警值
    }

    // 模拟API调用
    setTimeout(() => {
      // 添加到模拟数据
      mockData.push(submitData)

      console.log('新增耗材数据:', submitData)
      ElMessage.success('新增成功!')
      closeAddDialog()
      getList() // 刷新列表
    }, 1000)

  } catch (error) {
    console.error('新增失败:', error)
    ElMessage.error('新增失败，请重试')
  } finally {
    addLoading.value = false
  }
}

// 关闭导入对话框
const closeImportDialog = () => {
  importDialogVisible.value = false
  importFileList.value = []
  importLoading.value = false
}

// 导入文件选择变化
const handleImportFileChange = (file, files) => {
  importFileList.value = files
}

// 导入文件移除
const handleImportFileRemove = (file, files) => {
  importFileList.value = files
}

// 导入文件上传前验证
const beforeImportUpload = (file) => {
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

// 提交导入
const submitImport = async () => {
  if (importFileList.value.length === 0) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  try {
    importLoading.value = true

    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', importFileList.value[0].raw)

    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('导入成功!')
    closeImportDialog()

    // 导入成功后刷新表格数据
    getList()

  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请重试')
  } finally {
    importLoading.value = false
  }
}

// 监听调整数量变化，自动计算调整后库存
watch(() => transferForm.quantity, (newVal) => {
  transferForm.nowStock = currentStockNum.value + (newVal || 0)
})

// 组件挂载时获取数据
onMounted(() => {
  getList()
  initSelectOptions()
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
  gap: 4px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;

  .el-button {
    padding: 5px 8px;
    font-size: 12px;
    min-width: auto;
  }
}

// 上传容器样式
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
        font-size: 67px;
        color: #c0c4cc;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
