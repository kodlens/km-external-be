import CardTitle from '@/Components/CardTitle'
import { AxiosErrorResponse } from '@/types/axiosError'
import { DostvVideo } from '@/types/dostv'
import { PaginatedResponse } from '@/types/paginateResponse'
import { useQuery } from '@tanstack/react-query'
import { App, Button, Dropdown, Pagination, Table } from 'antd'
import Column from 'antd/es/table/Column'
import axios, { AxiosError } from 'axios'
import { RefreshCcw } from 'lucide-react'
import {  useState } from 'react'

const DostvYoutubeFeaturedTab = ( ) => {

  const [search, setSearch] = useState('')
  const [perPage, setPerPage] = useState(5)
  const [page, setPage] = useState(1)

  const { notification, modal } = App.useApp();


    const { data, isFetching, error, refetch } = useQuery<
        PaginatedResponse<DostvVideo>, 
        AxiosError<AxiosErrorResponse>
    >({
        queryKey: ['dostVideos', page, perPage],
        queryFn: async () => {
            const params = new URLSearchParams({
                perpage: perPage.toString(),
                page: page.toString(),
                search: search.toString(),
                sort_by: 'id.desc'
            })

            const res = await axios.get<PaginatedResponse<DostvVideo>>(`/admin/page-sections/get-featured-dostv-videos?${params}`);

            return res.data
        }
    });

    const onPageChange = (index: number, perPage: number) => {
        setPage(index)
    }

    return (
        <>
            <CardTitle title="LIST OF DOSTv FEATURED VIDEOS" />
            <div className='flex'>
                <Button icon={<RefreshCcw size={16}/>} className='ml-auto my-2'
                    onClick={()=>refetch()}></Button>
            </div>
            <div>
                <Table dataSource={data  ? data.data : []}
                    loading={isFetching}
                    rowKey={'id'}
                    pagination={false}>

                    <Column title="Id" dataIndex="id" />
                    <Column title="Title" dataIndex="title" key="title" />
                    <Column title="Lnk" dataIndex="link" key="link" />
                    <Column title="Order No." dataIndex="order_no" key="order_no" />
                    {/* <Column title="Banner" dataIndex="banner" key="banner" render={(banner) => (
                        <div>
                            <img src={`/storage/dostv/banners/${banner}`} width={50} />
                        </div>
                    )} /> */}
                    <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured) => (
                        is_featured ? (
                            <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

                        ) : (
                            <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                        )
                    )} />

                    {/* <Column title="Action" key="action"
                        render={(_, data: any) => (

                            <Space size="small">

                                <Dropdown
                                    trigger={['click']}
                                    menu={{
                                        items: [
                                            {
                                                label: 'Edit',
                                                key: 'admin.page-sections.dostv.dost-banner.edit',
                                                icon: <Pencil />,
                                                onClick: () => handleEditClick(data.id),
                                            },
                                         
                                            {
                                                label: 'View Banner',
                                                key: 'admin.page.banner.view-banner-photo',
                                                icon: <EyeIcon size={16} />,
                                                onClick: () => (
                                                    modal.info({
                                                        title: 'Banner',
                                                        content: (
                                                            <div>
                                                                <hr />
                                                                <img src={`/storage/dostv/banners/${data.banner}`} />
                                                                <hr />
                                                            </div>
                                                        ),
                                                    })
                                                ),
                                            },
                                            {
                                                type: 'divider'
                                            },
                                            {
                                                label: 'Delete',
                                                key: 'admin.banner-delete',
                                                icon: <Trash size={16} />,
                                                onClick: () => (
                                                    modal.confirm({
                                                        title: 'Delete?',
                                                        icon: <CircleQuestionMark />,
                                                        content: 'Are you sure you want to delete this data?',
                                                        okText: 'Yes',
                                                        cancelText: 'No',
                                                        onOk() {
                                                            handleDeleteClick(data.id)
                                                        }
                                                    })),
                                            },
                                        ]
                                    }}>
                                    <Button type='primary'>
                                        <Space>
                                            ...
                                        </Space>
                                    </Button>
                                </Dropdown>

                            </Space>
                        )}
                    /> */}
                </Table>

                <Pagination className='mt-4'
                    onChange={onPageChange}
                    pageSize={5}
                    defaultCurrent={1}
                    total={data?.total} />
             
            </div>
        </>
    )
}

export default DostvYoutubeFeaturedTab