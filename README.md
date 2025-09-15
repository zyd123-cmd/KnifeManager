# 🔧 刀具管理系统 (Tool Management System)

[![Vue](https://img.shields.io/badge/Vue-3.5.16-brightgreen.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9.9-blue.svg)](https://element-plus.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-yellow.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

一个基于 Vue 3 + Element Plus 的现代化刀具管理系统，采用三权分立的权限管理模式，为制造业提供专业的刀具借出、库存管理和数据统计解决方案。

## ✨ 系统特色

### 🔐 三权分立权限管理
- **操作员**：专注日常刀具借出操作
- **管理员**：负责核心业务管理和系统配置
- **审计员**：专注数据审计、统计分析和监督检查

### 📊 核心功能模块
- **工具管理**：刀头借出、刀柄借出管理
- **品牌管理**：刀具品牌信息维护
- **刀具类型**：刀具分类和规格管理
- **系统统计**：出入库记录、库存统计、刀柜货道分析
- **系统记录**：补货记录、还刀信息、收刀信息追踪
- **预警警告**：库存预警和异常提醒

## 🚀 技术栈

### 前端技术
- **框架**：Vue 3.5.16 (Composition API)
- **UI 组件库**：Element Plus 2.9.9
- **构建工具**：Vite 5.0.0
- **状态管理**：Pinia 3.0.2
- **路由管理**：Vue Router 4.5.1
- **图表库**：ECharts 5.6.0

### 开发工具
- **HTTP 客户端**：Axios 1.9.0
- **样式预处理**：Sass
- **代码加密**：JSEncrypt
- **文件操作**：File-saver
- **进度条**：NProgress

## 📁 项目结构

```
daoju/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── borrowReturnInfo/    # 借还信息接口
│   │   ├── cabinetChannel/      # 刀柜货道接口
│   │   ├── consumableService/   # 耗材服务接口
│   │   └── ...
│   ├── assets/            # 资源文件
│   │   ├── icons/         # 图标
│   │   ├── images/        # 图片
│   │   └── styles/        # 样式文件
│   ├── components/        # 公共组件
│   │   ├── Pagination/    # 分页组件
│   │   ├── FileUpload/    # 文件上传
│   │   └── ...
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   │   ├── auth.js        # 认证工具
│   │   ├── permission.js  # 权限管理
│   │   └── ...
│   ├── views/             # 页面组件
│   │   ├── borrowManagement/    # 借出管理
│   │   ├── cabinetChannel/      # 刀柜货道
│   │   ├── consumableService/   # 耗材服务
│   │   ├── dataDictionary/      # 数据字典
│   │   └── ...
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── permission.js      # 全局权限控制
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
# 克隆项目
git clone [your-repository-url]
cd daojuManager

# 进入项目目录
cd daoju

# 安装依赖
npm install
```

### 开发环境
```bash
# 启动开发服务器
npm run dev

# 访问地址：http://localhost:8082
```

### 生产构建
```bash
# 构建生产版本
npm run build:prod

# 构建预发布版本
npm run build:stage

# 预览构建结果
npm run preview
```

## 👥 用户角色与权限

### 🔧 操作员 (Operator)
**职责**：日常刀具借出操作
**权限模块**：
- 工具管理（刀头借出、刀柄借出）

### 👨‍💼 管理员 (Admin)
**职责**：核心业务管理和系统配置
**权限模块**：
- 工具管理
- 品牌管理
- 预警警告
- 刀具类型管理
- 刀具柜服务
- 耗材服务
- 系统统计
- 系统记录

### 📊 审计员 (Auditor)
**职责**：数据审计、统计分析和监督检查
**权限模块**：
- 取还收刀信息
- 数据字典
- 系统统计（查看权限）
- 系统记录（查看权限）
- 历史记录

## 🔑 登录测试账号

```
管理员账号：
用户名：admin
密码：admin123
角色：可选择任意角色

操作员账号：
用户名：operator
密码：admin123
角色：仅操作员

审计员账号：
用户名：auditor
密码：admin123
角色：仅审计员
```

## 📋 功能特性

### 🔄 工具管理
- 刀头借出管理
- 刀柄借出管理
- 借出记录追踪
- 归还流程管理
- 暂存功能

### 📊 数据统计
- 出入库记录统计
- 领刀记录分析
- 总库存统计
- 刀柜货道监控
- 使用率分析

### 📝 记录管理
- 补货记录
- 还刀信息
- 收刀信息
- 未还信息追踪
- 历史记录查询

### ⚠️ 预警系统
- 库存预警
- 逾期提醒
- 异常告警
- 自定义预警规则

## 🎨 界面预览

系统采用现代化的 Material Design 设计风格，提供：
- 响应式布局，支持多种屏幕尺寸
- 深色/浅色主题切换
- 直观的数据可视化图表
- 友好的用户交互体验

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔧 系统架构

### 权限管理架构
```
三权分立模式
├── 操作员 (Operator)
│   └── 专注日常操作
├── 管理员 (Admin)
│   └── 负责业务管理
└── 审计员 (Auditor)
    └── 负责监督审计
```

### 模块化设计
- **前后端分离**：Vue 3 前端 + RESTful API
- **组件化开发**：可复用的 UI 组件库
- **模块化路由**：基于角色的动态路由
- **响应式设计**：适配多种设备屏幕

## 🚀 部署说明

### Docker 部署（推荐）
```bash
# 构建镜像
docker build -t tool-management-system .

# 运行容器
docker run -p 8082:80 tool-management-system
```

### 传统部署
```bash
# 构建项目
npm run build:prod

# 将 dist 目录部署到 Web 服务器
# 如：Nginx、Apache 等
```

## 📊 系统截图

### 登录界面
- 三权分立角色选择
- 记住登录信息
- 安全验证机制

### 管理界面
- 现代化侧边栏导航
- 实时数据统计
- 直观的操作界面

### 数据统计
- 可视化图表展示
- 多维度数据分析
- 导出功能支持

## 🔄 更新日志

### v1.0.0 (2024-12-26)
- ✨ 初始版本发布
- 🔐 实现三权分立权限管理
- 📊 完成核心业务模块
- 🎨 优化用户界面体验

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 📧 提交 Issue
- 💬 项目讨论区
- 📱 技术交流群

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

## 📈 项目统计

- 🏗️ **架构**：Vue 3 + Element Plus + Vite
- 📦 **模块**：8+ 核心业务模块
- 👥 **角色**：3 种用户角色权限
- 🔧 **组件**：20+ 可复用组件
- 📱 **页面**：50+ 功能页面

---

⭐ **如果这个项目对您有帮助，请给我们一个 Star！**

🔗 **项目链接**：[GitHub Repository](https://github.com/your-username/tool-management-system)
