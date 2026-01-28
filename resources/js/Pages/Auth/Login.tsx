import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import ApplicationLogo from '@/Components/ApplicationLogo'

import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Divider, Typography } from 'antd'
import axios from 'axios'

const { Title, Text } = Typography

export default function Login() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const submit = (values: object) => {
    setLoading(true)
    setErrors({})

    axios
      .post('/km/login', values)
      .then(() => {
        router.visit('/km/login')
      })
      .catch((err) => {
        setErrors(err.response?.data?.errors || {})
        setLoading(false)
      })
  }

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <ApplicationLogo />
          </div>

          <Divider />

          {/* Heading */}
          <div className="text-center mb-6">
            <Title level={3} className="!mb-1">
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to continue to your account
            </Text>
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              validateStatus={errors?.username ? 'error' : ''}
              help={errors?.username?.[0]}
            >
              <Input
                size="large"
                placeholder="Enter your username"
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              validateStatus={errors?.password ? 'error' : ''}
              help={errors?.password?.[0]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              block
              icon={<LoginOutlined />}
              className="mt-2 font-semibold"
            >
              Sign In
            </Button>
          </Form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Knowledge Management System
          </div>
        </div>
      </div>
    </>
  )
}
