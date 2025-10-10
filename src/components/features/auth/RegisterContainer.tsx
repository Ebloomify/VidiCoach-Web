'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { message, Alert } from 'antd'
import { RegisterData } from '@/types'
import EmailRegisterForm from './EmailRegisterForm'
import GoogleRegisterButton from './GoogleRegisterButton'

export default function RegisterContainer() {
  const router = useRouter()
  const { register, loading, error, setError } = useAuthStore()
  const [localError, setLocalError] = useState<string | null>(null)

  // 清除错误状态
  useEffect(() => {
    return () => {
      setError(null)
      setLocalError(null)
    }
  }, [setError])

  const handleEmailRegister = async (data: RegisterData) => {
    try {
      setLocalError(null)
      setError(null)
      
      await register(data)
      message.success('注册成功！欢迎加入我们！')
      router.push('/dashboard')
    } catch (error: any) {
      const errorMessage = error.message || '注册失败，请重试'
      setLocalError(errorMessage)
      message.error(errorMessage)
    }
  }

  const handleGoogleRegisterSuccess = () => {
    message.success('Google注册成功！')
    router.push('/dashboard')
  }

  const handleGoogleRegisterError = (error: string) => {
    console.error('Google注册错误:', error)
    setLocalError(error)
    message.error('Google注册失败，请重试')
  }

  // 显示错误信息
  const displayError = error || localError

  return (
    <div className="register-container max-w-md w-full mx-auto space-y-6">
      {/* 错误信息显示 */}
      {displayError && (
        <Alert
          message="注册失败"
          description={displayError}
          type="error"
          showIcon
          closable
          onClose={() => {
            setLocalError(null)
            setError(null)
          }}
          className="mb-4"
        />
      )}

      {/* Google注册按钮 */}
      <GoogleRegisterButton
        onSuccess={handleGoogleRegisterSuccess}
        onError={handleGoogleRegisterError}
      />

      {/* 分割线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">或使用邮箱注册</span>
        </div>
      </div>

      {/* 邮箱注册表单 */}
      <EmailRegisterForm
        onSubmit={handleEmailRegister}
        loading={loading}
      />

      {/* 登录链接 */}
      <div className="text-center pt-4">
        <p className="text-gray-600">
          已有账户？{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
  )
}
