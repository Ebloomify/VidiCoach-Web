# 视频处理系统部署指南

本指南详细介绍如何部署 VidiCoach-Web 的视频处理系统，包括 FFmpeg 配置、S3 云存储配置和生产环境部署。

## 📋 目录

1. [系统架构](#系统架构)
2. [环境要求](#环境要求)
3. [FFmpeg 安装与配置](#ffmpeg-安装与配置)
4. [S3 云存储配置](#s3-云存储配置)
5. [环境变量配置](#环境变量配置)
6. [生产环境部署](#生产环境部署)
7. [性能优化](#性能优化)
8. [故障排查](#故障排查)

---

## 🏗️ 系统架构

### 视频处理流程

```
用户上传 → 分块上传 (5MB/chunk) → 合并文件 → 异步处理队列
                                                    ↓
                                              ┌─────┴─────┐
                                              │  FFmpeg   │
                                              └─────┬─────┘
                                                    ↓
                      ┌────────────────────────────┼────────────────────────────┐
                      ↓                            ↓                            ↓
             元数据提取                        缩略图生成                      转码处理
              (FFprobe)                        (screenshot)              ┌───────┴────────┐
                      ↓                            ↓                       ↓                ↓
                  保存元数据                    保存缩略图              多分辨率MP4       HLS流媒体
                                                                      (720p/1080p)    (v0/v1/v2)
                      ↓                            ↓                       ↓                ↓
                      └────────────────────────────┼────────────────────────┘
                                                    ↓
                                              上传到 S3
                                                ↓
                                           状态: READY
```

### 生成的文件类型

- **原始视频**: `uploads/videos/{videoId}.mp4`
- **缩略图**: `uploads/thumbnails/{videoId}_thumb.jpg`
- **多分辨率MP4**: `uploads/processed/{videoId}/RES_720P.mp4` 等
- **HLS Master**: `uploads/hls/{videoId}/master.m3u8`
- **HLS Variants**: `uploads/hls/{videoId}/v0/playlist.m3u8` 等
- **HLS Segments**: `uploads/hls/{videoId}/v0/segment_000.ts` 等

---

## 💻 环境要求

### 开发环境

- **Node.js**: 18+ 
- **PostgreSQL**: 14+
- **FFmpeg**: 4.4+
- **磁盘空间**: 至少 50GB（取决于视频数量和大小）

### 生产环境（推荐）

- **服务器**: Ubuntu 22.04 LTS 或类似
- **CPU**: 4+ 核心（用于并行转码）
- **内存**: 16GB+
- **磁盘**: SSD 500GB+
- **带宽**: 100Mbps+（用于上传到 S3）
- **可选**: S3 云存储 + CDN

---

## 🎬 FFmpeg 安装与配置

### Linux (Ubuntu/Debian)

```bash
# 添加 FFmpeg 官方仓库
sudo add-apt-repository ppa:savoury1/ffmpeg6
sudo apt update

# 安装 FFmpeg
sudo apt install ffmpeg ffprobe

# 验证安装
ffmpeg -version
ffprobe -version
```

### macOS

```bash
# 使用 Homebrew
brew install ffmpeg

# 验证安装
ffmpeg -version
ffprobe -version
```

### Windows

1. 下载 FFmpeg: https://www.gyan.dev/ffmpeg/builds/
2. 解压到 `C:\ffmpeg`
3. 添加环境变量: `C:\ffmpeg\bin`
4. 在 PowerShell 验证：
```powershell
ffmpeg -version
ffprobe -version
```

### Docker 环境

在 Dockerfile 中添加：

```dockerfile
FROM node:18-alpine

# 安装 FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
```

### 配置环境变量

在 `.env` 中设置 FFmpeg 路径（如果不在 PATH 中）：

```env
# Linux/macOS (通常不需要，如果在 PATH 中)
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

# Windows
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe
```

---

## ☁️ S3 云存储配置

### AWS S3

1. **创建 S3 Bucket**
   - 登录 AWS 控制台
   - 创建新 Bucket（如 `vidicoach-videos`）
   - 选择区域（如 `us-east-1`）
   - 启用版本控制（可选）
   - 禁用公共访问（通过 CloudFront CDN 访问）

2. **配置 IAM 用户**
   - 创建 IAM 用户
   - 附加策略：`AmazonS3FullAccess`（或最小权限）
   - 生成 Access Key 和 Secret Key

3. **配置 CloudFront CDN（推荐）**
   - 创建 CloudFront 分发
   - 源选择你的 S3 Bucket
   - 启用缓存优化
   - 设置 CORS 头

### 阿里云 OSS

```env
S3_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
S3_BUCKET_NAME=your-bucket-name
S3_REGION=cn-hangzhou
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### 腾讯云 COS

```env
S3_ENDPOINT=https://cos.ap-shanghai.myqcloud.com
S3_BUCKET_NAME=your-bucket-name
S3_REGION=ap-shanghai
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### MinIO (私有部署)

```env
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_NAME=vidicoach-videos
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
```

---

## 🔧 环境变量配置

### 完整 `.env` 配置示例

```env
# ===================================================
# 数据库配置
# ===================================================
DATABASE_URL="postgresql://user:password@localhost:5432/vidicoach"

# ===================================================
# NextAuth.js 配置
# ===================================================
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

# ===================================================
# 视频上传配置
# ===================================================
UPLOAD_DIR="./uploads/videos"
UPLOAD_TEMP_DIR="./uploads/temp"
MAX_VIDEO_SIZE=2147483648  # 2GB in bytes
VIDEO_CHUNK_SIZE=5242880    # 5MB in bytes

# ===================================================
# FFmpeg 配置
# ===================================================
FFMPEG_PATH="/usr/bin/ffmpeg"     # Linux/macOS
FFPROBE_PATH="/usr/bin/ffprobe"
# FFMPEG_PATH="C:\ffmpeg\bin\ffmpeg.exe"  # Windows
# FFPROBE_PATH="C:\ffmpeg\bin\ffprobe.exe"

# ===================================================
# 视频处理配置
# ===================================================
VIDEO_PROCESSING_CONCURRENCY=3     # 并发处理数（建议根据CPU核心数调整）
VIDEO_SESSION_EXPIRY_HOURS=24      # 上传会话过期时间

# ===================================================
# S3 云存储配置（生产环境必需）
# ===================================================
S3_BUCKET_NAME="vidicoach-videos"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key-id"
S3_SECRET_ACCESS_KEY="your-secret-access-key"
S3_ENDPOINT=""  # AWS S3 留空，MinIO/OSS 填写端点

# ===================================================
# 邮件服务配置（可选）
# ===================================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# ===================================================
# Google OAuth 配置（可选）
# ===================================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ===================================================
# API 配置
# ===================================================
API_BASE_URL="https://yourdomain.com/api"
```

### 开发环境 vs 生产环境

| 配置项 | 开发环境 | 生产环境 |
|--------|---------|---------|
| S3 配置 | 可选（使用本地文件） | 必需 |
| FFmpeg | 必需 | 必需 |
| 邮件服务 | 可选 | 推荐 |
| 域名 | localhost | 真实域名 |
| HTTPS | 否 | 是（必需）|

---

## 🚀 生产环境部署

### 1. 使用 Docker 部署（推荐）

#### Dockerfile

```dockerfile
FROM node:18-alpine

# 安装 FFmpeg
RUN apk add --no-cache ffmpeg

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建 Next.js
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - S3_BUCKET_NAME=${S3_BUCKET_NAME}
      - S3_REGION=${S3_REGION}
      - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
      - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=vidicoach
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 部署步骤

```bash
# 1. 克隆代码
git clone https://github.com/your-org/VidiCoach-Web.git
cd VidiCoach-Web

# 2. 配置环境变量
cp env.example .env
nano .env  # 编辑配置

# 3. 启动服务
docker-compose up -d

# 4. 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 5. 查看日志
docker-compose logs -f app
```

### 2. 使用 PM2 部署

```bash
# 1. 安装 PM2
npm install -g pm2

# 2. 构建项目
npm run build

# 3. 启动应用
pm2 start npm --name "vidicoach" -- start

# 4. 设置开机自启
pm2 startup
pm2 save

# 5. 监控
pm2 monit
```

### 3. 使用 Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel --prod

# 3. 配置环境变量
# 在 Vercel Dashboard 中添加所有环境变量
```

**注意**: Vercel 是无服务器环境，不建议用于视频处理（有 10 分钟超时限制）。

---

## ⚡ 性能优化

### 1. 转码性能优化

调整 `VIDEO_PROCESSING_CONCURRENCY`：

```env
# CPU 密集型：建议设置为 CPU 核心数
VIDEO_PROCESSING_CONCURRENCY=4

# 内存受限：设置为 CPU 核心数的一半
VIDEO_PROCESSING_CONCURRENCY=2
```

### 2. FFmpeg 编码优化

在 `src/lib/videoQueue.ts` 中调整编码预设：

```typescript
// 快速编码（适合开发）
preset: 'ultrafast'

// 平衡质量和速度（推荐）
preset: 'medium'

// 高质量（适合生产）
preset: 'slow'
```

### 3. S3 上传优化

- 使用 `S3 Transfer Acceleration`
- 配置 CDN（CloudFront）
- 启用 S3 压缩

### 4. 队列系统优化

生产环境建议使用 Redis + Bull：

```bash
# 安装依赖
npm install ioredis bull

# 配置 Redis
REDIS_URL="redis://localhost:6379"
```

---

## 🔍 故障排查

### 问题 1: FFmpeg 未找到

**错误**: `Error: ffmpeg was not found`

**解决方案**:
```bash
# 检查 FFmpeg 安装
which ffmpeg

# 如果未安装，参见 "FFmpeg 安装" 章节
# 如果已安装但路径不对，在 .env 中设置 FFMPEG_PATH
```

### 问题 2: S3 上传失败

**错误**: `Access Denied` 或 `Network Error`

**解决方案**:
1. 检查 IAM 权限
2. 验证 Access Key 和 Secret Key
3. 确认 Bucket 区域正确
4. 检查网络连接（防火墙）

### 问题 3: 视频处理超时

**错误**: `Processing timeout`

**解决方案**:
- 增加 `VIDEO_PROCESSING_CONCURRENCY`
- 使用更快的编码预设
- 考虑使用专业转码服务（AWS Elemental MediaConvert, Alibaba Cloud MPS）

### 问题 4: 磁盘空间不足

**错误**: `ENOSPC: no space left on device`

**解决方案**:
- 清理旧的上传文件
- 配置 S3 自动上传
- 扩展磁盘空间

### 问题 5: 内存溢出

**错误**: `JavaScript heap out of memory`

**解决方案**:
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

---

## 📊 监控建议

### 1. 监控指标

- 视频处理队列长度
- 平均处理时间
- 上传到 S3 的速度
- 磁盘使用率
- CPU 和内存使用率

### 2. 日志级别

```bash
# 开发环境：详细日志
LOG_LEVEL=debug

# 生产环境：关键日志
LOG_LEVEL=info
```

### 3. 健康检查

```bash
# 检查 FFmpeg
ffmpeg -version

# 检查数据库连接
npx prisma db pull

# 检查 S3 连接
aws s3 ls s3://your-bucket-name
```

---

## 📝 总结

### 快速检查清单

- [ ] Node.js 18+ 已安装
- [ ] PostgreSQL 数据库已配置
- [ ] FFmpeg 和 FFprobe 已安装并可用
- [ ] 环境变量已正确配置
- [ ] S3 凭证已配置（生产环境）
- [ ] 磁盘空间足够（50GB+）
- [ ] 数据库迁移已运行
- [ ] 服务已启动并监控

### 测试部署

```bash
# 1. 上传测试视频
curl -X POST http://localhost:3000/api/v1/video/upload/init

# 2. 检查处理队列
# 查看终端日志

# 3. 验证文件生成
ls -la uploads/

# 4. 检查数据库记录
# 使用 Prisma Studio
npx prisma studio
```

---

## 🆘 获取帮助

- 查看 [项目文档](README.md)
- 提交 [Issue](https://github.com/your-org/VidiCoach-Web/issues)
- 联系技术支持

---

**部署愉快！🎉**





