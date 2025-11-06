# vidi-coach-web

一个基于 Next.js 14+ 的现代化无人机培训视频管理平台，支持用户认证、视频上传、视频处理、云存储等功能。

## 📁 项目结构

```
Vidi-Coach-Web/
├── 📁 docs/                    # 项目文档
│   ├── DATABASE_SETUP_GUIDE.md # 数据库设置指南
│   ├── DOCKER_SETUP_GUIDE.md   # Docker 设置指南
│   ├── EMAIL_SETUP_GUIDE.md    # 邮件服务设置指南
│   ├── ENV_SETUP_GUIDE.md      # 环境变量设置指南
│   ├── FORGOT_PASSWORD_GUIDE.md # 忘记密码功能指南
│   ├── GOOGLE_OAUTH_SETUP.md   # Google OAuth 设置指南
│   ├── LOGIN_MOCK_MODE_GUIDE.md # 登录模拟模式指南
│   ├── FFMPEG_SETUP_GUIDE.md   # FFmpeg 安装指南
│   ├── S3_STORAGE_QUICKSTART.md # S3 云存储配置指南
│   ├── VIDEO_PROCESSING_DEPLOYMENT_GUIDE.md # 视频处理部署指南
│   ├── PROJECT_STRUCTURE.md    # 项目结构说明
│   └── README.md               # 详细文档
├── 📁 scripts/                 # 脚本文件
│   ├── docker-compose.yml      # Docker Compose 配置
│   ├── init-db.sql            # 数据库初始化脚本
│   ├── setup-email.bat        # 邮件设置脚本 (Windows)
│   ├── start-docker.bat       # Docker 启动脚本 (Windows)
│   └── start-docker.sh        # Docker 启动脚本 (Linux/Mac)
├── 📁 src/                     # 源代码
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 api/             # API 路由
│   │   ├── 📁 dashboard/       # 仪表板页面
│   │   ├── 📁 login/           # 登录页面
│   │   ├── 📁 register/        # 注册页面
│   │   ├── 📁 forgot-password/ # 忘记密码页面
│   │   ├── 📁 videos/          # 视频相关页面
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── 📁 components/          # 组件库
│   │   ├── 📁 features/        # 功能组件
│   │   ├── 📁 layout/          # 布局组件
│   │   ├── 📁 providers/       # 上下文提供者
│   │   └── 📁 ui/              # 基础UI组件
│   ├── 📁 hooks/               # 自定义Hooks
│   ├── 📁 lib/                 # 工具库
│   ├── 📁 store/               # Zustand状态管理
│   └── 📁 types/               # TypeScript类型定义
├── 📁 prisma/                  # 数据库模式
├── 📁 public/                  # 静态资源
├── .env.local                  # 环境变量 (需要创建)
├── env.example                 # 环境变量示例
├── package.json                # 项目依赖
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 项目说明
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
```bash
# 复制环境变量示例文件
cp env.example .env.local

# 编辑环境变量
# 参考 docs/ENV_SETUP_GUIDE.md
```

### 3. 数据库设置
```bash
# 使用 Docker (推荐)
./scripts/start-docker.bat  # Windows
./scripts/start-docker.sh   # Linux/Mac

# 或者参考 docs/DATABASE_SETUP_GUIDE.md
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 功能特性

- ✅ **用户认证**: 邮箱注册/登录、Google OAuth
- ✅ **密码重置**: 邮箱验证码重置密码
- ✅ **视频上传**: 分块上传、断点续传、进度跟踪
- ✅ **视频处理**: 自动转码（MP4、HLS）、缩略图生成
- ✅ **云存储**: AWS S3 集成，支持 CDN 加速
- ✅ **视频播放**: 支持多种格式和分辨率播放
- ✅ **响应式设计**: 支持多设备适配
- ✅ **状态管理**: Zustand 全局状态管理
- ✅ **类型安全**: 完整的 TypeScript 支持
- ✅ **数据库**: PostgreSQL + Prisma ORM
- ✅ **邮件服务**: 支持 Gmail、QQ、163 等邮箱
- ✅ **Docker 支持**: 一键启动数据库

## 🛠️ 技术栈

- **前端**: Next.js 14+, React, TypeScript
- **样式**: Tailwind CSS, Ant Design
- **状态管理**: Zustand
- **认证**: NextAuth.js
- **数据库**: PostgreSQL, Prisma
- **邮件**: Nodemailer
- **视频处理**: FFmpeg (fluent-ffmpeg)
- **云存储**: AWS S3, CloudFront CDN
- **容器化**: Docker, Docker Compose

## 📖 文档

- [环境变量设置指南](docs/ENV_SETUP_GUIDE.md)
- [数据库设置指南](docs/DATABASE_SETUP_GUIDE.md)
- [Docker 设置指南](docs/DOCKER_SETUP_GUIDE.md)
- [邮件服务设置指南](docs/EMAIL_SETUP_GUIDE.md)
- [忘记密码功能指南](docs/FORGOT_PASSWORD_GUIDE.md)
- [Google OAuth 设置指南](docs/GOOGLE_OAUTH_SETUP.md)
- [FFmpeg 安装指南](docs/FFMPEG_SETUP_GUIDE.md)
- [S3 云存储配置指南](docs/S3_STORAGE_QUICKSTART.md)
- [视频处理部署指南](docs/VIDEO_PROCESSING_DEPLOYMENT_GUIDE.md)
- [项目结构说明](docs/PROJECT_STRUCTURE.md)

## 🔧 开发工具

### 脚本文件 (scripts/)
- `start-docker.bat/sh` - 快速启动 Docker 数据库
- `setup-email.bat` - 快速配置邮件服务
- `docker-compose.yml` - Docker 数据库配置
- `init-db.sql` - 数据库初始化脚本

### 环境变量 (env.example)
包含所有必要的环境变量配置示例。

## 📝 开发说明

### 文件组织原则
1. **docs/**: 所有文档文件集中管理
2. **scripts/**: 所有脚本文件集中管理
3. **src/**: 源代码按功能模块组织
4. **根目录**: 只保留核心配置文件

### 组件设计
- 遵循 Container/View 模式
- 状态组件处理业务逻辑
- 视图组件负责展示
- 完整的 TypeScript 类型定义

### 状态管理
- 使用 Zustand 进行全局状态管理
- 按功能模块分割 Store
- 支持开发工具调试

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

**注意**: 这是一个开发中的项目，部分功能可能仍在完善中。
