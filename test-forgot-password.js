// 测试找回密码功能的脚本
// 使用方法: node test-forgot-password.js

const testEmail = 'test@example.com'

async function testForgotPassword() {
  try {
    console.log('🧪 测试找回密码功能...\n')
    
    // 测试1: 发送验证码
    console.log('📧 步骤1: 发送验证码')
    console.log(`测试邮箱: ${testEmail}`)
    
    const response1 = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    })
    
    const result1 = await response1.json()
    console.log('响应状态:', response1.status)
    console.log('响应内容:', JSON.stringify(result1, null, 2))
    
    if (!response1.ok) {
      console.error('❌ 发送验证码失败')
      console.error('错误信息:', result1.error)
      return
    }
    
    console.log('✅ 验证码发送成功\n')
    
    // 如果在开发环境，会返回验证码
    if (result1.data?.code) {
      console.log(`🔐 验证码: ${result1.data.code}\n`)
      
      // 测试2: 重置密码
      console.log('🔑 步骤2: 重置密码')
      const newPassword = 'newPassword123'
      
      const response2 = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          code: result1.data.code,
          newPassword: newPassword
        })
      })
      
      const result2 = await response2.json()
      console.log('响应状态:', response2.status)
      console.log('响应内容:', JSON.stringify(result2, null, 2))
      
      if (!response2.ok) {
        console.error('❌ 重置密码失败')
        console.error('错误信息:', result2.error)
        return
      }
      
      console.log('✅ 密码重置成功\n')
    }
    
    console.log('🎉 所有测试通过！')
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:')
    console.error(error.message)
    console.error('\n请确保:')
    console.error('1. 开发服务器正在运行 (npm run dev)')
    console.error('2. 数据库连接正常')
    console.error('3. Prisma Client 已生成 (npx prisma generate)')
  }
}

// 运行测试
testForgotPassword()

