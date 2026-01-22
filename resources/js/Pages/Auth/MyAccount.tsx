import { App, Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { SaveOutlined } from "@ant-design/icons";
import { PageProps } from "@/types";
import AuthorLayout from "@/Layouts/EncoderLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

export default function MyAccount({ auth }: PageProps) {

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm()
  const { message, modal, notification } = App.useApp();

  const loadAuthUser = () => {
    form.setFieldValue('username', auth.user.username)
    form.setFieldValue('lname', auth.user.lname)
    form.setFieldValue('fname', auth.user.fname)
    form.setFieldValue('mname', auth.user.mname)
    form.setFieldValue('sex', auth.user.sex)
  }

  useEffect(() => {
    loadAuthUser()
  }, [])

  const submit = (values: any) => {
    console.log('submit', values);
    axios.patch('/my-account-update', values).then(res => {
      if (res.data.status === "updated") {
        modal.success({
          title: "Updated!",
          content: <div>Your account successfully updated.</div>,
          onOk() {
            router.reload();
          },
        });
      }
    }).catch(err => {
      if (err.response.status === 422) {
        setErrors(err.response.data.errors)
      }
    })
  }


  return (

    <div className="w-[450px] bg-white p-6 mx-auto">
      <Form form={form} layout="vertical"
        onFinish={submit}
        autoComplete='off'
        initialValues={{
          username: '',
          lname: '',
          fname: '',
          mname: '',
          sex: '',
        }}>

        <Form.Item label="USERNAME"
          name="username"
          validateStatus={errors?.username ? 'error' : ''}
          help={errors?.username ? errors?.username[0] : ''}
        >
          <Input placeholder="Username" disabled size="large" />
        </Form.Item>

        <Form.Item label="LAST NAME" name="lname"
          validateStatus={errors?.lname ? 'error' : ''}
          help={errors?.lname ? errors?.lname[0] : ''}
        >
          <Input placeholder="Last Name" size="large" />
        </Form.Item>

        <Form.Item label="FIRST NAME" name="fname"
          validateStatus={errors?.fname ? 'error' : ''}
          help={errors?.fname ? errors?.fname[0] : ''}
        >
          <Input placeholder="First Name" size="large" />
        </Form.Item>

        <Form.Item label="MIDDLE NAME" name="mname"
          validateStatus={errors?.mname ? 'error' : ''}
          help={errors?.mname ? errors?.mname[0] : ''}
        >
          <Input placeholder="Middle name" size="large" />
        </Form.Item>

        <Form.Item name="sex" className="w-full"
          label="SEX"
          validateStatus={
            errors.sex ? "error" : ""
          }
          help={
            errors.sex ? errors.sex[0] : ""
          }
        >
          <Select>
            <Select.Option value="MALE">
              MALE
            </Select.Option>
            <Select.Option value="FEMALE">
              FEMALE
            </Select.Option>
          </Select>
        </Form.Item>

        <Button
          htmlType="submit"
          className='w-full'
          type="primary"
          icon={<SaveOutlined />} size='large' loading={loading}>
          Save
        </Button>

      </Form>
    </div>
  )
}
