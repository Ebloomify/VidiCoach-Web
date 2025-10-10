'use client'

import React from 'react'
import { Card, Typography } from 'antd'
import RegisterContainer from './RegisterContainer'
import RegisterErrorBoundary from './RegisterErrorBoundary'

const { Title, Paragraph } = Typography

interface RegisterViewProps {
  className?: string
}

export default function RegisterView({ className = '' }: RegisterViewProps) {
  return (
    <RegisterErrorBoundary>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <Title level={2} className="text-gray-900 mb-2">
              创建您的账户
            </Title>
            <Paragraph className="text-gray-600 text-base">
              加入我们的无人机培训平台，开始您的学习之旅
            </Paragraph>
          </div>

          {/* 注册表单卡片 */}
          <Card
            className="shadow-lg border-0 rounded-xl"
            bodyStyle={{ padding: '32px' }}
          >
            <RegisterContainer />
          </Card>

          {/* 底部信息 */}
          <div className="mt-6 text-center">
            <Paragraph className="text-gray-500 text-sm">
              注册即表示您同意我们的{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                服务条款
              </a>{' '}
              和{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                隐私政策
              </a>
            </Paragraph>
          </div>
        </div>
      </div>
    </RegisterErrorBoundary>
  )
}
