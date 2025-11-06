# S3 云存储快速配置指南

本指南提供 AWS S3、阿里云 OSS、腾讯云 COS 和 MinIO 的快速配置步骤。

## 📋 支持的存储服务

- ✅ AWS S3
- ✅ 阿里云 OSS
- ✅ 腾讯云 COS
- ✅ MinIO（私有部署）
- ✅ 其他 S3 兼容服务

---

## ☁️ AWS S3 配置

### 1. 创建 S3 Bucket（安全配置）

```bash
# 登录 AWS 控制台
https://console.aws.amazon.com

# 步骤：
# 1. 进入 S3 服务
# 2. 点击 "创建存储桶"
# 3. 输入存储桶名称: vidicoach-videos
# 4. 选择区域: us-east-1（或其他）
# 5. ⚠️ 重要：保持 "阻止所有公共访问" 启用（默认）
#    这确保 Bucket 保持私有，防止未授权访问和费用产生
# 6. 版本控制：可选（推荐启用，防止误删除）
# 7. 创建
```

**为什么保持私有？**
- ✅ **安全性**：防止恶意用户直接访问并下载你的视频
- ✅ **成本控制**：避免未授权访问导致的高额流量费用
- ✅ **数据保护**：保护你的视频资源不被盗用

### 2. 配置 IAM 用户

```bash
# 1. 进入 IAM 服务
# 2. 创建新用户: vidicoach-s3-user
# 3. 附加策略: AmazonS3FullAccess（或自定义最小权限）
# 4. 生成访问密钥
#    在创建访问密钥时，AWS 会询问使用场景，请根据实际情况选择：
#
#    📍 本地开发环境：
#       选择 → "Local code"
#       说明：用于本地开发环境中的应用程序代码
#
#    📍 部署在 AWS 上（EC2/ECS/Lambda）：
#       选择 → "Application running on an AWS compute service"
#       ⚠️ 注意：推荐使用 IAM Role 而不是访问密钥（更安全）
#
#    📍 部署在非 AWS 环境（自有服务器/Vercel/其他云）：
#       选择 → "Application running outside AWS"
#       说明：应用运行在 AWS 外部的数据中心或基础设施
#
# 5. 保存 Access Key ID 和 Secret Access Key
#    ⚠️ 安全提示：密钥只显示一次，请立即保存到安全位置
```

### 3. 配置 CloudFront CDN（推荐 - 安全访问）

```bash
# 1. 进入 CloudFront 服务
# 2. 创建分发
# 3. 源域名: your-bucket.s3.amazonaws.com
# 4. ⚠️ 重要：配置 Origin Access Control (OAC)
#    - 在 "源设置" 中，选择 "源访问控制设置"
#    - 选择 "创建新的源访问控制"
#    - 类型：Origin Access Control
#    - 签名行为：Sign requests (推荐) 或不签名
# 5. 更新 S3 Bucket 策略（见下方）
# 6. 缓存策略: CachingOptimized
# 7. 创建
# 8. 复制分配域名（如：d111111abcdef8.cloudfront.net）
```

**更新 S3 Bucket 策略**（允许 CloudFront 访问）：

进入 S3 Bucket → 权限 → 存储桶策略，添加：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vidicoach-videos/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

**这样配置的优势：**
- ✅ S3 Bucket 保持私有，安全
- ✅ 只能通过 CloudFront CDN 访问，无法直接访问 S3
- ✅ 享受 CDN 加速和缓存
- ✅ 可以设置访问限制和防盗链

### 4. 设置环境变量

```env
S3_BUCKET_NAME=vidicoach-videos
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_ENDPOINT=
```

### 5. 测试连接

```bash
# 安装 AWS CLI
pip install awscli

# 配置
aws configure

# 测试
aws s3 ls s3://vidicoach-videos
```

---

## 🇨🇳 阿里云 OSS 配置

### 1. 创建 OSS Bucket

```bash
# 登录阿里云控制台
https://oss.console.aliyun.com

# 步骤：
# 1. 创建 Bucket: vidicoach-videos
# 2. 选择区域: 华东1（杭州）
# 3. 读写权限: 私有
# 4. 创建
```

### 2. 创建访问密钥

```bash
# 1. 进入 RAM 访问控制
# 2. 用户管理 → 创建用户
# 3. 创建 AccessKey
# 4. 保存 AccessKey ID 和 AccessKey Secret
```

### 3. 配置 CDN（可选）

```bash
# 1. 开通阿里云 CDN
# 2. 添加加速域名
# 3. 绑定 OSS 源站
```

### 4. 设置环境变量

```env
S3_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
S3_BUCKET_NAME=vidicoach-videos
S3_REGION=cn-hangzhou
S3_ACCESS_KEY_ID=LTAI4Gxxxxxxxx
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## 🇨🇳 腾讯云 COS 配置

### 1. 创建 COS Bucket

```bash
# 登录腾讯云控制台
https://console.cloud.tencent.com

# 步骤：
# 1. 进入对象存储 COS
# 2. 创建存储桶
# 3. 名称: vidicoach-videos
# 4. 地域: 上海
# 5. 访问权限: 私有读写
```

### 2. 创建访问密钥

```bash
# 1. 进入访问管理
# 2. API密钥管理
# 3. 新建密钥
# 4. 保存 SecretId 和 SecretKey
```

### 3. 设置环境变量

```env
S3_ENDPOINT=https://cos.ap-shanghai.myqcloud.com
S3_BUCKET_NAME=vidicoach-videos
S3_REGION=ap-shanghai
S3_ACCESS_KEY_ID=AKIDxxxxxxxx
S3_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## 🏠 MinIO 私有部署

### 1. 使用 Docker 部署 MinIO

```bash
# 创建 MinIO 容器
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  -v minio-data:/data \
  minio/minio server /data --console-address ":9001"

# 访问 MinIO Console
http://localhost:9001
```

### 2. 创建 Bucket

```bash
# 1. 登录 MinIO Console
# 2. 创建 Bucket: vidicoach-videos
# 3. 设置访问策略（根据需要）
```

### 3. 创建访问密钥

```bash
# 1. Identity → Access Keys
# 2. Create Access Key
# 3. 保存 Access Key 和 Secret Key
```

### 4. 设置环境变量

```env
S3_ENDPOINT=http://localhost:9000
S3_BUCKET_NAME=vidicoach-videos
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

---

## 🔒 安全和权限配置

### ⚠️ 重要：安全最佳实践

#### 1. **始终保持 Bucket 私有**

✅ **正确做法**：
- 启用"阻止所有公共访问"（默认）
- 只允许应用程序通过 IAM 凭证访问
- 通过 CloudFront CDN 公开访问（配置 OAC）

❌ **错误做法**：
- 取消"阻止所有公共访问"让 Bucket 公开
- 直接在 S3 URL 暴露文件

**风险**：
- 🔴 恶意用户可以直接访问并下载所有视频
- 🔴 可能产生巨额流量费用（按 GB 计费）
- 🔴 视频资源被盗用，无法控制访问

#### 2. **使用 CloudFront Origin Access Control (OAC)**

**优势**：
- ✅ S3 Bucket 保持私有
- ✅ 只能通过 CloudFront 访问，无法直接访问 S3
- ✅ 可以设置 CloudFront 签名 URL（更安全）
- ✅ 支持防盗链和访问限制

#### 3. **最小权限原则**

**IAM 用户策略**（推荐最小权限）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::vidicoach-videos",
        "arn:aws:s3:::vidicoach-videos/*"
      ]
    }
  ]
}
```

❌ **不推荐**：使用 `AmazonS3FullAccess`（权限过大）

#### 4. **费用保护措施**

```bash
# AWS 控制台设置
# 1. 进入 S3 → 存储桶 → 管理 → 指标和警报
# 2. 创建费用警报（当费用超过阈值时通知）
# 3. 设置访问日志监控异常访问

# CloudWatch 警报设置
# - 监控 S3 请求数量
# - 监控数据传输量
# - 设置异常访问告警
```

### AWS S3 Bucket 策略（允许 CloudFront + 应用访问）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vidicoach-videos/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    },
    {
      "Sid": "AllowAppUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:user/vidicoach-s3-user"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vidicoach-videos/*"
    }
  ]
}
```

### CORS 配置

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "https://yourdomain.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🧪 测试上传

### 1. 检查配置

```bash
# 在项目根目录
npm run dev

# 启动后，检查控制台输出
# 应该看到: [S3] S3 client initialized
```

### 2. 上传测试视频

```bash
# 访问上传页面
http://localhost:3000/videos/upload

# 上传一个小视频文件
# 观察终端日志
```

### 3. 验证上传

```bash
# AWS S3
aws s3 ls s3://vidicoach-videos/videos/

# MinIO
mc ls minio/vidicoach-videos/videos/

# 或在控制台查看
```

---

## 📊 费用估算

### AWS S3

| 项目 | 价格 | 说明 |
|-----|------|------|
| 存储 | $0.023/GB/月 | 前 50TB |
| 请求 | $0.0004/1000 请求 | PUT/GET |
| 传输 | $0.09/GB | 出站流量 |

**示例**: 
- 100GB 存储
- 100万次请求
- 500GB 出站流量
- **月费用**: ~$75

### 阿里云 OSS

| 项目 | 价格 | 说明 |
|-----|------|------|
| 存储 | ￥0.12/GB/月 | 标准存储 |
| 请求 | ￥0.01/1000 次 | PUT/GET |
| 传输 | ￥0.50/GB | 出站流量 |

**示例**: 
- 100GB 存储
- 100万次请求
- 500GB 出站流量
- **月费用**: ~￥450

---

## 🎯 最佳实践

### 1. 使用 CDN

- ✅ 减少带宽成本
- ✅ 提高访问速度
- ✅ 改善用户体验

### 2. 生命周期管理

```bash
# 30天后自动删除临时文件
# 90天后归档到冷存储
```

### 3. 版本控制

```bash
# 保留版本历史
# 防止误删除
```

### 4. 监控和告警

```bash
# 设置费用告警
# 监控流量峰值
```

---

## ✅ 检查清单

- [ ] Bucket 已创建
- [ ] 访问密钥已生成
- [ ] 环境变量已配置
- [ ] CORS 已配置
- [ ] 测试上传成功
- [ ] CDN 已配置（可选）
- [ ] 费用告警已设置

---

## 🆘 故障排查

### 问题 1: Access Denied

**解决方案**:
- 检查 IAM 权限
- 验证 Access Key
- 检查 Bucket 策略

### 问题 2: 上传超时

**解决方案**:
- 增加超时时间
- 检查网络连接
- 使用 S3 Transfer Acceleration

### 问题 3: CORS 错误

**解决方案**:
- 配置正确的 CORS 策略
- 检查允许的源域名

### 问题 4: 费用异常高（未授权访问）

**症状**:
- 账单突然增加
- 大量数据传输
- 大量 GET 请求

**可能原因**:
- 🔴 S3 Bucket 被设置为公开访问
- 🔴 有人通过爬虫批量下载视频
- 🔴 访问凭证泄露

**立即处理**:
1. **检查 Bucket 权限**
   ```bash
   # AWS Console: S3 → Bucket → 权限
   # 确认"阻止所有公共访问"已启用
   ```

2. **检查访问日志**
   ```bash
   # 启用 S3 访问日志
   # 查看 CloudWatch Logs 分析异常访问
   ```

3. **紧急措施**:
   - 立即将 Bucket 设为私有
   - 撤销泄露的访问密钥
   - 配置 CloudFront 签名 URL

4. **预防措施**:
   - 启用 AWS 费用预算和告警
   - 配置 S3 生命周期策略（自动删除旧文件）
   - 使用 CloudFront 限制访问频率

### 问题 5: CloudFront 无法访问 S3

**症状**:
- 403 Forbidden 错误
- 显示 Access Denied

**解决方案**:
- 检查 Origin Access Control (OAC) 配置
- 验证 S3 Bucket 策略中的 CloudFront ARN 是否正确
- 确保 OAC 已关联到 CloudFront 分发

---

## 🛡️ 安全检查清单

部署前请确认：

- [ ] ✅ S3 Bucket "阻止所有公共访问" **已启用**
- [ ] ✅ 已配置 Origin Access Control (OAC)
- [ ] ✅ S3 Bucket 策略仅允许 CloudFront 和应用程序访问
- [ ] ✅ IAM 用户使用最小权限原则
- [ ] ✅ 已设置 AWS 费用预算和告警
- [ ] ✅ 访问密钥已安全存储（不在代码库中）
- [ ] ✅ CloudFront 签名 URL 已配置（可选，但推荐）
- [ ] ✅ 已启用 S3 访问日志监控

---

**配置完成！现在可以安全地上传视频到云存储。☁️🎉**

