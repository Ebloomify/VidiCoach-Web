# 数据库配置指南

## ⚠️ 问题原因

您遇到的错误是因为 **PostgreSQL数据库服务器没有运行** 或 **数据库配置不正确**。

错误信息：
```
Can't reach database server at localhost:5432
```

## 🔧 解决方案

### 方案1: 使用本地PostgreSQL（推荐用于开发）

#### 1. 安装PostgreSQL

**Windows:**
- 下载并安装: https://www.postgresql.org/download/windows/
- 或使用Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 2. 创建数据库

```bash
# 登录PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE db;

# 创建用户（可选）
CREATE USER your_username WITH PASSWORD 'your_password';

# 授权
GRANT ALL PRIVILEGES ON DATABASE db TO your_username;

# 退出
\q
```

#### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# PostgreSQL数据库连接
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/db?schema=public"

# NextAuth配置
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (可选)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**注意**: 
- 将 `your_password` 替换为您的实际密码
- 将 `db` 替换为您的数据库名
- `NEXTAUTH_SECRET` 应该是一个至少32个字符的随机字符串

#### 4. 运行数据库迁移

```bash
# 生成Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 或者直接推送schema到数据库
npx prisma db push
```

#### 5. 重启开发服务器

```bash
npm run dev
```

### 方案2: 使用在线数据库服务（推荐用于生产）

#### Vercel Postgres

1. 访问: https://vercel.com/dashboard
2. 创建项目并添加Postgres数据库
3. 复制提供的 `DATABASE_URL`
4. 添加到 `.env.local` 文件

#### Supabase

1. 访问: https://supabase.com/
2. 创建新项目
3. 获取数据库连接字符串
4. 添加到 `.env.local` 文件

#### Railway

1. 访问: https://railway.app/
2. 创建PostgreSQL服务
3. 获取连接字符串
4. 添加到 `.env.local` 文件

#### PlanetScale (MySQL)

如果您更喜欢MySQL：

1. 访问: https://planetscale.com/
2. 创建数据库
3. 获取连接字符串
4. 修改 `prisma/schema.prisma` 中的 `provider` 为 `mysql`

### 方案3: 使用Docker（简单快速）

#### 1. 创建 `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 2. 启动数据库

```bash
docker-compose up -d
```

#### 3. 配置 `.env.local`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### 4. 运行迁移

```bash
npx prisma db push
```

## 🧪 测试数据库连接

创建测试脚本 `test-db.js`:

```javascript
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ 数据库连接成功！')
    
    const userCount = await prisma.user.count()
    console.log(`📊 当前用户数: ${userCount}`)
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

运行测试:
```bash
node test-db.js
```

## 📝 快速配置步骤（推荐）

如果您想快速开始，使用Docker是最简单的方式：

```bash
# 1. 创建docker-compose.yml文件（见上方）

# 2. 启动数据库
docker-compose up -d

# 3. 创建.env.local文件
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db?schema=public"' > .env.local
echo 'NEXTAUTH_SECRET="development-secret-key-min-32-characters"' >> .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local

# 4. 生成Prisma Client
npx prisma generate

# 5. 推送数据库schema
npx prisma db push

# 6. 启动开发服务器
npm run dev
```

## 🔍 常见问题

### Q: 如何检查PostgreSQL是否正在运行？

**Windows:**
```powershell
Get-Service -Name postgresql*
```

**macOS/Linux:**
```bash
ps aux | grep postgres
# 或
sudo systemctl status postgresql
```

### Q: 如何生成NEXTAUTH_SECRET？

```bash
# 使用openssl生成随机字符串
openssl rand -base64 32

# 或使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Q: 数据库连接仍然失败怎么办？

1. 检查PostgreSQL是否正在运行
2. 检查端口5432是否被占用
3. 检查 `.env.local` 文件中的DATABASE_URL是否正确
4. 检查数据库用户名和密码是否正确
5. 尝试重启PostgreSQL服务

### Q: 如何查看数据库中的数据？

使用Prisma Studio：
```bash
npx prisma studio
```

这会在浏览器中打开一个数据库管理界面。

## 📚 相关文档

- [Prisma文档](https://www.prisma.io/docs/)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [NextAuth文档](https://next-auth.js.org/)

## ✅ 配置完成后

配置完成后，请再次运行测试：

```bash
node test-forgot-password.js
```

如果看到验证码成功发送的消息，说明配置成功！

