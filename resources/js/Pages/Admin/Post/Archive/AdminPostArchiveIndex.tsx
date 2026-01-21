import { Post, PageProps, User, Status } from '@/types'
import { Head, router } from '@inertiajs/react'

import {
 
  DeleteOutlined,
  EyeOutlined, PaperClipOutlined,
} from '@ant-design/icons';

import {
  Card, Space, Table,
  Pagination, Button,
  Form, Input, Select,
  Dropdown,
  MenuProps,
  App
} from 'antd';


import React, { KeyboardEvent, useEffect, useState } from 'react'
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

const dateFormat = (item: Date): string => {
  return dayjs(item).format('MMM-DD-YYYY')
}

const AdminPostArchiveIndex = (
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

  const createMenuItems = (data: Post) => {

    const items: MenuProps['items'] = [];

    items.push({
      label: 'Draft',
      key: 'admin.posts-draft',
      icon: <PaperClipOutlined />,
      onClick: () => {
        axios.post('/admin/posts-draft/' + data.id).then(res => {
          if (res.data.status === 'draft') {
            modal.info({
              title: 'Draft!',
              content: 'Successfully draft.'
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
    }, {
      type: 'divider'
    },
      {
        label: 'Pemanently Delete',
        key: 'admin.posts-destroy',
        icon: <DeleteOutlined />,
        onClick: () => handleDeleteClick(data.id),
      });

    // Add 'Edit' if the user has edit permission
    // if (paramPermissions.includes('posts.edit')) {

    // }

    // // Add 'Trash' if the user has trash permission
    // if (paramPermissions.includes('posts.trash')) {
    // 	items.push();
    // }

    // if (paramPermissions.includes('posts.archive')) {
    // 	items.push();
    // }


    // if (paramPermissions.includes('posts.pending')) {
    // 	items.push();
    // }

    // if (paramPermissions.includes('posts.draft')) {
    // 	items.push();
    // }

    // if (paramPermissions.includes('posts.published')) {
    // 	items.push();
    // }

    // if (paramPermissions.includes('posts.submit-for-publishing')) {
    // 	items.push(
    //     );
    // }

    //open for all
    //items.push();

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
      const res = await axios.get<PostResponse>(`/admin/get-post-archives?${params}`);
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


  const handClickNew = () => {
    router.visit('/admin/posts/create');
  }
  const handleEditClick = (id: number) => {
    router.visit('/admin/posts/' + id + '/edit');
  }

  // const handleTrashClick = (id:number) => {
  // 	modal.confirm({
  // 		title: 'Trash?',
  // 		content: 'Are you sure you want to move to trash this post?',
  // 		onOk: async ()=>{
  // 			const res = await axios.post('/admin/posts-trash/' + id);
  // 			if(res.data.status === 'trashed'){
  // 				loadAsync(search, perPage, page);
  // 			}
  // 		}
  // 	})
  // }

  const handleDeleteClick = (id: number) => {
    modal.confirm({
      title: 'Delete?',
      content: 'Are you sure you want to delete this post?',
      onOk: async () => {
        setLoading(true)
        const res = await axios.delete('/admin/posts/' + id);
        if (res.data.status === 'deleted') {
          loadAsync(search, perPage, page);
          setLoading(false)
        }
      }
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
            <Select
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
            />

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
              total={total} />
          </div>
        </div>
        {/* card */}

      </div>

    </>
  )
}


AdminPostArchiveIndex.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminPostArchiveIndex;