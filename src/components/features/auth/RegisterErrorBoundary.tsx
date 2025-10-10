'use client'

import React from 'react'
import { Result, Button } from 'antd'
import { useRouter } from 'next/navigation'

interface RegisterErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class RegisterErrorBoundary extends React.Component<
  RegisterErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: RegisterErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('注册页面错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Result
            status="error"
            title="注册页面出现错误"
            subTitle="很抱歉，注册过程中发生了意外错误。请刷新页面重试。"
            extra={[
              <Button
                type="primary"
                key="retry"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.reload()
                }}
              >
                刷新页面
              </Button>,
              <Button
                key="home"
                onClick={() => {
                  const router = useRouter()
                  router.push('/')
                }}
              >
                返回首页
              </Button>
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}
