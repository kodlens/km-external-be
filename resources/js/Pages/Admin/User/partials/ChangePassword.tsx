import { App, Button, Checkbox, Form, Input, Modal } from 'antd'
import React, { useState } from 'react'

import { EyeTwoTone, EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons';
import { User } from '@/types';
import axios from 'axios';

export default function ChangePassword({data, onSuccess} : {data:User, onSuccess:any} ) {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const [form] = Form.useForm();
    const { notification, } = App.useApp();
        
    function onFinish(values: any): void {
        setLoading(true)
        axios.post('/admin/change-password/' + data.id, values)
        .then(res=>{
            if(res.data.status === 'changed'){
                notification.info({message:"Password changed successfully.", duration: 2, showProgress: true})
                onSuccess()
                setOpen(false)
            }
            setLoading(false)

        }).catch(err=>{
            if(err.response.status === 422)
                setErrors(err.response.data.errors)

            setLoading(false)
        })
    }

    return (
        <>
            <Button shape="circle"
                loading={loading}
                onClick={()=> setOpen(true)}
            icon={<LockOutlined/>} />

            <Modal
                open={open}
                title="CHANGE PASSWORD"
                okText="Save"
                cancelText="Cancel"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit',
                }}
                onCancel={() => setOpen(false)}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
						autoComplete='off'
                        initialValues={{
							password: '',
                            password_confirmation: ''
                        }}
                        clearOnDestroy
                        onFinish={(values) => onFinish(values)}
                    >
                        {dom}
                    </Form>
                )}>

                    <Form.Item
                        name="password"
                        label="New Password"
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password ? errors.password[0] : ''}
                        
                    >
						<Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
							placeholder="New Password"/>
					</Form.Item>

					<Form.Item
						name="password_confirmation"
						label="Re-type Password"
						validateStatus={errors.password_confirmation ? 'error' : ''}
						help={errors.password_confirmation ? errors.password_confirmation[0] : ''}
					>
						<Input.Password iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
							placeholder="Re-type Password"/>
					</Form.Item>
            </Modal>
        </>
    )
}
