# Google OAuth 设置指南

## 步骤1: 创建Google Cloud项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API

## 步骤2: 配置OAuth同意屏幕

1. 在左侧菜单中，选择 "APIs & Services" > "OAuth consent screen"
2. 选择 "External" 用户类型（除非你有Google Workspace账户）
3. 填写应用信息：
   - 应用名称：Vidi Coach Web
   - 用户支持邮箱：你的邮箱
   - 开发者联系信息：你的邮箱
4. 添加作用域：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. 添加测试用户（开发阶段）

## 步骤3: 创建OAuth 2.0客户端ID

1. 在左侧菜单中，选择 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth 2.0 Client IDs"
3. 选择应用类型：Web application
4. 配置授权重定向URI：
   - 开发环境：`http://localhost:3000/api/auth/callback/google`
   - 生产环境：`https://yourdomain.com/api/auth/callback/google`

## 步骤4: 获取凭据

1. 创建完成后，复制客户端ID和客户端密钥
2. 在项目根目录创建 `.env.local` 文件
3. 添加以下环境变量：

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## 步骤5: 测试配置

1. 启动开发服务器：`npm run dev`
2. 访问登录页面：`http://localhost:3000/login`
3. 点击 "Continue with Google" 按钮
4. 完成Google登录流程

## 注意事项

- 确保重定向URI与你的域名匹配
- 在生产环境中使用HTTPS
- 定期轮换客户端密钥
- 监控API使用情况

