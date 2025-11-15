<template>
  <div class="container">
    <!-- <div>取刀具货道管理</div> -->
    
    <!-- 顶部查询条件区域 -->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline">
        <el-form-item label="品牌编码:" prop="brandCode">
          <el-input
            v-model="searchForm.brandCode"
            placeholder="请输入品牌编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀柜编码:" prop="cabinetCode">
          <el-input
            v-model="searchForm.cabinetCode"
            placeholder="请输入刀柜编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀具型号:" prop="cutterCode">
          <el-input
            v-model="searchForm.cutterCode"
            placeholder="请输入刀具型号"
            clearable
          />
        </el-form-item>
        <el-form-item label="刀具类型:" prop="cutterType">
          <el-input
            v-model="searchForm.cutterType"
            placeholder="请输入刀具类型"
            clearable
          />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="searchForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A面" value="A"/>
            <el-option label="B面" value="B"/>
            <el-option label="C面" value="C"/>
            <el-option label="D面" value="D"/>
            <el-option label="E面" value="E"/>
          </el-select>
        </el-form-item>
        <el-form-item label="库位号:" prop="stockLoc">
          <el-input
            v-model="searchForm.stockLoc"
            placeholder="请输入库位号"
            clearable
          />
        </el-form-item>
        <el-form-item label="耗材型号或品牌:" prop="cutterOrBrand">
          <el-input
            v-model="searchForm.cutterOrBrand"
            placeholder="请输入耗材型号或品牌"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料编码:" prop="materialCode">
          <el-input
            v-model="searchForm.materialCode"
            placeholder="请输入物料编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="规格:" prop="specification">
          <el-input
            v-model="searchForm.specification"
            placeholder="请输入规格"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="search">查询</el-button>
          <el-button @click="resetSearch" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="buttonDiv">
      <el-button type="warning" icon="plus" @click="handlePreReplenish" :loading="preReplenishLoading">预补刀</el-button>
      <el-button type="info" icon="tools" @click="handleReplenish" :loading="replenishLoading">补刀</el-button>
      <el-button type="warning" icon="warning" @click="handleAlarmSettings">预警设置</el-button>
      <el-button type="success" icon="download" @click="handleExport">导出</el-button>
      <el-button type="primary" icon="upload" @click="handleImport">导入</el-button>
      <el-button type="info" icon="pie-chart" @click="handleStatistics">统计分析</el-button>
      <!-- 新增暂存功能按钮 -->
      <el-button type="primary" icon="collection" @click="handleStorageRecord">暂存记录</el-button>
      <el-button type="primary" icon="user" @click="handlePersonalStorage">个人暂存</el-button>
    </div>

    <!-- 货道信息表格 -->
    <div class="tableDiv">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :scroll-x="true"
        table-layout="auto"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="brandName" label="品牌名称" align="center" width="120"/>
        <el-table-column prop="cutterCode" label="刀具型号" align="center" width="150"/>
        <el-table-column prop="cutterType" label="刀具类型" align="center" width="120"/>
        <el-table-column prop="stockLoc" label="库位号" align="center" width="100"/>
        <el-table-column prop="locPrefix" label="柜子面" align="center" width="80">
          <template #default="scope">
            <el-tag :type="getLocPrefixTagType(scope.row.locPrefix)">
              {{ scope.row.locPrefix }}面
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(元)" align="center" width="100">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="locCapacity" label="货道容量" align="center" width="100"/>
        <el-table-column prop="locSurplus" label="剩余数量" align="center" width="100"/>
        <el-table-column prop="stockStatus" label="货道状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getStockStatusTagType(scope.row.stockStatus)">
              {{ getStockStatusText(scope.row.stockStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storageType" label="暂存类型" align="center" width="120">
          <template #default="scope">
            <el-tag :type="getStorageTypeTagType(scope.row.storageType)">
              {{ getStorageTypeText(scope.row.storageType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isBan" label="绑定状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isBan === '0' ? 'success' : 'danger'">
              {{ scope.row.isBan === '0' ? '非禁用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
              <el-button
                :type="scope.row.stockStatus === 2 ? 'success' : 'danger'"
                size="small"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.stockStatus === 2 ? '启用' : '禁用' }}
              </el-button>
              <el-button
                :type="scope.row.isBan === '0' ? 'danger' : 'warning'"
                size="small"
                @click="handleToggleBind(scope.row)"
              >
                {{ scope.row.isBan === '0' ? '禁用' : '启用' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
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
    <el-dialog v-model="detailDialogVisible" title="货道详情" width="900px">
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="货道主键">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="刀柜编码">{{ currentRecord.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{ currentRecord.stockLoc }}</el-descriptions-item>
          <el-descriptions-item label="柜子面">{{ currentRecord.locPrefix }}面</el-descriptions-item>
          <el-descriptions-item label="品牌名称">{{ currentRecord.brandName }}</el-descriptions-item>
          <el-descriptions-item label="刀具型号">{{ currentRecord.cutterCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具类型">{{ currentRecord.cutterType }}</el-descriptions-item>
          <el-descriptions-item label="耗材主键">{{ currentRecord.cutterId }}</el-descriptions-item>
          <el-descriptions-item label="货道容量">{{ currentRecord.locCapacity }}</el-descriptions-item>
          <el-descriptions-item label="剩余数量">{{ currentRecord.locSurplus }}</el-descriptions-item>
          <el-descriptions-item label="包装数量">{{ currentRecord.packQty }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ currentRecord.price ? currentRecord.price.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="货道状态">
            <el-tag :type="getStockStatusTagType(currentRecord.stockStatus)">
              {{ getStockStatusText(currentRecord.stockStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="暂存类型">
            <el-tag :type="getStorageTypeTagType(currentRecord.storageType)">
              {{ getStorageTypeText(currentRecord.storageType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="绑定状态">
            <el-tag :type="currentRecord.isBan === '0' ? 'success' : 'danger'">
              {{ currentRecord.isBan === '0' ? '非禁用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否禁用">
            <el-tag :type="currentRecord.isBan === '0' ? 'success' : 'danger'">
              {{ currentRecord.isBan === '0' ? '非禁用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="入库时间">{{ currentRecord.warehouseInTime }}</el-descriptions-item>
          <el-descriptions-item label="警报数量">{{ currentRecord.warningNum }}</el-descriptions-item>
          <el-descriptions-item label="物料编码">{{ currentRecord.materialCode }}</el-descriptions-item>
          <el-descriptions-item label="物料类型">{{ currentRecord.materialType }}</el-descriptions-item>
          <el-descriptions-item label="规格">{{ currentRecord.specification }}</el-descriptions-item>
          <el-descriptions-item label="图片路径">{{ currentRecord.imageUrl }}</el-descriptions-item>
          <el-descriptions-item label="库位类型">{{ currentRecord.locType }}</el-descriptions-item>
          <el-descriptions-item label="当前库存数">{{ currentRecord.stockNum }}</el-descriptions-item>
          <el-descriptions-item label="库存警告">{{ currentRecord.inventoryWarning }}</el-descriptions-item>
          <el-descriptions-item label="磨损数量">{{ currentRecord.awayQty }}</el-descriptions-item>
          <el-descriptions-item label="寿命次数">{{ currentRecord.numberLife }}</el-descriptions-item>
          <el-descriptions-item label="寿命小时">{{ currentRecord.timeLife }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 统计对话框 -->
    <el-dialog v-model="statisticsDialogVisible" title="货道统计分析" width="600px">
      <el-form :inline="true" :model="statisticsForm" ref="statisticsFormRef" class="statistics-form">
        <el-form-item label="刀柜编码:" prop="cabinetCode" :rules="[{ required: true, message: '请输入刀柜编码', trigger: 'blur' }]">
          <el-input v-model="statisticsForm.cabinetCode" placeholder="请输入刀柜编码" />
        </el-form-item>
        <el-form-item label="柜子面:" prop="locPrefix">
          <el-select v-model="statisticsForm.locPrefix" placeholder="请选择柜子面" clearable>
            <el-option label="A面" value="A"/>
            <el-option label="B面" value="B"/>
            <el-option label="C面" value="C"/>
            <el-option label="D面" value="D"/>
            <el-option label="E面" value="E"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStatistics" :loading="statisticsLoading">查询统计</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="statisticsData" class="statistics-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="货道总数">{{ statisticsData.cabinetNum }}</el-descriptions-item>
          <el-descriptions-item label="禁用数量">{{ statisticsData.disableNum }}</el-descriptions-item>
          <el-descriptions-item label="空闲数量">{{ statisticsData.freeNum }}</el-descriptions-item>
          <el-descriptions-item label="库存告警值">{{ statisticsData.makeAlarm }}</el-descriptions-item>
          <el-descriptions-item label="刀具总价值">{{ statisticsData.priceNum ? statisticsData.priceNum.toFixed(2) + '元' : '0.00元' }}</el-descriptions-item>
          <el-descriptions-item label="在用数量">{{ statisticsData.workNum }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statisticsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绑定对话框 -->
    <el-dialog v-model="bindDialogVisible" title="绑定货道" width="600px">
      <el-form :model="bindForm" ref="bindFormRef" label-width="120px">
        <el-form-item label="耗材主键:" prop="cutterId" :rules="[{ required: true, message: '请输入耗材主键', trigger: 'blur' }]">
          <el-input v-model="bindForm.cutterId" placeholder="请输入耗材主键" />
        </el-form-item>
        <el-form-item label="是否禁用:" prop="isBan" :rules="[{ required: true, message: '请选择是否禁用', trigger: 'change' }]">
          <el-select v-model="bindForm.isBan" placeholder="请选择是否禁用">
            <el-option label="非禁用" :value="0"/>
            <el-option label="禁用" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="货道容量:" prop="locCapacity" :rules="[{ required: true, message: '请输入货道容量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locCapacity" :min="1" placeholder="请输入货道容量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="包装数量:" prop="locPackQty" :rules="[{ required: true, message: '请输入包装数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locPackQty" :min="1" placeholder="请输入包装数量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="刀具数量:" prop="locSurplus" :rules="[{ required: true, message: '请输入刀具数量', trigger: 'blur' }]">
          <el-input-number v-model="bindForm.locSurplus" :min="0" placeholder="请输入刀具数量" style="width: 100%" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBind" :loading="bindLoading">确定绑定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 解绑对话框 -->
    <el-dialog v-model="unbindDialogVisible" title="解绑货道" width="400px">
      <div class="unbind-content">
        <el-icon class="warning-icon" size="48" color="#E6A23C"><Warning /></el-icon>
        <p class="unbind-message">确定要解绑该货道吗？</p>
        <p class="unbind-tip">解绑后将清除该货道的绑定关系</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="submitUnbind" :loading="unbindLoading">确定解绑</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预补刀对话框 -->
    <el-dialog v-model="preReplenishDialogVisible" title="预补刀结果" width="1200px">
      <div v-if="preReplenishData" class="pre-replenish-content">
        <el-tabs v-model="preReplenishTab">
          <el-tab-pane label="补刀成功" name="success">
            <el-table 
              :data="preReplenishData.successStock" 
              border 
              style="width: 100%"
              max-height="400"
            >
              <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
              <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
              <el-table-column prop="locCapacity" label="货道容量" align="center" width="100"/>
              <el-table-column prop="locSurplus" label="补货前数量" align="center" width="120"/>
              <el-table-column prop="plugNum" label="补货后数量" align="center" width="120"/>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="补刀失败" name="error">
            <el-table 
              :data="preReplenishData.errorStock" 
              border 
              style="width: 100%"
              max-height="400"
            >
              <el-table-column prop="cabinetCode" label="刀柜编码" align="center" width="150"/>
              <el-table-column prop="stockLoc" label="库位号" align="center" width="120"/>
              <el-table-column prop="massage" label="失败原因" align="center" min-width="200"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else class="no-data">
        <el-empty description="暂无预补刀数据" />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="preReplenishDialogVisible = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="handleBatchReplenish"
            :loading="replenishLoading"
            :disabled="!preReplenishData || !preReplenishData.successStock || preReplenishData.successStock.length === 0"
          >
            批量补刀
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入货道数据" width="500px">
      <el-form :model="importForm" ref="importFormRef" label-width="100px">
        <el-form-item label="刀柜编码:" prop="cabinetCode" :rules="[{ required: true, message: '请输入刀柜编码', trigger: 'blur' }]">
          <el-input v-model="importForm.cabinetCode" placeholder="请输入刀柜编码" />
        </el-form-item>
        <el-form-item label="选择文件:" prop="file" :rules="[{ required: true, message: '请选择要导入的文件', trigger: 'change' }]">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="true"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            accept=".xlsx,.xls,.csv"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 xlsx/xls/csv 文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitImport" :loading="importLoading">确定导入</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增暂存记录对话框 -->
    <el-dialog v-model="storageRecordDialogVisible" title="暂存记录" width="1200px">
      <div class="storage-record-content">
        <!-- 搜索条件 -->
        <div class="storage-search-div">
          <el-form :inline="true" :model="storageSearchForm" ref="storageSearchFormRef" class="storage-search-form">
            <el-form-item label="当前页:" prop="current">
              <el-input-number v-model="storageSearchForm.current" :min="1" />
            </el-form-item>
            <el-form-item label="结束时间:" prop="endTime">
              <el-date-picker
                v-model="storageSearchForm.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="顺序:" prop="order">
              <el-select v-model="storageSearchForm.order" placeholder="请选择顺序">
                <el-option label="从大到小" :value="0" />
                <el-option label="从小到大" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序类型:" prop="rankingType">
              <el-select v-model="storageSearchForm.rankingType" placeholder="请选择排序类型">
                <el-option label="数量" :value="0" />
                <el-option label="金额" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="记录状态:" prop="recordStatus">
              <el-select v-model="storageSearchForm.recordStatus" placeholder="请选择记录状态">
                <el-option label="取刀" :value="0" />
                <el-option label="还刀" :value="1" />
                <el-option label="收刀" :value="2" />
                <el-option label="暂存" :value="3" />
                <el-option label="完成" :value="4" />
                <el-option label="违规还刀" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="每页数量:" prop="size">
              <el-input-number v-model="storageSearchForm.size" :min="1" />
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime">
              <el-date-picker
                v-model="storageSearchForm.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleStorageSearch" :loading="storageLoading">查询</el-button>
              <el-button @click="resetStorageSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 暂存记录表格 -->
        <div class="storage-table-div">
          <el-table 
            :data="storageTableData" 
            border 
            style="width: 100%" 
            v-loading="storageLoading"
            @selection-change="handleStorageSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column prop="lendUserName" label="取出人" align="center" />
            <el-table-column prop="storageUserName" label="暂存人" align="center" />
            <el-table-column prop="brandName" label="品牌名称" align="center" />
            <el-table-column prop="cutterCode" label="刀具型号" align="center" />
            <el-table-column prop="specification" label="规格" align="center" />
            <el-table-column prop="quantity" label="数量" align="center" />
            <el-table-column prop="oldPrice" label="老单价(元)" align="center">
              <template #default="scope">
                <span>{{ scope.row.oldPrice ? scope.row.oldPrice.toFixed(2) : '0.00' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="newPrice" label="新单价(元)" align="center">
              <template #default="scope">
                <span>{{ scope.row.newPrice ? scope.row.newPrice.toFixed(2) : '0.00' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="oldStockNum" label="操作前库存数" align="center" />
            <el-table-column prop="newStockNum" label="操作后库存数" align="center" />
            <el-table-column prop="stockLoc" label="库位号" align="center" />
            <el-table-column prop="logStatus" label="日志类型" align="center">
              <template #default="scope">
                <el-tag :type="getLogStatusTagType(scope.row.logStatus)">
                  {{ getLogStatusText(scope.row.logStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="业务状态" align="center">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cabinetCode" label="刀柜编码" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="operator" label="操作人" align="center" />
            <el-table-column label="操作" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleStorageDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 分页组件 -->
        <div class="storage-pagination-div">
          <el-pagination
            v-model:current-page="storagePagination.current"
            v-model:page-size="storagePagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :total="storagePagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleStorageSizeChange"
            @current-change="handleStorageCurrentChange"
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="storageRecordDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 个人暂存信息对话框 -->
    <el-dialog v-model="personalStorageDialogVisible" title="个人暂存信息" width="800px">
      <div v-if="personalStorageData && personalStorageData.length > 0">
        <el-table :data="personalStorageData" border style="width: 100%">
          <el-table-column prop="cabinetCode" label="刀柜编码" align="center" />
          <el-table-column prop="id" label="通道号主键" align="center" />
          <el-table-column prop="locPrefix" label="柜子面" align="center" />
          <el-table-column prop="locType" label="库位类型" align="center" />
          <el-table-column prop="name" label="暂存用户名" align="center" />
          <el-table-column prop="stockLoc" label="库位号" align="center" />
          <el-table-column prop="storageCode" label="暂存编码" align="center" />
          <el-table-column prop="storageType" label="暂存类型" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.storageType === 0 ? 'info' : 'warning'">
                {{ scope.row.storageType === 0 ? '公共暂存' : '个人暂存' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="storageUser" label="暂存用户" align="center" />
        </el-table>
      </div>
      <div v-else class="no-data">
        <el-empty description="暂无个人暂存信息" />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="personalStorageDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预警设置对话框 -->
    <el-dialog v-model="alarmSettingsDialogVisible" title="预警设置" width="500px">
      <el-form :model="alarmForm" ref="alarmFormRef" label-width="120px">
        <el-form-item label="刀柜编码:" prop="cabinetCode" :rules="[{ required: true, message: '请输入刀柜编码', trigger: 'blur' }]">
          <el-input v-model="alarmForm.cabinetCode" placeholder="请输入刀柜编码" />
        </el-form-item>
        <el-form-item label="告警值:" prop="alarmValue" :rules="[{ required: true, message: '请输入告警值', trigger: 'blur' }]">
          <el-input-number v-model="alarmForm.alarmValue" :min="0" placeholder="请输入告警值" style="width: 100%" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="alarmSettingsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAlarmSettings" :loading="alarmLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TakeCutterChannelManage">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning, UploadFilled } from '@element-plus/icons-vue'
import { 
  listTakeCabinet, 
  unbindCutter, 
  changeBan, 
  preBatchPlug, 
  onPreBatchPlug,
  getPublicStorageList,
  getPersonalStorageInfo,
  setTakeCabinetAlarm,
  getTakeCabinetAlarm
} from '@/api/cabinetChannel/takeCabinet'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const bindDialogVisible = ref(false)
const unbindDialogVisible = ref(false)
const preReplenishDialogVisible = ref(false)
const importDialogVisible = ref(false)
const statisticsLoading = ref(false)
const bindLoading = ref(false)
const unbindLoading = ref(false)
const preReplenishLoading = ref(false)
const replenishLoading = ref(false)
const importLoading = ref(false)
const currentRecord = ref(null)
const statisticsData = ref(null)
const currentUnbindRow = ref(null)
const preReplenishData = ref(null)
const preReplenishTab = ref('success')

// 新增暂存相关的响应式数据
const storageRecordDialogVisible = ref(false)
const personalStorageDialogVisible = ref(false)
const alarmSettingsDialogVisible = ref(false)
const storageLoading = ref(false)
const alarmLoading = ref(false)
const storageTableData = ref([])
const personalStorageData = ref([])
const selectedStorageRows = ref([])
const storageSearchFormRef = ref()
const alarmFormRef = ref()

// 搜索表单
const searchForm = reactive({
  brandCode: '',
  cabinetCode: '',
  cutterCode: '',
  cutterType: '',
  locPrefix: '',
  stockLoc: '',
  cutterOrBrand: '',
  materialCode: '',
  specification: ''
})

// 统计表单
const statisticsForm = reactive({
  cabinetCode: '',
  locPrefix: ''
})

// 绑定表单
const bindForm = reactive({
  cutterId: '',
  isBan: 0,
  locCapacity: null,
  locPackQty: null,
  locSurplus: null,
  stockId: ''
})

// 导入表单
const importForm = reactive({
  cabinetCode: '',
  file: null
})

// 分页数据
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

const searchFormRef = ref()
const statisticsFormRef = ref()
const bindFormRef = ref()
const importFormRef = ref()
const uploadRef = ref()

// 生命周期
onMounted(() => {
  getList()
})

// 货道列表查询
const getList = () => {
  loading.value = true
  
  // 构造查询参数
  const queryParams = {
    brandCode: searchForm.brandCode,
    cabinetCode: searchForm.cabinetCode,
    cutterCode: searchForm.cutterCode,
    cutterType: searchForm.cutterType,
    locPrefix: searchForm.locPrefix,
    stockLoc: searchForm.stockLoc,
    cutterOrBrand: searchForm.cutterOrBrand,
    materialCode: searchForm.materialCode,
    specification: searchForm.specification
  }
  
  // 过滤掉空值参数
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
      delete queryParams[key]
    }
  })

  listTakeCabinet(queryParams).then(response => {
    if (response.success) {
      tableData.value = response.data || []
      pagination.total = response.data.length || 0
    } else {
      ElMessage.error(response.msg || '查询失败')
      tableData.value = []
    }
    loading.value = false
  }).catch(error => {
    console.error('查询取刀柜列表失败:', error)
    ElMessage.error('查询失败')
    tableData.value = []
    loading.value = false
  })
}

// 搜索处理
const handleSearch = () => {
  pagination.current = 1
  getList()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    brandCode: '',
    cabinetCode: '',
    cutterCode: '',
    cutterType: '',
    locPrefix: '',
    stockLoc: '',
    cutterOrBrand: '',
    materialCode: '',
    specification: ''
  })
  nextTick(() => {
    searchFormRef.value?.clearValidate()
  })
  getList()
}

// 选择项变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  getList()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.current = current
  getList()
}

// 查看详情
const handleDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

// 导出数据
const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的货道记录')
    return
  }

  // 实际导出逻辑
  console.log('导出货道数据:', selectedRows.value)
  ElMessage.success('导出成功')
}

// 打开统计对话框
const handleStatistics = () => {
  statisticsDialogVisible.value = true
  statisticsData.value = null
}

// 获取统计数据
const getStatistics = () => {
  if (!statisticsForm.cabinetCode) {
    ElMessage.warning('请输入刀柜编码')
    return
  }

  statisticsLoading.value = true

  // 模拟API调用
  setTimeout(() => {
    const key = `${statisticsForm.cabinetCode}-${statisticsForm.locPrefix || 'A'}`
    statisticsData.value = mockStatisticsData[key] || {
      cabinetNum: 0,
      disableNum: 0,
      freeNum: 0,
      makeAlarm: 0,
      priceNum: 0,
      workNum: 0
    }
    statisticsLoading.value = false
  }, 500)
}

// 解绑货道
const handleUnbind = (row) => {
  currentUnbindRow.value = row
  unbindDialogVisible.value = true
}

// 提交解绑
const submitUnbind = () => {
  unbindLoading.value = true
  
  unbindCutter(currentUnbindRow.value.id).then(response => {
    if (response.success) {
      ElMessage.success('货道解绑成功')
      unbindDialogVisible.value = false
      getList() // 刷新列表
    } else {
      ElMessage.error(response.msg || '解绑失败')
    }
    unbindLoading.value = false
  }).catch(error => {
    console.error('解绑失败:', error)
    ElMessage.error('解绑失败')
    unbindLoading.value = false
  })
}

// 绑定/解绑切换
const handleToggleBind = (row) => {
  // 根据当前绑定状态决定操作
  const isBan = row.isBan || '0'  // '0'表示非禁用，'1'表示禁用
  const action = isBan === '0' ? '禁用' : '启用'
  
  ElMessageBox.confirm(`确定要${action}库位号 ${row.stockLoc} 吗?`, `确认${action}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用API切换绑定状态
    const newIsBan = isBan === '0' ? '1' : '0'
    changeBan(row.id, newIsBan).then(response => {
      if (response.success) {
        // 更新本地数据
        row.isBan = newIsBan
        ElMessage.success(`${action}成功!`)
      } else {
        ElMessage.error(response.msg || `${action}失败`)
      }
    }).catch(error => {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败`)
    })
  }).catch(() => {
    ElMessage.info(`已取消${action}`)
  })
}

// 绑定货道
const handleBind = (row) => {
  // 重置绑定表单
  Object.assign(bindForm, {
    cutterId: row.cutterId || '',
    isBan: row.isBan || 0,
    locCapacity: row.locCapacity || null,
    locPackQty: row.packQty || null,
    locSurplus: row.locSurplus || null,
    stockId: row.id || ''
  })

  bindDialogVisible.value = true
}

// 提交绑定
const submitBind = () => {
  bindFormRef.value?.validate((valid) => {
    if (valid) {
      bindLoading.value = true

      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('货道绑定成功')
        bindDialogVisible.value = false
        getList() // 刷新列表
        bindLoading.value = false
      }, 1000)
    }
  })
}

// 预补刀
const handlePreReplenish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要预补刀的货道记录')
    return
  }

  // 获取选中记录的刀柜编码（假设所有选中记录属于同一个刀柜）
  const cabinetCode = selectedRows.value[0].cabinetCode
  if (!cabinetCode) {
    ElMessage.warning('无法获取刀柜编码')
    return
  }

  preReplenishLoading.value = true
  preReplenishData.value = null
  preReplenishTab.value = 'success'
  preReplenishDialogVisible.value = true

  // 调用预补刀接口
  preBatchPlug(cabinetCode).then(response => {
    if (response.success) {
      preReplenishData.value = response.data || { successStock: [], errorStock: [] }
      ElMessage.success('预补刀查询成功')
    } else {
      ElMessage.error(response.msg || '预补刀查询失败')
      preReplenishData.value = { successStock: [], errorStock: [] }
    }
    preReplenishLoading.value = false
  }).catch(error => {
    console.error('预补刀查询失败:', error)
    ElMessage.error('预补刀查询失败')
    preReplenishData.value = { successStock: [], errorStock: [] }
    preReplenishLoading.value = false
  })
}

// 批量补刀
const handleBatchReplenish = () => {
  if (!preReplenishData.value || !preReplenishData.value.successStock || preReplenishData.value.successStock.length === 0) {
    ElMessage.warning('没有可补刀的货道')
    return
  }

  // 获取刀柜编码
  const cabinetCode = preReplenishData.value.successStock[0]?.cabinetCode
  if (!cabinetCode) {
    ElMessage.warning('无法获取刀柜编码')
    return
  }

  replenishLoading.value = true

  // 调用批量补刀接口
  onPreBatchPlug(cabinetCode).then(response => {
    if (response.success) {
      if (response.data) {
        ElMessage.success('批量补刀成功')
        preReplenishDialogVisible.value = false
        getList() // 刷新列表
      } else {
        ElMessage.warning('批量补刀失败')
      }
    } else {
      ElMessage.error(response.msg || '批量补刀失败')
    }
    replenishLoading.value = false
  }).catch(error => {
    console.error('批量补刀失败:', error)
    ElMessage.error('批量补刀失败')
    replenishLoading.value = false
  })
}

// 补刀操作
const handleReplenish = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要补刀的货道记录')
    return
  }

  replenishLoading.value = true

  // 模拟API调用
  setTimeout(() => {
    ElMessage.success(`补刀成功，共处理${selectedRows.value.length}条货道记录`)
    replenishLoading.value = false
    getList() // 刷新列表
  }, 1000)
}

// 预警设置
const handleAlarmSettings = () => {
  alarmSettingsDialogVisible.value = true
  // 重置表单
  Object.assign(alarmForm, {
    cabinetCode: '',
    alarmValue: null
  })
}

// 提交预警设置
const submitAlarmSettings = () => {
  alarmFormRef.value?.validate((valid) => {
    if (valid) {
      alarmLoading.value = true
      
      setTakeCabinetAlarm(alarmForm.cabinetCode, alarmForm.alarmValue).then(response => {
        if (response.success) {
          ElMessage.success('预警设置成功')
          alarmSettingsDialogVisible.value = false
        } else {
          ElMessage.error(response.msg || '预警设置失败')
        }
        alarmLoading.value = false
      }).catch(error => {
        console.error('预警设置失败:', error)
        ElMessage.error('预警设置失败')
        alarmLoading.value = false
      })
    }
  })
}

// 获取预警值
const getAlarmValue = (cabinetCode) => {
  if (!cabinetCode) {
    ElMessage.warning('请输入刀柜编码')
    return
  }
  
  getTakeCabinetAlarm(cabinetCode).then(response => {
    if (response.success) {
      ElMessage.info(`刀柜 ${cabinetCode} 的告警值为: ${response.data || 0}`)
    } else {
      ElMessage.error(response.msg || '获取告警值失败')
    }
  }).catch(error => {
    console.error('获取告警值失败:', error)
    ElMessage.error('获取告警值失败')
  })
}

// 打开暂存记录对话框
const handleStorageRecord = () => {
  storageRecordDialogVisible.value = true
  getStorageList()
}

// 获取暂存记录列表
const getStorageList = () => {
  storageLoading.value = true
  
  // 构造查询参数
  const queryParams = {
    current: storageSearchForm.current,
    end_time: storageSearchForm.endTime,
    order: storageSearchForm.order,
    ranking_type: storageSearchForm.rankingType,
    record_status: storageSearchForm.recordStatus,
    size: storageSearchForm.size,
    start_time: storageSearchForm.startTime
  }
  
  // 过滤掉空值参数
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
      delete queryParams[key]
    }
  })

  getPublicStorageList(queryParams).then(response => {
    if (response.success) {
      storageTableData.value = response.data.records || []
      storagePagination.total = response.data.total || 0
      storagePagination.current = response.data.current || 1
      storagePagination.size = response.data.size || 20
    } else {
      ElMessage.error(response.msg || '查询暂存记录失败')
      storageTableData.value = []
    }
    storageLoading.value = false
  }).catch(error => {
    console.error('查询暂存记录失败:', error)
    ElMessage.error('查询暂存记录失败')
    storageTableData.value = []
    storageLoading.value = false
  })
}

// 暂存记录搜索处理
const handleStorageSearch = () => {
  storagePagination.current = 1
  getStorageList()
}

// 重置暂存记录搜索
const resetStorageSearch = () => {
  Object.assign(storageSearchForm, {
    current: 1,
    endTime: '',
    order: null,
    rankingType: null,
    recordStatus: null,
    size: 20,
    startTime: ''
  })
  nextTick(() => {
    storageSearchFormRef.value?.clearValidate()
  })
  getStorageList()
}

// 暂存记录选择项变化
const handleStorageSelectionChange = (selection) => {
  selectedStorageRows.value = selection
}

// 暂存记录分页大小变化
const handleStorageSizeChange = (size) => {
  storagePagination.size = size
  getStorageList()
}

// 暂存记录页码变化
const handleStorageCurrentChange = (current) => {
  storagePagination.current = current
  getStorageList()
}

// 查看暂存记录详情
const handleStorageDetail = (row) => {
  ElMessageBox.alert(`
    取出人: ${row.lendUserName}
    暂存人: ${row.storageUserName || '-'}
    品牌名称: ${row.brandName}
    刀具型号: ${row.cutterCode}
    规格: ${row.specification}
    物料编码: ${row.materialCode}
    数量: ${row.quantity}
    老单价: ${row.oldPrice ? row.oldPrice.toFixed(2) + '元' : '0.00元'}
    新单价: ${row.newPrice ? row.newPrice.toFixed(2) + '元' : '0.00元'}
    操作前库存数: ${row.oldStockNum}
    操作后库存数: ${row.newStockNum}
    库位号: ${row.stockLoc}
    刀柜编码: ${row.cabinetCode}
    日志类型: ${getLogStatusText(row.logStatus)}
    业务状态: ${getStatusText(row.status)}
    创建部门: ${row.createDept}
    创建人: ${row.createUser}
    更新人: ${row.updateUser}
    操作人: ${row.operator}
    创建时间: ${row.createTime}
    更新时间: ${row.updateTime}
    操作详情: ${row.detailsCode}
    备注: ${row.remake || '-'}
    租户ID: ${row.tenantId}
    是否删除: ${row.isDeleted === 0 ? '正常' : '已删除'}
  `, '暂存记录详情', {
    confirmButtonText: '确定'
  })
}

// 打开个人暂存信息对话框
const handlePersonalStorage = () => {
  // 获取选中的刀柜编码
  const cabinetCode = searchForm.cabinetCode
  if (!cabinetCode) {
    ElMessage.warning('请先输入刀柜编码')
    return
  }
  
  personalStorageDialogVisible.value = true
  getPersonalStorageInfo(cabinetCode).then(response => {
    if (response.success) {
      personalStorageData.value = response.data || []
    } else {
      ElMessage.error(response.msg || '查询个人暂存信息失败')
      personalStorageData.value = []
    }
  }).catch(error => {
    console.error('查询个人暂存信息失败:', error)
    ElMessage.error('查询个人暂存信息失败')
    personalStorageData.value = []
  })
}

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true
  // 重置导入表单
  Object.assign(importForm, {
    cabinetCode: '',
    file: null
  })
  // 清空上传组件
  uploadRef.value?.clearFiles()
}

// 文件变化处理
const handleFileChange = (file) => {
  importForm.file = file.raw
}

// 文件移除处理
const handleFileRemove = () => {
  importForm.file = null
}

// 提交导入
const submitImport = () => {
  importFormRef.value?.validate((valid) => {
    if (valid) {
      if (!importForm.file) {
        ElMessage.warning('请选择要导入的文件')
        return
      }

      importLoading.value = true

      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('货道数据导入成功')
        importDialogVisible.value = false
        importLoading.value = false
        getList() // 刷新列表
      }, 2000)
    }
  })
}

// 状态文本和样式方法
const getStatusText = (status) => {
  const statusMap = {
    0: '取刀',
    1: '还刀', 
    2: '收刀',
    3: '暂存',
    4: '完成',
    5: '违规还刀'
  }
  return statusMap[status] || '未知'
}

const getStatusTagType = (status) => {
  const typeMap = {
    0: 'primary',
    1: 'warning',
    2: 'info',
    3: 'warning',
    4: 'success',
    5: 'danger'
  }
  return typeMap[status] || 'info'
}

const getLogStatusText = (logStatus) => {
  const statusMap = {
    0: '操作日志',
    1: '公共暂存',
    2: '补货'
  }
  return statusMap[logStatus] || '未知'
}

const getLogStatusTagType = (logStatus) => {
  const typeMap = {
    0: 'primary',
    1: 'warning',
    2: 'success'
  }
  return typeMap[logStatus] || 'info'
}

const getStockStatusText = (status) => {
  const statusMap = {
    0: '空闲',
    1: '占用',
    2: '维护'
  }
  return statusMap[status] || '未知'
}

const getStockStatusTagType = (status) => {
  const typeMap = {
    0: 'success',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStorageTypeText = (type) => {
  const typeMap = {
    0: '公共暂存',
    1: '个人暂存',
    2: '扩展取刀'
  }
  return typeMap[type] || '未知'
}

const getStorageTypeTagType = (type) => {
  const typeMap = {
    0: 'primary',
    1: 'success',
    2: 'warning'
  }
  return typeMap[type] || 'info'
}

const getLocPrefixTagType = (prefix) => {
  const typeMap = {
    'A': 'primary',
    'B': 'success',
    'C': 'warning',
    'D': 'danger',
    'E': 'info'
  }
  return typeMap[prefix] || 'info'
}

// 统计数据模拟
const mockStatisticsData = {
  'CAB20241227001-A': {
    cabinetNum: 150,
    disableNum: 5,
    freeNum: 20,
    makeAlarm: 10,
    priceNum: 18750.50,
    workNum: 125
  },
  'CAB20241227002-B': {
    cabinetNum: 120,
    disableNum: 3,
    freeNum: 15,
    makeAlarm: 8,
    priceNum: 10716.00,
    workNum: 102
  },
  'CAB20241227003-C': {
    cabinetNum: 180,
    disableNum: 8,
    freeNum: 25,
    makeAlarm: 12,
    priceNum: 28224.00,
    workNum: 147
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.topSearchDiv {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.buttonDiv {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.tableDiv {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 20px;
}

.paginationDiv {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 20px 20px;
}

.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.statistics-form {
  margin-bottom: 20px;
}

.statistics-content {
  margin-top: 20px;
}

.unbind-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  margin-bottom: 16px;
}

.unbind-message {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
}

.unbind-tip {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.pre-replenish-content {
  margin-bottom: 20px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
}

.storage-search-div {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.storage-table-div {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 20px;
}

.storage-pagination-div {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 20px 20px;
}

.storage-search-form .el-form-item {
  margin-bottom: 10px;
}
</style>







