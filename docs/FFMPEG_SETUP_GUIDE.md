# FFmpeg 安装和配置指南

本指南提供在 Windows、Linux 和 macOS 上安装 FFmpeg 的详细步骤。

## 📋 目录

- [Windows 安装](#windows-安装)
- [Linux (Ubuntu/Debian) 安装](#linux-ubuntudebian-安装)
- [macOS 安装](#macos-安装)
- [Docker 配置](#docker-配置)
- [验证安装](#验证安装)
- [常见问题](#常见问题)

---

## 🪟 Windows 安装

### 方法 1: 使用预编译二进制文件（推荐）

1. **下载 FFmpeg**

   访问: https://www.gyan.dev/ffmpeg/builds/

   下载 "ffmpeg-release-essentials.zip"

2. **解压文件**

   ```powershell
   # 解压到 C:\ffmpeg
   Expand-Archive -Path ffmpeg-release-essentials.zip -DestinationPath C:\
   ```

3. **添加到系统路径**

   ```powershell
   # 方法 1: 使用图形界面
   # 1. 右键 "此电脑" → "属性"
   # 2. 点击 "高级系统设置"
   # 3. 点击 "环境变量"
   # 4. 在 "系统变量" 中找到 "Path"
   # 5. 点击 "编辑" → "新建"
   # 6. 添加: C:\ffmpeg\bin

   # 方法 2: 使用 PowerShell（需要管理员权限）
   [Environment]::SetEnvironmentVariable(
     "Path",
     [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\ffmpeg\bin",
     "Machine"
   )
   ```

4. **重启 PowerShell 或终端**

5. **验证安装**

   ```powershell
   ffmpeg -version
   ffprobe -version
   ```

### 方法 2: 使用 Chocolatey

```powershell
# 1. 安装 Chocolatey（如果未安装）
# 参见: https://chocolatey.org/install

# 2. 安装 FFmpeg
choco install ffmpeg

# 验证
ffmpeg -version
```

### 方法 3: 使用 Scoop

```powershell
# 1. 安装 Scoop（如果未安装）
Invoke-WebRequest -UseBasicParsing get.scoop.sh | Invoke-Expression

# 2. 安装 FFmpeg
scoop install ffmpeg

# 验证
ffmpeg -version
```

---

## 🐧 Linux (Ubuntu/Debian) 安装

### 方法 1: 使用官方 PPA（推荐 - 获取最新版本）

```bash
# 1. 更新系统
sudo apt update
sudo apt upgrade -y

# 2. 添加 FFmpeg PPA
sudo add-apt-repository ppa:savoury1/ffmpeg6
sudo apt update

# 3. 安装 FFmpeg
sudo apt install ffmpeg ffprobe -y

# 4. 验证安装
ffmpeg -version
ffprobe -version
```

### 方法 2: 使用系统默认源

```bash
# 安装（可能是较旧版本）
sudo apt update
sudo apt install ffmpeg -y

# 验证
ffmpeg -version
```

### 方法 3: 从源码编译（高级用户）

```bash
# 1. 安装依赖
sudo apt install -y \
  build-essential \
  yasm \
  cmake \
  libtool \
  libc6 \
  libc6-dev \
  unzip \
  wget \
  libnuma1 \
  libnuma-dev

# 2. 下载 FFmpeg
cd /tmp
wget https://ffmpeg.org/releases/ffmpeg-6.0.tar.xz
tar -xf ffmpeg-6.0.tar.xz
cd ffmpeg-6.0

# 3. 配置编译选项
./configure --enable-gpl --enable-libx264 --enable-libx265

# 4. 编译和安装
make -j$(nproc)
sudo make install

# 5. 验证
ffmpeg -version
```

---

## 🍎 macOS 安装

### 方法 1: 使用 Homebrew（推荐）

```bash
# 1. 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 FFmpeg
brew install ffmpeg

# 3. 验证安装
ffmpeg -version
ffprobe -version
```

### 方法 2: 使用 MacPorts

```bash
# 1. 安装 MacPorts
# 参见: https://www.macports.org/install.php

# 2. 安装 FFmpeg
sudo port install ffmpeg

# 验证
ffmpeg -version
```

---

## 🐳 Docker 配置

### Alpine Linux (轻量级)

```dockerfile
FROM node:18-alpine

# 安装 FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
```

### Ubuntu (完整功能)

```dockerfile
FROM node:18

# 安装 FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - FFMPEG_PATH=/usr/bin/ffmpeg
      - FFPROBE_PATH=/usr/bin/ffprobe
    volumes:
      - ./uploads:/app/uploads
    ports:
      - "3000:3000"
```

---

## ✅ 验证安装

### 1. 检查版本

```bash
ffmpeg -version
ffprobe -version
```

**期望输出**:
```
ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers
built with gcc 11.2.0
configuration: ...
```

### 2. 测试视频处理

```bash
# 创建一个测试视频
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 test.mp4

# 提取元数据
ffprobe -v quiet -print_format json -show_format -show_streams test.mp4

# 生成缩略图
ffmpeg -i test.mp4 -vf "select=eq(n\,0)" -vframes 1 thumb.jpg

# 清理测试文件
rm test.mp4 thumb.jpg
```

### 3. 检查必需的编码器

```bash
# 检查 libx264 (H.264 视频编码)
ffmpeg -codecs | grep libx264

# 检查 aac (音频编码)
ffmpeg -codecs | grep aac

# 检查 HLS 支持
ffmpeg -h muxer=hls
```

---

## 🔧 配置环境变量

### 设置 FFmpeg 路径

在项目 `.env` 文件中：

```env
# Windows
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe

# Linux/macOS (如果不在系统 PATH 中)
FFMPEG_PATH=/usr/local/bin/ffmpeg
FFPROBE_PATH=/usr/local/bin/ffprobe

# Docker
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
```

### 在 Next.js 中设置

```typescript
// next.config.js
module.exports = {
  // 确保 FFmpeg 二进制文件被包含在部署中
  experimental: {
    outputFileTracingIncludes: {
      '*': ['./node_modules/fluent-ffmpeg/**/*'],
    },
  },
}
```

---

## 🐛 常见问题

### 问题 1: FFmpeg 命令未找到

**错误**: `command not found: ffmpeg`

**解决方案**:
1. 确认 FFmpeg 已安装
2. 检查 PATH 环境变量
3. 重启终端
4. 在 `.env` 中指定完整路径

### 问题 2: 编码器不可用

**错误**: `Unknown encoder 'libx264'`

**解决方案**:
```bash
# Linux: 安装额外编码器
sudo apt install -y libx264-dev libx265-dev

# macOS: 重新安装 FFmpeg（Homebrew 默认包含）
brew reinstall ffmpeg

# 从源码编译时启用编码器
./configure --enable-gpl --enable-libx264 --enable-libx265
```

### 问题 3: 权限错误

**错误**: `Permission denied`

**解决方案**:
```bash
# 检查文件权限
ls -la /usr/bin/ffmpeg

# 如果需要，添加执行权限
sudo chmod +x /usr/bin/ffmpeg
```

### 问题 4: 版本过旧

**错误**: `Feature not supported in this version`

**解决方案**:
1. 更新到最新版本
2. 使用 PPA 或 Homebrew 获取最新构建
3. 从源码编译最新版本

### 问题 5: Node.js 找不到 FFmpeg

**错误**: `ffmpeg was not found`

**解决方案**:
```typescript
// 在代码中明确指定路径
import ffmpeg from 'fluent-ffmpeg'

// 设置 FFmpeg 路径
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH)
}

if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH)
}
```

---

## 📚 相关资源

- [FFmpeg 官方文档](https://ffmpeg.org/documentation.html)
- [FFmpeg Wiki](https://trac.ffmpeg.org/wiki)
- [fluent-ffmpeg 文档](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

---

## ✅ 检查清单

- [ ] FFmpeg 已安装
- [ ] FFprobe 已安装
- [ ] 版本检查通过
- [ ] 测试命令正常工作
- [ ] 环境变量已配置（如果需要）
- [ ] 编码器可用（libx264, aac）
- [ ] HLS 支持已启用

---

**安装完成！现在可以开始处理视频了。🎉**





