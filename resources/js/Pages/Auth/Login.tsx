import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import ApplicationLogo from '@/Components/ApplicationLogo'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography } from 'antd'
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

      <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-100 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg sm:p-9">
            <ApplicationLogo className="mb-6 justify-center" />

            <div className="mb-7 text-center">
              <Text className="uppercase tracking-[0.2em] text-slate-500">STII-KM PANEL</Text>
              <Title level={3} className="!mb-1 !mt-2">
                Welcome back
              </Title>
              <Text type="secondary">Sign in with your assigned account credentials.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={submit} autoComplete="off">
              <Form.Item
                label="Username"
                name="username"
                validateStatus={errors?.username ? 'error' : ''}
                help={errors?.username?.[0]}
              >
                <Input
                  size="large"
                  placeholder="Enter your username"
                  prefix={<UserOutlined className="text-slate-400" />}
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
                  prefix={<LockOutlined className="text-slate-400" />}
                />
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                block
                icon={<LoginOutlined />}
                className="mt-2 h-11 font-semibold"
              >
                Sign In
              </Button>
            </Form>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
              � {new Date().getFullYear()} Knowledge Management System
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
