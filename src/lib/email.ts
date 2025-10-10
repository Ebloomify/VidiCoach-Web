// 邮件发送工具类
import nodemailer from 'nodemailer'

interface SendEmailParams {
  to: string
  subject: string
  text?: string
  html?: string
}

// 创建邮件传输对象
function createTransporter() {
  // 如果没有配置SMTP，返回null
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP配置未设置，邮件将只在控制台显示')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP服务器地址
    port: parseInt(process.env.SMTP_PORT || '587'), // SMTP端口
    secure: process.env.SMTP_SECURE === 'true', // 是否使用SSL
    auth: {
      user: process.env.SMTP_USER, // 发件人邮箱
      pass: process.env.SMTP_PASS, // 邮箱密码或授权码
    },
  })
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  const transporter = createTransporter()

  // 如果没有配置SMTP或在开发模式，只打印到控制台
  if (!transporter) {
    console.log('📧 [模拟] 发送邮件:')
    console.log('   收件人:', to)
    console.log('   主题:', subject)
    console.log('   内容:', text || html?.substring(0, 200) + '...')
    return { success: true, message: '邮件已发送（开发模式）' }
  }

  // 真实发送邮件
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || '无人机培训平台'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('✅ 邮件发送成功:', to)
    return { success: true, message: '邮件已发送' }
  } catch (error: any) {
    console.error('❌ 邮件发送失败:', error.message)
    return { success: false, message: `邮件发送失败: ${error.message}` }
  }
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  const subject = '重置密码验证码 - 无人机培训平台'
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 重置密码</h1>
            <p>无人机培训平台</p>
          </div>
          <div class="content">
            <p>您好，</p>
            <p>我们收到了您的密码重置请求。请使用以下验证码重置您的密码：</p>
            
            <div class="code-box">
              <div class="code">${resetCode}</div>
              <p style="color: #6b7280; margin-top: 10px;">验证码有效期为 15 分钟</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ 安全提示：</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>如果这不是您的操作，请忽略此邮件</li>
                <li>请勿将验证码透露给任何人</li>
                <li>验证码仅可使用一次</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px;">如有任何问题，请联系我们的客服团队。</p>
            
            <div class="footer">
              <p>© 2024 无人机培训平台 · 保留所有权利</p>
              <p>此邮件由系统自动发送，请勿直接回复</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject,
    html
  })
}

