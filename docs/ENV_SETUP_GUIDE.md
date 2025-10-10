# 环境变量配置指南

## 模拟模式（不需要数据库）

如果您想在没有数据库的情况下测试应用，请创建 `.env.local` 文件：

```env
# 启用模拟认证模式（不连接数据库）
USE_MOCK_AUTH=true

# NextAuth 配置
NEXTAUTH_SECRET="development-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth（可选，如不使用Google登录可以忽略）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 模拟模式登录说明

启用模拟模式后：

### 邮箱密码登录
- 可以使用**任意邮箱**和**任意6位以上密码**进行登录
- 预设测试账户：
  - 邮箱：`test@example.com` / 密码：`password123`
  - 邮箱：`admin@example.com` / 密码：`admin123`

### Google登录
- 如果配置了Google OAuth，可以正常使用Google登录
- 模拟模式下不会将用户信息存入数据库

## 生产模式（需要数据库）

如果您已经配置好数据库，请创建 `.env.local` 文件：

```env
# 关闭模拟模式（使用真实数据库）
USE_MOCK_AUTH=false

# 数据库配置
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"

# NextAuth 配置
NEXTAUTH_SECRET="production-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 生成 NEXTAUTH_SECRET

使用以下命令生成安全的密钥：

```bash
# 使用 openssl
openssl rand -base64 32

# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 注意事项

1. **不要提交 `.env.local` 到Git仓库**
2. 模拟模式仅用于开发和测试
3. 生产环境必须关闭模拟模式并配置真实数据库
4. Google OAuth需要在Google Cloud Console配置

