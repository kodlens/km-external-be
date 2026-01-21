import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Post, PageProps, User, Status } from '@/types'
import { Head, router } from '@inertiajs/react'

import {
  EditOutlined,
  EyeOutlined,
  PicRightOutlined
} from '@ant-design/icons';

import {
  Space, Table,
  Pagination, Button, Modal,
  Form, Input, Select, Checkbox,
  notification,
  Dropdown,
  MenuProps,
  App,
  InputNumber
} from 'antd';


import React, { KeyboardEvent, useEffect, useState } from 'react'
import axios from 'axios';


const { Column } = Table;

interface PostResponse {
  data: any[]
  //data: Post[];
  total: number;
}

interface Option {
  label: string;
  value: string;
}


import dayjs from 'dayjs';
import ArticleView from '@/Components/Post/ArticleView';
import CardTitle from '@/Components/CardTitle';
import AdminLayout from '@/Layouts/AdminLayout';

const dateFormat = (item: Date): string => {
  return dayjs(item).format('MMM-DD-YYYY')
}

const AdminPostFeaturedIndex = (
  { auth, statuses, permissions }:
    PageProps) => {

  const { modal } = App.useApp();

  const [form] = Form.useForm();

  const [data, setData] = useState<Post[]>([]);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [errors, setErrors] = useState<any>({});

  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const createMenuItems = (paramPermissions: string[], data: Post) => {

    const items: MenuProps['items'] = [];

    items.push({
      label: 'Update Order No.',
      key: 'admin.posts-edit',
      icon: <EditOutlined />,
      onClick: () => handleUpdateOrderNo(data.id),
    }, {
      label: 'Featured',
      key: 'admin.posts-featured',
      icon: <PicRightOutlined />,
      onClick: () => {
        axios.post('/admin/posts-featured/' + data.id).then(res => {
          if (res.data.status === 'featured') {
            modal.info({
              title: 'Featured!',
              content: 'Successfully added to featured articles.'
            })
            loadAsync(search, perPage, page)
          }
        })
      },
    }, {
      label: 'Unfeatured',
      key: 'admin.posts-unfeatured',
      icon: <PicRightOutlined />,
      onClick: () => {
        axios.post('/admin/posts-unfeatured/' + data.id).then(res => {
          if (res.data.status === 'unfeatured') {
            modal.info({
              title: 'Unfeatured!',
              content: 'Remove from featured articles.'
            })
            loadAsync(search, perPage, page)
          }
        })
      },
    }, {
      label: 'View',
      key: 'admin.posts-view',
      icon: <EyeOutlined />,
      onClick: () => {
        modal.info({
          width: 1024,
          title: 'Article Display',
          content: (
            <ArticleView post={data} className='' />
          ),
          onOk() { },
        });
      },
    }
    );

    return items;
  }


  const loadAsync = async (
    search: string,
    perPage: number,
    page: number
  ) => {

    const params = [
      `perpage=${perPage}`,
      `search=${search}`,
      `page=${page}`,
      `status=${status}`
    ].join('&');

    try {
      const res = await axios.get<PostResponse>(`/admin/get-post-featured?${params}`);
      setData(res.data.data)
      setTotal(res.data.total)
    } catch (err) {

    }
  }

  useEffect(() => {

    loadAsync('', perPage, page);


  }, [page])

  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }

  //truncate display content on table
  const truncate = (text: string, limit: number) => {
    if (text.length > 0) {
      const words = text.split(' ');
      if (words.length > limit) {
        return words.slice(0, limit).join(' ') + '...';
      }
      return text;
    } else {
      return ''
    }
  }

  const handleUpdateOrderNo = (id: number) => {
    //router.visit('/admin/posts/' + id + '/edit');
    setId(id)
    setOpen(true)
  }

  const onFinish = (value: any) => {
    setLoading(true)
    console.log(value)
    setOpen(false)
    axios.post('/admin/post-featured-update-order-no', {
      order_no: value.order_no,
      post_id: id
    }).then(res => {
      setLoading(false)
      if (res.data.status === 'updated') {

        notification.success({
          message: 'UPDATED!',
          description: 'Order no. successfully updated.',
          placement: 'topRight',
        });
        loadAsync(search, perPage, page)
      }
    }).catch(err => {
      setLoading(false)
      notification.error({
        message: 'ERROR!',
        description: err.response.data.error,
        placement: 'topRight',
      });
    })
  }


  const handSearchClick = () => {
    loadAsync(search, perPage, page);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter')
      handSearchClick()
  }

  /**handle error image */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/no-img.png';
  }

  return (

    <>
      <Head title="FEATURED POST/ARTICLE"></Head>

      <div className='flex mt-10 justify-center items-center'>
        {/* card */}
        <div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]'>
          {/* card header */}
          <CardTitle title="LIST OF FEATURED ARTICLES" />

          {/* card body */}

          <div className='flex gap-2 mb-2'>

            <Input placeholder="Search Title"
              onKeyDown={handleKeyDown}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type='primary' onClick={handSearchClick}>SEARCH</Button>
          </div>

          {/* <div className='flex flex-end my-2'>
						<Button className='ml-auto'
							icon={<FileAddOutlined />}
							type="primary" onClick={handClickNew}>
							NEW
						</Button>
					</div> */}

          <div className='text-red-500'>
            Only the top 5 articles will be displayed.
          </div>
          <div>


            <Table dataSource={data}
              loading={loading}
              rowKey={(data) => data.id}
              pagination={false}>

              <Column title="Img" dataIndex="featured_image"
                render={(featured_image) => (
                  (
                    <div className="h-[40px] w-[40px]">
                      <img src={`/storage/featured_images/${featured_image}`}
                        onError={handleImageError} />
                    </div>
                  )

                )} />

              <Column title="Id" dataIndex="id" />
              <Column title="Title" dataIndex="title" key="title" />
              <Column title="Excerpt"
                dataIndex="excerpt"
                key="excerpt"
                render={(excerpt) => (
                  <span>{excerpt ? truncate(excerpt, 10) : ''}</span>
                )}
              />

              {/* <Column title="Author" dataIndex="author" key="author"
								render={(author:{author:string}) => {
									return (
										<>
											{author?.author}
										</>
									)
								}}
							/> */}

              <Column title="Publication Date" dataIndex="publication_date" key="publication_date"
                render={(publication_date) => {
                  return (
                    <>
                      {publication_date && dateFormat(publication_date)}
                    </>
                  )
                }}
              />

              <Column title="Status" dataIndex="status" key="status" render={(status) => {
                return (
                  <div>
                    {status === 'submit' && (
                      <div className='bg-green-300 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                        SUMIT FOR PUBLISHING
                      </div>

                    )}
                    {status === 'publish' && (
                      <div className='bg-green-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                        PUBLISHED
                      </div>
                    )}
                    {status === 'unpublish' && (
                      <div className='bg-red-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                        UNPUBLISHED
                      </div>
                    )}

                    {status === 'draft' && (
                      <div className='bg-orange-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                        DRAFT
                      </div>
                    )}

                    {status === 'return' && (
                      <div className='bg-red-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                        RETURN TO AUTHOR
                      </div>
                    )}

                  </div>
                )
              }}
              />

              <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured) => (

                is_featured ? (
                  <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

                ) : (
                  <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                )

              )} />

              <Column title="Order No" dataIndex="order_no" />



              <Column title="Action" key="action"
                render={(_, data: Post) => (
                  <Space size="small">
                    <Dropdown  trigger={['click']}
                               menu={{items: createMenuItems(permissions, data) }} >
                      <Button type='primary'>
                        <Space>
                          ...
                        </Space>
                      </Button>

                    </Dropdown>

                  </Space>
                )}
              />
            </Table>

            <Pagination className='my-10'
              onChange={onPageChange}
              defaultCurrent={1}
              total={total} />
          </div>
        </div>
        {/* card */}

      </div>



      {/* Modal */}
      <Modal
        open={open}
        title="ORDER NO. INFORMATION"
        okText="Update"
        cancelText="Close"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            autoComplete="off"
            initialValues={{
              order_no: 0,
            }}
            clearOnDestroy
            onFinish={(values) => onFinish(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="order_no"
          label="Order No."
          validateStatus={errors.order_no ? "error" : ""}
          help={errors.order_no ? errors.order_no[0] : ""}
        >
          <InputNumber type='number' max={6} className='w-full' placeholder="Order No." />
        </Form.Item>

      </Modal>

    </>
  )
}

AdminPostFeaturedIndex.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminPostFeaturedIndex;
