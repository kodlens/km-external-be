
import { Banner, PageProps, PaginateResponse } from '@/types';
import { App, Button, Dropdown, Input, message, Pagination, Popconfirm, Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'


import { FileAddOutlined, 
    DeleteOutlined, EditOutlined, 
    QuestionCircleOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Check, CheckCheck, EyeIcon, ThumbsUp, ThumbsUpIcon, Trash } from 'lucide-react';
import CardTitle from '@/Components/CardTitle';

const { Column } = Table;
const { Search } = Input;

const BannerIndex = ( { auth } : PageProps) => {

    //console.log('how many times this DOM rendered');

    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [data, setData] = useState<Banner[]>([])

    const { notification, modal } = App.useApp();

    const loadAsync = async () => {

        setLoading(true)
        const params = [
            `search=${search}`,
            `perpage=${perPage}`,
            `page=${page}`,
            `sort_by=id.desc`
        ].join('&');

		try{
			const res = await axios.get<PaginateResponse>(`/admin/page-sections/get-banners?${params}`);
			setData(res.data.data)
			setTotal(res.data.total)
			setLoading(false)
		}catch(err){
			setLoading(false)
		}
    }

    const onPageChange = (index:number, perPage:number) => {
        setPage(index)
        setPerPage(perPage)
    }

    useEffect(()=>{
        loadAsync()
    },[perPage, page])

    const handClickNew = () => {
        router.visit('/admin/page-sections/banners/create');
    }

    const handleEditClick = (id:number) => {
        router.visit('/admin/page-sections/banners/' + id + '/edit');
    }
    

    const handleSetActive = (d:Banner) => {
        axios.post('/admin/page-sections/set-active/' + d.id).then(res=>{
            if(res.data.status === 'active'){
                notification.success({
                    message: 'Banner set to active.'
                })
                loadAsync()
            }
        })
    }
    
    const handleDeleteClick = async (id:number) => {
		const res = await axios.delete('/admin/page-sections/banners/' + id);
		if(res.data.status === 'deleted'){
			notification.success({
				message: 'Deleted!',
				description:'Banner image deleted.'
			})
			loadAsync()
		}
	}
    
    return (
        <>

            <Head title="Featured Videos" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    {/* card header */}
					<CardTitle title={'LIST OF BANNERS'} />

                    {/* card body */}
                    <div>
                        <div className='mb-2 flex gap-2'>
                            
                            <Search placeholder="Search..." 
                                autoComplete='off'
                                enterButton="Search"
                                size="large"
                                id="search"
                                onChange={(e) => setSearch(e.target.value)}
                                loading={loading}
                                onSearch={loadAsync} />
                        </div>

                        <div className='flex flex-end my-4'>
                            <Button className='ml-auto' 
                                icon={<FileAddOutlined />} 
                                type="primary" onClick={handClickNew}>
                                New
                            </Button>     
                        </div>
                        
                        <Table dataSource={data}
                            loading={loading}
                            rowKey={(data) => data.id}
                            pagination={false}>

                            <Column title="Id" dataIndex="id"/>
                            <Column title="Name" dataIndex="name" key="name"/>
                            <Column title="Description" dataIndex="description" key="description"/>
                            <Column title="Banner" dataIndex="img" key="img" render={(img)=>(
								<img src={`/storage/banner_images/${img}`} width={50}/>
								
							)}/>
                            <Column title="Active" dataIndex="active" key="active" render={(active)=>(
								active ? (
									<span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>
									
								) : (
									<span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
								)
								
							)}/>
                            
                            <Column title="Action" key="action" 
                                render={(_, data:any) => (

                                    <Space size="small">

                                        <Dropdown menu={{
                                            items: [
                                                {
                                                    label: 'Edit',
                                                    key: 'admin.page.banner.edit',
                                                    icon: <EditOutlined />,
                                                    onClick: () => handleEditClick(data.id),
                                                },
                                                {
                                                    label: 'Set Active',
                                                    key: 'admin.banner-set-active',
                                                    icon: <CheckCheck size={16} />,
                                                    onClick: () => (
                                                        modal.confirm({
                                                        title: 'Delete?',
                                                        icon: <QuestionCircleOutlined />,
                                                        content: 'Are you sure you want to set this to active?',
                                                        okText: 'Yes',
                                                        cancelText: 'No',
                                                        onOk() {
                                                            handleSetActive(data) 
                                                        }
                                                    })),
                                                },
                                                {
                                                    label: 'View Banner',
                                                    key: 'admin.page.banner.view-banner-photo',
                                                    icon: <EyeIcon size={16}/>,
                                                    onClick: () => (
                                                        modal.info({
                                                            title: 'Banner',
                                                            content: (
                                                                <div>
                                                                    <hr />
                                                                    <img src={`/storage/banner_images/${data.img}`} />
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
                                                        icon: <QuestionCircleOutlined />,
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
                            />
                        </Table>

                        <Pagination className='mt-4' 
                            onChange={onPageChange}
                            pageSize={5}
                            defaultCurrent={1} 
                            total={total} />
                        
                    </div>
                </div>
                {/* card */}

            </div>
        </>
    )
}
BannerIndex.layout = (page: any) => (
  <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);

export default BannerIndex