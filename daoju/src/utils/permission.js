import useUserStore from '@/store/modules/user'

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = useUserStore().permissions
    const permissionDatas = value
    const all_permission = "*:*:*"

    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore().roles
    const permissionRoles = value
    const super_admin = "admin"

    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}

/**
 * 三权分立权限管理
 */

// 获取当前用户信息
export function getCurrentUser() {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

// 检查用户是否有指定权限
export function hasPermission(permission) {
  const user = getCurrentUser()
  if (!user || !user.permissions) {
    return false
  }

  // 如果有通配符权限，直接返回true
  if (user.permissions.includes('*')) {
    return true
  }

  // 检查具体权限
  return user.permissions.some(p => {
    if (p.endsWith(':*')) {
      // 模块级通配符权限
      const module = p.replace(':*', '')
      return permission.startsWith(module + ':')
    }
    return p === permission
  })
}

// 检查用户角色
export function hasRole(role) {
  const user = getCurrentUser()
  return user && user.role === role
}

// 检查是否为操作员
export function isOperator() {
  return hasRole('operator')
}

// 检查是否为管理员
export function isAdmin() {
  return hasRole('admin')
}

// 检查是否为审计员
export function isAuditor() {
  return hasRole('auditor')
}

// 页面访问权限配置
export const PAGE_PERMISSIONS = {
  // 刀柜货道
  '/cabinetChannel/cutter': 'cabinetChannel:cutter:operate',
  '/cabinetChannel/handleCabinet': 'cabinetChannel:handle:operate',
  '/cabinetChannel/collectCabinet': 'cabinetChannel:collectCabinet:view',
  '/cabinetChannel/collectHandleCabinet': 'cabinetChannel:collectHandleCabinet:view',

  // 借出管理
  '/borrowManagement/daoTouBorrow': 'borrowManagement:borrow',
  '/borrowManagement/daoBingBorrow': 'borrowManagement:borrow',

  // 取还收刀信息
  '/borrowReturnInfo/collectInfo': 'borrowReturnInfo:collectInfo:view',
  '/borrowReturnInfo/returnInfo': 'borrowReturnInfo:returnInfo:view',
  '/borrowReturnInfo/takeInfo': 'borrowReturnInfo:takeInfo:view',
  '/borrowReturnInfo/unreturnedInfo': 'borrowReturnInfo:unreturnedInfo:view',
  '/borrowReturnInfo/rankingStatistics': 'borrowReturnInfo:rankingStatistics:view',
  '/borrowReturnInfo/totalInventoryStats': 'borrowReturnInfo:totalInventoryStats:view',

  // 数据字典
  '/dataDictionary/dictCollection': 'dataDictionary:view',
  '/dataDictionary/personalizedSettings': 'dataDictionary:view',

  // 刀具类型管理
  '/cutterTypeManagement/cutterType': 'cutterTypeManagement:view',

  // 品牌管理
  '/brandManagement/brandInfo': 'brandManagement:view',

  // 系统统计
  '/systemStatistics/stockRecord': 'systemStatistics:view',
  '/systemStatistics/lendRecord': 'systemStatistics:view',
  '/systemStatistics/totalInventoryStats': 'systemStatistics:view',
  '/systemStatistics/cabinetChannelStats/collectCabinet': 'systemStatistics:view',
  '/systemStatistics/cabinetChannelStats/takeCabinet': 'systemStatistics:view',
  '/systemStatistics/cabinetChannelStats/handleCabinet': 'systemStatistics:view',
  '/systemStatistics/cabinetChannelStats/collectHandleCabinet': 'systemStatistics:view',

  // 系统记录
  '/systemRecord/restockRecord': 'systemRecord:view',
  '/systemRecord/returnInfo': 'systemRecord:view',
  '/systemRecord/collectInfo': 'systemRecord:view',
  '/systemRecord/unreturnedInfo': 'systemRecord:view',

  // 预警警告
  '/alarmWarning': 'alarmWarning:view'
}

// 检查页面访问权限
export function canAccessPage(path) {
  const user = getCurrentUser()
  if (!user) {
    return false
  }

  // 管理员可以访问所有页面
  if (user.role === 'admin') {
    return true
  }

  const requiredPermission = PAGE_PERMISSIONS[path]
  if (!requiredPermission) {
    // 如果页面没有配置权限要求，默认允许访问
    return true
  }

  return hasPermission(requiredPermission)
}