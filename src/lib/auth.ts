import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // 🔓 开发模式：使用模拟认证（暂不连接数据库）
          if (process.env.USE_MOCK_AUTH === 'true') {
            console.log('🔓 使用模拟认证模式')
            
            // 模拟用户数据库
            const mockUsers = [
              {
                id: 'mock-1',
                email: 'test@example.com',
                name: '测试用户',
                password: 'password123'
              },
              {
                id: 'mock-2',
                email: 'admin@example.com',
                name: '管理员',
                password: 'admin123'
              }
            ]

            // 查找或创建用户
            let user = mockUsers.find(u => u.email === credentials.email)
            
            if (!user) {
              // 允许任意邮箱注册/登录
              user = {
                id: `user-${Date.now()}`,
                email: credentials.email,
                name: credentials.email.split('@')[0],
                password: credentials.password
              }
            }

            // 验证密码（接受任何6位以上的密码）
            if (credentials.password.length >= 6) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: null,
              }
            }

            return null
          }

          // 🔒 生产模式：使用真实数据库
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('认证错误:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // 模拟模式：跳过数据库操作
        if (process.env.USE_MOCK_AUTH === 'true') {
          console.log('🔓 Google登录 - 模拟模式')
          return true
        }

        // 生产模式：使用真实数据库
        try {
          // 检查用户是否已存在
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // 创建新用户
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                emailVerified: new Date(),
              }
            })
          }
        } catch (error) {
          console.error('Google用户创建错误:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
