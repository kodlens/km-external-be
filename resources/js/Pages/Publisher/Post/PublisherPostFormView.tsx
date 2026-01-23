import { ReactNode, useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import {
  App,
  Button,
  Form,
  Input,
  Select,
  Flex,
  ConfigProvider,
  DatePicker,
} from "antd";
import dayjs from 'dayjs';
import { PageProps } from "@/types";
import axios from "axios";

import { Post } from "@/types/post";
import form from "antd/es/form";
import Ckeditor from "@/Components/Ckeditor";
import SelectSubjects from "@/Components/SelectSubjects";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


const PublisherPostFormView = ({
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

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { message, modal, notification } = App.useApp();


  useEffect(() => {
    //loadCategories()
    if (id > 0) {
      getData();
  }
  }, []);

  const getData = () => {
    try {
      form.setFields([
        { name: "title", value: post.title },
        { name: "slug", value: post.alias },
        { name: "description", value: post.description },
        { name: "excerpt", value: post.excerpt },
        { name: "status", value: post.status },
        { name: "source_url", value: post.source_url },
        { name: "agency", value: post.agency },
        { name: "author_name", value: post.author_name },
        { name: "is_publish", value: post.is_publish },
        { name: "subjects", value: post.subjects },
        { name: "publish_date", value: post.publish_date ?  dayjs(post.publish_date) : null },
      ]);
    } catch (err) { }
  };

  const submit = (values: Post) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch('/publisher/posts/' + id, values).then(res => {

        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              router.visit("/publisher/posts");
            },
          });
        }
        setLoading(false)

      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      })

    } else {
      axios.post('/publisher/posts', values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {

              router.visit("/publisher/posts");
            },
          });
        }
        setLoading(false)
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
                source_url: '',
                agency: '',
                author_name: '',
                publish_date: null,
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
                  name="author_name"
                  label="Author Name"
                  className="w-full"
                  validateStatus={errors.author_name ? "error" : ""}
                  help={errors.author_name ? errors.author_name[0] : ""}
                >
                  <Input placeholder="Author Name" />
                </Form.Item>

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

              <Flex gap={`middle`}>
                <Form.Item
                  name="source_url"
                  label="Source"
                  className="w-full"
                  validateStatus={errors.source_url ? "error" : ""}
                  help={errors.source_url ? errors.source_url[0] : ""}
                >
                  <Input placeholder="Source" />
                </Form.Item>

                <Form.Item
                  name="agency"
                  label="Agency"
                  className="w-full"
                  validateStatus={errors.agency ? "error" : ""}
                  help={errors.agency ? errors.agency[0] : ""}
                >
                  <Input placeholder="Agency" />
                </Form.Item>

                <Form.Item
                  name="publish_date"
                  label="Publish Date"
                  className="w-full"
                  validateStatus={errors.publish_date ? "error" : ""}
                  help={errors.publish_date ? errors.publish_date[0] : ""}
                >
                  <DatePicker className="w-full" placeholder="Publish Date" />
                </Form.Item>
              </Flex>

              <div className="my-6 border-t p-6 bg-gray-50 rounded-md">
                <div className="font-bold mb-4">Manage Subjects/Subject Headings</div>
                { errors && errors.subjects ? (
                  <div className="mb-4 text-red-600">{errors.subjects[0]}</div>
                ) : null }
                <SelectSubjects form={form}/>

              </div>

              <div className="flex mb-4 mt-6">
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

export default PublisherPostFormView;

PublisherPostFormView.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
);


