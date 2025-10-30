<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select
          v-model="loginForm.role"
          size="large"
          placeholder="请选择登录角色"
          style="width: 100%"
        >
          <el-option
            v-for="role in roleOptions"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          >
            <div style="display: flex; align-items: center;">
              <el-icon style="margin-right: 8px; color: var(--el-color-primary);">
                <component :is="role.icon" />
              </el-icon>
              <div>
                <div style="font-weight: 600;">{{ role.label }}</div>
                <div style="font-size: 12px; color: var(--el-text-color-secondary);">{{ role.description }}</div>
              </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2025 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCodeImg } from "@/api/login"
import Cookies from "js-cookie"
import { encrypt, decrypt } from "@/utils/jsencrypt"
import useUserStore from '@/store/modules/user'
import {constantRoutes} from "../router/index.js";
import {setToken} from "@/utils/auth.js";
import { User, Setting, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const title = import.meta.env.VITE_APP_TITLE
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// 表单引用
const loginRef = ref()

const loginForm = ref({
  username: "admin",
  password: "admin123",
  role: "operator", // 默认选择操作员
  rememberMe: false,
  code: "",
  uuid: ""
})

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  role: [{ required: true, trigger: "change", message: "请选择登录角色" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
}

// 角色选项配置
const roleOptions = ref([
  {
    value: 'operator',
    label: '操作员',
    description: '负责刀具借出管理操作',
    icon: 'User'
  },
  // 新增 headman 角色，UI 与 operator 完全一致
  {
    value: 'headman',
    label: '班组长', // 可根据需求修改角色名称
    description: '负责小组刀具管理及人员协调', // 可根据需求修改角色描述
    icon: 'User' // 复用 operator 的 User 图标，保证 UI 一致
  },
  {
    value: 'admin',
    label: '管理员',
    description: '负责工具管理、品牌管理、预警设置等核心业务',
    icon: 'Setting'
  },
  {
    value: 'auditor',
    label: '审计员',
    description: '负责数据审计、统计分析、记录查看和监督检查',
    icon: 'View'
  }
])

const codeUrl = ref("")
const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(true)
// 注册开关
const register = ref(false)
const redirect = ref(undefined)

watch(route, (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
}, { immediate: true })

function handleLogin() {
  console.log('登录按钮被点击')
  console.log('登录表单数据:', loginForm.value)

  loading.value = true

  // 基本验证
  if (!loginForm.value.username || !loginForm.value.password || !loginForm.value.role) {
    ElMessage.error('请填写完整的登录信息')
    loading.value = false
    return
  }

  console.log('基本验证通过')

  // 简化登录逻辑，直接成功
  setTimeout(() => {
    try {
      const userInfo = {
        username: loginForm.value.username,
        role: loginForm.value.role,
        roleName: getRoleName(loginForm.value.role),
        permissions: getRolePermissions(loginForm.value.role),
        token: 'mock-token-' + Date.now()
      }

      console.log('用户信息:', userInfo)

      // 存储用户信息
      setToken(userInfo.token)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      console.log('用户信息已存储')

      ElMessage.success(`欢迎您，${userInfo.roleName}！`)

      // 跳转到首页
      console.log('准备跳转到首页')
      router.push("/index")
      loading.value = false
    } catch (error) {
      console.error('登录过程中出错:', error)
      ElMessage.error('登录失败，请重试')
      loading.value = false
    }
  }, 500)
}

// 验证用户角色权限
function validateUserRole(username, role) {
  // 暂时允许所有角色登录，简化验证逻辑
  return { valid: true }
}

// 获取角色名称
function getRoleName(roleValue) {
  const roleMap = {
    'operator': '操作员',
    'headman': '班组长', // 与角色选项中的label保持一致
    'admin': '管理员',
    'auditor': '审计员'
  }
  return roleMap[roleValue] || roleValue
}

// 获取角色权限
function getRolePermissions(role) {
  const permissionMap = {
    'operator': ['borrowManagement:view', 'borrowManagement:borrow'],
    'admin': [
      'borrowManagement:*',      // 工具管理（借出管理）完整权限
      'brandManagement:*',       // 品牌管理完整权限
      'alarmWarning:*',          // 预警警告完整权限
      'cutterTypeManagement:*',  // 刀具类型管理完整权限
      'cabinetChannel:*',        // 刀具柜服务完整权限
      'consumableService:*',     // 耗材服务完整权限
      'systemStatistics:*',      // 系统统计完整权限
      'systemRecord:*'           // 系统记录完整权限
    ],
    // 新增headman权限：admin权限 + auditor权限
    'headman': [
      // admin的核心业务权限
      'borrowManagement:*',
      'brandManagement:*',
      'alarmWarning:*',
      'cutterTypeManagement:*',
      'cabinetChannel:*',
      'consumableService:*',
      'systemStatistics:*',
      'systemRecord:*',
      // auditor的审计权限
      'borrowReturnInfo:view',
      'dataDictionary:view',
      'historyRecord:view'
    ],
    'auditor': [
      'borrowReturnInfo:view',   // 取还收刀信息查看权限
      'dataDictionary:view',     // 数据字典查看权限
      'systemStatistics:view',   // 系统统计查看权限
      'systemRecord:view',       // 系统记录查看权限
      'historyRecord:view'       // 历史记录查看权限
    ]
  }

  return permissionMap[role] || []
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img
      loginForm.value.uuid = res.uuid
    }
  })
}

function getCookie() {
  const username = Cookies.get("username")
  const password = Cookies.get("password")
  const role = Cookies.get("role")
  const rememberMe = Cookies.get("rememberMe")
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    role: role === undefined ? loginForm.value.role : role,
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}

getCode()
getCookie()

</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  z-index: 1;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
