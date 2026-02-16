import { Status } from '@/types'
import { Head, router } from '@inertiajs/react'

import {

  DeleteOutlined,
  EyeOutlined, PaperClipOutlined,
} from '@ant-design/icons';

import {
  Space, Table,
  Pagination, Button,
  Form, Input, Select,
  Dropdown,
  MenuProps,
  App
} from 'antd';


import React, { KeyboardEvent, useState } from 'react'
import axios from 'axios';


const { Column } = Table;

interface PostResponse {
  data: any[]
  //data: Post[];
  total: number;
}

import dayjs from 'dayjs';
import ArticleView from '@/Components/Post/ArticleView';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTitle from '@/Components/CardTitle';
import { Post } from '@/types/info';
import { useQuery } from '@tanstack/react-query';

const dateFormat = (item: Date): string => {
  return dayjs(item).format('MMM-DD-YYYY')
}

const AdminPostArchiveIndex = () => {

  const { modal } = App.useApp();
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const createMenuItems = (data: Post) => {

    const items: MenuProps['items'] = [];

    items.push({
      label: 'Unarchive',
      key: 'admin.posts-unarchived',
      icon: <PaperClipOutlined />,
      onClick: () => {
        axios.post('/admin/post-unarchive/' + data.id).then(res => {
          if (res.data.status === 'unarchive') {
            modal.success({
              title: 'Unarchived!',
              content: 'The post/article was successfully unarchived.'
            })
            refetch();
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
    }, {
      type: 'divider'
    },
      {
        label: 'Pemanently Delete',
        key: 'admin.posts-destroy',
        icon: <DeleteOutlined />,
        onClick: () => handleDeleteClick(data.id),
      });
    return items;
  }

  const { data, isFetching, refetch } = useQuery({
      queryKey: ['posts', search, perPage, page],
      queryFn: async () => {
          const params = [
              `perpage=${perPage}`,
              `search=${search}`,
              `page=${page}`,
          ].join('&');
          const res = await axios.get<PostResponse>(`/admin/get-post-archives?${params}`);
          return res.data
      }
  })

  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }


  const handClickNew = () => {
    router.visit('/admin/posts/create');
  }
  const handleEditClick = (id: number) => {
    router.visit('/admin/posts/' + id + '/edit');
  }

  const handleDeleteClick = (id: number) => {
    modal.confirm({
      title: 'Delete?',
      content: 'Are you sure you want to delete this post/article?',
      onOk: async () => {

        const res = await axios.delete('/admin/posts/' + id);
        if (res.data.status === 'deleted') {
          refetch();
        }
      }
    })
  }

  const handSearchClick = () => {
    refetch();
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
      <Head title="POST/ARTICLE"></Head>

      <div className='flex mt-10 justify-center items-center'>
        {/* card */}
        <div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]'>
          {/* card header */}
          <CardTitle title="LIST OF ARTICLES" />
          {/* card body */}
          <div className='flex gap-2 mb-2'>
            {/* <Select
              style={{
                width: '200px'
              }}

              defaultValue=""
              options={[
                { label: 'All', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Return to Author', value: 'return' },
                { label: 'Submit for Publishing', value: 'submit' },
                { label: 'Publish', value: 'publish' },
                { label: 'Unpublish', value: 'unpublish' },
              ]}
            /> */}

            <Input placeholder="Search Title"
              onKeyDown={handleKeyDown}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type='primary' onClick={handSearchClick}>SEARCH</Button>
          </div>

          <div>

            <Table dataSource={data ? data.data : []}
              loading={isFetching}
              rowKey={(data) => data.id}
              pagination={false}>

              <Column title="Id" dataIndex="id" />
              <Column title="Title" dataIndex="title" key="title" />

              <Column title="Publication Date" dataIndex="publish_date" key="publish_date"
                render={(publish_date) => {
                  return (
                    <>
                      {publish_date && dateFormat(publish_date)}
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
              <Column title="Action" key="action"
                render={(_, data: Post) => (
                  <Space size="small">
                    <Dropdown.Button menu={{ items: createMenuItems(data) }} type='primary'>
                      Options
                    </Dropdown.Button>

                  </Space>
                )}
              />
            </Table>

            <Pagination className='my-10'
              onChange={onPageChange}
              defaultCurrent={1}
              total={data?.total} />
          </div>
        </div>
        {/* card */}

      </div>

    </>
  )
}


AdminPostArchiveIndex.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminPostArchiveIndex;
