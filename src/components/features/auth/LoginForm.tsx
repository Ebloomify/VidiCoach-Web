'use client'

import React, { useState } from 'react'
import { Input, Button, Form, Checkbox, message, Alert } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onForgotPassword?: () => void
  onSuccess?: () => void
}

export default function LoginForm({ onForgotPassword, onSuccess }: LoginFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true)
    setError(null)

    try {
      // 使用NextAuth的signIn方法
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError('邮箱或密码错误，请重试')
        message.error('登录失败')
      } else if (result?.ok) {
        message.success('登录成功！')
        
        // 如果勾选了"记住我"，可以在这里设置localStorage
        if (values.remember) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('savedEmail', values.email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('savedEmail')
        }

        // 调用成功回调或跳转
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error('登录错误:', error)
      setError('登录过程中发生错误，请稍后重试')
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载保存的邮箱
  React.useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe')
    const savedEmail = localStorage.getItem('savedEmail')
    
    if (rememberMe === 'true' && savedEmail) {
      form.setFieldsValue({
        email: savedEmail,
        remember: true
      })
    }
  }, [form])

  return (
    <div className="login-form">
      {/* 错误提示 */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        className="space-y-4"
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
            placeholder="请输入邮箱地址"
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入您的密码' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入密码"
            className="h-12"
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          {onForgotPassword && (
            <Button
              type="link"
              onClick={onForgotPassword}
              className="p-0 h-auto"
            >
              忘记密码？
            </Button>
          )}
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 text-lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

