import { statusDropdownMenu } from '@/helper/statusMenu';
import { PageProps, User } from '@/types';
import { Form, Input, Flex, Select, DatePicker, Button, ConfigProvider, FormInstance, App, AutoComplete } from 'antd';

import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import Ckeditor from './Ckeditor';
import SelectSubjects from './SelectSubjects';
import { Info } from '@/types/info';
import { Author } from '@/types/author';
import { Agency } from '@/types/agency';
import { Region } from '@/types/region';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { SelectAgency } from './SelectAgency';
import AgencyAutoComplete from './AgencyAutoComplete';


export interface CreateEditProps {
  id: number,
  auth: PageProps,
  info: Info,
  ckLicense: string,
  authors: Author[],
  agencies: Agency[],
  regions: Region[],
  tags: string[],
  uri: string
}


const CreateEditArticle = ({
  id,
  auth,
  info,
  ckLicense,
  agencies,
  regions,
  //regionalOffices,
  authors,
  tags,
  uri
}: CreateEditProps) => {

  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { message, modal } = App.useApp();

  const submit = (values: Info) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch(`${uri}/${id}`, values).then(res => {

        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              router.visit(`${uri}`);
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
      axios.post(`${uri}`, values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {

              router.visit(`${uri}`);
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

  const handleClassification = () => {
    setLoading(true)
    const content = form.getFieldValue("description");
    console.log(content);

    axios.post("/classify-article", { content: content }).then((res) => {
      console.log(res.data);
      setLoading(false)

    })

  }


  const getData = () => {
    try {
      form.setFields([
        { name: "title", value: info.title },
        { name: "slug", value: info.alias },
        { name: "description", value: info.description },
        { name: "excerpt", value: info.excerpt },
        { name: "status", value: info.status },
        { name: "source_url", value: info.source_url },
        { name: "agency", value: info.agency },
        { name: "author_name", value: info.author_name },
        { name: "is_publish", value: info.is_publish },
        { name: "subjects", value: info.subjects },
        { name: "publish_date", value: info.publish_date ? dayjs(info.publish_date) : null },
      ]);

    } catch (err) { }
  };


  return (
    <div className="bg-white p-6 mx-2 md:max-w-7xl w-full" >

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

        <div className="flex lg:flex-row-reverse flex-col-reverse gap-4">

          <div className="w-full lg:w-1/3">
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
                  options={statusDropdownMenu((auth.user as User).role)}
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

              {/* <AgencyAutoComplete agencies={agencies} /> */}

              <Form.Item
                name="agency"
                label="Agency"
                className="w-full"
                validateStatus={errors.agency ? "error" : ""}
                help={errors.agency ? errors.agency[0] : ""}
              >
                {/* <Select options={agencies ? agencies.map(item => ({ value: item.code, label: item.code })) : [] }  allowClear/> */}
                <AgencyAutoComplete agencies={agencies} />
              </Form.Item>

            </Flex>

            <Form.Item
              name="publish_date"
              label="Publish Date"
              className="w-full"
              validateStatus={errors.publish_date ? "error" : ""}
              help={errors.publish_date ? errors.publish_date[0] : ""}
            >
              <DatePicker className="w-full" placeholder="Publish Date" />
            </Form.Item>

          </div>

          {/* CKEditor */}
          <div className="w-full lg:w-2/3">

            {/* EDITOR CK WYSIWYG */}
            <div className="min-h-[300px] ">
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
                <Ckeditor post={info || undefined} form={form} ckLicense={ckLicense} />
              </Form.Item>
            </div>

          </div>

        </div>
        {/* flex contaner */}

        <div>
          <Button
            type="primary"
            onClick={() => {
              handleClassification();
            }}>
            Classify
          </Button>
        </div>
        {/* <KmClassifier /> */}

        <div className="my-6 border-t p-6 bg-gray-50 rounded-md">
          <div className="font-bold mb-4">Manage Subjects/Subject Headings</div>
          {errors && errors.subjects ? (
            <div className="mb-4 text-red-600">{errors.subjects[0]}</div>
          ) : null}
          <SelectSubjects form={form} />

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
  )
}

export default CreateEditArticle
