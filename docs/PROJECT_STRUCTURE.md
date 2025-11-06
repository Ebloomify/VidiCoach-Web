# VidiCoach-Web 项目结构说明

## 📁 目录结构

```
VidiCoach-Web/
├── 📄 配置文件
│   ├── .env                    # 环境变量（不提交到 Git）
│   ├── env.example             # 环境变量示例
│   ├── next.config.js          # Next.js 配置
│   ├── tailwind.config.js      # Tailwind CSS 配置
│   ├── tsconfig.json           # TypeScript 配置
│   ├── postcss.config.js       # PostCSS 配置
│   ├── package.json            # 项目依赖
│   └── vercel.json             # Vercel 部署配置
│
├── 📂 docs/                    # 项目文档
│   ├── DATABASE_SETUP_GUIDE.md
│   ├── DOCKER_SETUP_GUIDE.md
│   ├── EMAIL_SETUP_GUIDE.md
│   ├── ENV_SETUP_GUIDE.md
│   ├── FORGOT_PASSWORD_GUIDE.md
│   ├── GOOGLE_OAUTH_SETUP.md
│   ├── LOGIN_MOCK_MODE_GUIDE.md
│   └── PROJECT_STRUCTURE.md    # 本文档
│
├── 📂 prisma/                  # 数据库相关
│   └── schema.prisma           # Prisma 数据库模型
│
├── 📂 public/                  # 静态资源
│   └── drone.png
│
├── 📂 scripts/                 # 脚本和工具
│   ├── docker-compose.yml      # Docker 配置
│   ├── init-db.sql             # 数据库初始化脚本
│   ├── start-docker.bat        # 启动 Docker (Windows)
│   ├── start-docker.sh         # 启动 Docker (Unix)
│   ├── setup-email.bat         # 邮件服务设置
│   ├── test-email.js           # 邮件功能测试
│   └── test-forgot-password.js # 忘记密码功能测试
│
├── 📂 src/                     # 源代码目录
│   │
│   ├── 📂 app/                 # Next.js 14 App Router
│   │   │
│   │   ├── 📂 api/             # API 路由
│   │   │   ├── 📂 auth/        # 认证相关 API
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   ├── forgot-password/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── reset-password/route.ts
│   │   │   │
│   │   │   └── 📂 v1/          # API v1 版本
│   │   │       └── 📂 video/   # 视频相关 API
│   │   │           ├── 📂 status/[videoId]/
│   │   │           │   └── route.ts        # 查询视频状态
│   │   │           └── 📂 upload/
│   │   │               ├── init/route.ts   # 初始化上传
│   │   │               ├── chunk/route.ts  # 上传分片
│   │   │               └── complete/route.ts # 完成上传
│   │   │
│   │   ├── 📂 dashboard/       # 仪表盘页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 login/           # 登录页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 register/        # 注册页面
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 forgot-password/ # 忘记密码
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 profile/         # 用户资料
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📂 videos/          # 视频相关页面
│   │   │   ├── list/page.tsx   # 视频列表
│   │   │   └── upload/page.tsx # 视频上传
│   │   │
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式
│   │
│   ├── 📂 components/          # React 组件
│   │   │
│   │   ├── 📂 features/        # 功能组件
│   │   │   ├── 📂 auth/        # 认证相关组件
│   │   │   │   ├── EmailRegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── GoogleRegisterButton.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterContainer.tsx
│   │   │   │   ├── RegisterErrorBoundary.tsx
│   │   │   │   └── RegisterView.tsx
│   │   │   │
│   │   │   └── 📂 dashboard/   # 仪表盘组件
│   │   │       ├── ActivitySection.tsx
│   │   │       ├── ChartsSection.tsx
│   │   │       └── KPICards.tsx
│   │   │
│   │   ├── 📂 layout/          # 布局组件
│   │   │   ├── ConditionalLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 providers/       # Context 提供者
│   │   │   ├── AuthInitializer.tsx
│   │   │   └── SessionProvider.tsx
│   │   │
│   │   └── 📂 ui/              # UI 组件
│   │       └── GoogleLoginButton.tsx
│   │
│   ├── 📂 hooks/               # 自定义 React Hooks
│   │   ├── useAuth.ts          # 认证 Hook
│   │   ├── useAuthInit.ts      # 认证初始化
│   │   ├── useAuthSync.ts      # 认证同步
│   │   └── useVideo.ts         # 视频 Hook
│   │
│   ├── 📂 lib/                 # 工具库和核心逻辑
│   │   ├── auth.ts             # NextAuth 配置
│   │   ├── email.ts            # 邮件服务
│   │   ├── prisma.ts           # Prisma 客户端
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── verification.ts     # 验证相关
│   │   ├── video.ts            # 视频处理工具
│   │   └── videoQueue.ts       # 视频处理队列
│   │
│   ├── 📂 store/               # Zustand 状态管理
│   │   ├── authStore.ts        # 认证状态
│   │   ├── uploadStore.ts      # 上传状态
│   │   ├── videoStore.ts       # 视频状态
│   │   └── index.ts
│   │
│   ├── 📂 types/               # TypeScript 类型定义
│   │   ├── index.ts            # 通用类型
│   │   └── next-auth.d.ts      # NextAuth 类型扩展
│   │
│   └── 📂 constants/           # 常量定义
│       └── index.ts
│
└── 📂 uploads/                 # 上传文件存储（不提交到 Git）
    ├── videos/                 # 视频文件
    └── temp/                   # 临时分片文件
```

## 🎯 核心功能模块

### 1. 认证系统 (Authentication)
- **位置**: `src/app/api/auth/`, `src/components/features/auth/`
- **功能**:
  - 用户注册（邮箱/Google）
  - 登录（NextAuth.js）
  - 忘记密码/重置密码
  - 会话管理

### 2. 视频上传系统 (Video Upload)
- **位置**: `src/app/api/v1/video/`, `src/lib/video.ts`, `src/lib/videoQueue.ts`
- **功能**:
  - 分片上传（5MB/片）
  - 断点续传
  - 异步视频处理
  - 多码率转码
  - 状态查询

### 3. 仪表盘 (Dashboard)
- **位置**: `src/app/dashboard/`, `src/components/features/dashboard/`
- **功能**:
  - KPI 卡片
  - 数据图表
  - 活动记录

### 4. 用户管理 (User Management)
- **位置**: `src/app/profile/`, `src/store/authStore.ts`
- **功能**:
  - 用户资料管理
  - 账号设置

## 🔑 关键文件说明

| 文件路径 | 用途 |
|---------|------|
| `src/lib/auth.ts` | NextAuth.js 配置，定义认证策略 |
| `src/lib/prisma.ts` | Prisma 数据库客户端单例 |
| `src/lib/video.ts` | 视频文件验证、分片管理 |
| `src/lib/videoQueue.ts` | 视频处理队列管理 |
| `src/store/uploadStore.ts` | 视频上传状态管理 |
| `prisma/schema.prisma` | 数据库模型定义 |

## 📦 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, Ant Design
- **状态管理**: Zustand
- **类型检查**: TypeScript

### 后端
- **框架**: Next.js API Routes
- **认证**: NextAuth.js
- **数据库**: PostgreSQL + Prisma ORM
- **文件处理**: Multipart form-data, Chunked upload

### 开发工具
- **包管理**: npm
- **代码格式化**: Prettier
- **代码检查**: ESLint
- **容器化**: Docker (PostgreSQL)

## 🚀 启动流程

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp env.example .env
   # 编辑 .env 文件
   ```

3. **启动数据库**
   ```bash
   docker-compose -f scripts/docker-compose.yml up -d
   ```

4. **数据库迁移**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 📝 开发规范

### 文件命名
- **组件**: PascalCase (如 `LoginForm.tsx`)
- **工具函数**: camelCase (如 `video.ts`)
- **类型文件**: camelCase (如 `index.ts`)
- **常量**: UPPER_SNAKE_CASE

### 目录组织
- 按功能模块组织（feature-based）
- 共享组件放在 `components/ui/`
- 功能特定组件放在 `components/features/`

### API 路由
- RESTful 风格
- 版本化 (`/api/v1/`)
- 使用 HTTP 标准状态码

## 🔍 常见任务

### 添加新的 API 端点
1. 在 `src/app/api/v1/` 下创建路由文件
2. 导出 GET、POST 等方法
3. 添加类型定义到 `src/types/`

### 添加新页面
1. 在 `src/app/` 下创建目录和 `page.tsx`
2. 如需特殊布局，添加 `layout.tsx`
3. 相关组件放在 `src/components/features/`

### 添加新的数据模型
1. 在 `prisma/schema.prisma` 中定义模型
2. 运行 `npx prisma generate`
3. 运行 `npx prisma db push` 或创建迁移

## 📚 相关文档

- [环境变量配置](./ENV_SETUP_GUIDE.md)
- [数据库设置](./DATABASE_SETUP_GUIDE.md)
- [Docker 设置](./DOCKER_SETUP_GUIDE.md)
- [邮件配置](./EMAIL_SETUP_GUIDE.md)
- [Google OAuth 配置](./GOOGLE_OAUTH_SETUP.md)

## 🐛 调试建议

- 使用 `console.log` 或 Chrome DevTools
- 检查 `.env` 配置是否正确
- 查看浏览器 Network 面板
- 检查数据库连接状态: `npx prisma studio`

## 🤝 贡献指南

1. 遵循现有代码风格
2. 添加必要的注释
3. 更新相关文档
4. 确保没有 TypeScript 错误
5. 测试功能是否正常

---

**最后更新**: 2024-10-27
**项目版本**: 0.1.0

