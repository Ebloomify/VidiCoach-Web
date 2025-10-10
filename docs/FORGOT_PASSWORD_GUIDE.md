# 找回密码功能使用指南

## 功能概述

找回密码功能允许用户通过注册邮箱重置密码。整个流程包括三个步骤：

1. **输入邮箱** - 用户输入注册时使用的邮箱地址
2. **验证身份** - 通过邮箱接收验证码并输入新密码
3. **完成** - 密码重置成功，跳转到登录页面

## 技术实现

### 1. 验证码生成和存储

**文件**: `src/lib/verification.ts`

- 生成6位随机数字验证码
- 验证码有效期：15分钟
- 防止频繁请求：1分钟冷却时间
- 一次性使用：验证成功后自动删除

```typescript
// 生成验证码
const code = generateVerificationCode() // 例如: "123456"

// 保存验证码
saveVerificationCode(email, code, 15) // 15分钟有效期

// 验证验证码
const { valid, message } = verifyCode(email, code)
```

### 2. 邮件发送

**文件**: `src/lib/email.ts`

- 开发环境：验证码打印到控制台
- 生产环境：需要配置真实邮件服务（SendGrid, AWS SES, Nodemailer等）
- 邮件模板：包含美观的HTML格式和安全提示

```typescript
// 发送密码重置邮件
await sendPasswordResetEmail(email, verificationCode)
```

### 3. API接口

#### 发送验证码接口

**路径**: `POST /api/auth/forgot-password`

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**响应**:
```json
{
  "success": true,
  "message": "验证码已发送到您的邮箱，请查收",
  "data": {
    "code": "123456"  // 仅在开发环境返回
  }
}
```

#### 重置密码接口

**路径**: `POST /api/auth/reset-password`

**请求体**:
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newPassword123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "密码重置成功，请使用新密码登录"
}
```

### 4. UI组件

#### ForgotPasswordForm

**文件**: `src/components/features/auth/ForgotPasswordForm.tsx`

**功能**:
- 步骤指示器（Steps组件）
- 邮箱输入和验证
- 验证码输入和重发
- 新密码设置和确认
- 倒计时功能（60秒）
- 成功提示和自动跳转

**使用示例**:
```tsx
<ForgotPasswordForm
  onSuccess={() => router.push('/login')}
  onBack={() => router.push('/login')}
/>
```

### 5. 页面路由

**文件**: `src/app/forgot-password/page.tsx`

**URL**: `/forgot-password`

**特性**:
- 美观的渐变背景
- 响应式设计
- 与登录页面一致的设计风格

## 使用流程

### 用户端操作

1. **访问找回密码页面**
   - 从登录页面点击"Forgot your password?"链接
   - 或直接访问 `/forgot-password`

2. **输入邮箱**
   - 输入注册时使用的邮箱地址
   - 点击"发送验证码"按钮

3. **查收验证码**
   - 在开发环境中，验证码会显示在页面通知中
   - 在生产环境中，需要查收邮箱

4. **输入验证码和新密码**
   - 输入6位验证码
   - 设置新密码（至少6个字符）
   - 确认新密码
   - 点击"重置密码"按钮

5. **完成重置**
   - 看到成功提示
   - 自动跳转到登录页面
   - 使用新密码登录

### 开发环境测试

在开发环境中，验证码会以两种方式显示：

1. **页面通知**: 使用 Ant Design 的 `message.info()` 显示
2. **控制台日志**: 验证码会打印到浏览器控制台

```
📧 发送邮件 (开发模式):
收件人: user@example.com
主题: 重置密码验证码 - 无人机培训平台
内容: [HTML内容包含验证码]
```

### 生产环境配置

在生产环境部署前，需要配置真实的邮件服务：

1. **选择邮件服务提供商**
   - SendGrid
   - AWS SES
   - Mailgun
   - Nodemailer (使用SMTP)

2. **安装依赖**
   ```bash
   npm install nodemailer
   # 或
   npm install @sendgrid/mail
   ```

3. **配置环境变量**
   ```env
   # .env.local
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   SMTP_FROM=noreply@yourdomain.com
   ```

4. **更新 email.ts**
   ```typescript
   // src/lib/email.ts
   import nodemailer from 'nodemailer'

   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT || '587'),
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASSWORD,
     },
   })

   export async function sendEmail({ to, subject, html }: SendEmailParams) {
     if (process.env.NODE_ENV === 'development') {
       console.log('📧 发送邮件 (开发模式):', { to, subject })
       return { success: true }
     }

     try {
       await transporter.sendMail({
         from: process.env.SMTP_FROM,
         to,
         subject,
         html,
       })
       return { success: true, message: '邮件已发送' }
     } catch (error) {
       console.error('邮件发送失败:', error)
       return { success: false, message: '邮件发送失败' }
     }
   }
   ```

## 安全特性

1. **验证码加密存储**
   - 生产环境建议使用Redis存储
   - 设置合理的过期时间

2. **频率限制**
   - 1分钟冷却时间防止频繁请求
   - 可根据需要调整冷却时间

3. **一次性验证码**
   - 验证成功后自动删除
   - 防止重复使用

4. **邮箱隐私保护**
   - 不透露用户是否存在
   - 统一返回成功消息

5. **密码强度要求**
   - 至少6个字符
   - 可根据需要增加复杂度要求

## 错误处理

系统会处理以下错误情况：

1. **邮箱不存在** - 返回模糊消息，不透露用户是否存在
2. **验证码错误** - 提示"验证码错误"
3. **验证码过期** - 提示"验证码已过期"
4. **频繁请求** - 提示等待时间
5. **密码强度不足** - 提示密码要求
6. **密码不匹配** - 提示两次密码不一致
7. **网络错误** - 提示服务器错误

## 注意事项

1. **开发环境**
   - 验证码会显示在页面和控制台
   - 邮件不会真实发送

2. **生产环境**
   - 必须配置真实邮件服务
   - 移除开发环境的验证码显示
   - 使用Redis等持久化存储

3. **性能优化**
   - 定期清理过期验证码
   - 使用缓存减少数据库查询
   - 实施请求频率限制

4. **监控和日志**
   - 记录验证码发送日志
   - 监控发送成功率
   - 追踪异常情况

## 后续优化建议

1. **增强安全性**
   - 添加图形验证码（防止机器人）
   - 实施IP限制
   - 增加邮箱验证环节

2. **改进用户体验**
   - 支持短信验证码
   - 提供多种找回方式
   - 添加密码强度指示器

3. **功能扩展**
   - 支持多语言
   - 自定义邮件模板
   - 管理后台查看重置记录

4. **性能提升**
   - 使用消息队列处理邮件发送
   - 实施CDN加速
   - 优化数据库查询

## 故障排除

### 验证码未收到

1. 检查邮箱地址是否正确
2. 查看垃圾邮件文件夹
3. 检查邮件服务配置
4. 查看服务器日志

### 验证码验证失败

1. 确认验证码输入正确
2. 检查是否已过期（15分钟）
3. 验证码只能使用一次
4. 清除浏览器缓存重试

### 密码重置失败

1. 检查网络连接
2. 确认密码符合要求
3. 查看浏览器控制台错误
4. 联系技术支持

## 技术支持

如有问题，请联系开发团队或查看项目文档。

