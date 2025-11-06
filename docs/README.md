# Vidi Coach Web - 详细技术文档

一个基于 Next.js 14+ 的现代化无人机平台，提供用户认证、视频管理、文件上传等功能。

## 功能特性

- 🎥 视频上传和管理
- 🔐 用户认证 (邮箱注册/登录、Google OAuth)
- 🔑 密码重置 (邮箱验证码)
- 📱 响应式设计
- 🎨 现代化UI (Tailwind CSS + Ant Design)
- 📊 仪表板统计
- 🔄 实时上传进度
- 🐳 Docker 支持
- 📧 邮件服务集成

## 技术栈

- **前端框架**: Next.js 14+ (App Router)
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS + Ant Design
- **状态管理**: Zustand
- **身份认证**: NextAuth.js
- **数据库**: PostgreSQL + Prisma ORM
- **邮件服务**: Nodemailer
- **容器化**: Docker + Docker Compose
- **代码质量**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vidi-coach-web
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 项目结构

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Development Guidelines

### Component Structure
- Use functional components with TypeScript
- Follow the container/view pattern for complex components
- Keep components small and focused on single responsibility

### State Management
- Use Zustand for global state
- Keep local state in components when possible
- Use custom hooks for shared logic

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use consistent spacing and color scheme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.