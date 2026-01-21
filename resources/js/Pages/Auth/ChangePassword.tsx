import {App, Button, Form, Input} from "antd";
import {useState} from "react";
import {SaveOutlined} from "@ant-design/icons";

import axios from "axios";

export default function ChangePassword() {

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm()
    const { message, modal, notification } = App.useApp();



    const submit = (values:any) =>{
        setErrors({})
        axios.post('/change-password', values).then(res=>{
            if (res.data.status === "changed") {
                modal.info({
                    title: "Success!",
                    content: <div>Password successfully changed.</div>,
                    onOk() {
                        form.setFieldValue('old_password', '')
                        form.setFieldValue('password', '')
                        form.setFieldValue('password_confirmation', '')
                    },
                });
            }
        }).catch(err=>{
            if(err.response.status === 422){
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
                old_password: '',
                password: '',
                password_confirmation: '',
                
            }}>

                <Form.Item label="PASSWORD"
                name="old_password"
                validateStatus={errors?.old_password ? 'error' : ''}
                help={errors?.old_password ? errors?.old_password[0] : ''}
                >
                    <Input.Password placeholder="Password" size="large" />
                </Form.Item>

                <Form.Item label="NEW PASSWORD" name="password"
                validateStatus={errors?.password ? 'error' : ''}
                help={errors?.password ? errors?.password[0] : ''}
                >
                    <Input.Password placeholder="New Password" size="large" />
                </Form.Item>

                <Form.Item label="RE-TYPE PASSWORD" name="password_confirmation"
                validateStatus={errors?.password_confirmation ? 'error' : ''}
                help={errors?.password_confirmation ? errors?.password_confirmation[0] : ''}
                >
                    <Input.Password placeholder="Re-type Password" size="large" />
                </Form.Item>

                <Button
                    htmlType="submit"
                    className='w-full'
                    type="primary"
                    icon={<SaveOutlined />} size='large' loading={loading}>
                    Update Password
                </Button>

            </Form>
        </div>
    )
}
