import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import ApplicationLogo from '@/Components/ApplicationLogo'
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
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

      <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_35%)]" />
        <div className="pointer-events-none absolute left-10 top-10 h-28 w-28 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full border border-emerald-300/20" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative hidden bg-slate-900 p-10 text-white lg:block">
              <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(2,132,199,0.25),transparent_35%,rgba(16,185,129,0.18))]" />
              <div className="relative z-10">
                <Text className="uppercase tracking-[0.22em] text-sky-200/80">STII-KM PANEL</Text>
                <Title level={2} className="!mb-2 !mt-4 !text-white">
                  Knowledge Hub Access
                </Title>
                <Text className="text-slate-200">
                  Manage information updates securely and keep your team aligned with accurate,
                  timely content.
                </Text>

                <div className="mt-10 space-y-4 text-sm">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <SafetyCertificateOutlined className="text-emerald-300" />
                    <span>Role-based secure authentication</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <ThunderboltOutlined className="text-sky-300" />
                    <span>Fast access to publishing workflow</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <ApplicationLogo className="mb-6 justify-center lg:justify-start" />

              <div className="mb-7 text-center lg:text-left">
                <Text className="uppercase tracking-[0.2em] text-slate-500 lg:hidden">STII-KM PANEL</Text>
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
                    className="!h-11 !rounded-xl"
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
                    className="!h-11 !rounded-xl"
                  />
                </Form.Item>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                  className="mt-2 h-11 rounded-xl border-0 bg-slate-900 font-semibold shadow-lg shadow-slate-900/25 hover:!bg-slate-800"
                >
                  Sign In
                </Button>
              </Form>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500 lg:text-left">
                &copy; {new Date().getFullYear()} Knowledge Management System
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
