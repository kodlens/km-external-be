import CardTitle from '@/Components/CardTitle'
import { Dostv, PaginateResponse } from '@/types'
import { App, Button, Dropdown, Pagination, Space, Table } from 'antd'
import Search from 'antd/es/input/Search'
import Column from 'antd/es/table/Column'
import axios, { AxiosError } from 'axios'
import { CheckCheck, CircleQuestionMark, Pencil, PlusIcon, Trash } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DostvVideo } from '@/types/dostv'
import { AxiosErrorResponse } from '@/types/axiosError'
import { PaginatedResponse } from '@/types/paginateResponse'
import ModalDostvVideosCreateEdit, { ModalDostvVideosCreateEditHandle } from './ModalDostvVideosCreateEdit'

const DostvVideosTab = () => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const modalRef = useRef<ModalDostvVideosCreateEditHandle>(null)

    const { notification, modal } = App.useApp();

    const { data, isFetching, error, refetch } = useQuery<
        PaginatedResponse<DostvVideo>, 
        AxiosError<AxiosErrorResponse>
    >({
        queryKey: ['dostVideos', page, perPage],
        queryFn: async () => {
            const params = [
                `title=${search}`,
                `perpage=${perPage}`,
                `page=${page}`,
                `sort_by=id.desc`
            ].join('&');

            const res = await axios.get<PaginatedResponse<DostvVideo>>(`/admin/page-sections/get-dostv-videos?${params}`);

            return res.data
        }
    });
 

    const onPageChange = (index: number, perPage: number) => {
        setPage(index)
        setPerPage(perPage)
    }


    const handleSetFeatured = (vid:DostvVideo) => {

        if(data?.data){
            axios.post(`/admin/page-sections/dostv-videos/set-featured/${vid.id}/${0}`).then(res=>{
                if(res.data.status === 'unfeatured'){
                    notification.success({
                        message: 'Unfeatured!',
                        description: 'DOSTv video set to unfeatured.'
                    })
                }
                refetch()
            })
        }else{

            axios.post(`/admin/page-sections/dostv-video/set-featured/${vid.id}/${1}`).then(res=>{
                if(res.data.status === 'featured'){
                    notification.success({
                        message: 'Set to Featured!',
                        description: 'Successfully set to featured DOSTv video.'
                    })
                }
                refetch()
            })

        } 
    }

    const handleDeleteClick = async (id: number) => {
        const res = await axios.delete('/admin/page-sections/dostv-videos/' + id);
        if (res.data.status === 'deleted') {
            notification.success({
                message: 'Deleted!',
                description: 'Video successfully deleted.'
            })
            refetch()
        }
    }

    return (
        <>
            <CardTitle title={'LIST OF DOSTv VIDEOS'} />

            {/* card body */}
            <div>
                <div className='mb-2 flex gap-2'>

                    <Search placeholder="Search..."
                        autoComplete='off'
                        enterButton="Search"
                        id="search"
                        onChange={(e) => setSearch(e.target.value)}
                        loading={isFetching}
                        onSearch={()=>refetch()} />
                </div>

                <div className='flex flex-col'>
                    
                    <Button 
                        icon={<PlusIcon size={16}/>}
                        type='primary'
                        className='ml-auto my-2'
                        onClick={ () => {
                            modalRef.current?.openModal(0)
                        }}
                    >
                        New
                    </Button>

                    <ModalDostvVideosCreateEdit onRefresh={refetch} ref={modalRef}/>


                    <Table dataSource={data?.data}
                        loading={loading}
                        rowKey={'id'}
                        pagination={false}>

                        <Column title="Id" dataIndex="id" />
                        <Column title="Title" dataIndex="title" key="title" />
                        <Column title="Link" dataIndex="link" key="link" />
                        <Column title="Order No." dataIndex="order_no" key="order_no" />

                        <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured) => (

                            is_featured ? (
                                <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

                            ) : (
                                <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                            )

                        )} />

                         <Column title="Active" dataIndex="active" key="active" render={(active) => (

                            active ? (
                                <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

                            ) : (
                                <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                            )

                        )} />

                        <Column title="Action" key="action"
                            render={(_, vid: DostvVideo) => (
                                <Space size="small">
                                    <Dropdown
                                        trigger={['click']}
                                        menu={{
                                            items: [
                                                {
                                                    label: 'Edit',
                                                    key: 'admin.page-sections.dostv.dost-youtube-videos.edit',
                                                    icon: <Pencil size={16} />,
                                                    onClick: () => modalRef.current?.openModal(vid.id ? vid.id : 0)
                                                },
                                                {
                                                    label: vid?.is_featured ? 'Unfeatured' : 'Set Featured',
                                                    key: 'admin.page-sections.dostv.dost-youtube-videos.set-featured',
                                                    icon: <CheckCheck size={16} />,
                                                    onClick: () => (
                                                        modal.confirm({
                                                            title: vid?.is_featured ? 'Unfeatured' : 'Set Featured',
                                                            icon: <CircleQuestionMark size={16} />,
                                                            content: 'Are you sure you want to set this to featured?',
                                                            okText: 'Yes',
                                                            cancelText: 'No',
                                                            onOk() {
                                                                handleSetFeatured(vid)
                                                            }
                                                        })),
                                                },
                                                {
                                                    type: 'divider'
                                                },
                                                {
                                                    label: 'Delete',
                                                    key: 'admin.dostvs.dostv-youtube-videos.delete',
                                                    icon: <Trash size={16} />,
                                                    onClick: () => (
                                                        modal.confirm({
                                                            title: 'Delete?',
                                                            icon: <CircleQuestionMark className='mr-2 text-red-600' />,
                                                            content: 'Are you sure you want to delete this data?',
                                                            okText: 'Yes',
                                                            cancelText: 'No',
                                                            onOk() {
                                                                handleDeleteClick(vid.id ? vid.id : 0)
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
                        />
                    </Table>

                    <Pagination className='mt-4'
                        onChange={onPageChange}
                        pageSize={5}
                        defaultCurrent={1}
                        total={total} />
                </div>

            </div>

        </>
    )
}

export default DostvVideosTab