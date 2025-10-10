# 账号密码登录功能 - 模拟模式使用指南

## ✅ 功能已完成

账号密码登录功能已经实现，目前使用**模拟模式**（不需要数据库）。

## 🎯 已实现的功能

### 1. 登录表单组件
- **文件**: `src/components/features/auth/LoginForm.tsx`
- **功能**:
  - 邮箱和密码输入
  - 表单验证
  - "记住我"功能
  - 错误提示
  - 加载状态

### 2. 模拟认证系统
- **文件**: `src/lib/auth.ts`
- **特性**:
  - 支持任意邮箱和密码登录（密码需6位以上）
  - 预设测试账户
  - 自动创建模拟用户
  - 无需数据库连接

### 3. 美化的登录页面
- **文件**: `src/app/login/page.tsx`
- **设计**:
  - 响应式布局
  - 左侧品牌展示区
  - 右侧登录表单区
  - Ant Design组件
  - 渐变背景

## 🚀 快速开始

### 步骤1: 环境变量已配置

`.env.local` 文件已自动创建，包含:
```env
USE_MOCK_AUTH=true
NEXTAUTH_SECRET=development-secret-key-minimum-32-characters-long-for-testing
NEXTAUTH_URL=http://localhost:3000
```

### 步骤2: 启动开发服务器

```bash
npm run dev
```

### 步骤3: 访问登录页面

打开浏览器访问: `http://localhost:3000/login`

### 步骤4: 测试登录

您可以使用以下任意方式登录：

#### 方式1: 使用预设测试账户

- 邮箱: `test@example.com`
- 密码: `password123`

或

- 邮箱: `admin@example.com`
- 密码: `admin123`

#### 方式2: 使用任意邮箱和密码

- 邮箱: **任意有效邮箱格式** (如: `yourname@example.com`)
- 密码: **任意6位以上密码** (如: `123456`)

## 💡 模拟模式说明

当 `USE_MOCK_AUTH=true` 时：

### ✅ 可以做的事

1. 使用任意邮箱和密码登录
2. 测试登录流程
3. 测试UI交互
4. 测试"记住我"功能
5. 测试错误处理

### ❌ 不能做的事

1. 真实的用户数据持久化
2. 密码加密验证
3. 用户数据查询
4. 注册新用户到数据库

### 🔄 自动行为

- 首次使用任意邮箱登录时，系统会自动创建一个临时模拟用户
- 用户信息仅在JWT token中保存，不会写入数据库
- 刷新页面后，如果token有效，会保持登录状态

## 📋 测试场景

### 场景1: 正常登录
```
1. 访问 /login
2. 输入任意邮箱: test@test.com
3. 输入密码: 123456
4. 点击"登录"
5. ✅ 成功登录，跳转到 /dashboard
```

### 场景2: 记住我功能
```
1. 登录时勾选"记住我"
2. 成功登录后，邮箱会保存到 localStorage
3. 下次访问登录页时，邮箱会自动填充
```

### 场景3: 密码强度验证
```
1. 输入邮箱: test@test.com
2. 输入密码: 12345 (少于6位)
3. 点击"登录"
4. ❌ 登录失败，提示密码格式错误
```

### 场景4: 忘记密码
```
1. 点击"忘记密码？"
2. 跳转到 /forgot-password
3. 按照找回密码流程操作
```

## 🎨 UI特性

### 响应式设计
- **桌面端**: 左右分屏布局
- **移动端**: 单列布局，显示Logo

### 视觉效果
- 渐变背景
- 阴影卡片
- Ant Design组件
- 平滑过渡动画

### 用户体验
- 实时表单验证
- 清晰的错误提示
- 加载状态反馈
- 密码可见性切换

## 🔐 NextAuth 集成

### Session管理

登录成功后，NextAuth会创建一个JWT session：

```typescript
{
  user: {
    id: 'user-123456789',
    email: 'test@example.com',
    name: 'test'
  },
  expires: '2024-11-10T00:00:00.000Z'
}
```

### 获取当前用户

在任何页面或组件中：

```typescript
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>未登录</div>
  
  return <div>欢迎, {session?.user?.name}</div>
}
```

### 退出登录

```typescript
import { signOut } from 'next-auth/react'

<button onClick={() => signOut()}>退出登录</button>
```

## 🔄 从模拟模式切换到真实数据库

当您准备好连接数据库时：

1. 配置数据库（参见 `DATABASE_SETUP_GUIDE.md`）

2. 修改 `.env.local`:
```env
USE_MOCK_AUTH=false  # 关闭模拟模式
DATABASE_URL="postgresql://..."  # 添加数据库URL
```

3. 运行数据库迁移:
```bash
npx prisma generate
npx prisma db push
```

4. 重启开发服务器

## 📁 文件结构

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                 # 登录页面
│   └── forgot-password/
│       └── page.tsx                 # 找回密码页面
├── components/
│   └── features/
│       └── auth/
│           ├── LoginForm.tsx        # 登录表单组件
│           ├── RegisterForm.tsx     # 注册表单组件
│           └── ForgotPasswordForm.tsx  # 找回密码表单
└── lib/
    └── auth.ts                      # NextAuth配置
```

## 🐛 故障排除

### 问题1: 登录后无反应

**原因**: `NEXTAUTH_SECRET` 未配置

**解决**: 检查 `.env.local` 文件是否存在并包含 `NEXTAUTH_SECRET`

### 问题2: 登录后立即退出

**原因**: JWT配置问题

**解决**: 确保 `NEXTAUTH_URL` 与实际访问地址一致

### 问题3: "记住我"功能不work

**原因**: localStorage 被禁用

**解决**: 检查浏览器设置，允许网站使用 localStorage

## 📝 开发提示

### 1. 调试模式

在浏览器控制台查看详细日志：

```javascript
// 查看session
console.log(await fetch('/api/auth/session').then(r => r.json()))
```

### 2. 自定义模拟用户

修改 `src/lib/auth.ts` 中的 `mockUsers` 数组：

```typescript
const mockUsers = [
  {
    id: 'custom-1',
    email: 'custom@example.com',
    name: '自定义用户',
    password: 'customPassword'
  }
]
```

### 3. 修改登录成功后的跳转

在 `src/components/features/auth/LoginForm.tsx` 中修改：

```typescript
router.push('/your-custom-page')  // 改为你想要的页面
```

## ⚠️ 重要提示

1. **模拟模式仅用于开发和测试**
2. **生产环境必须关闭模拟模式**
3. **不要在生产环境使用简单的NEXTAUTH_SECRET**
4. **及时清理开发提示信息**

## 📚 相关文档

- [Next Auth 文档](https://next-auth.js.org/)
- [Ant Design 文档](https://ant.design/)
- [数据库配置指南](./DATABASE_SETUP_GUIDE.md)
- [找回密码功能指南](./FORGOT_PASSWORD_GUIDE.md)
- [环境变量配置](./ENV_SETUP_GUIDE.md)

## ✨ 后续计划

- [ ] 添加OAuth提供商 (GitHub, Facebook等)
- [ ] 实现2FA双因素认证
- [ ] 添加登录历史记录
- [ ] 实现登录频率限制
- [ ] 添加验证码功能

---

**祝您开发顺利！** 🎉

如有问题，请参考相关文档或联系开发团队。

