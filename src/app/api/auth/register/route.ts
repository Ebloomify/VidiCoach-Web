import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { RegisterData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { name, email, password } = body

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 加密密码
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // 需要邮箱验证
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // 返回用户信息（不包含密码）
    return NextResponse.json({
      success: true,
      data: {
        user,
        message: '注册成功！请检查您的邮箱进行验证。'
      }
    })

  } catch (error) {
    console.error('注册API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    )
  }
}
