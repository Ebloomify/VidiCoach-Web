# Docker 数据库配置指南

## 📦 使用Docker运行PostgreSQL

本指南将帮助您使用Docker快速搭建PostgreSQL数据库环境。

## 🔧 前置要求

### 1. 安装Docker

#### Windows
- 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- 安装后重启电脑
- 确保Docker Desktop正在运行

#### macOS
```bash
# 使用Homebrew安装
brew install --cask docker

# 或下载安装包
# https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu/Debian)
```bash
# 更新包索引
sudo apt-get update

# 安装Docker
sudo apt-get install docker.io docker-compose

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 添加当前用户到docker组（避免每次使用sudo）
sudo usermod -aG docker $USER
```

### 2. 验证Docker安装

```bash
# 检查Docker版本
docker --version

# 检查Docker Compose版本
docker-compose --version
```

## 🚀 快速开始

### 步骤1: 启动数据库

在项目根目录下运行：

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f postgres
```

**预期输出**:
```
Creating network "vidi-coach-network" ... done
Creating volume "vidi-coach-web_postgres_data" ... done
Creating vidi-coach-postgres ... done
Creating vidi-coach-pgadmin  ... done
```

### 步骤2: 等待数据库就绪

```bash
# 检查数据库健康状态
docker-compose ps

# 等待 postgres 服务状态变为 "healthy"
```

### 步骤3: 更新环境变量

修改 `.env.local` 文件：

```env
# 关闭模拟模式
USE_MOCK_AUTH=false

# 数据库连接（Docker配置）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db?schema=public"

# NextAuth配置
NEXTAUTH_SECRET="development-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth（可选）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 步骤4: 初始化数据库

```bash
# 生成Prisma Client
npx prisma generate

# 推送数据库schema
npx prisma db push

# 或者使用迁移（推荐）
npx prisma migrate dev --name init
```

**预期输出**:
```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

### 步骤5: 启动应用

```bash
# 启动Next.js开发服务器
npm run dev
```

### 步骤6: 测试登录

访问 `http://localhost:3000/login` 并使用注册功能创建账户。

## 📊 数据库管理工具

### 使用pgAdmin（Web界面）

1. 访问: `http://localhost:5050`
2. 登录信息:
   - 邮箱: `admin@example.com`
   - 密码: `admin`

3. 添加服务器:
   - 右键 "Servers" → "Register" → "Server"
   - General标签:
     - Name: `DB`
   - Connection标签:
     - Host: `postgres` (在Docker网络内) 或 `localhost` (从宿主机)
     - Port: `5432`
     - Username: `postgres`
     - Password: `postgres`
     - Database: `db`

### 使用Prisma Studio

```bash
# 启动Prisma Studio
npx prisma studio

# 访问 http://localhost:5555
```

### 使用命令行

```bash
# 进入PostgreSQL容器
docker exec -it postgres psql -U postgres -d db

# 常用SQL命令
\l              # 列出所有数据库
\dt             # 列出所有表
\d User         # 查看User表结构
SELECT * FROM "User";  # 查询用户表

# 退出
\q
```

## 🔄 常用Docker命令

### 启动和停止

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose stop

# 停止并删除容器（保留数据）
docker-compose down

# 停止并删除容器和数据卷（⚠️ 会删除所有数据）
docker-compose down -v
```

### 查看状态和日志

```bash
# 查看运行状态
docker-compose ps

# 查看所有日志
docker-compose logs

# 查看特定服务日志
docker-compose logs postgres
docker-compose logs pgadmin

# 实时跟踪日志
docker-compose logs -f postgres
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart postgres
```

### 数据备份和恢复

#### 备份数据库

```bash
# 备份到文件
docker exec vidi-coach-postgres pg_dump -U postgres db > backup.sql

# 或使用docker-compose
docker-compose exec postgres pg_dump -U postgres db > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### 恢复数据库

```bash
# 从备份文件恢复
docker exec -i vidi-coach-postgres psql -U postgres -d db < backup.sql

# 或使用docker-compose
docker-compose exec -T postgres psql -U postgres -d db < backup.sql
```

## 🔧 配置说明

### docker-compose.yml 配置项

```yaml
services:
  postgres:
    image: postgres:15-alpine  # PostgreSQL版本
    container_name: vidi-coach-postgres  # 容器名称
    ports:
      - "5432:5432"  # 端口映射（宿主机:容器）
    environment:
      POSTGRES_USER: postgres  # 数据库用户名
      POSTGRES_PASSWORD: postgres  # 数据库密码
      POSTGRES_DB: vidi-coach_db  # 数据库名称
    volumes:
      - postgres_data:/var/lib/postgresql/data  # 数据持久化
```

### 修改数据库配置

如果需要修改用户名、密码或数据库名：

1. 编辑 `docker-compose.yml`
2. 更新 `.env.local` 中的 `DATABASE_URL`
3. 重新创建容器：
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## 🐛 故障排除

### 问题1: 端口5432已被占用

**错误信息**:
```
Error: bind: address already in use
```

**解决方案**:

```bash
# 查看占用5432端口的进程
# Windows
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :5432

# 停止占用端口的服务，或修改docker-compose.yml中的端口映射
ports:
  - "5433:5432"  # 使用5433端口

# 同时更新.env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/db?schema=public"
```

### 问题2: 容器无法启动

**检查日志**:
```bash
docker-compose logs postgres
```

**常见原因**:
- Docker Desktop未运行
- 权限问题
- 磁盘空间不足

**解决方案**:
```bash
# 清理未使用的Docker资源
docker system prune -a

# 重新启动Docker Desktop
```

### 问题3: 数据库连接失败

**检查连接**:
```bash
# 测试数据库连接
docker exec vidi-coach-postgres pg_isready -U postgres

# 预期输出: /var/run/postgresql:5432 - accepting connections
```

**验证环境变量**:
```bash
# 查看.env.local文件
cat .env.local

# 确保DATABASE_URL正确
```

### 问题4: Prisma迁移失败

**错误信息**:
```
Error: P1001: Can't reach database server
```

**解决方案**:
```bash
# 1. 确保数据库正在运行
docker-compose ps

# 2. 测试连接
npx prisma db pull

# 3. 重新生成Prisma Client
npx prisma generate

# 4. 推送schema
npx prisma db push
```

## 📝 最佳实践

### 1. 开发环境

```bash
# 启动数据库
docker-compose up -d postgres

# 不需要pgAdmin时可以不启动
```

### 2. 数据持久化

- 数据存储在Docker volume中
- 即使删除容器，数据也不会丢失
- 只有使用 `docker-compose down -v` 才会删除数据

### 3. 定期备份

```bash
# 创建备份脚本 backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec vidi-coach-postgres pg_dump -U postgres vidi-coach_db > backups/backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"

# 使用
chmod +x backup.sh
./backup.sh
```

### 4. 环境隔离

```bash
# 开发环境
docker-compose up -d

# 测试环境（使用不同的compose文件）
docker-compose -f docker-compose.test.yml up -d
```

## 🔐 安全建议

### 生产环境配置

1. **修改默认密码**:
   ```yaml
   environment:
     POSTGRES_PASSWORD: your-strong-password-here
   ```

2. **限制端口访问**:
   ```yaml
   ports:
     - "127.0.0.1:5432:5432"  # 只允许本地访问
   ```

3. **使用环境变量**:
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${DB_PASSWORD}
   ```

4. **启用SSL**:
   ```yaml
   command: postgres -c ssl=on -c ssl_cert_file=/etc/ssl/certs/server.crt
   ```

## 📚 相关资源

- [Docker官方文档](https://docs.docker.com/)
- [PostgreSQL Docker镜像](https://hub.docker.com/_/postgres)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Prisma文档](https://www.prisma.io/docs/)

## ✅ 完整工作流程

```bash
# 1. 启动数据库
docker-compose up -d

# 2. 等待数据库就绪
docker-compose logs -f postgres
# 看到 "database system is ready to accept connections" 后按 Ctrl+C

# 3. 初始化数据库
npx prisma generate
npx prisma db push

# 4. 启动应用
npm run dev

# 5. 测试应用
# 访问 http://localhost:3000

# 6. 停止服务（保留数据）
docker-compose stop

# 7. 完全清理（删除数据）
docker-compose down -v
```

## 🎉 完成！

现在您已经成功配置了Docker数据库环境！

- ✅ PostgreSQL数据库运行在 `localhost:5432`
- ✅ pgAdmin管理界面运行在 `localhost:5050`
- ✅ 数据持久化到Docker volume
- ✅ 可以随时启动/停止/重启

祝您开发顺利！🚀
