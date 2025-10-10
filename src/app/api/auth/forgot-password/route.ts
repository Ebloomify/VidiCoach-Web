import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, saveVerificationCode, canSendVerificationCode } from '@/lib/verification'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: '请提供邮箱地址' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // 为了安全，不透露用户是否存在
      return NextResponse.json(
        { 
          success: true, 
          message: '如果该邮箱已注册，您将收到重置密码的验证码' 
        },
        { status: 200 }
      )
    }

    // 检查是否可以发送验证码（防止频繁请求）
    const { canSend, message } = canSendVerificationCode(email)
    if (!canSend) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 429 }
      )
    }

    // 生成验证码
    const verificationCode = generateVerificationCode()

    // 保存验证码（15分钟有效期）
    saveVerificationCode(email, verificationCode, 15)

    // 发送邮件
    const emailResult = await sendPasswordResetEmail(email, verificationCode)

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: '邮件发送失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: '验证码已发送到您的邮箱，请查收'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('找回密码API错误:', error)
    console.error('错误详情:', error.message)
    console.error('错误堆栈:', error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'development' 
          ? `服务器内部错误: ${error.message}` 
          : '服务器内部错误' 
      },
      { status: 500 }
    )
  }
}

