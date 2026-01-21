import AdminLayout from '@/Layouts/AdminLayout'
import { FeaturedVideo, PageProps } from '@/types'
import { Head, router } from '@inertiajs/react'
import { App, Button, Checkbox, Form, Input, InputNumber } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SaveOutlined } from "@ant-design/icons";
import CardTitle from '@/Components/CardTitle'

export default function FeaturedVideosCreateEdit( 
    {
        auth, id, featuredVideo 
    }
    : {
        auth:PageProps, id:number, featuredVideo: FeaturedVideo
    }) {

    const [form] = Form.useForm();
    const [errors, setErrors] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { message, modal, notification } = App.useApp();


    const submit = async (values: object) => {
        // setLoading(true)
        //console.log(values);
        
        setErrors({});

        if (id > 0) {
            try {
                const res = await axios.patch("/admin/page-sections/videos/" + id, values);
                if (res.data.status === "updated") {
                    modal.info({
                        title: "Updated!",
                        content: <div>Featured video successfully updated.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/videos");
                        },
                    });
                }
            } catch (err: any) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                } else {
                    message.error(`${err}. Check your components`);
                }
                setLoading(false);
            }
        } else {
            try {
                const res = await axios.post("/admin/page-sections/videos", values);
                if (res.data.status === "saved") {
                    //openNotification('bottomRight', 'Saved!', 'Article successfully save.')
                    modal.info({
                        title: "Saved!",
                        content: <div>Featured video successfully saved.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/videos");
                        },
                    });
                }
            } catch (err: any) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                } else {
                    message.error(`${err}. Check your components`);
                }
                setLoading(false);
            }
        }
    };

    const getData = () => {
        try {
            console.log(featuredVideo);
            
            form.setFields([
                { name: "title", value: featuredVideo.title },
                { name: "excerpt", value: featuredVideo.excerpt },
                { name: "link", value: featuredVideo.link },
                { name: "order_no", value: featuredVideo.order_no },
                { name: "is_featured", value: featuredVideo.is_featured > 0 ? true : false },
            ]);
        } catch (err) {}
    };



    useEffect(() => {
        //loadCategories()
        if (id > 0) {
            getData();
        }
    }, []);



    return (
        <AdminLayout user={ auth.user } >
            
            <Head title="Featured Videos" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    {/* card header */}
                    <CardTitle title="ADD/EDIT FEATURED VIDEOS<" />
                    {/* card body */}
                    <div>

                    <Form
                        layout="vertical"
                        form={form}
                        autoComplete="off"
                        onFinish={submit}
                        initialValues={{
                            title: "",
                            excerpt: "",
                            link: "",
                            order_no: null,
                            is_featured: null,
                            featured_title: false,
                        }}
                    >

                        <Form.Item
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
                            <Input.TextArea
                                rows={4}
                                placeholder="Excerpt"
                            />
                        </Form.Item>

                        <Form.Item
                            name="link"
                            label="Video Link"
                            validateStatus={errors.link ? "error" : ""}
                            help={errors.link ? errors.link[0] : ""}
                        >
                            <Input
                                placeholder="Video Link"
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
                                <Checkbox>Featured Videos</Checkbox>
                        </Form.Item>

                        <Button
                            htmlType='submit'
                            className="mt-4"
                            icon={<SaveOutlined />}
                            loading={loading}
                            type="primary"
                        >
                            Save
                        </Button>


                    </Form>
                        
                    </div>
                </div>
                {/* card */}

            </div>
        </AdminLayout>
    )
}
