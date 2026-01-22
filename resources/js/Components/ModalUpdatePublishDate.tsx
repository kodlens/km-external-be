import { App, DatePicker, Form, Input, Modal, notification } from 'antd';
import axios from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react'

interface Props {
    uri:string;
    onRefresh: ()=>void
}

export type ModalUpdatePublishDateHandle = {
    openModal: (id: number) => void
}

const ModalUpdatePublishDate = forwardRef<ModalUpdatePublishDateHandle, Props>(( { uri, onRefresh }, ref) => {

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { modal } = App.useApp();

    useImperativeHandle(ref, () => ({
        openModal: async (id: number) => {
            setOpen(true)
            setId(id)
        }
    }))


    const onFinishSetPublishDate = async (values: any) => {
        setLoading(true)
        axios.post(`${uri}/${id}`, values).then((res) => {
            if (res.data.status === 'updated') {
                setLoading(false)

                notification.success({
                    message: 'Updated!',
                    description: 'Publish date set successfully.',
                });
                setOpen(false);
                onRefresh()
                //call the reload
            }
        }).catch(err => {
            setErrors(err.response.data.errors);
            setLoading(false)

        });
    }

    return (
        <Modal
            title="Update Publish Date"
            open={open}
            onCancel={() => {
                setOpen(false);
                setId(0);
                setErrors({});
            }}
            okButtonProps={{
                autoFocus: true,
                htmlType: "submit",
            }}
            okText="Save"
            cancelText="Close"
            destroyOnHidden
            confirmLoading={loading}
            modalRender={(dom) => (
                <Form
                    layout="vertical"
                    className='border-b'
                    form={form}

                    name="form_in_modal"
                    autoComplete="off"
                    initialValues={{
                        publish_date: null,
                        post_id: id
                    }}
                    clearOnDestroy
                    onFinish={(values) => onFinishSetPublishDate(values)}
                >
                    {dom}
                </Form>
            )}
        >
            <Form.Item
                name="publish_date"
                className="w-full"
                label="Publish Date"
                validateStatus={errors.publish_date ? "error" : ""}
                help={errors.publish_date ? errors.publish_date[0] : ''}
            >
                <DatePicker placeholder="Select date" className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
                name="post_id"
                className="w-full"
                label="Publish Date"
                hidden>
                <Input hidden></Input>
            </Form.Item>
        </Modal>
    )
})

export default ModalUpdatePublishDate
