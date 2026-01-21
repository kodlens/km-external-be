import React, { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

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
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Base64UploadAdapter,
    PictureEditing,
    Indent,
    IndentBlock,
    TextPartLanguage,
    AutoLink,
    Link,
    LinkImage,
    List,
    ListProperties,
    TodoList,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersEssentials,
    Style,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { UploadOutlined, SaveOutlined, ProjectOutlined } from "@ant-design/icons";

import {
    App,
    Button,
    Form,
    Input,
    Select,
    Checkbox,
    Upload,
    DatePicker,
    Flex,
    ConfigProvider,
} from "antd";

import type { UploadFile, UploadProps } from "antd";

import {
    Section,
    Post,
    Category,
    PageProps,
    Status,
    User,
    Quarter,
    Author,
    Permission,
} from "@/types";

// import { NotificationPlacement } from 'antd/es/notification/interface';

import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";

import dayjs from "dayjs";

const dateFormat = (item: string): string => {
    return dayjs(item).format("MMM-DD-YYYY");
};

import PostComment from "./partials/PostComment";

export default function PostCreateEdit({
    id,
    auth,
    statuses,
    sections,
    quarters,
    categories,
    article,
    authors,
    permissions,
}: {
    id: number;
    auth: PageProps;
    statuses: Status[];
    sections: Section[];
    quarters: Quarter[];
    categories: Category[];
    article: Post;
    authors: Author[];
    permissions: string[];
}) {
    const { props } = usePage<PageProps>();
    const csrfToken: string = props.auth.csrf_token ?? ""; // Ensure csrfToken is a string

    const [form] = Form.useForm();

    const [errors, setErrors] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { message, modal, notification } = App.useApp();

    useEffect(() => {
        //loadCategories()
        if (id > 0) {
            getData();
        }
    }, []);

    //console.log('PostCreate rerender')

    const getData = () => {
        try {
            const fileList = [
                {
                    uid: "-1", // Unique identifier
                    name: article.featured_image, // File name
                    status: "done", // Initial status of the file
                    url: `/storage/featured_images/${article.featured_image}`, // URL to display the image
                    response: article.featured_image, // response, name from db
                },
            ];

            form.setFields([
                { name: "quarter", value: article.quarter_id },
                { name: "title", value: article.title },
                { name: "section", value: article.section_id },
                { name: "slug", value: article.slug },
                { name: "excerpt", value: article.excerpt },
                //{ name: "author", value: article.author_id },
                { name: "category", value: article.category_id },
                {
                    name: "upload",
                    value: article.featured_image ? fileList : null,
                },
                { name: "image_caption", value: article.image_caption },
                { name: "description", value: article.description },
                { name: "status", value: article.status_id },
                // {
                //     name: "publication_date",
                //     value:
                //         article.publication_date &&
                //         dayjs(article?.publication_date),
                // },
                { name: "quarter", value: article.quarter_id },
                { name: "year", value: article.year },
                // {
                //     name: "is_featured",
                //     value: article.is_featured ? true : false,
                // },
            ]);

            // console.log(moment(article.date_published, 'YYYY-MM-DD') );
        } catch (err) {}
    };

    const uploadProps: UploadProps = {
        name: "featured_image",
        action: "/panel/temp-upload",
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
                //form.setFieldValue('featured_image', info.file.name)
            } else {
                if (info.file.status === "done") {
                    message.success(
                        `${info.file.name} file uploaded successfully`
                    );
                    form.setFieldValue("featured_image", info.file.response);
                } else if (info.file.status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        },
        onRemove(info) {
            if (id > 0) {
                //remove image if mode is update (temp,uploadedfiles)
                axios
                    .post(`/panel/image-remove/${id}/${info.name}`)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            } else {
                //remove image in temp folder if mode is create
                axios
                    .post("/panel/temp-remove/" + info.response)
                    .then((res) => {
                        if (res.data.status === "temp_deleted") {
                            message.success("File removed.");
                        }
                    });
            }
        },
    };

    const submit = async (values: object) => {
        // setLoading(true)
        console.log(values);
        
        setErrors({});

        if (id > 0) {
            try {
                const res = await axios.patch("/panel/posts/" + id, values);
                if (res.data.status === "updated") {
                    modal.info({
                        title: "Updated!",
                        content: <div>Post successfully updated.</div>,
                        onOk() {
                            router.visit("/panel/posts");
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
                const res = await axios.post("/panel/posts", values);
                if (res.data.status === "saved") {
                    //openNotification('bottomRight', 'Saved!', 'Article successfully save.')
                    modal.info({
                        title: "Saved!",
                        content: <div>Article successfully saved.</div>,
                        onOk() {
                            router.visit("/panel/posts");
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

    //for dynamic width
    const dynamicWidth = () => {
        const width =
            id > 0
                ? { flex: 2, width: "auto" }
                : { flex: "none", width: "80%" };
        return width;
    };

    /**truncate text and add 3 dots at the end */
    const truncate = (text: string, limit: number) => {
        if (text.length > 0) {
            const words = text.split(" ");
            if (words.length > limit) {
                return words.slice(0, limit).join(" ") + "...";
            }
            return text;
        } else {
            return "";
        }
    };

    const handleClickSubmit = (n:number) =>  {
        setLoading(true)
   
        form.setFieldsValue({
            is_submit: n
        });
       
        form.submit()
  
    }

    return (
        <Authenticated user={auth.user}>
            <Head title="Article" />

            {/* card container */}
            <div className=" mt-10">
                {/* card container */}
                <div
                    className="flex justify-center flex-col
					lg:flex-row"
                >
                    {/* card input */}
                    <div className="bg-white p-6 mx-2" style={dynamicWidth()}>
                        <div className="font-bold text-lg pb-2 mb-2 border-b">
                            ADD/EDIT POST
                        </div>
                        <Form
                            layout="vertical"
                            form={form}
                            autoComplete="off"
                            onFinish={submit}
                            initialValues={{
                                title: "",
                                section: null,
                                excerpt: "",
                                description: "",
                                year: null,
                                quarter: null,
                                featured_title: "",
                                upload: [],
                                image_caption: "",
                                category: null,
                                status: null,
                                tags: null,
                                is_submit: 0,
                                 //author: null,
                                //publication_date: null,
                                 //is_featured: false,
                            }}
                        >
                            <Form.Item
                                name="title"
                                label="Title"
                                validateStatus={errors.title ? "error" : ""}
                                help={errors.title ? errors.title[0] : ""}
                            >
                                <Input placeholder="Title" />
                            </Form.Item>

                            <Form.Item
                                name="slug"
                                label="Slug (Read Only)"
                                validateStatus={errors.slug ? "error" : ""}
                                help={errors.slug ? errors.slug[0] : ""}
                            >
                                <Input disabled placeholder="Slug" />
                            </Form.Item>

                            <Form.Item
                                name="section"
                                className="w-full"
                                label="Section"
                                validateStatus={errors.section ? "error" : ""}
                                help={errors.section ? errors.section[0] : ""}
                            >
                                <Select placeholder="Select section">
                                    {sections?.map((item) => (
                                        <Select.Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.section}
                                        </Select.Option>
                                    ))}
                                </Select>
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

                            <div className="flex gap-2">
                                {/* <Form.Item
                                    name="author"
                                    className="w-full"
                                    label="Select Auhtor"
                                    validateStatus={
                                        errors.author ? "error" : ""
                                    }
                                    help={errors.author ? errors.author[0] : ""}
                                >
                                    <Select placeholder="Author">
                                        {authors?.map((item) => (
                                            <Select.Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.lastname},{" "}
                                                {item.firstname}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item> */}

                                <Form.Item
                                    name="category"
                                    className="w-full"
                                    label="Select Category"
                                    validateStatus={
                                        errors.category ? "error" : ""
                                    }
                                    help={
                                        errors.category
                                            ? errors.category[0]
                                            : ""
                                    }
                                >
                                    <Select>
                                        {categories?.map((cat) => (
                                            <Select.Option
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.title}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="upload"
                                valuePropName="fileList"
                                className="w-full"
                                label="Select Featured Image"
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
                                name="image_caption"
                                className="w-full"
                                label="Featured Image Caption"
                                validateStatus={
                                    errors.image_caption ? "error" : ""
                                }
                                help={
                                    errors.image_caption
                                        ? errors.image_caption[0]
                                        : ""
                                }
                            >
                                <Input placeholder="Featured Image Caption" />
                            </Form.Item>

                            {/* EDITOR CK WYSIWYG */}
                            <Form.Item
                                label="Body"
                                name="description"
                                className="prose-lg !max-w-none"
                                validateStatus={
                                    errors.description ? "error" : ""
                                }
                                help={
                                    errors.description
                                        ? errors.description[0]
                                        : ""
                                }
                            >
                                <CKEditor
                                    data={article?.description}
                                    editor={ClassicEditor}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        //setEditorData(data);
                                        form.setFieldsValue({
                                            description: data,
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

                                                "link",
                                                "uploadImage",
                                                "insertTable",
                                                "blockQuote",
                                                "mediaEmbed",
                                                "codeBlock",
                                                "pageBreak",
                                                "horizontalLine",
                                                "specialCharacters",

                                                // --- Block-level formatting -------------------------------------------------------------------
                                                "heading",
                                                "style",
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
                                                "alignment",
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

                                        heading: {
                                            options: [
                                                {
                                                    model: "paragraph",
                                                    title: "Paragraph",
                                                    class: "ck-heading_paragraph",
                                                },
                                                {
                                                    model: "heading1",
                                                    view: "h1",
                                                    title: "Heading 1",
                                                    class: "ck-heading_heading1",
                                                },
                                                {
                                                    model: "heading2",
                                                    view: "h2",
                                                    title: "Heading 2",
                                                    class: "ck-heading_heading2",
                                                },
                                                {
                                                    model: "heading3",
                                                    view: "h3",
                                                    title: "Heading 3",
                                                    class: "ck-heading_heading3",
                                                },
                                                {
                                                    model: "heading4",
                                                    view: "h4",
                                                    title: "Heading 4",
                                                    class: "ck-heading_heading4",
                                                },
                                            ],
                                        },

                                        image: {
                                            resizeOptions: [
                                                {
                                                    name: "resizeImage:original",
                                                    label: "Default image width",
                                                    value: null,
                                                },
                                                {
                                                    name: "resizeImage:50",
                                                    label: "50% page width",
                                                    value: "50",
                                                },
                                                {
                                                    name: "resizeImage:75",
                                                    label: "75% page width",
                                                    value: "75",
                                                },
                                            ],
                                            toolbar: [
                                                "imageTextAlternative",
                                                "toggleImageCaption",
                                                "|",
                                                "imageStyle:inline",
                                                "imageStyle:wrapText",
                                                "imageStyle:breakText",
                                                "|",
                                                "resizeImage",
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
                                            ImageCaption,
                                            ImageInsert,
                                            ImageResize,
                                            ImageStyle,
                                            ImageToolbar,
                                            ImageUpload,
                                            Base64UploadAdapter,
                                            Indent,
                                            IndentBlock,
                                            Italic,
                                            Link,
                                            LinkImage,
                                            List,
                                            ListProperties,
                                            MediaEmbed,
                                            Mention,
                                            PageBreak,
                                            Paragraph,
                                            PasteFromOffice,
                                            PictureEditing,
                                            RemoveFormat,
                                            SpecialCharacters,
                                            // SpecialCharactersEmoji,
                                            SpecialCharactersEssentials,
                                            Strikethrough,
                                            Style,
                                            Subscript,
                                            Superscript,
                                            Table,
                                            TableCaption,
                                            TableCellProperties,
                                            TableColumnResize,
                                            TableProperties,
                                            TableToolbar,
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
                                        initialData: "",
                                    }}
                                />
                            </Form.Item>

                            <Flex gap="middle">
                                <Form.Item
                                    name="year"
                                    className="w-full"
                                    label="Year"
                                    validateStatus={errors.year ? "error" : ""}
                                    help={errors.year ? errors.year[0] : ""}
                                >
                                    <Input placeholder="Year" />
                                </Form.Item>

                                <Form.Item
                                    name="quarter"
                                    className="w-full"
                                    label="Select Quater"
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
                            </Flex>

                            <Flex gap="middle">
                                <Form.Item
                                    name="status"
                                    className="w-full"
                                    label="Select Status"
                                    validateStatus={
                                        errors.status ? "error" : ""
                                    }
                                    help={errors.status ? errors.status[0] : ""}
                                >
                                    <Select>
                                        {statuses?.map((item) => (
                                            <Select.Option
                                                key={item.status_id}
                                                value={item.status_id}
                                            >
                                                {item.status}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                               

                                {/* <Form.Item
                                    name="publication_date"
                                    label="Date Publish"
                                    className="w-full"
                                    validateStatus={
                                        errors.publication_date ? "error" : ""
                                    }
                                    help={
                                        errors.publication_date
                                            ? errors.publication_date[0]
                                            : ""
                                    }
                                >
                                    <DatePicker className="w-full" />
                                </Form.Item> */}

                                {/* <Form.Item
                                    name="is_featured"
                                    valuePropName="checked"
                                    className="w-full"
                                    label="Featured"
                                    validateStatus={
                                        errors.is_featured ? "error" : ""
                                    }
                                    help={
                                        errors.is_featured
                                            ? errors.is_featured[0]
                                            : ""
                                    }
                                >
                                    <Checkbox>Featured Artlce</Checkbox>
                                </Form.Item> */}

                            </Flex>

                            {/* <Form.Item
                                name="is_submit"
                            >
                                <Input  placeholder="For Submit"/> {/* To visualize the field value }
                            </Form.Item> */}

                            <Form.Item
                                name="is_submit"
                                hidden
                            >
                                <Input placeholder="Year" />
                            </Form.Item>
                            {/* logic condition for buttons base on the roles */}
                            {id > 0
                                ? permissions.includes("posts.update") && (
                                    <Button
                                        onClick={()=>handleClickSubmit(0)}
                                        className="mt-4"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        type="primary"
                                    >
                                        Save Article
                                    </Button>
                                  )
                                : permissions.includes("posts.create") && (
                                    <>
                                        <Button
                                            onClick={()=>handleClickSubmit(0)}
                                            className="mt-4"
                                            icon={<SaveOutlined />}
                                            loading={loading}
                                            type="primary"
                                        >
                                            Save Article
                                        </Button>
                                       
                                    </>
                                )}

                                {permissions.includes("posts.submit-for-publishing") && (
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Button: {
                                                    defaultBg: 'green',
                                                    defaultColor: 'white',
                                                    defaultHoverBorderColor: 'green',
                                                    
                                                    defaultActiveColor: 'white',
                                                    defaultActiveBorderColor: '#1a8c12',
                                                    defaultActiveBg: '#1a8c12',

                                                    defaultHoverBg: '#379b30',
                                                    defaultHoverColor: 'white',
                                                }
                                            }
                                        }}>
                                        <Button
                                            className="mt-4 ml-2"
                                            onClick={()=>handleClickSubmit(1)}
                                            icon={<ProjectOutlined />}
                                            loading={loading}
                                        >
                                            Save and Submit
                                        </Button>
                                    </ConfigProvider>
                                )}
                                    
                        </Form>
                    </div>
                    {/* end input card */}

                    {/* card comment */}
                    {id > 0 && <PostComment className="flex-1" id={id} />}
                    {/* end card comment */}
                </div>
                {/* end card container */}
            </div>
            {/* card container */}
        </Authenticated>
    );
}
