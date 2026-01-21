import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category, PageProps, User } from '@/types'
import { Head } from '@inertiajs/react'

import { FileAddOutlined, 
    DeleteOutlined, EditOutlined, 
    QuestionCircleOutlined } from '@ant-design/icons';

import { Card, Space, Table, Modal,
    Pagination, Button,
    Form, Input, Select, Checkbox, 
	App} from 'antd';


import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTitle from '@/Components/CardTitle';

const { Column } = Table;
const { Search } = Input;

const AdminCategoryIndex = ({ auth, permissions }: PageProps<{permissions:string[]}>) => {
	
	const [form] = Form.useForm();
	
	const { notification, modal } = App.useApp();

    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [open, setOpen] = useState(false); //for modal

	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [errors, setErrors] = useState<any>({});

    const [sortBy, setSortBy] = useState<any>('id.desc');

    const [id, setId] = useState(0);
		
	interface CategoryResponse {
		data: any[];
		total: number;
	}

	const loadAsync = async () => {

        setLoading(true)
        const params = [
			`search=${search}`,
            `perpage=${perPage}`,
            `sort_by=${sortBy}`,
            `page=${page}`
        ].join('&');

		try{
			const res = await axios.get<CategoryResponse>(`/admin/get-categories?${params}`);
			setData(res.data.data)
			setTotal(res.data.total)
			setLoading(false)
		}catch(err){
			setLoading(false)
		}
    }

    useEffect(()=>{
        loadAsync()
    },[page])


    const onPageChange = (index:number, perPage:number) => {
        setPage(index)
        setPerPage(perPage)
    }


	const getData = async (id:number) => {
		try{
			const res = await axios.get<Category>(`/admin/categories/${id}`);
			form.setFields([
				{ name: 'title', value: res.data.title },
				{ name: 'description', value: res.data.description },
				{ name: 'active', value: res.data.active ? true : false },
			]);
		}catch(err){
            //console.log(err);
		}
    }


	const handClickNew = () => {
        //router.visit('/');
		setId(0)
        setOpen(true)
    }

	const handleEditClick = (id:number) => {
		setErrors({})
		setId(id);
        setOpen(true);
        getData(id);
	}

	const handleDeleteClick = async (id:number) => {
		const res = await axios.delete('/admin/categories/' + id);
		if(res.data.status === 'deleted'){
			notification.info({
				message: 'Deleted!',
				description:'Category successfully deleted.',
				placement: 'bottomRight'
			})
			loadAsync()
		}
	}

	const onFinish = async (values:Category) =>{
		
		if(id > 0){
			try{
				const res = await axios.put('/admin/categories/' + id, values)
				if(res.data.status === 'updated'){
					notification.info({
						message: 'Updated!',
						description:'Category successfully update.',
						placement: 'bottomRight'
					})
					setOpen(false)
					loadAsync()
				}
			}catch(err:any){
				if(err.response.status === 422){
					setErrors(err.response.data.errors)
				}
			}
		}else{
			try{
				const res = await axios.post('/admin/categories', values)
				if(res.data.status === 'saved'){
					notification.info({
						message: 'Saved!',
						description:'Category successfully save.',
						placement: 'bottomRight'
					})
					setOpen(false)
					loadAsync()
				}
			}catch(err:any){
				if(err.response.status === 422){
					setErrors(err.response.data.errors)

				}
			}
		}
		
		//throw new Error('Function not implemented.');
	}

	return (
		<>
			<Head title="Category Management"></Head>

			<div className='flex mt-10 justify-center items-center'>

				{/* card */}
				<div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
					md:w-[900px]
					sm:w-[740px]'>
					{/* card header */}
					<CardTitle title={'LIST OF CATEGORIES'} />
					{/* card body */}
					<div>
						<div className='mb-2'>
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
							<Column title="Category" dataIndex="title" key="title"/>
							<Column title="Description" dataIndex="description" key="description"/>
							<Column title="Slug" dataIndex="slug" key="slug"/>
							<Column title="Active" dataIndex="active" key="active" render={(active)=>(
								active ? (
									<span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>
								) : (
									<span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
								)
							)}/>
							
							<Column title="Action" key="action" 
								render={(_, data:Category) => (
									<Space size="small">

										<Button shape="circle" 
											icon={<EditOutlined/>} onClick={ ()=> handleEditClick(data.id) } />
										
										<Button danger shape="circle"
											onClick={()=> (
												modal.confirm({
													title: 'Delete?',
													icon: <QuestionCircleOutlined />,
													content: 'Are you sure you want to delete this data?',
													okText: 'Yes',
													cancelText: 'No',
													onOk() {
														handleDeleteClick(data.id) 
													}
												})
											)}
											icon={<DeleteOutlined/>} />
									</Space>
								)}
							/>
						</Table>

						<Pagination className='mt-4' 
							onChange={onPageChange}
							defaultCurrent={1} 
							total={total} />
						
					</div>
				</div>
				{/* card */}

			</div>


			{/* Modal with Cancel and Save button*/}
			<Modal
                open={open}
                title="CATEGORY INFORMATION"
                okText="Save"
                cancelText="Cancel"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit',
                }}
                onCancel={() => setOpen(false)}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
						autoComplete='off'
                        initialValues={{
							title: '',
							description: '',
                            active: true,
                        }}
                        clearOnDestroy
                        onFinish={(values) => onFinish(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="title"
                    label="Category"
                    validateStatus={errors.title ? 'error' : ''}
                    help={errors.title ? errors.title[0] : ''}
                >
                    <Input placeholder="Category"/>
                </Form.Item>

				<Form.Item
                    name="description"
                    label="Description"
                    validateStatus={errors.description ? 'error' : ''}
                    help={errors.description ? errors.description[0] : ''}
                >
                    <Input.TextArea placeholder="Description"/>
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="checked"
                >
                    <Checkbox>Active</Checkbox>
                </Form.Item>
                
            </Modal>

		</>
	)
}

AdminCategoryIndex.layout = (page:any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminCategoryIndex;
