import AdminLayout from '@/Layouts/AdminLayout'
import { PageProps, Quarter } from '@/types'
import { Head, router, usePage } from '@inertiajs/react'
import { App, Button, Checkbox, Flex, Form, Input, InputNumber, Select, Upload, UploadProps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { InboxOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
    ClassicEditor,
    Alignment,
    Autoformat,
    Bold,
    CKBox,
    Code,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
    BlockQuote,
    CloudServices,
    CodeBlock,
    Essentials,
    FindAndReplace,
    Font,
    Heading,
    Highlight,
    HorizontalLine,
    GeneralHtmlSupport,
    AutoImage,
    Image,
    Indent,
    IndentBlock,
    TextPartLanguage,
    AutoLink,
    Link,
    LinkImage,
    List,
    ListProperties,
    TodoList,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersEssentials,
    Style,
    TextTransformation,
    WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { Magazine } from '@/types/magazine'
import { url } from 'inspector'


const MagazineCreateEdit = ( 
    {
        auth, id, magazine, quarters
    }
    : {
        auth:PageProps, id:number, magazine: Magazine,
        quarters: Quarter[]
    }) => {

    const { props } = usePage<PageProps>();
    const csrfToken: string = props.auth.csrf_token ?? ""; // Ensure csrfToken is a string

    const { Dragger } = Upload;

    const [form] = Form.useForm();
    const [errors, setErrors] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { message, modal, notification } = App.useApp();
    
    const submit = async (values: object) => {
        // setLoading(true)
        setErrors({});

        if (id > 0) {
            try {
                const res = await axios.patch("/admin/page-sections/magazines/" + id, values);
                
                if (res.data.status === "updated") {
                    modal.success({
                        title: "Updated!",
                        content: <div>Magazine successfully updated.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/magazines");
                        },
                    });
                }
            } catch (err: any) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    // message.error(err.response.data.message);
                    notification.error({
                        message: err.response.data.message
                    })
                } else {
                    notification.error({
                        message: `${err}. Check your components`
                    })
                }
                setLoading(false);
            }
        } else {
            try {
                const res = await axios.post("/admin/page-sections/magazines", values);
                if (res.data.status === "saved") {
                    //openNotification('bottomRight', 'Saved!', 'Article successfully save.')
                    modal.success({
                        title: "Saved!",
                        content: <div>Magazine successfully saved.</div>,
                        onOk() {
                            router.visit("/admin/page-sections/magazines");
                        },
                    });
                }
            } catch (err: any) {
                if (err.response.status === 422) {
                    setErrors(err.response.data.errors);
                    notification.error({
                        message: err.response.data.message
                    })
                } else {
                    notification.error({
                        message: `${err}. Check your components`
                    })
                }
                setLoading(false);
            }
        }
    };

    const getData = () => {
        
        try {
            
            const fileCover =  [{
                uid: "-1", // Unique identifier
                name: magazine.cover, // File name
                status: "done", // Initial status of the file
                url: `/storage/magazines/${magazine.cover}`, // URL to display the image
                response: magazine.cover, // response, name from db
            }];

          

            const fileMagazine =  [{
                uid: "-2", // Unique identifier
                name: magazine.magazine_path, // File name
                status: "done", // Initial status of the file
                url: `/storage/magazines/releases/${magazine.magazine_path}`, // URL to display the image
                response: magazine.magazine_path, // response, name from db
            }];
            
            form.setFields([
                { name: 'title', value: magazine.title },
                { name: 'excerpt', value: magazine.excerpt },
                { name: 'cover_file', value: magazine.cover ? fileCover : null },
                { name: "slug", value: magazine.slug },
                { name: 'magazine_file', value: magazine.magazine_path ? fileMagazine : null },
                { name: 'quarter', value: magazine.quarter },
                { name: 'year', value: magazine.year },
                { name: 'is_featured', value: magazine.is_featured > 0 ? true : false },
            ]);
        } catch (err) {}
    };

    const coverUploadProps: UploadProps = {
        
        name: "cover_file",
        action: "/admin/page-sections/temp-upload-cover-magazine",
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
            if (id > 0) {
                //console.log(info);
                //form.setFieldValue('cover_file', info.file.name)
                //console.log('change fired');
                
            } else {
                if (info.file.status === "done") {
                    message.success(
                        `${info.file.name} file uploaded successfully`
                    );
                    //form.setFieldValue("cover_file", info.file.response);
                    form.setFieldValue("cover_file", info.fileList);

                    //console.log(info);
                    
                } else if (info.file.status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        },
   
        onRemove(info) {
            if (id > 0) {
                //delete image
                return new Promise((resolve) => {
                    modal.confirm({
                        content: 'Are you sure you want to remove this cover image? This action cannot be undone.',
                        onOk: () => {
                            axios
                                .post(`/admin/page-sections/delete-cover-magazine/${id}/${info.name}`)
                                .then((res) => {
                                    if (res.data.status === "cover_deleted") {
                                        message.success("File deleted successfully.");
                                    } else {
                                        message.error("Failed to delete the file.");
                                    }
                                    resolve(true); // proceed with removal
                                })
                                .catch(() => {
                                    message.error("Delete request failed.");
                                    resolve(false); // cancel removal
                                });
                        },
                        onCancel: () => {
                            resolve(false); // cancel removal
                        },
                    });
                });
            } else {
                //remove image in temp folder if mode is create
                axios
                    .post("/admin/page-sections/remove-cover-magazine/" + info.response)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            }
        },
    };



    const uploadMagazineProps: UploadProps = {
        name: "magazine_file",
        action: "/admin/page-sections/temp-upload-pdf-magazine",
        accept: '.pdf',
        headers: {
            "X-CSRF-Token": csrfToken,
        },
        beforeUpload: (file) => {
  
            const isPdf = file.type === "application/pdf";

            if (!isPdf) {
                message.error(`${file.name} is not a pdf file`);
            }

            return isPdf || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully`
                );
                form.setFieldValue("magazine", info.file.response);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
            
        },
        onRemove(info) {
            if (id > 0) {

                return new Promise((resolve) => {
                    modal.confirm({
                        title: 'Are you sure you want to delete this PDF magazine?',
                        onOk: ()=>{
                            axios.post(`/admin/page-sections/delete-magazine/${id}/${info.name}`)
                                .then(res=>{
                                    if(res.data.status === 'magazine_deleted'){
                                        notification.success({
                                            message: 'Magazine successfuly deleted.'
                                        })
                                    }
                                    resolve(true)
                                }).catch(err => {
                                    console.log(err.response.data.message)
                                    if(err.response.status === 422){
                                        notification.error({
                                            message: err.response.data.message
                                        })
                                    }else{
                                        notification.error({
                                            message: 'Unknown error!'
                                        })
                                    }
                                    resolve(false)
                                })
                        }
                    })
                });
                //remove image if mode is update (temp,uploadedfiles)
            } else {
                //remove image in temp folder if mode is create
                axios
                    .post("/admin/magazines/temp-remove/" + info.response)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            }
        },
    };

    useEffect(() => {
        //loadCategories()
        if (id > 0) {
            getData();
        }
    }, []);



    return (
        <>
            
            <Head title="Magazine" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    {/* card header */}
					<div className="font-bold mb-4 text-lg">ADD/EDIT MAGAZINE</div>

                    {/* card body */}
                    <div>

                    <Form
                        layout="vertical"
                        form={form}
                        autoComplete="off"
                        onFinish={submit}
                        initialValues={{
                            title: '',
                            cover_file: null,
                            excerpt: '',
                            slug: '',
                            magazine_file: null,
                            year: 0,
                            quarter: 1,
                            is_featured: 0,
                        }}
                    >

                        <Form.Item name="title" label="Title"
                            validateStatus={errors.title ? "error" : ""}
                            help={errors.title ? errors.title[0] : ""}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>

                        <Form.Item
                            name="slug" label="Slug"
                            validateStatus={errors.slug ? "error" : ""}
                            help={errors.slug ? errors.slug[0] : ""}
                        >
                            <Input readOnly disabled
                                placeholder="Slug"
                            />
                        </Form.Item>

                        <Form.Item
                            name="cover_file" 
                            valuePropName="fileList"
                            className="w-full"
                            label="Cover"
                            getValueFromEvent={(e) => {
                                // Normalize the value to fit what the Upload component expects
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            validateStatus={errors.cover_file ? "error" : ""}
                            help={errors.cover_file ? errors.cover_file[0] : ""}
                        >
                            <Dragger
                                maxCount={1}
                                // fileList={fileList}
                                listType="picture"
                                {...coverUploadProps}
                            >

                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Upload your banner here. Support for single file only.
                                </p>
                                
                                {/* <Button icon={<UploadOutlined />}>
                                    Click to Upload
                                </Button> */}
                            </Dragger>
                        </Form.Item>
                        

                        {/* EDITOR CK WYSIWYG */}
                        <Form.Item
                            label="Excerpt"
                            name="excerpt"
                            className="prose-lg !max-w-none"
                            validateStatus={
                                errors.excerpt ? "error" : ""
                            }
                            help={
                                errors.excerpt
                                    ? errors.excerpt[0]
                                    : ""
                            }
                        >
                            <CKEditor
                                data={magazine?.excerpt}
                                editor={ClassicEditor}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    //setEditorData(data);
                                    form.setFieldsValue({
                                        excerpt: data,
                                    });
                                }}
                                config={{
                                    toolbar: {
                                        shouldNotGroupWhenFull: true,
                                        items: [
                                            // --- Document-wide tools ----------------------------------------------------------------------
                                            "undo",
                                            "redo",
                                            "|",
                                            "findAndReplace",
                                            "selectAll",
                                            "|",
                                            // --- "Insertables" ----------------------------------------------------------------------------
                                            "|",
                                            // --- Basic styles, font and inline formatting -------------------------------------------------------
                                            "bold",
                                            "italic",
                                            "underline",
                                            "strikethrough",
                                            {
                                                label: "Basic styles",
                                                icon: "text",
                                                items: [
                                                    "fontSize",
                                                    "fontFamily",
                                                    "fontColor",
                                                    "fontBackgroundColor",
                                                    "highlight",
                                                    "superscript",
                                                    "subscript",
                                                    "code",
                                                    "|",
                                                    "textPartLanguage",
                                                    "|",
                                                ],
                                            },
                                            "removeFormat",
                                            "|",

                                            // --- Text alignment ---------------------------------------------------------------------------
                                            "|",

                                            // --- Lists and indentation --------------------------------------------------------------------
                                            "bulletedList",
                                            "numberedList",
                                            "todoList",
                                            "|",
                                            "outdent",
                                            "indent",
                                        ],
                                    },

                                    link: {
                                        addTargetToExternalLinks: true,
                                        defaultProtocol: "https://",
                                    },
                                    table: {
                                        contentToolbar: [
                                            "tableColumn",
                                            "tableRow",
                                            "mergeTableCells",
                                        ],
                                    },

                                    plugins: [
                                        Alignment,
                                        Autoformat,
                                        AutoImage,
                                        AutoLink,
                                        BlockQuote,
                                        Bold,
                                        CloudServices,
                                        Code,
                                        CodeBlock,
                                        Essentials,
                                        FindAndReplace,
                                        Font,
                                        GeneralHtmlSupport,
                                        Heading,
                                        Highlight,
                                        HorizontalLine,
                                        Image,
                                        Indent,
                                        IndentBlock,
                                        Italic,
                                        Link,
                                        LinkImage,
                                        List,
                                        ListProperties,
                                        Mention,
                                        PageBreak,
                                        Paragraph,
                                        PasteFromOffice,
                                        RemoveFormat,
                                        SpecialCharacters,
                                        // SpecialCharactersEmoji,
                                        SpecialCharactersEssentials,
                                        Strikethrough,
                                        Style,
                                        Subscript,
                                        Superscript,
                                        TextPartLanguage,
                                        TextTransformation,
                                        TodoList,
                                        Underline,
                                        WordCount,
                                    ],
                                    //licenseKey: '<YOUR_LICENSE_KEY>',
                                    // mention: {
                                    //     // Mention configuration
                                    // },
                                    initialData: '',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="magazine_file" 
                            valuePropName="fileList"
                            className="w-full"
                            label="Magazine"
                            getValueFromEvent={(e) => {
                                // Normalize the value to fit what the Upload component expects
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            validateStatus={errors.magazine ? "error" : ""}
                            help={errors.magazine ? errors.magazine[0] : ""}
                        >
                            <Upload
                                maxCount={1}
                                {...uploadMagazineProps}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Click to Upload PDF
                                </Button>
                            </Upload>
                        </Form.Item>
                        
                        <div className='w-full flex gap-4'>
                            <Form.Item
                                name="quarter"
                                className="w-full"
                                label="Select Quarter"
                                validateStatus={
                                    errors.quarter ? "error" : ""
                                }
                                help={
                                    errors.quarter ? errors.quarter[0] : ""
                                }
                            >
                                <Select>
                                    {quarters?.map((item) => (
                                        <Select.Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.quarter_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="year" label="Year" 
                                validateStatus={errors.year ? "error" : ""}
                                help={errors.year ? errors.year[0] : ""}
                            >
                                <InputNumber placeholder="Year" className='w-full' />
                            </Form.Item>


                        </div>

                        <Form.Item
                            name="is_featured" valuePropName="checked"
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
                                <Checkbox>Featured Magazine</Checkbox>
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
        </>
    )
}



MagazineCreateEdit.layout =  (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default MagazineCreateEdit;