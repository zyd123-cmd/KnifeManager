# 🔧 Tool Management System

[![Vue](https://img.shields.io/badge/Vue-3.5.16-brightgreen.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9.9-blue.svg)](https://element-plus.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-yellow.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A modern tool management system based on Vue 3 + Element Plus, featuring a three-tier permission management model, providing professional tool lending, inventory management, and data statistics solutions for manufacturing industries.

## ✨ Key Features

### 🔐 Three-Tier Permission Management
- **Operator**: Focus on daily tool lending operations
- **Administrator**: Responsible for core business management and system configuration
- **Auditor**: Focus on data auditing, statistical analysis, and supervision

### 📊 Core Modules
- **Tool Management**: Cutter head lending, tool handle lending management
- **Brand Management**: Tool brand information maintenance
- **Cutter Type**: Tool classification and specification management
- **System Statistics**: In/out records, inventory statistics, cabinet channel analysis
- **System Records**: Restocking records, return information, collection information tracking
- **Alarm Warning**: Inventory alerts and exception reminders

## 🚀 Tech Stack

### Frontend Technologies
- **Framework**: Vue 3.5.16 (Composition API)
- **UI Library**: Element Plus 2.9.9
- **Build Tool**: Vite 5.0.0
- **State Management**: Pinia 3.0.2
- **Router**: Vue Router 4.5.1
- **Charts**: ECharts 5.6.0

## 🛠️ Installation & Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Clone the repository
git clone [your-repository-url]
cd daojuManager

# Navigate to project directory
cd daoju

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev

# Access: http://localhost:8082
```

### Production Build
```bash
# Build for production
npm run build:prod

# Build for staging
npm run build:stage

# Preview build
npm run preview
```

## 👥 User Roles & Permissions

### 🔧 Operator
**Responsibilities**: Daily tool lending operations
**Access Modules**:
- Tool Management (Cutter head lending, Tool handle lending)

### 👨‍💼 Administrator
**Responsibilities**: Core business management and system configuration
**Access Modules**:
- Tool Management
- Brand Management
- Alarm Warning
- Cutter Type Management
- Cabinet Service
- Consumable Service
- System Statistics
- System Records

### 📊 Auditor
**Responsibilities**: Data auditing, statistical analysis, and supervision
**Access Modules**:
- Borrow Return Info
- Data Dictionary
- System Statistics (View only)
- System Records (View only)
- History Records

## 🔑 Test Accounts

```
Administrator:
Username: admin
Password: admin123
Role: Can select any role

Operator:
Username: operator
Password: admin123
Role: Operator only

Auditor:
Username: auditor
Password: admin123
Role: Auditor only
```

## 📁 Project Structure

```
daoju/
├── src/
│   ├── api/               # API interfaces
│   ├── assets/            # Static assets
│   ├── components/        # Reusable components
│   ├── layout/            # Layout components
│   ├── router/            # Route configuration
│   ├── store/             # State management
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   └── main.js            # Entry point
├── package.json           # Project configuration
└── vite.config.js         # Vite configuration
```

## 🔧 System Architecture

### Permission Management Architecture
```
Three-Tier Model
├── Operator
│   └── Daily Operations
├── Administrator  
│   └── Business Management
└── Auditor
    └── Supervision & Audit
```

### Modular Design
- **Frontend-Backend Separation**: Vue 3 frontend + RESTful API
- **Component-Based Development**: Reusable UI component library
- **Modular Routing**: Role-based dynamic routing
- **Responsive Design**: Multi-device screen adaptation

## 🚀 Deployment

### Docker Deployment (Recommended)
```bash
# Build image
docker build -t tool-management-system .

# Run container
docker run -p 8082:80 tool-management-system
```

### Traditional Deployment
```bash
# Build project
npm run build:prod

# Deploy dist directory to web server
# e.g., Nginx, Apache, etc.
```

## 📋 Feature Highlights

### 🔄 Tool Management
- Cutter head lending management
- Tool handle lending management
- Lending record tracking
- Return process management
- Temporary storage function

### 📊 Data Statistics
- In/out record statistics
- Tool lending record analysis
- Total inventory statistics
- Cabinet channel monitoring
- Usage rate analysis

### 📝 Record Management
- Restocking records
- Return information
- Collection information
- Unreturned information tracking
- Historical record queries

### ⚠️ Alert System
- Inventory alerts
- Overdue reminders
- Exception alarms
- Custom alert rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Thanks to the following open source projects:
- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [Element Plus](https://element-plus.org/) - Vue 3 Component Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [ECharts](https://echarts.apache.org/) - Data Visualization Charts
- [Pinia](https://pinia.vuejs.org/) - Vue State Management

## 📈 Project Stats

- 🏗️ **Architecture**: Vue 3 + Element Plus + Vite
- 📦 **Modules**: 8+ core business modules
- 👥 **Roles**: 3 user role permissions
- 🔧 **Components**: 20+ reusable components
- 📱 **Pages**: 50+ functional pages

---

⭐ **If this project helps you, please give us a Star!**

🔗 **Project Link**: [GitHub Repository](https://github.com/your-username/tool-management-system)
