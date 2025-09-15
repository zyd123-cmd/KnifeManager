<template>
  <div class="container">
    <div>刀具柜管理页面</div>
    <!--  顶部查询条件区域-->
    <div class="topSearchDiv">
      <el-form :inline="true" :model="formInline" ref="formInlineRes" class="demo-form-inline">
        <el-form-item label="刀具柜编码:" prop="cabinetCode">
          <el-input v-model="formInline.cabinetCode" placeholder="请输入刀具柜编码" clearable/>
        </el-form-item>
        <el-form-item label="刀具柜名称:" prop="cabinetName">
          <el-input v-model="formInline.cabinetName" placeholder="请输入刀具柜名称" clearable/>
        </el-form-item>
        <el-form-item label="公司:" prop="company">
          <el-input v-model="formInline.company" placeholder="请输入公司名称" clearable/>
        </el-form-item>
        <el-form-item label="创建部门:" prop="createDept">
          <el-input v-model="formInline.createDept" placeholder="请输入创建部门" clearable/>
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model="formInline.createUser" placeholder="请输入创建人" clearable/>
        </el-form-item>
        <el-form-item label="工厂名称:" prop="factoryName">
          <el-input v-model="formInline.factoryName" placeholder="请输入工厂名称" clearable/>
        </el-form-item>
        <el-form-item label="车间:" prop="factoryId">
          <el-select
            v-model="formInline.factoryId"
            placeholder="请选择车间"
            clearable
            filterable
            style="width: 200px;"
          >
            <el-option 
              v-for="workshop in workshopList" 
              :key="workshop.id"
              :label="workshop.name" 
              :value="workshop.id"
            />
          </el-select>
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="search">搜索</el-button>
          <el-button @click="reFreshForm(formInlineRes)" icon="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    新增按钮-->
    <div class="buttonDiv">
      <el-button type="primary" icon="plus" @click="openAddDialog">新增刀具柜</el-button>
      <el-button type="success" icon="search" @click="openIdleQueryDialog">空闲查询</el-button>
      <el-button
        type="danger"
        icon="delete"
        @click="batchDelete"
        :disabled="selectedRows.length === 0"
      >
        批量删除
      </el-button>
    </div>

    <!--    中部表格显示刀具柜信息-->
    <div class="tableDiv">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="cabinetCode" label="刀具柜编码" align="center" width="150"/>
        <el-table-column prop="cabinetName" label="刀具柜名称" align="center" width="200"/>
        <el-table-column prop="company" label="公司" align="center" width="150"/>
        <el-table-column prop="createDept" label="创建部门" align="center" width="120"/>
        <el-table-column prop="createUser" label="创建人" align="center" width="100"/>
        <el-table-column prop="factoryName" label="工厂名称" align="center" width="150"/>
        <el-table-column prop="workshopName" label="车间名称" align="center" width="120"/>
        <el-table-column prop="location" label="位置" align="center" width="120"/>
        <el-table-column prop="capacity" label="容量" align="center" width="80"/>
        <el-table-column prop="currentCount" label="当前数量" align="center" width="100"/>
        <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="200" show-overflow-tooltip/>
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

    <!-- 新增刀具柜对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑刀具柜' : '新增刀具柜'"
      width="1200px"
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
        <el-row :gutter="20" v-if="isEdit">
          <el-col :span="12">
            <el-form-item label="刀具柜编码" prop="cabinetCode">
              <el-input
                v-model="addForm.cabinetCode"
                placeholder="系统自动生成"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="刀具柜名称" prop="cabinetName">
              <el-input
                v-model="addForm.cabinetName"
                placeholder="请输入刀具柜名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司" prop="company">
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
            <el-form-item label="工厂名称" prop="factoryName">
              <el-input
                v-model="addForm.factoryName"
                placeholder="请输入工厂名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间" prop="factoryId">
              <el-select
                v-model="addForm.factoryId"
                placeholder="请选择车间"
                clearable
                filterable
                style="width: 100%"
                @change="handleWorkshopChange"
              >
                <el-option
                  v-for="workshop in workshopList"
                  :key="workshop.id"
                  :label="workshop.name"
                  :value="workshop.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="楼层" prop="floor">
              <el-select
                v-model="addForm.floor"
                placeholder="请选择楼层"
                clearable
                style="width: 100%"
              >
                <el-option label="1楼" value="1" />
                <el-option label="2楼" value="2" />
                <el-option label="3楼" value="3" />
                <el-option label="4楼" value="4" />
                <el-option label="5楼" value="5" />
                <el-option label="地下1楼" value="B1" />
                <el-option label="地下2楼" value="B2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 货道信息 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <div class="stock-tabs-container">
                <el-tabs
                  v-model="activeStockTab"
                  type="border-card"
                  class="stock-tabs"
                  @tab-click="handleTabClick"
                >
                  <el-tab-pane
                    v-for="(stock, index) in addForm.stockList"
                    :key="stock.locPrefix"
                    :label="stock.locPrefix + '面'"
                    :name="stock.locPrefix"
                  >
                    <template #label>
                      <div class="tab-label">
                        <el-tag
                          :type="getFaceTagType(stock.locPrefix)"
                          size="small"
                          effect="dark"
                        >
                          {{ stock.locPrefix }}面
                        </el-tag>
                        <el-badge
                          :value="stock.locType === 0 ? '收刀' : '取刀'"
                          :type="stock.locType === 0 ? 'warning' : 'success'"
                          class="tab-badge"
                        />
                      </div>
                    </template>

                    <div class="stock-tab-content">
                      <div class="stock-form">
                        <el-row :gutter="30">
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><Box /></el-icon>
                                货道容量
                              </label>
                              <el-input-number
                                v-model="stock.locCapacity"
                                :min="1"
                                :max="999"
                                size="large"
                                controls-position="right"
                                class="form-input"
                              />
                              <div class="form-help">每个货道能存放的刀具数量</div>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><Setting /></el-icon>
                                库位类型
                              </label>
                              <el-select
                                v-model="stock.locType"
                                size="large"
                                class="form-input"
                              >
                                <el-option label="收刀柜" :value="0">
                                  <div class="option-content">
                                    <el-icon><Download /></el-icon>
                                    <span>收刀柜</span>
                                  </div>
                                </el-option>
                                <el-option label="取刀柜" :value="1">
                                  <div class="option-content">
                                    <el-icon><Upload /></el-icon>
                                    <span>取刀柜</span>
                                  </div>
                                </el-option>
                              </el-select>
                              <div class="form-help">选择该面的功能类型</div>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><Grid /></el-icon>
                                货道总数
                              </label>
                              <el-input-number
                                v-model="stock.quantity"
                                :min="1"
                                :max="999"
                                size="large"
                                controls-position="right"
                                class="form-input"
                              />
                              <div class="form-help">该面总共有多少个货道</div>
                            </div>
                          </el-col>
                        </el-row>

                        <el-row :gutter="30">
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><DataAnalysis /></el-icon>
                                总容量
                              </label>
                              <div class="capacity-display">
                                <span class="capacity-number">{{ stock.locCapacity * stock.quantity }}</span>
                                <span class="capacity-unit">个刀具</span>
                              </div>
                              <div class="form-help">该面总共能存放的刀具数量</div>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><OfficeBuilding /></el-icon>
                                刀具柜名称
                              </label>
                              <el-input
                                v-model="stock.cabinetName"
                                size="large"
                                :disabled="true"
                                class="form-input disabled-input"
                              />
                              <div class="form-help">自动关联刀具柜名称</div>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div class="form-item">
                              <label class="form-label">
                                <el-icon><Key /></el-icon>
                                刀具柜编号
                              </label>
                              <el-input
                                v-model="stock.cabinetCode"
                                size="large"
                                :disabled="true"
                                class="form-input disabled-input"
                              />
                              <div class="form-help">自动关联刀具柜编号</div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
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

    <!-- 刀具柜详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="刀具柜详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-if="currentCabinet">
        <!-- 基本信息 -->
        <el-descriptions title="刀具柜基本信息" :column="2" border>
          <el-descriptions-item label="刀具柜编码">{{ currentCabinet.cabinetCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具柜名称">{{ currentCabinet.cabinetName }}</el-descriptions-item>
          <el-descriptions-item label="公司">{{ currentCabinet.company }}</el-descriptions-item>
          <el-descriptions-item label="创建部门">{{ currentCabinet.createDept }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentCabinet.createUser }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ currentCabinet.updateUser }}</el-descriptions-item>
          <el-descriptions-item label="工厂名称">{{ currentCabinet.factoryName }}</el-descriptions-item>
          <el-descriptions-item label="车间名称">{{ currentCabinet.workshopName }}</el-descriptions-item>
          <el-descriptions-item label="楼层">{{ currentCabinet.floor }}</el-descriptions-item>
          <el-descriptions-item label="容量">{{ currentCabinet.capacity }}</el-descriptions-item>
          <el-descriptions-item label="当前数量">{{ currentCabinet.currentCount }}</el-descriptions-item>
          <el-descriptions-item label="使用率">{{ ((currentCabinet.currentCount / currentCabinet.capacity) * 100).toFixed(1) }}%</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentCabinet.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentCabinet.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentCabinet.status === 'active' ? 'success' : 'danger'">
              {{ currentCabinet.status === 'active' ? '正常' : '停用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentCabinet.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 货道信息 -->
        <div class="detail-stock-section" v-if="currentCabinet.stockList && currentCabinet.stockList.length > 0">
          <h3 class="section-title">
            <el-icon><Grid /></el-icon>
            货道配置信息
          </h3>

          <el-tabs
            v-model="activeDetailTab"
            type="border-card"
            class="detail-stock-tabs"
          >
            <el-tab-pane
              v-for="stock in currentCabinet.stockList"
              :key="stock.locPrefix"
              :label="stock.locPrefix + '面'"
              :name="stock.locPrefix"
            >
              <template #label>
                <div class="detail-tab-label">
                  <el-tag
                    :type="getFaceTagType(stock.locPrefix)"
                    size="small"
                    effect="dark"
                  >
                    {{ stock.locPrefix }}面
                  </el-tag>
                  <span class="tab-type">{{ stock.locType === 0 ? '收刀' : '取刀' }}</span>
                </div>
              </template>

              <div class="detail-stock-content">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="detail-info-card">
                      <div class="info-header">
                        <el-icon><Box /></el-icon>
                        <span>货道容量</span>
                      </div>
                      <div class="info-value">{{ stock.locCapacity }}</div>
                      <div class="info-desc">每个货道能存放的刀具数量</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="detail-info-card">
                      <div class="info-header">
                        <el-icon><Setting /></el-icon>
                        <span>库位类型</span>
                      </div>
                      <div class="info-value">
                        <el-tag :type="stock.locType === 0 ? 'warning' : 'success'">
                          {{ stock.locType === 0 ? '收刀柜' : '取刀柜' }}
                        </el-tag>
                      </div>
                      <div class="info-desc">{{ stock.locType === 0 ? '回收使用过的刀具' : '提供新的刀具' }}</div>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="detail-info-card">
                      <div class="info-header">
                        <el-icon><Grid /></el-icon>
                        <span>货道总数</span>
                      </div>
                      <div class="info-value">{{ stock.quantity }}</div>
                      <div class="info-desc">该面总共有多少个货道</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="detail-info-card highlight-card">
                      <div class="info-header">
                        <el-icon><DataAnalysis /></el-icon>
                        <span>总容量</span>
                      </div>
                      <div class="info-value highlight-value">{{ stock.locCapacity * stock.quantity }}</div>
                      <div class="info-desc">该面总共能存放的刀具数量</div>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="24">
                    <div class="detail-info-card full-width">
                      <div class="info-header">
                        <el-icon><OfficeBuilding /></el-icon>
                        <span>关联信息</span>
                      </div>
                      <div class="info-content">
                        <div class="info-row">
                          <span class="info-label">刀具柜名称：</span>
                          <span class="info-text">{{ stock.cabinetName }}</span>
                        </div>
                        <div class="info-row">
                          <span class="info-label">刀具柜编号：</span>
                          <span class="info-text">{{ stock.cabinetCode }}</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 无货道信息提示 -->
        <div v-else class="no-stock-info">
          <el-empty description="暂无货道配置信息" />
        </div>

        <!-- 设备信息 -->
        <div class="device-info-section">
          <h3 class="section-title">
            <el-icon><Setting /></el-icon>
            设备信息
          </h3>

          <div v-loading="deviceLoading" class="device-info-content">
            <div v-if="deviceInfo" class="device-info-card">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="设备编码">{{ deviceInfo.deviceCode }}</el-descriptions-item>
                <el-descriptions-item label="设备名称">{{ deviceInfo.deviceName }}</el-descriptions-item>
                <el-descriptions-item label="设备位置">{{ deviceInfo.devicePlace }}</el-descriptions-item>
                <el-descriptions-item label="设备类型">{{ deviceInfo.deviceType }}</el-descriptions-item>
                <el-descriptions-item label="设备状态">
                  <el-tag :type="deviceInfo.deviceStatus === 0 ? 'success' : 'danger'">
                    {{ deviceInfo.deviceStatus === 0 ? '启动' : '禁用' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="业务状态">
                  <el-tag :type="deviceInfo.status === 1 ? 'success' : 'danger'">
                    {{ deviceInfo.status === 1 ? '正常' : '停用' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="IC卡号">{{ deviceInfo.icCardNo }}</el-descriptions-item>
                <el-descriptions-item label="车间主键">{{ deviceInfo.factoryId }}</el-descriptions-item>
                <el-descriptions-item label="操作系统">{{ deviceInfo.operateSys }}</el-descriptions-item>
                <el-descriptions-item label="显示顺序">{{ deviceInfo.orderNum }}</el-descriptions-item>
                <el-descriptions-item label="租户ID">{{ deviceInfo.tenantId }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ deviceInfo.updateTime }}</el-descriptions-item>
                <el-descriptions-item label="是否删除">
                  <el-tag :type="deviceInfo.isDeleted === 0 ? 'success' : 'danger'">
                    {{ deviceInfo.isDeleted === 0 ? '正常' : '已删除' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="更新人">{{ deviceInfo.updateUser }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <div v-else-if="!deviceLoading" class="no-device-info">
              <el-empty description="暂无设备信息" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 空闲查询对话框 -->
    <el-dialog
      v-model="idleQueryDialogVisible"
      title="空闲查询"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="idleQueryFormRef"
        :model="idleQueryForm"
        :rules="idleQueryFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="刀柜编码" prop="cabinetCode">
              <el-select
                v-model="idleQueryForm.cabinetCode"
                placeholder="请选择刀柜编码"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="cabinet in cabinetCodeList"
                  :key="cabinet.value"
                  :label="cabinet.label"
                  :value="cabinet.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="库位类型" prop="locType">
              <el-select
                v-model="idleQueryForm.locType"
                placeholder="请选择库位类型"
                style="width: 100%"
              >
                <el-option label="收刀柜" :value="0" />
                <el-option label="取刀柜" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="获取方向" prop="direction">
              <el-select
                v-model="idleQueryForm.direction"
                placeholder="请选择获取方向"
                style="width: 100%"
              >
                <el-option label="从上至下" :value="0" />
                <el-option label="从下至上" :value="1" />
                <el-option label="中间" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeIdleQueryDialog">取消</el-button>
          <el-button
            type="primary"
            @click="submitIdleQuery"
            :loading="idleQueryLoading"
          >
            {{ idleQueryLoading ? '查询中...' : '确认查询' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {reactive, ref, onMounted, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Grid, Download, Upload, Box, Setting, DataAnalysis, OfficeBuilding, Key } from '@element-plus/icons-vue'

const formInlineRes = ref()
const addFormRef = ref()
const idleQueryFormRef = ref()

// 顶部查询数据
const formInline = reactive({
  cabinetCode: '', //刀具柜编码
  cabinetName: '', //刀具柜名称
  company: '', //公司
  createDept: '', //创建部门
  createUser: '', //创建人
  factoryName: '', //工厂名称
  factoryId: '', //车间主键
  createTime: '', //创建时间
})

// 分页和加载状态
const loading = ref(false)
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const queryParams = reactive({
  cabinetCode: '',
  cabinetName: '',
  company: '',
  createDept: '',
  createUser: '',
  factoryName: '',
  factoryId: '',
  createTimeStart: '',
  createTimeEnd: ''
})

// 表格数据
const tableData = ref([])

// 车间列表数据
const workshopList = reactive([
  { id: 'WS001', name: '第一车间' },
  { id: 'WS002', name: '第二车间' },
  { id: 'WS003', name: '第三车间' },
  { id: 'WS004', name: '装配车间' },
  { id: 'WS005', name: '机加工车间' },
  { id: 'WS006', name: '热处理车间' },
  { id: 'WS007', name: '表面处理车间' },
  { id: 'WS008', name: '质检车间' }
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

// 模拟数据
const mockData = [
  {
    id: 1,
    cabinetCode: 'CAB20241227001',
    cabinetName: '第一车间刀具柜A',
    company: '精密制造有限公司',
    createDept: '生产部',
    createUser: '张工程师',
    updateUser: '李主管',
    factoryName: '主工厂',
    factoryId: 'WS001',
    workshopName: '第一车间',
    location: 'A区-01号位',
    capacity: 100,
    currentCount: 85,
    createTime: '2024-12-25 09:00:00',
    updateTime: '2024-12-26 14:30:00',
    status: 'active',
    remark: '主要存放铣刀和钻头',
    stockList: [
      {
        locPrefix: 'A',
        locCapacity: 20,
        locType: 0,
        quantity: 10,
        cabinetName: '第一车间刀具柜A',
        cabinetCode: 'CAB20241227001'
      },
      {
        locPrefix: 'B',
        locCapacity: 20,
        locType: 0,
        quantity: 10,
        cabinetName: '第一车间刀具柜A',
        cabinetCode: 'CAB20241227001'
      },
      {
        locPrefix: 'C',
        locCapacity: 20,
        locType: 1,
        quantity: 10,
        cabinetName: '第一车间刀具柜A',
        cabinetCode: 'CAB20241227001'
      },
      {
        locPrefix: 'D',
        locCapacity: 20,
        locType: 1,
        quantity: 10,
        cabinetName: '第一车间刀具柜A',
        cabinetCode: 'CAB20241227001'
      },
      {
        locPrefix: 'E',
        locCapacity: 20,
        locType: 0,
        quantity: 10,
        cabinetName: '第一车间刀具柜A',
        cabinetCode: 'CAB20241227001'
      }
    ]
  },
  {
    id: 2,
    cabinetCode: 'CAB20241227002',
    cabinetName: '第二车间刀具柜B',
    company: '智能制造科技公司',
    createDept: '维修部',
    createUser: '王技师',
    updateUser: '赵主管',
    factoryName: '分工厂',
    factoryId: 'WS002',
    workshopName: '第二车间',
    location: 'B区-02号位',
    capacity: 80,
    currentCount: 65,
    createTime: '2024-12-24 10:15:00',
    updateTime: '2024-12-25 16:45:00',
    status: 'active',
    remark: '专用于车刀存放'
  },
  {
    id: 3,
    cabinetCode: 'CAB20241227003',
    cabinetName: '装配车间刀具柜C',
    company: '质量检测中心',
    createDept: '质检部',
    createUser: '陈检验员',
    updateUser: '孙主管',
    factoryName: '主工厂',
    factoryId: 'WS004',
    workshopName: '装配车间',
    location: 'C区-03号位',
    capacity: 60,
    currentCount: 45,
    createTime: '2024-12-23 08:30:00',
    updateTime: '2024-12-24 11:20:00',
    status: 'inactive',
    remark: '维护中，暂停使用'
  },
  {
    id: 4,
    cabinetCode: 'CAB20241227004',
    cabinetName: '机加工车间刀具柜D',
    company: '创新研发有限公司',
    createDept: '研发部',
    createUser: '刘工程师',
    updateUser: '周经理',
    factoryName: '研发中心',
    factoryId: 'WS005',
    workshopName: '机加工车间',
    location: 'D区-04号位',
    capacity: 120,
    currentCount: 95,
    createTime: '2024-12-22 14:00:00',
    updateTime: '2024-12-23 09:15:00',
    status: 'active',
    remark: '高精度刀具专用柜'
  },
  {
    id: 5,
    cabinetCode: 'CAB20241227005',
    cabinetName: '质检车间刀具柜E',
    company: '大规模制造集团',
    createDept: '质检部',
    createUser: '马班长',
    updateUser: '吴主任',
    factoryName: '主工厂',
    factoryId: 'WS008',
    workshopName: '质检车间',
    location: 'E区-05号位',
    capacity: 50,
    currentCount: 30,
    createTime: '2024-12-21 07:45:00',
    updateTime: '2024-12-22 18:30:00',
    status: 'active',
    remark: '检测工具专用存放'
  }
]

// 设备信息模拟数据
const mockDeviceData = {
  'CAB20241227001': {
    deviceCode: 'DEV001',
    deviceName: '智能刀具柜控制器A',
    devicePlace: '第一车间A区',
    deviceStatus: 0,
    deviceType: '刀具柜控制器',
    factoryId: 'WS001',
    icCardNo: 'IC001234567890',
    id: 1,
    isDeleted: 0,
    operateSys: 'Linux 4.19',
    orderNum: 1,
    status: 1,
    tenantId: 'T001',
    updateTime: '2024-12-27 10:30:00',
    updateUser: 1001
  },
  'CAB20241227002': {
    deviceCode: 'DEV002',
    deviceName: '智能刀具柜控制器B',
    devicePlace: '第二车间B区',
    deviceStatus: 0,
    deviceType: '刀具柜控制器',
    factoryId: 'WS002',
    icCardNo: 'IC001234567891',
    id: 2,
    isDeleted: 0,
    operateSys: 'Linux 4.19',
    orderNum: 2,
    status: 1,
    tenantId: 'T001',
    updateTime: '2024-12-26 15:20:00',
    updateUser: 1002
  },
  'CAB20241227003': {
    deviceCode: 'DEV003',
    deviceName: '智能刀具柜控制器C',
    devicePlace: '第三车间C区',
    deviceStatus: 1,
    deviceType: '刀具柜控制器',
    factoryId: 'WS003',
    icCardNo: 'IC001234567892',
    id: 3,
    isDeleted: 0,
    operateSys: 'Linux 4.19',
    orderNum: 3,
    status: 0,
    tenantId: 'T001',
    updateTime: '2024-12-25 09:45:00',
    updateUser: 1003
  },
  'CAB20241227004': {
    deviceCode: 'DEV004',
    deviceName: '智能刀具柜控制器D',
    devicePlace: '第四车间D区',
    deviceStatus: 0,
    deviceType: '刀具柜控制器',
    factoryId: 'WS004',
    icCardNo: 'IC001234567893',
    id: 4,
    isDeleted: 0,
    operateSys: 'Linux 4.19',
    orderNum: 4,
    status: 1,
    tenantId: 'T001',
    updateTime: '2024-12-24 14:15:00',
    updateUser: 1004
  },
  'CAB20241227005': {
    deviceCode: 'DEV005',
    deviceName: '智能刀具柜控制器E',
    devicePlace: '质检车间E区',
    deviceStatus: 0,
    deviceType: '刀具柜控制器',
    factoryId: 'WS008',
    icCardNo: 'IC001234567894',
    id: 5,
    isDeleted: 0,
    operateSys: 'Linux 4.19',
    orderNum: 5,
    status: 1,
    tenantId: 'T001',
    updateTime: '2024-12-23 11:30:00',
    updateUser: 1005
  }
};

// 对话框相关
const addDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const idleQueryDialogVisible = ref(false)
const addLoading = ref(false)
const idleQueryLoading = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const currentCabinet = ref(null)
const selectedRows = ref([])

// 空闲查询表单数据
const idleQueryForm = reactive({
  cabinetCode: '',
  locType: 0, // 默认收刀柜
  direction: 0 // 默认从上至下
})

// 空闲查询表单验证规则
const idleQueryFormRules = reactive({
  cabinetCode: [
    { required: true, message: '请选择刀柜编码', trigger: 'change' }
  ],
  locType: [
    { required: true, message: '请选择库位类型', trigger: 'change' }
  ],
  direction: [
    { required: true, message: '请选择获取方向', trigger: 'change' }
  ]
})

// 刀柜编码列表
const cabinetCodeList = ref([])
const activeStockTab = ref('A')
const activeDetailTab = ref('A')
const deviceInfo = ref(null)
const deviceLoading = ref(false)

// 新增表单数据
const addForm = reactive({
  cabinetCode: '',
  cabinetName: '',
  company: '',
  factoryName: '',
  factoryId: '',
  floor: '',
  stockList: [
    {
      locPrefix: 'A',
      locCapacity: 10,
      locType: 0,
      quantity: 5,
      cabinetName: '',
      cabinetCode: ''
    },
    {
      locPrefix: 'B',
      locCapacity: 10,
      locType: 0,
      quantity: 5,
      cabinetName: '',
      cabinetCode: ''
    },
    {
      locPrefix: 'C',
      locCapacity: 10,
      locType: 1,
      quantity: 5,
      cabinetName: '',
      cabinetCode: ''
    },
    {
      locPrefix: 'D',
      locCapacity: 10,
      locType: 1,
      quantity: 5,
      cabinetName: '',
      cabinetCode: ''
    },
    {
      locPrefix: 'E',
      locCapacity: 10,
      locType: 0,
      quantity: 5,
      cabinetName: '',
      cabinetCode: ''
    }
  ]
})

// 表单验证规则
const addFormRules = reactive({
  cabinetName: [
    { required: true, message: '请输入刀具柜名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  factoryName: [
    { required: true, message: '请输入工厂名称', trigger: 'blur' }
  ],
  factoryId: [
    { required: true, message: '请选择车间', trigger: 'change' }
  ],
  floor: [
    { required: true, message: '请选择楼层', trigger: 'change' }
  ]
})

// 生成刀具柜编码
const generateCabinetCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const today = `${year}${month}${day}`
  const existingCodes = mockData.filter(cabinet =>
    cabinet.cabinetCode && cabinet.cabinetCode.startsWith(`CAB${today}`)
  )

  const nextNumber = existingCodes.length + 1
  const sequence = String(nextNumber).padStart(3, '0')

  return `CAB${today}${sequence}`
}

// 获取列表数据
const getList = () => {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    let filteredData = [...mockData]

    // 根据刀具柜编码筛选
    if (queryParams.cabinetCode) {
      filteredData = filteredData.filter(item =>
        item.cabinetCode.toLowerCase().includes(queryParams.cabinetCode.toLowerCase())
      )
    }

    // 根据刀具柜名称筛选
    if (queryParams.cabinetName) {
      filteredData = filteredData.filter(item =>
        item.cabinetName.toLowerCase().includes(queryParams.cabinetName.toLowerCase())
      )
    }

    // 根据公司筛选
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

    // 根据工厂名称筛选
    if (queryParams.factoryName) {
      filteredData = filteredData.filter(item =>
        item.factoryName.toLowerCase().includes(queryParams.factoryName.toLowerCase())
      )
    }

    // 根据车间筛选
    if (queryParams.factoryId) {
      filteredData = filteredData.filter(item =>
        item.factoryId === queryParams.factoryId
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
  queryParams.cabinetCode = formInline.cabinetCode
  queryParams.cabinetName = formInline.cabinetName
  queryParams.company = formInline.company
  queryParams.createDept = formInline.createDept
  queryParams.createUser = formInline.createUser
  queryParams.factoryName = formInline.factoryName
  queryParams.factoryId = formInline.factoryId

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
  queryParams.cabinetCode = ''
  queryParams.cabinetName = ''
  queryParams.company = ''
  queryParams.createDept = ''
  queryParams.createUser = ''
  queryParams.factoryName = ''
  queryParams.factoryId = ''
  queryParams.createTimeStart = ''
  queryParams.createTimeEnd = ''
  pagination.current = 1
  getList()
}

// 获取设备信息
const getDeviceInfo = async (cabinetCode, icCardNo) => {
  deviceLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 根据刀具柜编码获取设备信息
    const device = mockDeviceData[cabinetCode]
    if (device) {
      deviceInfo.value = device
    } else {
      deviceInfo.value = null
    }
  } catch (error) {
    console.error('获取设备信息失败:', error)
    deviceInfo.value = null
  } finally {
    deviceLoading.value = false
  }
}

// 查看详情
const handleDetail = (row) => {
  currentCabinet.value = { ...row }
  activeDetailTab.value = 'A' // 重置到A面
  detailDialogVisible.value = true

  // 获取设备信息
  getDeviceInfo(row.cabinetCode, row.icCardNo || '')
}

// 删除单个刀具柜
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除刀具柜 "${row.cabinetName}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除刀具柜:', row)
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
    ElMessage.warning('请选择要删除的刀具柜')
    return
  }

  const cabinetNames = selectedRows.value.map(row => row.cabinetName).join('、')

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个刀具柜吗？\n刀具柜名称：${cabinetNames}`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    console.log('批量删除刀具柜:', selectedRows.value)
    ElMessage.success(`成功删除 ${selectedRows.value.length} 个刀具柜!`)
    selectedRows.value = []
    getList() // 刷新列表
  }).catch(() => {
    ElMessage.info('已取消批量删除')
  })
}

// 打开新增对话框
const openAddDialog = () => {
  isEdit.value = false
  editId.value = null
  resetAddForm()
  activeStockTab.value = 'A' // 重置到A面
  addDialogVisible.value = true
}

// 打开空闲查询对话框
const openIdleQueryDialog = () => {
  resetIdleQueryForm()
  idleQueryDialogVisible.value = true
}

// 关闭空闲查询对话框
const closeIdleQueryDialog = () => {
  idleQueryDialogVisible.value = false
  resetIdleQueryForm()
  idleQueryLoading.value = false
}

// 重置空闲查询表单
const resetIdleQueryForm = () => {
  Object.assign(idleQueryForm, {
    cabinetCode: '',
    locType: 0,
    direction: 0
  })
  nextTick(() => {
    idleQueryFormRef.value?.clearValidate()
  })
}

// 提交空闲查询
const submitIdleQuery = async () => {
  try {
    const valid = await idleQueryFormRef.value.validate()
    if (!valid) return

    idleQueryLoading.value = true

    // 准备提交数据
    const queryData = {
      cabinetCode: idleQueryForm.cabinetCode,
      locType: idleQueryForm.locType,
      direction: idleQueryForm.direction
    }

    // 模拟API调用
    setTimeout(() => {
      console.log('空闲查询参数:', queryData)

      // 模拟查询结果
      const mockResult = {
        success: true,
        message: '查询成功',
        data: {
          cabinetCode: queryData.cabinetCode,
          locType: queryData.locType === 0 ? '收刀柜' : '取刀柜',
          direction: ['从上至下', '从下至上', '中间'][queryData.direction],
          idleLocations: [
            { locCode: 'A01', locName: 'A区01号位', status: '空闲' },
            { locCode: 'A03', locName: 'A区03号位', status: '空闲' },
            { locCode: 'B02', locName: 'B区02号位', status: '空闲' }
          ],
          totalIdle: 3,
          totalCapacity: 100
        }
      }

      ElMessage.success(`查询成功！找到 ${mockResult.data.totalIdle} 个空闲库位`)
      closeIdleQueryDialog()
    }, 1000)

  } catch (error) {
    console.error('空闲查询失败:', error)
    ElMessage.error('空闲查询失败，请重试')
  } finally {
    idleQueryLoading.value = false
  }
}

// 更新货道信息中的刀具柜名称和编号
const updateStockListCabinetInfo = () => {
  addForm.stockList.forEach(stock => {
    stock.cabinetName = addForm.cabinetName
    stock.cabinetCode = addForm.cabinetCode
  })
}

// 获取面标签类型
const getFaceTagType = (face) => {
  const typeMap = {
    'A': 'primary',
    'B': 'success',
    'C': 'warning',
    'D': 'danger',
    'E': 'info'
  }
  return typeMap[face] || 'primary'
}

// Tab点击处理
const handleTabClick = (tab) => {
  console.log('切换到', tab.props.name, '面')
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
    cabinetCode: '',
    cabinetName: '',
    company: '',
    factoryName: '',
    factoryId: '',
    floor: '',
    stockList: [
      {
        locPrefix: 'A',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: '',
        cabinetCode: ''
      },
      {
        locPrefix: 'B',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: '',
        cabinetCode: ''
      },
      {
        locPrefix: 'C',
        locCapacity: 10,
        locType: 1,
        quantity: 5,
        cabinetName: '',
        cabinetCode: ''
      },
      {
        locPrefix: 'D',
        locCapacity: 10,
        locType: 1,
        quantity: 5,
        cabinetName: '',
        cabinetCode: ''
      },
      {
        locPrefix: 'E',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: '',
        cabinetCode: ''
      }
    ]
  })
  nextTick(() => {
    addFormRef.value?.clearValidate()
  })
}

// 车间选择变更处理
const handleWorkshopChange = (workshopId) => {
  const selectedWorkshop = workshopList.find(workshop => workshop.id === workshopId)
  if (selectedWorkshop) {
    // 可以在这里添加根据车间选择自动填充其他信息的逻辑
    console.log('选择的车间:', selectedWorkshop)
  }
}

// 编辑操作
const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id

  Object.assign(addForm, {
    cabinetCode: row.cabinetCode,
    cabinetName: row.cabinetName,
    company: row.company,
    factoryName: row.factoryName,
    factoryId: row.factoryId,
    floor: row.floor || '',
    stockList: row.stockList ? [...row.stockList] : [
      {
        locPrefix: 'A',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: row.cabinetName,
        cabinetCode: row.cabinetCode
      },
      {
        locPrefix: 'B',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: row.cabinetName,
        cabinetCode: row.cabinetCode
      },
      {
        locPrefix: 'C',
        locCapacity: 10,
        locType: 1,
        quantity: 5,
        cabinetName: row.cabinetName,
        cabinetCode: row.cabinetCode
      },
      {
        locPrefix: 'D',
        locCapacity: 10,
        locType: 1,
        quantity: 5,
        cabinetName: row.cabinetName,
        cabinetCode: row.cabinetCode
      },
      {
        locPrefix: 'E',
        locCapacity: 10,
        locType: 0,
        quantity: 5,
        cabinetName: row.cabinetName,
        cabinetCode: row.cabinetCode
      }
    ]
  })

  addDialogVisible.value = true
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
      createUser: '当前用户', // 实际应从用户状态获取
      updateUser: '当前用户',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      currentCount: 0, // 新建刀具柜初始数量为0
      workshopName: workshopList.find(w => w.id === addForm.factoryId)?.name || '',
      id: Date.now() // 模拟ID，实际由后端生成
    }

    if (isEdit.value) {
      submitData.cabinetCode = addForm.cabinetCode
      submitData.id = editId.value
      // 更新货道信息中的刀具柜信息
      submitData.stockList.forEach(stock => {
        stock.cabinetName = submitData.cabinetName
        stock.cabinetCode = submitData.cabinetCode
      })
      console.log('编辑刀具柜数据:', submitData)
      ElMessage.success('编辑成功!')
    } else {
      submitData.cabinetCode = generateCabinetCode()
      // 更新货道信息中的刀具柜信息
      submitData.stockList.forEach(stock => {
        stock.cabinetName = submitData.cabinetName
        stock.cabinetCode = submitData.cabinetCode
      })
      console.log('新增刀具柜数据:', submitData)
      ElMessage.success('新增成功!')
    }

    closeAddDialog()
    getList() // 刷新列表

  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEdit.value ? '编辑失败，请重试' : '新增失败，请重试')
  } finally {
    addLoading.value = false
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

// 初始化刀柜编码列表
const initCabinetCodeList = () => {
  // 模拟刀柜编码列表数据
  cabinetCodeList.value = [
    { value: 'CAB001', label: 'CAB001 - A区01号刀具柜' },
    { value: 'CAB002', label: 'CAB002 - A区02号刀具柜' },
    { value: 'CAB003', label: 'CAB003 - B区01号刀具柜' },
    { value: 'CAB004', label: 'CAB004 - B区02号刀具柜' },
    { value: 'CAB005', label: 'CAB005 - C区01号刀具柜' }
  ]
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
  initCabinetCodeList()
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

// 货道信息Tabs容器样式
.stock-tabs-container {
  width: 100%;
  margin-top: 20px;
}

.stock-tabs {
  width: 100%;

  :deep(.el-tabs__header) {
    margin-bottom: 0;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 20px;

    &::after {
      display: none;
    }
  }

  :deep(.el-tabs__nav) {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  :deep(.el-tabs__item) {
    flex: 1;
    text-align: center;
    padding: 15px 10px;
    font-weight: 500;
    border: 1px solid #e4e7ed;
    margin-right: 0;
    margin-bottom: -1px;

    &:first-child {
      border-radius: 8px 0 0 0;
    }

    &:last-child {
      border-radius: 0 8px 0 0;
    }

    &.is-active {
      background: white;
      border-bottom-color: white;
      z-index: 1;
    }

    &:not(.is-active) {
      background: #f8f9fa;

      &:hover {
        background: #e9ecef;
      }
    }
  }

  :deep(.el-tabs__content) {
    padding: 0;
    border: 1px solid #e4e7ed;
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: white;
  }

  .tab-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .tab-badge {
      :deep(.el-badge__content) {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 8px;
      }
    }
  }
}

.stock-tab-content {
  padding: 30px;
  background: white;
  min-height: 300px;
}

.stock-form {
  .form-item {
    margin-bottom: 30px;

    .form-label {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 10px;

      .el-icon {
        margin-right: 6px;
        color: #409eff;
      }
    }

    .form-input {
      width: 100%;
    }

    .form-help {
      font-size: 12px;
      color: #909399;
      margin-top: 6px;
      line-height: 1.4;
      text-align: center;
    }

    .disabled-input {
      :deep(.el-input__inner) {
        background-color: #f5f7fa;
        color: #909399;
      }
    }
  }

  .capacity-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    padding: 15px 20px;
    background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
    border-radius: 8px;
    color: white;
    min-height: 60px;

    .capacity-number {
      font-size: 28px;
      font-weight: 700;
      margin-right: 8px;
    }

    .capacity-unit {
      font-size: 16px;
      opacity: 0.9;
    }
  }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    font-size: 16px;
  }
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
}

.stock-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &.stock-item-a {
    border-color: #409eff;
  }

  &.stock-item-b {
    border-color: #67c23a;
  }

  &.stock-item-c {
    border-color: #e6a23c;
  }

  &.stock-item-d {
    border-color: #f56c6c;
  }

  &.stock-item-e {
    border-color: #909399;
  }
}

.stock-item-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;

  .face-label {
    :deep(.el-tag) {
      font-size: 16px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 20px;
    }
  }

  .type-badge {
    :deep(.el-badge__content) {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
    }
  }
}

.stock-item-content {
  padding: 20px;

  .form-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .form-label {
      width: 80px;
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .form-input {
      flex: 1;

      &.disabled-input {
        :deep(.el-input__inner) {
          background-color: #f5f7fa;
          color: #909399;
        }
      }
    }
  }
}

.stock-item-footer {
  background: #f8f9fa;
  padding: 12px 20px;
  border-top: 1px solid #e4e7ed;

  .capacity-info {
    text-align: center;

    .capacity-text {
      font-size: 14px;
      font-weight: 600;
      color: #409eff;
      background: #ecf5ff;
      padding: 6px 12px;
      border-radius: 16px;
      display: inline-block;
    }
  }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    font-size: 16px;
  }
}

:deep(.el-input-number) {
  width: 100%;

  .el-input__inner {
    text-align: center;
  }
}

:deep(.el-select) {
  width: 100%;
}

// 详情页面货道信息样式
.detail-stock-section {
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

.detail-stock-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__item) {
    padding: 12px 16px;
    font-weight: 500;
  }

  .detail-tab-label {
    display: flex;
    align-items: center;
    gap: 8px;

    .tab-type {
      font-size: 12px;
      color: #909399;
    }
  }
}

.detail-stock-content {
  padding: 20px;
  background: #fafbfc;
}

.detail-info-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &.highlight-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #0ea5e9;
  }

  &.full-width {
    margin-bottom: 0;
  }

  .info-header {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;

    .el-icon {
      margin-right: 6px;
      color: #409eff;
    }
  }

  .info-value {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;

    &.highlight-value {
      font-size: 24px;
      color: #0ea5e9;
    }
  }

  .info-desc {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }

  .info-content {
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-weight: 500;
        color: #374151;
        margin-right: 8px;
        min-width: 100px;
      }

      .info-text {
        color: #6b7280;
        flex: 1;
      }
    }
  }
}

.no-stock-info {
  margin-top: 30px;
  padding: 40px;
  text-align: center;
  background: #fafbfc;
  border-radius: 8px;
}

/* 设备信息样式 */
.device-info-section {
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

.device-info-content {
  margin-top: 20px;
  min-height: 200px;
}

.device-info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e4e7ed;
}

.no-device-info {
  text-align: center;
  padding: 40px 0;
  color: #999;
  background: #fafbfc;
  border-radius: 8px;
}
</style>
