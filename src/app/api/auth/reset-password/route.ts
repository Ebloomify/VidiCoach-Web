import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyCode } from '@/lib/verification'

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json()

    // 验证必填字段
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: '请提供完整的信息' },
        { status: 400 }
      )
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // 验证验证码
    const { valid, message } = verifyCode(email, code)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新用户密码
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json(
      {
        success: true,
        message: '密码重置成功，请使用新密码登录'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('重置密码API错误:', error)
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

