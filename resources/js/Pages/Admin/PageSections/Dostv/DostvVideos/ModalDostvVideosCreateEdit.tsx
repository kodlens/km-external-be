import { Dostv } from '@/types'
import { App, Checkbox, Form, Input, InputNumber, message, Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios'

import { forwardRef, useImperativeHandle, useState } from 'react'


interface Props {
    data?:Dostv;
    onRefresh: () => void
}

export type ModalDostvVideosCreateEditHandle = {
    openModal: (id:number)=> void
}

const ModalDostvVideosCreateEdit = forwardRef<ModalDostvVideosCreateEditHandle, Props>( ({ onRefresh }, ref) => {

    const [form] = Form.useForm();
    const [errors, setErrors] = useState<any>({})
    const { notification } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [id, setId] = useState<number>(0)

    // useImperativeHandle(ref, () => ({
    //   open: () => setModalOpen(true),
    //   close: () => setModalOpen(false),
    // }));

    useImperativeHandle(ref, ()=> ({
        openModal: async (id:number) => {
            setId(id)
            setOpen(true)

            if(id > 0){
                try {
                    const res = await axios.get(`/admin/page-sections/dostvs/dostv-youtube-videos/${id}}`);
                    form.setFields([
                        { name: 'title', value: res.data.title },
                        { name: 'excerpt', value: res.data.excerpt },
                        { name: 'link', value: res.data.link },
                        { name: 'order_no', value: res.data.order_no },
                        { name: 'is_featured', value: !!res.data.is_featured },
                    ]);
                } catch (err) {}
            }
        }
    }))


    const submit = async (values: object) => {
        setLoading(true)
        setErrors({});

        if (id > 0) {

            try {
                const res = await axios.patch(`/admin/page-sections/dostvs/dostv-youtube-videos/${id}`, values);
                if (res.data.status === "updated") {
                    notification.success({
                        message: 'DOSTv youtube videos successfully updated.'
                    })
                    setLoading(false)
                    onRefresh()
                    form.resetFields()
                    setOpen(false)
                }
            } catch (err: any) {
                setLoading(false)

                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                } else {
                    message.error(`${err}. Check your components`);
                }
            }

        } else {

            try {
                const res = await axios.post(`/admin/page-sections/dostvs/dostv-youtube-videos/`, values);
                if (res.data.status === "saved") {
                    notification.success({
                        message: 'DOSTv youtube videos successfully saved.'
                    })
                    setLoading(false)
                    onRefresh()
                    form.resetFields()
                    setOpen(false)
                }
            } catch (err: any) {
                setLoading(false)

                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                } else {
                    message.error(`${err}. Check your components`);
                }
            }
        }
    }

    return (
        <>
            <Modal open={open}
                title='YOUTUBE VIDEO INFORMATION'
                okText='Save'
                cancelText='Close'
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit'
                }}
                confirmLoading={loading}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        autoComplete="off"
                        onFinish={submit}
                        initialValues={{
                            title: null,
                            excerpt: '',
                            link: '',
                            order_no: 0,
                            active: false,
                        }}
                    >
                        {dom}
                    </Form>
                )}
                onCancel={() => setOpen(false)}>
                <hr />

                <Form.Item
                    className='mt-4'
                    name="title"
                    label="Title"
                    validateStatus={errors.title ? "error" : ""}
                    help={errors.title ? errors.title[0] : ""}
                >
                    <Input
                        placeholder="Title"
                    />
                </Form.Item>

                <Form.Item
                    name="excerpt"
                    label="Excerpt"
                    validateStatus={errors.excerpt ? "error" : ""}
                    help={errors.excerpt ? errors.excerpt[0] : ""}
                >
                    <TextArea
                        placeholder="Excerpt"
                    />
                </Form.Item>

                <Form.Item
                    name="link"
                    label="Link"
                    validateStatus={errors.link ? "error" : ""}
                    help={errors.link ? errors.link[0] : ""}
                >
                    <Input
                        placeholder="Link"
                    />
                </Form.Item>


                <Form.Item
                    name="order_no"
                    label="Order No."
                    validateStatus={errors.order_no ? "error" : ""}
                    help={errors.order_no ? errors.order_no[0] : ""}
                >
                    <InputNumber
                        placeholder="Order No."
                    />
                </Form.Item>

                <Form.Item
                    name="is_featured"
                    valuePropName="checked"
                    className="w-full"
                    validateStatus={
                        errors.is_featured ? "error" : ""
                    }
                    help={
                        errors.is_featured
                            ? errors.is_featured[0]
                            : ""
                    }
                >
                    <Checkbox>Featured</Checkbox>
                </Form.Item>
                <hr />
            </Modal>
        </>
    )
}
)

export default ModalDostvVideosCreateEdit