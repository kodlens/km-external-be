import AdminLayout from "@/Layouts/AdminLayout"
import { PageProps } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
import { App, Button, Checkbox, Form, Input, Upload, UploadProps } from "antd"
import Dragger from "antd/es/upload/Dragger"
import axios from "axios"
import { ArrowLeft, SaveAll } from "lucide-react"
import { useEffect, useState } from "react"
import { InboxOutlined } from "@ant-design/icons";
import { Dostv } from "@/types/dostv"
import { link } from "fs"

const DostvMainCreateEdit = ({ id, dostv } : { id:number, dostv:Dostv }) => {
    
    const [form] = Form.useForm();

    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const { notification, modal, message } = App.useApp();



     const getData = () => {
        try {
            const fileList = [
                {
                    uid: "-1", // Unique identifier
                    name: dostv.featured_image, // File name
                    status: "done", // Initial status of the file
                    url: `/storage/dostv/${dostv.featured_image}`, // URL to display the image
                    response: dostv.featured_image, // response, name from db
                },
            ];
            
            form.setFields([
                { name: "title", value: dostv.title },
                { name: "description", value: dostv.description },
                {
                    name: "featured_image",
                    value: dostv.featured_image ? fileList : null,
                },
                { name: "website", value: dostv.website },
                { name: "link", value: dostv.link },
                { name: "active", value: dostv.active > 0 ? true : false },
            ]);
        } catch (err) {}
    };


    useEffect(() => {
        //loadCategories()
        if (id > 0) {
            getData();
        }
    }, []);


    const submit = async (values: Dostv) => {
        setLoading(true)
        
        setErrors({});

        if (id > 0) {
            try {
                const res = await axios.patch("/admin/page-sections/dostvs/" + id, values);
                if (res.data.status === "updated") {
                    modal.success({
                        title: "Updated!",
                        content: <div>Banner successfully updated.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/dostvs");
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
                const res = await axios.post("/admin/page-sections/dostvs", values);
                if (res.data.status === "saved") {
                    modal.success({
                        title: "Saved!",
                        content: <div>Banner successfully saved.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/dostvs");
                        },
                    });
                }
            } catch (err: any) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                } else {
                    message.error(`${err.response.message}. Check your components`);
                }
                setLoading(false);
            }
        }
    }

    const { props } = usePage<PageProps>();
    const csrfToken: string = props.auth.csrf_token ?? ""; // Ensure csrfToken is a string
    //** =================THIS IS FOR UPLOAD IMAGE ================*/
    const uploadProps: UploadProps = {
        name: "featured_image",
        action: "/admin/page-sections/dostvs/temp-upload-banner",
        headers: {
            "X-CSRF-Token": csrfToken,
        },
        beforeUpload:  (file) => {

            const isPNG = file.type === "image/png"; 
            const isJPG = file.type === "image/jpeg"; 

            if (!isPNG && !isJPG) { 
                message.error(`${file.name} is not a png/jpg file`); 
            }
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const test = reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;

                //console.log('image', img);
                img.onload = () => {
                    if (img.width === 1200 && img.height === 675) {
                        //resolve(file); // ✅ allow upload
                        console.log('yeeeeyy!');
                    } else {
                    message.error(`Image must be exactly 1200 x 675 pixels`);
                        //reject(Upload.LIST_IGNORE); // ❌ block upload
                        return false
                    }
                };
                return true
            }
            //console.log(test);
            return isPNG || isJPG || Upload.LIST_IGNORE;   
            
        },


        /* ========================= 
            GE COMMENT KAY SULBARON TIKa

            Logic here is to check the height and width of banner
            kung makapasar ba sa sizing, then allow upload

        ========================= */

        
        // beforeUploadTest: (file) => {
        //     return new Promise((resolve, reject) => {
        //         const isPNG = file.type === "image/png";
        //         const isJPG = file.type === "image/jpeg";

        //         if (!isPNG && !isJPG) {
        //         message.error(`${file.name} is not a PNG/JPG file`);
        //         return reject(Upload.LIST_IGNORE);
        //         }

        //         // 🔎 Check image dimensions
        //         const reader = new FileReader();
        //         reader.onload = (e) => {
        //         const img = new Image();
        //         img.src = e.target?.result as string;

        //         img.onload = () => {
        //             if (img.width === 1200 && img.height === 675) {
        //             resolve(file); // ✅ allow upload
        //             } else {
        //             message.error(`Image must be exactly 1200 x 675 pixels`);
        //             reject(Upload.LIST_IGNORE); // ❌ block upload
        //             }
        //         };
        //         };
        //         reader.readAsDataURL(file);
        //     });
        // },
        
        /* ========================= 
            GE COMMENT KAY SULBARON TIKa
        ========================= */

        onChange(info) {
            if (info.file.status === "done") {
                setErrors({})
                message.success(
                    `${info.file.name} file uploaded successfully`
                );
                //form.setFieldValue("banner", info.file.response);
            } else if (info.file.status === "error") {
                if(info.file.error.status === 422){
                    message.error('ERROR: ' + info.file.response.errors ? info.file.response.message : 'Unknown error!');
                    setErrors(info.file.response.errors);
                }else{
                    message.error(`${info.file.response.message}. File upload failed.`);
                }
            }
        },

        onRemove(info) {
            if(id>0){
                axios.post(`/admin/page-sections/dostvs/delete-dostv-banner/${id}/${info.response}`)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            }else{
                axios
                    .post(`/admin/page-sections/dostvs/temp-remove-banner/${info.response}`)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            }
        },
    };
    /** ================================================================= */
    

    return (
        <>
            <Head title="Manage Dostv" />
            <div className='mt-10 p-6 overflow-auto mx-2 md:mx-auto bg-white shadow-sm rounded-md
                md:max-w-[600px]'>
                <Form
                    layout="vertical"
                    form={form}
                    autoComplete="off"
                    onFinish={submit}
                    initialValues={{
                        featured_image: null,
                        title: '',
                        description: '',
                        link: '',
                        website: '',
                        order_no: 0,
                        is_featured: 0,
                        active: false,
                    }}
                >

                    <Form.Item
                        name="featured_image" 
                        valuePropName="fileList"
                        className="w-full"
                        label="Featured Image"
                        getValueFromEvent={(e) => {
                            // Normalize the value to fit what the Upload component expects
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                        validateStatus={errors.featured_image ? "error" : ""}
                        help={errors.featured_image ? errors.featured_image[0] : ""}
                    >
                        <Dragger
                            maxCount={1}
                            // fileList={fileList}
                            listType="picture"
                            {...uploadProps}
                        >

                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Upload your banner here. Support for single file only. Recommended is 1200 x 675
                            </p>
                        </Dragger>
                    </Form.Item>

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
                        name="website"
                        label="Website"
                        validateStatus={errors.website ? "error" : ""}
                        help={errors.website ? errors.website[0] : ""}
                    >
                        <Input
                            placeholder="Home website, link here ..."
                        />
                    </Form.Item> 
                    
                    <Form.Item
                        name="link"
                        label="More Link"
                        validateStatus={errors.link ? "error" : ""}
                        help={errors.link ? errors.link[0] : ""}
                    >
                        <Input
                            placeholder="Additional link here ..."
                        />
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
                    
                    <div className="mt-4 flex gap-2">
                        <Button
                            onClick={ () => window.history.back() }
                            className=""
                            icon={<ArrowLeft size={16} />}
                        >
                            Back
                        </Button>

                        <Button
                            htmlType='submit'
                            icon={<SaveAll size={16} />}
                            loading={loading}
                            type="primary"
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

DostvMainCreateEdit.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default DostvMainCreateEdit