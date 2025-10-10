'use client'

import React from 'react'
import { Card, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import ForgotPasswordForm from '@/components/features/auth/ForgotPasswordForm'

const { Title, Paragraph } = Typography

export default function ForgotPasswordPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/login')
  }

  const handleBack = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <Title level={2} className="text-gray-900 mb-2">
            找回密码
          </Title>
          <Paragraph className="text-gray-600 text-base">
            通过注册邮箱重置您的密码
          </Paragraph>
        </div>

        {/* 表单卡片 */}
        <Card
          className="shadow-lg border-0 rounded-xl"
          bodyStyle={{ padding: '32px' }}
        >
          <ForgotPasswordForm
            onSuccess={handleSuccess}
            onBack={handleBack}
          />
        </Card>

        {/* 底部信息 */}
        <div className="mt-6 text-center">
          <Paragraph className="text-gray-500 text-sm">
            遇到问题？{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              联系客服
            </a>
          </Paragraph>
        </div>
      </div>
    </div>
  )
}

