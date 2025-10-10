# 📧 邮件发送配置指南

本指南将帮助您配置真实的邮件发送功能，用于发送密码重置验证码等。

---

## 🎯 概述

项目已集成 **Nodemailer**，支持通过SMTP发送真实邮件。您可以使用：
- **Gmail** (Google邮箱)
- **QQ邮箱**
- **163邮箱**
- 或任何支持SMTP的邮件服务

如果不配置SMTP，邮件将仅在**服务器控制台**显示（用于开发测试）。

---

## ⚙️ 配置方式

### 方案1: 使用 Gmail（推荐）

#### 第1步：开启两步验证
1. 访问 [Google账号安全设置](https://myaccount.google.com/security)
2. 找到"两步验证"并开启

#### 第2步：生成应用专用密码
1. 访问 [应用专用密码](https://myaccount.google.com/apppasswords)
2. 选择应用：选择"邮件"
3. 选择设备：选择"Windows电脑"（或其他）
4. 点击"生成"
5. **复制生成的16位密码**（形如：`abcd efgh ijkl mnop`）

#### 第3步：配置环境变量
在 `.env.local` 文件中添加：

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="abcd efgh ijkl mnop"  # 刚才生成的应用专用密码
SMTP_FROM_NAME="无人机培训平台"
```

---

### 方案2: 使用 QQ邮箱

#### 第1步：开启SMTP服务
1. 登录 [QQ邮箱网页版](https://mail.qq.com)
2. 点击"设置" → "账户"
3. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启"POP3/SMTP服务"或"IMAP/SMTP服务"
5. 发送短信验证后，会显示**授权码**（16位密码）
6. **保存这个授权码**

#### 第2步：配置环境变量
在 `.env.local` 文件中添加：

```env
SMTP_HOST="smtp.qq.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-qq@qq.com"
SMTP_PASS="your-authorization-code"  # QQ邮箱授权码（不是QQ密码！）
SMTP_FROM_NAME="无人机培训平台"
```

**注意**：
- 授权码**不是**QQ密码
- 授权码通常是16位的字母数字组合
- 如果忘记授权码，需要重新生成

---

### 方案3: 使用 163邮箱

#### 第1步：开启SMTP服务
1. 登录 [163邮箱网页版](https://mail.163.com)
2. 点击"设置" → "POP3/SMTP/IMAP"
3. 开启"IMAP/SMTP服务"
4. 发送短信验证后，会显示**授权码**
5. **保存这个授权码**

#### 第2步：配置环境变量
在 `.env.local` 文件中添加：

```env
SMTP_HOST="smtp.163.com"
SMTP_PORT=465
SMTP_SECURE="true"
SMTP_USER="your-email@163.com"
SMTP_PASS="your-authorization-code"  # 163邮箱授权码
SMTP_FROM_NAME="无人机培训平台"
```

---

## 🧪 测试邮件发送

### 方法1: 通过忘记密码功能测试

1. 确保 `.env.local` 已配置SMTP
2. 重启开发服务器：
   ```bash
   npm run dev
   ```
3. 访问 `http://localhost:3000/forgot-password`
4. 输入您的邮箱地址
5. 点击"发送验证码"
6. 检查邮箱是否收到验证码

### 方法2: 查看服务器日志

如果配置成功，在服务器终端会看到：
```
✅ 邮件发送成功: user@example.com
```

如果配置错误，会看到：
```
❌ 邮件发送失败: Invalid login: 535 Error...
```

---

## 🐛 常见问题

### 问题1: "Invalid login" 或 "535 Error"

**原因**：用户名或密码错误

**解决方法**：
- 确认 `SMTP_USER` 是完整的邮箱地址
- 确认 `SMTP_PASS` 是**授权码**，不是邮箱密码
- 重新生成授权码

---

### 问题2: "Connection timeout"

**原因**：网络连接问题或端口被阻止

**解决方法**：
- 检查防火墙设置
- 尝试更换端口：
  - Gmail: 端口 587 或 465
  - QQ: 端口 587 或 465
  - 163: 端口 465 或 994

---

### 问题3: 收不到邮件

**可能原因**：
1. 邮件进入垃圾箱 → 检查垃圾邮件文件夹
2. 邮箱地址错误 → 确认输入正确
3. SMTP配置错误 → 查看服务器日志

---

### 问题4: Gmail "Less secure app access"

如果遇到"不够安全的应用"错误：
1. **不要**使用"允许不够安全的应用"选项
2. 改用"应用专用密码"（更安全）
3. 按照上面的Gmail配置步骤重新配置

---

## 🔐 安全建议

1. **永远不要**将 `.env.local` 提交到Git
2. 定期更换授权码
3. 使用强密码保护邮箱账号
4. 生产环境使用专业邮件服务（如SendGrid、AWS SES）

---

## 📋 配置检查清单

在测试前，确保：

- [ ] `.env.local` 文件已创建
- [ ] SMTP配置已添加到 `.env.local`
- [ ] `SMTP_PASS` 是授权码，不是密码
- [ ] `SMTP_USER` 是完整邮箱地址
- [ ] 已重启开发服务器
- [ ] 邮箱SMTP服务已开启

---

## 📚 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SMTP_HOST` | SMTP服务器地址 | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP端口 | `587` |
| `SMTP_SECURE` | 是否使用SSL | `false` (587端口) 或 `true` (465端口) |
| `SMTP_USER` | 发件人邮箱（完整地址） | `your-email@gmail.com` |
| `SMTP_PASS` | 邮箱授权码（不是密码！） | `abcd efgh ijkl mnop` |
| `SMTP_FROM_NAME` | 发件人显示名称 | `无人机培训平台` |

---

## 🎉 配置完成后

邮件功能将用于：
- ✅ 密码重置验证码
- ✅ 账号激活邮件（未来功能）
- ✅ 系统通知（未来功能）

如果遇到其他问题，请查看服务器终端的错误日志。

---

**祝您配置顺利！🚀**

