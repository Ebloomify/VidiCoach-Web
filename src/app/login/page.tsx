'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, Typography } from 'antd'
import LoginForm from '@/components/features/auth/LoginForm'
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton'

const { Title, Paragraph } = Typography

export default function LoginPage() {
  const router = useRouter()

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  const handleLoginSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧视觉区 - 背景图 */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/drone.png"
            alt="Drone in agricultural field"
            fill
            className="object-cover"
            priority
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent"></div>
        </div>
        
        {/* 左侧内容 */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">
              Vidi Coach
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              专业无人机视频管理平台
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>智能视频分析</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>实时监控</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>云存储管理</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录区 */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo - 移动端显示 */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">B</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Vidi Coach
            </h2>
          </div>

          {/* 欢迎信息 */}
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-900 mb-2">
              欢迎回来
            </Title>
            <Paragraph className="text-gray-600 text-base">
              登录您的账户继续使用
            </Paragraph>
          </div>

          {/* 登录卡片 */}
          <Card
            className="shadow-xl border-0 rounded-2xl"
            bodyStyle={{ padding: '32px' }}
          >
            {/* Google登录 */}
            <div className="mb-6">
              <GoogleLoginButton />
            </div>

            {/* 分割线 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  或使用邮箱登录
                </span>
              </div>
            </div>

            {/* 登录表单 */}
            <LoginForm
              onForgotPassword={handleForgotPassword}
              onSuccess={handleLoginSuccess}
            />
          </Card>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <Paragraph className="text-gray-600">
              还没有账户？{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                立即注册
              </a>
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  )
}
