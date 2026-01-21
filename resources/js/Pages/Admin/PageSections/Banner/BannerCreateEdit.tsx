import AdminLayout from '@/Layouts/AdminLayout'
import { Banner, PageProps } from '@/types'
import { Head, router, usePage } from '@inertiajs/react'
import { App, Button, Checkbox, Form, Input, InputNumber, Upload } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";


import type { UploadFile, UploadProps } from "antd";


const BannerCreateEdit = ( 
    {
        auth, id, banner 
    }
    : {
        auth:PageProps, id:number, banner: Banner
    }) => {

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
                const res = await axios.patch("/admin/page-sections/banners/" + id, values);
                if (res.data.status === "updated") {
                    modal.info({
                        title: "Updated!",
                        content: <div>Banner successfully updated.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/banners");
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
                const res = await axios.post("/admin/page-sections/banners", values);
                if (res.data.status === "saved") {
                    //openNotification('bottomRight', 'Saved!', 'Article successfully save.')
                    modal.info({
                        title: "Saved!",
                        content: <div>Banner successfully saved.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/banners");
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
            const fileList = [
                {
                    uid: "-1", // Unique identifier
                    name: banner.img, // File name
                    status: "done", // Initial status of the file
                    url: `/storage/banner_images/${banner.img}`, // URL to display the image
                    response: banner.img, // response, name from db
                },
            ];
            
            form.setFields([
                { name: "name", value: banner.name },
                { name: "description", value: banner.description },
                {
                    name: "upload",
                    value: banner.img ? fileList : null,
                },
                { name: "active", value: banner.active > 0 ? true : false },
            ]);
        } catch (err) {}
    };



    useEffect(() => {
        //loadCategories()
        if (id > 0) {
            getData();
        }
    }, []);

    
    const { props } = usePage<PageProps>();
    const csrfToken: string = props.auth.csrf_token ?? ""; // Ensure csrfToken is a string
    //** =================THIS IS FOR UPLOAD IMAGE ================*/
    const uploadProps: UploadProps = {
        name: "upload",
        action: "/admin/page-sections/temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },
        beforeUpload: (file) => {
            const isPNG = file.type === "image/png";
            const isJPG = file.type === "image/jpeg";

            if (!isPNG && !isJPG) {
                message.error(`${file.name} is not a png/jpg file`);
            }
            return isPNG || isJPG || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                setErrors({})
                message.success(
                    `${info.file.name} file uploaded successfully`
                );
                form.setFieldValue("img", info.file.response);
            } else if (info.file.status === "error") {
                if(info.file.error.status === 422){
                    message.error('ERROR: ' + info.file.response.errors ? info.file.response.errors.upload[0] : 'Please ensure the upload file is a valid type of image and not greater that 1MB.');
                    setErrors(info.file.response.errors);
                }else{
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        },
        onRemove(info) {
       
            axios
                .post("/admin/pages/temp-remove/" + info.response)
                .then((res) => {
                    if (res.data.status === "temp_deleted") {
                        message.success("File removed.");
                    }
                });
        },
    };
    /** ================================================================= */


    return (
        <>
            
            <Head title="Banner" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    {/* card header */}

					<div className="font-bold mb-4 text-lg">ADD/EDIT BANNER</div>

                    {/* card body */}
                    <div>

                    <Form
                        layout="vertical"
                        form={form}
                        autoComplete="off"
                        onFinish={submit}
                        initialValues={{
                            name: "",
                            description: "",
                            img: "",
                            upload: [],
                            active: false,
                        }}
                    >

                        <Form.Item
                            name="name"
                            label="Name"
                            validateStatus={errors.name ? "error" : ""}
                            help={errors.name ? errors.name[0] : ""}
                        >
                            <Input
                                placeholder="Name"
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            validateStatus={errors.description ? "error" : ""}
                            help={errors.description ? errors.description[0] : ""}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Description"
                            />
                        </Form.Item>

                        <Form.Item
                            name="upload"
                            valuePropName="fileList"
                            className="w-full"
                            label="Select Banner Image"
                            getValueFromEvent={(e) => {
                                // Normalize the value to fit what the Upload component expects
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            validateStatus={errors.upload ? "error" : ""}
                            help={errors.upload ? errors.upload[0] : ""}
                        >
                            <Upload
                                maxCount={1}
                                // fileList={fileList}
                                listType="picture"
                                {...uploadProps}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Click to Upload
                                </Button>
                            </Upload>
                        </Form.Item>


                        <Form.Item
                            name="active"
                            valuePropName="checked"
                            className="w-full"
                            validateStatus={
                                errors.active ? "error" : ""
                            }
                            help={
                                errors.active
                                    ? errors.active[0]
                                    : ""
                            }
                                >
                                <Checkbox>Active</Checkbox>
                        </Form.Item>
                        
                        <div className='flex gap-3'>
                           
                            <Button
                                className="mt-4"
                                icon={<ArrowLeftOutlined />}
                                onClick={()=>window.history.back() }
                            >
                                Back
                            </Button>

                            <Button
                                htmlType='submit'
                                className="mt-4"
                                icon={<SaveOutlined />}
                                loading={loading}
                                type="primary"
                            >
                                Save
                            </Button>
                        </div>


                    </Form>
                        
                    </div>
                </div>
                {/* card */}

            </div>
        </>
    )
}



BannerCreateEdit.layout =  (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default BannerCreateEdit;