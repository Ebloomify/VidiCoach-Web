'use client'

import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { RegisterData } from '@/types'

interface EmailRegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>
  loading?: boolean
  className?: string
}

export default function EmailRegisterForm({ 
  onSubmit, 
  loading = false, 
  className = '' 
}: EmailRegisterFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = async (values: RegisterData & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    try {
      await onSubmit({
        name: values.name,
        email: values.email,
        password: values.password
      })
    } catch (error) {
      console.error('注册失败:', error)
    }
  }

  return (
    <div className={`email-register-form ${className}`}>
      <Form
        form={form}
        name="emailRegister"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="用户名"
          rules={[
            { required: true, message: '请输入您的用户名' },
            { min: 2, message: '用户名至少需要2个字符' },
            { max: 50, message: '用户名不能超过50个字符' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="请输入您的用户名"
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱地址' },
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
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少需要6个字符' },
            { max: 128, message: '密码不能超过128个字符' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: '密码必须包含至少一个大写字母、一个小写字母和一个数字'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入密码"
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          rules={[
            { required: true, message: '请确认密码' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请再次输入密码"
            className="h-12"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 text-lg font-semibold"
            size="large"
          >
            {loading ? '注册中...' : '创建账户'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
