import React, { ReactNode, useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

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

import { PageProps } from "@/types";


import axios from "axios";

import dayjs from "dayjs";

import { Post } from "@/types/post";
import EncoderLayout from "@/Layouts/EncoderLayout";
import form from "antd/es/form";
import Ckeditor from "@/Components/Ckeditor";



const EncoderPostCreateEdit = ({
  id,
  post,
  ckLicense
}: {
  id: number,
  auth: PageProps,
  post: Post,
  ckLicense: string
}) => {
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
        { name: "slug", value: post.alias },
        { name: "description", value: post.description },
        { name: "excerpt", value: post.excerpt },
        { name: "status", value: post.status },
        { name: "source", value: post.source },
        { name: "agency", value: post.agency },
        { name: "is_publish", value: post.is_publish },
      ]);

      // console.log(moment(article.date_published, 'YYYY-MM-DD') );
    } catch (err) { }
  };

  const submit = (values: Post) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch('/encoder/posts/' + id, values).then(res => {

        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              setLoading(false)
              router.visit("/encoder/posts");
            },
          });
        }
      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      })

    } else {
      axios.post('/encoder/posts', values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {
              setLoading(false)
              router.visit("/encoder/posts");
            },
          });
        }
      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      })
    }

  };


  //for dynamic width


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
          <div className="bg-white p-6 mx-2 md:max-w-4xl w-full" >
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
                slug: '',
                excerpt: "",
                description: "",
                status: 'draft',
                is_publish: 0,
                source: 'km-stii',
                agency: '',
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
                <Ckeditor post={post} form={form} ckLicense={ckLicense} />
              </Form.Item>

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
                  <Select
                    options={[
                      {
                        label: 'Draft',
                        value: 'draft'
                      },
                      {
                        label: 'Submit for Publishing',
                        value: 'submit'
                      },
                    ]}
                  >

                  </Select>
                </Form.Item>
              </Flex>

              <div className="flex">
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
                    htmlType="submit"
                    icon={<ProjectOutlined />}
                    loading={loading}
                  >
                    Save Post/Article
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

export default EncoderPostCreateEdit;

EncoderPostCreateEdit.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
