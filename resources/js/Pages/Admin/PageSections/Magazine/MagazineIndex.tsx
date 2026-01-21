
import { Banner, PageProps, PaginateResponse } from '@/types';
import { App, Button, Dropdown, Input, Pagination, Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'


import { FileAddOutlined, 
    DeleteOutlined, EditOutlined, 
    QuestionCircleOutlined, 
    DownOutlined} from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { EyeIcon, ThumbsUpIcon, Trash } from 'lucide-react';
import CardTitle from '@/Components/CardTitle';

const { Column } = Table;
const { Search } = Input;

export default function MagazineIndex( { auth } : PageProps) {

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
			const res = await axios.get<PaginateResponse>(`/admin/page-sections/get-magazines?${params}`);
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
        router.visit('/admin/page-sections/magazines/create');
    }
    const handleEditClick = (id:number) => {
        router.visit('/admin/page-sections/magazines/' + id + '/edit');
    }
    


    const handleDeleteClick = async (id:number) => {
		const res = await axios.delete('/admin/page-sections/magazines/' + id);
		if(res.data.status === 'deleted'){
			notification.info({
				message: 'Deleted!',
				description:'Magazine successfully deleted.',
			})
			loadAsync()
		}
	}
    
    return (
        <>

            <Head title="Magazine" />

            <div className='flex mt-10 justify-center items-center'>

                {/* card */}
                <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
                    md:w-[900px]
                    sm:w-[740px]'>
                    {/* card header */}
					<CardTitle title={'LIST OF MAGAZINES'} />
                    
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
                            <Column title="Title" dataIndex="title" key="title"/>
                            {/* <Column title="Cover" dataIndex="cover" key="cover"/> */}
                            <Column title="Slug" dataIndex="slug" key="slug"/>
                            <Column title="Quarter" dataIndex="quarter" key="quarter"/>
                            <Column title="Year" dataIndex="year" key="year"/>
                    
                            <Column title="Cover" dataIndex="cover" key="cover" render={(cover)=>(
								<img src={`/storage/magazines/${cover}`} width={30}/>
								
							)}/>

                            <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured)=>(
								is_featured ? (
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
                                                    key: 'admin.page.magazines.edit',
                                                    icon: <EditOutlined />,
                                                    onClick: () => handleEditClick(data.id),
                                                },
                                                {
                                                    label: 'Set Featured',
                                                    key: 'admin.page.magazines.set-cover-featured',
                                                    icon: <ThumbsUpIcon size={16}/>,
                                                    onClick: () => (
                                                        modal.confirm({
                                                            title: 'Set this as featured?',
                                                            okText: 'Yes',
                                                            onOk: ()=>{
                                                                axios.post('/admin/page-sections/magazine/set-featured/' + data.id)
                                                                    .then(res => {
                                                                        if(res.data.status === 'featured'){
                                                                            loadAsync()
                                                                            notification.success({
                                                                                message: 'Magazine successfully set to featured.'
                                                                            })
                                                                        }
                                                                    })
                                                            }
                                                            
                                                        })
                                                    ),
                                                },
                                                {
                                                    label: 'View Cover Photo',
                                                    key: 'admin.page.magazines.view-cover-photo',
                                                    icon: <EyeIcon size={16}/>,
                                                    onClick: () => (
                                                        modal.info({
                                                            title: 'Cover Photo',
                                                            content: (
                                                                <div>
                                                                    <hr />
                                                                    <img src={`/storage/magazines/${data.cover}`} />
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
                                                    key: 'admin.magazine-delete',
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

MagazineIndex.layout = (page: any) => (
  <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);