import {App, Button, Form, Input, Select} from "antd";
import {useEffect, useState} from "react";
import {SaveOutlined} from "@ant-design/icons";
import { PageProps } from "@/types";
import AuthorLayout from "@/Layouts/EncoderLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function MyAccount( {auth} : PageProps ) {

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm()
    const { message, modal, notification } = App.useApp();

    const loadAuthUser = () =>{
        form.setFieldValue('username', auth.user.username)
        form.setFieldValue('lastname', auth.user.lastname)
        form.setFieldValue('firstname', auth.user.firstname)
        form.setFieldValue('middlename', auth.user.middlename)
        form.setFieldValue('sex', auth.user.sex)
        form.setFieldValue('bio', auth.user.bio)
    }

    useEffect(()=>{
        loadAuthUser()
    },[])
    const submit = (values:any) =>{
        console.log('submit', values);
        axios.patch('/my-account-update', values).then(res=>{
            if (res.data.status === "updated") {
                modal.info({
                    title: "Updated!",
                    content: <div>Your account successfully updated.</div>,
                    onOk() {
                        loadAuthUser()
                        setLoading(false)
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
                username: '',
                lastname: '',
                firstname: '',
                middlename: '',
                sex: '',
                email: '',
                bio: '',
                contact: '',
            }}>

                <Form.Item label="USERNAME"
                name="username"
                validateStatus={errors?.username ? 'error' : ''}
                help={errors?.username ? errors?.username[0] : ''}
                >
                    <Input placeholder="Username" size="large" />
                </Form.Item>

                <Form.Item label="LAST NAME" name="lastname"
                validateStatus={errors?.lastname ? 'error' : ''}
                help={errors?.lastname ? errors?.lastname[0] : ''}
                >
                    <Input placeholder="Last Name" size="large" />
                </Form.Item>

                <Form.Item label="FIRST NAME" name="firstname"
                validateStatus={errors?.firstname ? 'error' : ''}
                help={errors?.firstname ? errors?.firstname[0] : ''}
                >
                    <Input placeholder="First Name" size="large" />
                </Form.Item>

                <Form.Item label="MIDDLE NAME" name="middlename"
                validateStatus={errors?.middlename ? 'error' : ''}
                help={errors?.middlename ? errors?.middlename[0] : ''}
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

                <Form.Item label="BIO" name="bio"
                    validateStatus={errors?.bio ? 'error' : ''}
                    help={errors?.bio ? errors?.bio[0] : ''}
                    >
                    <Input.TextArea rows={6} placeholder="Bio" size="large" />
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
