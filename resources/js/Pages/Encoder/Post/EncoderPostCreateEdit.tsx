import React, { ReactNode, useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Bold,
  //CKBox,
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
import { UploadOutlined, SaveOutlined, ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";

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
  Category,
  PageProps,
  User,
  Quarter,

  Permission,
} from "@/types";


import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";

import dayjs from "dayjs";
import PostComment from "@/Components/Post/PostComment";
import PostLogComponent from "@/Components/Post/PostLog";
import { Post } from "@/types/post";
import EncoderLayout from "@/Layouts/EncoderLayout";
import form from "antd/es/form";

const dateFormat = (item: string): string => {
  return dayjs(item).format("MMM-DD-YYYY");
};


export default function EncoderPostCreateEdit({
  id,
  auth,
  post,
  ckLicense
}: {
  id: number,
  auth: PageProps,
  post: Post,
  ckLicense: string
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
      // const fileList = [
      //     {
      //         uid: "-1", // Unique identifier
      //         name: article.featured_image, // File name
      //         status: "done", // Initial status of the file
      //         url: `/storage/featured_images/${article.featured_image}`, // URL to display the image
      //         response: article.featured_image, // response, name from db
      //     },
      // ];

      form.setFields([
        { name: "title", value: post.title },
        { name: "description", value: post.description },
        { name: "excerpt", value: post.excerpt },
        { name: "status", value: post.status },
        { name: "source", value: post.source },

      ]);

      // console.log(moment(article.date_published, 'YYYY-MM-DD') );
    } catch (err) { }
  };

  const submit = (values: any) => {

    if (values.is_submit > 1 || values.status === 'submit') {
      modal.confirm({
        title: "Submit for Publishing!",
        content: <div>Are you sure you want to submit this for publishing?</div>,
        onOk() {
          executeSave(values)
        },
        onCancel() {
          setLoading(false)
        }
      });
    } else {
      executeSave(values)
    }
  };

  const executeSave = async (values: any) => {

    setLoading(true)
    setErrors({});

    if (id > 0) {
      try {
        const res = await axios.patch("/author/posts/" + id, values);
        if (res.data.status === "updated") {
          modal.info({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              getData()
              setLoading(false)

              if (values.is_submit > 0) {
                router.visit("/author/posts");
              }
            },
          });
        }
      } catch (err: any) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
          console.log(err.response.data);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.post("/author/posts", values);
        if (res.data.status === "saved") {
          //openNotification('bottomRight', 'Saved!', 'Article successfully save.')
          modal.info({
            title: "Saved!",
            content: <div>Article successfully saved.</div>,
            onOk() {
              router.visit("/author/posts");
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
  }

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

  const handleClickSubmit = (n: number) => {
    setLoading(true)

    form.setFieldsValue({
      is_submit: n
    });

    form.submit()

  }

  return (
    <>
      <Head title="Article" />

      {/* card container */}
      <div className="">
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
                excerpt: "",
                description: "",
                status: 'draft',
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
                  data={post?.description}
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
                    licenseKey: ckLicense,
                    // mention: {
                    //     // Mention configuration
                    // },
                    initialData: "",
                  }}
                />
              </Form.Item>

              <div className="flex">
                <Button
                  onClick={() => handleClickSubmit(0)}
                  icon={<SaveOutlined />}
                  loading={loading}
                  type="primary"
                >
                  Save Article
                </Button>

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
                    className="ml-2"
                    onClick={() => handleClickSubmit(1)}
                    icon={<ProjectOutlined />}
                    loading={loading}
                  >
                    Submit for Publishing
                  </Button>
                </ConfigProvider>

                <Button
                  danger
                  onClick={() => history.back()}
                  className="ml-auto"
                  icon={<ArrowLeftOutlined />}
                  loading={loading}
                  type="primary"
                >
                  BACK
                </Button>
              </div>

            </Form>
          </div>
          {/* end input card */}
        </div>
        {/* end card container */}
      </div>
      {/* card container */}
    </>
  );
}


EncoderPostCreateEdit.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
