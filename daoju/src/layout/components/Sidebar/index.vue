<template>
  <div :class="{ 'has-logo': showLogo }" class="sidebar-container">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="getMenuBackground"
        :text-color="getMenuTextColor"
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
        :class="sideTheme"
      >
        <sidebar-item
          v-for="(route, index) in filteredRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { getCurrentUser } from '@/utils/permission'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters)
const showLogo = computed(() => settingsStore.sidebarLogo)
const sideTheme = computed(() => settingsStore.sideTheme)
const theme = computed(() => settingsStore.theme)
const isCollapse = computed(() => !appStore.sidebar.opened)

// 根据用户角色过滤路由
const filteredRouters = computed(() => {
  const user = getCurrentUser()
  if (!user) {
    console.log('没有用户信息')
    return []
  }

  console.log('当前用户:', user)
  console.log('原始路由:', sidebarRouters.value)

  const filtered = filterRoutesByRole(sidebarRouters.value, user.role)
  console.log('过滤后的路由:', filtered)

  return filtered
})

// 根据角色过滤路由
function filterRoutesByRole(routes, role) {
  console.log('过滤路由 - 角色:', role)
  console.log('过滤路由 - 输入路由:', routes)

  const roleRouteMap = {
    'operator': ['BorrowManagement'], // 操作员只能看到借出管理模块
    'admin': [
      'BorrowManagement',      // 工具管理（借出管理）
      'BrandManagement',       // 品牌管理
      'AlarmWarning',          // 预警警告
      'CutterTypeManagement',  // 刀具类型管理
      'CabinetService',        // 刀具柜服务
      'ConsumableService',     // 耗材服务
      'SystemStatistics',      // 系统统计
      'SystemRecord'           // 系统记录
    ], // 管理员看到指定的模块
    'auditor': [
      'BorrowReturnInfo',      // 取还收刀信息
      'DataDictionary',        // 数据字典
      'SystemStatistics',      // 系统统计
      'SystemRecord',          // 系统记录
      'HistoryRecord' ,         // 历史记录（如果还有剩余功能）
      'SystemRanking'          // 系统排行
    ] // 审计员看到其他模块
  }

  const allowedModules = roleRouteMap[role]
  console.log('允许的模块:', allowedModules)

  if (allowedModules === '*') {
    return routes // 管理员返回所有路由
  }

  if (!allowedModules) {
    console.log('没有找到角色对应的模块')
    return []
  }

  const filtered = routes.filter(route => {
    console.log('检查路由:', route.name, '是否在允许列表中')
    return allowedModules.includes(route.name)
  })

  console.log('过滤结果:', filtered)
  return filtered
}

// 获取菜单背景色
const getMenuBackground = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-bg)'
  }
  return sideTheme.value === 'theme-dark' ? variables.menuBg : variables.menuLightBg
})

// 获取菜单文字颜色
const getMenuTextColor = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-text)'
  }
  return sideTheme.value === 'theme-dark' ? variables.menuText : variables.menuLightText
})

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  background-color: v-bind(getMenuBackground);
  
  .scrollbar-wrapper {
    background-color: v-bind(getMenuBackground);
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
    
    .el-menu-item, .el-sub-menu__title {
      &:hover {
        background-color: var(--menu-hover, rgba(0, 0, 0, 0.06)) !important;
      }
    }

    .el-menu-item {
      color: v-bind(getMenuTextColor);
      
      &.is-active {
        color: var(--menu-active-text, #409eff);
        background-color: var(--menu-hover, rgba(0, 0, 0, 0.06)) !important;
      }
    }

    .el-sub-menu__title {
      color: v-bind(getMenuTextColor);
    }
  }
}
</style>
