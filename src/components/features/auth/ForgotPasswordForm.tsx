'use client'

import React, { useState } from 'react'
import { Input, Button, Form, Steps, message } from 'antd'
import { MailOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onBack?: () => void
}

type StepType = 0 | 1 | 2

export default function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepType>(0)
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(0)

  // 步骤1: 发送验证码
  const handleSendCode = async (values: { email: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '发送验证码失败')
      }

      message.success(result.message || '验证码已发送到您的邮箱')
      
      // 开发环境显示验证码
      if (result.data?.code) {
        message.info(`开发模式 - 验证码: ${result.data.code}`, 10)
      }

      setEmail(values.email)
      setCurrentStep(1)
      startCountdown()
    } catch (error: any) {
      message.error(error.message || '发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  // 步骤2: 验证验证码并重置密码
  const handleResetPassword = async (values: { code: string; newPassword: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: values.code,
          newPassword: values.newPassword
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '重置密码失败')
      }

      message.success(result.message || '密码重置成功')
      setCurrentStep(2)
      
      // 2秒后调用成功回调
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (error: any) {
      message.error(error.message || '重置密码失败')
    } finally {
      setLoading(false)
    }
  }

  // 倒计时功能
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 重新发送验证码
  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '发送验证码失败')
      }

      message.success('验证码已重新发送')
      
      // 开发环境显示验证码
      if (result.data?.code) {
        message.info(`开发模式 - 验证码: ${result.data.code}`, 10)
      }

      startCountdown()
    } catch (error: any) {
      message.error(error.message || '发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: '输入邮箱',
      icon: <MailOutlined />
    },
    {
      title: '验证身份',
      icon: <SafetyOutlined />
    },
    {
      title: '完成',
      icon: <LockOutlined />
    }
  ]

  return (
    <div className="forgot-password-form max-w-md w-full mx-auto">
      {/* 步骤指示器 */}
      <Steps
        current={currentStep}
        items={steps}
        className="mb-8"
      />

      {/* 步骤1: 输入邮箱 */}
      {currentStep === 0 && (
        <Form
          form={form}
          onFinish={handleSendCode}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入您的邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="请输入注册时使用的邮箱"
              className="h-12"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg"
              loading={loading}
            >
              发送验证码
            </Button>
          </Form.Item>

          {onBack && (
            <Button
              type="link"
              onClick={onBack}
              className="w-full"
            >
              返回登录
            </Button>
          )}
        </Form>
      )}

      {/* 步骤2: 输入验证码和新密码 */}
      {currentStep === 1 && (
        <Form
          form={form}
          onFinish={handleResetPassword}
          layout="vertical"
          size="large"
        >
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              验证码已发送到 <strong>{email}</strong>
            </p>
          </div>

          <Form.Item
            name="code"
            label="验证码"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码为6位数字' }
            ]}
          >
            <Input
              prefix={<SafetyOutlined className="text-gray-400" />}
              placeholder="请输入6位验证码"
              maxLength={6}
              className="h-12"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="link"
              onClick={handleResendCode}
              disabled={countdown > 0}
              className="p-0"
            >
              {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
            </Button>
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少需要6个字符' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入新密码（至少6个字符）"
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请再次输入新密码"
              className="h-12"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-lg"
              loading={loading}
            >
              重置密码
            </Button>
          </Form.Item>

          <Button
            type="link"
            onClick={() => setCurrentStep(0)}
            className="w-full"
          >
            返回上一步
          </Button>
        </Form>
      )}

      {/* 步骤3: 完成 */}
      {currentStep === 2 && (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            密码重置成功！
          </h3>
          <p className="text-gray-600 mb-6">
            您的密码已成功重置，即将跳转到登录页面...
          </p>
          {onSuccess && (
            <Button
              type="primary"
              size="large"
              onClick={onSuccess}
              className="h-12"
            >
              立即登录
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

