
import {  PageProps, User, Status } from '@/types'
import { Head, router } from '@inertiajs/react'

import {
  FileAddOutlined, DropboxOutlined,
  DownOutlined,
  DeleteOutlined, EditOutlined,
  EyeOutlined, UserOutlined,
  ProjectOutlined, DeliveredProcedureOutlined, PaperClipOutlined,
  PicRightOutlined
} from '@ant-design/icons';

import {
  Card, Space, Table,
  Pagination, Button,
  Input, Select,
  Dropdown,
  MenuProps,
  App
} from 'antd';


import React, { KeyboardEvent, ReactNode, useState } from 'react'
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
import { AnyObject } from 'antd/es/_util/type';
import ArticleView from '@/Components/Post/ArticleView';
import EncoderLayout from '@/Layouts/EncoderLayout';
import { dateFormat, truncate } from '@/helper/helperFunctions';
import { Post } from '@/types/post';
import { useQuery } from '@tanstack/react-query';



export default function EncoderPostIndex(
  { auth, permissions }:
    PageProps) {

  const { modal } = App.useApp();

  const [status, setStatus] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const createMenuItems = (post: Post) => {

    const items: MenuProps['items'] = [];

    if (post.status === 'draft' || post.status === 'return') { //published (7)
      items.push(
        {
          label: 'Edit',
          key: '1',
          icon: <EditOutlined />,
          onClick: () => handleEditClick(post.id),
        },
        {
          label: 'Trash',
          key: '2',
          icon: <DeleteOutlined />,
          onClick: () => handleTrashClick(post.id)
        },
        {
          label: 'Draft',
          key: '5',
          icon: <PaperClipOutlined />,
          onClick: () => {

            axios.post('/author/posts-draft/' + post.id).then(res => {
              if (res.data.status === 'draft') {
                modal.info({
                  title: 'Draft!',
                  content: 'Successfully draft.'
                })
                refetch()

              }
            })
          },
        },
        {
          key: 'posts.submit-for-publishing',
          icon: <ProjectOutlined />,
          label: 'Submit for Publishing',
          onClick: () => {

            axios.post('/author/posts-submit-for-publishing/' + post.id).then(res => {
              if (res.data.status === 'submit-for-publishing') {
                modal.info({
                  title: 'Submitted!',
                  content: 'Successfully submitted.'
                })

                refetch()
              }
            })
          },
        });
    }


    items.push({
      label: 'View',
      key: '7',
      icon: <EyeOutlined />,
      onClick: () => {
        modal.info({
          width: 1024,
          title: 'Article',
          content: (
            <ArticleView post={post} className="" />
          ),
          onOk() { },
        });
      },
    })

    return items;
  }


  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['posts', { perPage, page }],
    queryFn: async () => {
      const params = [
      `perpage=${perPage}`,
      `search=${search}`,
      `page=${page}`,
      `status=${status}`
    ].join('&');
      const res = await axios.get(`/encoder/get-posts?${params}`);
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const onPageChange = (index: number) => {
    setPage(index)
  }


  const handleStatusChange = (value: string) => {
    setStatus(value)
    //loadAsync(search, perPage, page)
  }



  const handClickNew = () => {
    router.visit('/encoder/posts/create');
  }
  const handleEditClick = (id: number) => {
    router.visit('/encoder/posts/' + id + '/edit');
  }
  const handleTrashClick = (id: number) => {

    modal.confirm({
      title: 'Trash?',
      content: 'Are you sure you want to move to trash this post?',
      onOk: async () => {
        const res = await axios.post('/encoder/posts-trash/' + id);
        if (res.data.status === 'trashed') {
            refetch()

        }
      }
    })
  }
  const handleSoftDelete = (id: number) => {
    modal.confirm({
      title: 'Delete?',
      content: 'Are you sure you want to delete this post?',
      onOk: async () => {
        const res = await axios.post('/author/posts-soft-delete/' + id);
        if (res.data.status === 'soft_deteled') {
            refetch()
        }
      }
    })
  }

  const handSearchClick = () => {
    refetch()
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
      <Head title="Post/Articles"></Head>

      <div className='flex w-full justify-center items-center'>
        {/* card */}
        <div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1300px]'>
          {/* card header */}
          <div className="font-bold text-lg mb-4">LIST OF POST/ARTICLES</div>

          {/* card body */}

          <div className='flex gap-2 mb-2'>
            <Select
              onChange={handleStatusChange}
              style={{
                width: '200px'
              }}

              defaultValue=""
              options={[
                { label: 'All', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Submit for Publishing', value: 'submit' }
              ]}
            />

            <Input placeholder="Search Title"
              onKeyDown={handleKeyDown}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type='primary' onClick={handSearchClick}>SEARCH</Button>
          </div>

          {/* {
						permissions.includes('posts.create') && (

					)} */}
          <div className='flex flex-end my-2'>
            <Button className='ml-auto'
              icon={<FileAddOutlined />}
              type="primary" onClick={handClickNew}>
              NEW
            </Button>
          </div>

          <div>

            <Table dataSource={data?.data}
              loading={isFetching}
              rowKey={(data: Post) => data.id}
              pagination={false}>

              <Column title="Id" dataIndex="id" />
              <Column title="Title" dataIndex="title" key="title" />
              {/* <Column title="Excerpt"
                dataIndex="excerpt"
                key="excerpt"
                render={(excerpt) => (
                  <span>{excerpt ? truncate(excerpt, 10) : ''}</span>
                )}
              /> */}
              <Column title="Description"
                dataIndex="description_text"
                key="description_text"
                render={(description_text) => (
                  <span>{description_text ? truncate(description_text, 50) : ''}</span>
                )}
                  />

              <Column title="Publication Date"
                dataIndex="publish_date"
                key="publish_date"
                render={(publish_date) => (
                  <>
                    { publish_date && dateFormat(publish_date)}
                  </>
                )}
              />

              {/* <Column title="Status" dataIndex="status" key="status" render={(status) => (

                <div>
                  {status === 'submit' && (
                    <div className='bg-green-300 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      SUBMIT FOR PUBLISHING
                    </div>

                  )}
                  {status === 'publish' && (
                    <div className='bg-green-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      PUBLISHED
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

              )}
              /> */}

              <Column
                title="Date Created"
                dataIndex="created_at"
                key="created_at"
                render={(created_at) => (
                  <>
                    {created_at &&
                      dateFormat(created_at)}
                  </>
                )}
              />

              <Column title="Action" key="action"
                render={(_, data: Post) => (
                  <Space size="small">
                    <Dropdown trigger={['click']} menu={{ items: createMenuItems(data) }} >
                      <Space>
                        <Button type='primary'>...</Button>
                      </Space>
                    </Dropdown>
                  </Space>
                )}
              />
            </Table>

            <Pagination className='mt-4'
              onChange={() => {
                console.log('sample to hoy');
                onPageChange(page)
              }}
              defaultCurrent={1}
              total={data?.total} />
          </div>
        </div>
        {/* card */}

      </div>

    </>
  )
}


EncoderPostIndex.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
