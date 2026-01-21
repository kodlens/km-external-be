import { useEffect, FormEventHandler, useState, ChangeEvent } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

import { InfoCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

import axios from 'axios';

export default function Login() {


  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    return () => {
      //reset('password');
    };
  }, []);

  const submit = (values: object) => {
    setLoading(true)

    setErrors({})

    axios.post('/km/login', values).then(res => {
      router.visit('/km/login')
    }).catch(err => {
      setErrors(err.response.data.errors)
      form.resetFields()
      setLoading(false)

    })

  };

  return (
    <>
      <div className='min-h-screen flex justify-center items-center bg-page-1'>
        <Head title="Log in" />


        <div className='bg-white p-6 shadow-lg rounded-md w-full m-3 sm:w-[400px]'>
          <div className='mb-5'>
            <ApplicationLogo></ApplicationLogo>
          </div>

          <div className='font-bold text-xl mb-7 text-center'>SIGN IN TO YOUR ACCOUNT</div>

          <div className='mb-2'>

            <Form
              form={form}
              layout="vertical"
              onFinish={submit}
              autoComplete='off'
              initialValues={{
                username: '',
                password: '',
              }}>

              <Form.Item label="USERNAME"
                name="username"
                validateStatus={errors?.username ? 'error' : ''}
                help={errors?.username ? errors?.username[0] : ''}
              >
                <Input placeholder="Username" size="large" />
              </Form.Item>

              <Form.Item label="PASSWORD"
                name="password"
                validateStatus={errors?.password ? 'error' : ''}
                help={errors?.password ? errors?.password[0] : ''}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>

              <Button
                htmlType="submit"
                className='w-full font-bold'
                type="primary"
                icon={<LoginOutlined />} size='large' loading={loading}>
                LOGIN
              </Button>
            </Form>
          </div>

        </div>
        {/* card */}

      </div>
    </>
  );
}
