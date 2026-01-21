import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Permission,  PageProps } from '@/types'
import { Head } from '@inertiajs/react'

import { FileAddOutlined,
    DeleteOutlined, EditOutlined, 
    QuestionCircleOutlined } from '@ant-design/icons';

import { Card, Space, Table, 
    Pagination, Button, Modal,
    Form, Input, Select, Checkbox,
    notification } from 'antd';


import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { NotificationPlacement } from 'antd/es/notification/interface';


const { Column } = Table;
const { Search } = Input;

export default function PermissionIndex({ auth, permissions }: PageProps<{permissions:string[]}>) {
	
	const [form] = Form.useForm();

    const [data, setData] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [open, setOpen] = useState(false); //for modal

	const [perPage, setPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [label, setLabel] = useState('');
    const [module, setModule] = useState('');
    const [errors, setErrors] = useState<any>({});

    const [sortBy, setSortBy] = useState<any>('id.desc');

    const [id, setId] = useState(0);
		
	interface AxiosResponse {
		data: any[];
		total: number;
	}

	const loadAsync = async () => {

        setLoading(true)
        const params = [
			`label=${label}`,
			`module=${module}`,
            `perpage=${perPage}`,
            `sort_by=${sortBy}`,
            `page=${page}`
        ].join('&');

		try{
			const res = await axios.get<AxiosResponse>(`/panel/get-permissions?${params}`);
			setData(res.data.data)
			setTotal(res.data.total)
			setLoading(false)
		}catch(err){
			setLoading(false)
		}
    }

    useEffect(()=>{
        loadAsync()
    },[perPage, page])


    const onPageChange = (index:number, perPage:number) => {
        setPage(index)
        setPerPage(perPage)
    }


	// this for notifcation
	const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement:NotificationPlacement, title:string, msg:string) => {
        api.info({
            message: title,
            description: msg,
            placement,
        });
    };


	const getData = async (id:number) => {
		try{
			const res = await axios.get<Permission>(`/panel/permissions/${id}`);
			form.setFields([
				{ name: 'module_name', value: res.data.module_name },
				{ name: 'label', value: res.data.label },
				{ name: 'name', value: res.data.name },
				{ name: 'description', value: res.data.description },
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
		const res = await axios.delete('/panel/permissions/' +id);
		if(res.data.status === 'deleted'){
			openNotification('bottomRight', 'Deleted!', 'Role successfully deleted.')
			loadAsync()
		}
	}
	

	const onFinish = async (values:Permission) =>{

		if(id > 0){
			try{
				const res = await axios.put('/panel/permissions/' + id, values)
				if(res.data.status === 'updated'){
                    setOpen(false)
					//form.resetFields()
					loadAsync()
                    openNotification('bottomRight', 'Updated!', 'Permission successfully update.')
				}
			}catch(err:any){
				if(err.response.status === 422){
					setErrors(err.response.data.errors)
				}
			}
		}else{
			try{
				const res = await axios.post('/panel/permissions', values)
				if(res.data.status === 'saved'){
					openNotification('bottomRight', 'Saved!', 'Permission successfully save.')
					//form.resetFields()
					setOpen(false)
					loadAsync()
				}
			}catch(err:any){
				if(err.response.status === 422){
					setErrors(err.response.data.errors)
				}
			}
		}
	}

    const handleModuleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            loadAsync()
        }
    }

	return (
		<Authenticated user={auth.user}>
			<Head title="Role Management"></Head>

			{contextHolder}

			<div className='flex mt-10 justify-center items-center'>

				{/* card */}
				<div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
					md:w-[900px]
					sm:w-[740px]'>
					{/* card header */}
					<div className="font-bold mb-4">List of Permission</div>
					{/* card body */}
					<div>
						<div className='mb-2 flex gap-2'>
                            <Input placeholder="Search Module..." 
								onChange={(e) => setModule(e.target.value)}
                                onKeyDown={handleModuleKeyDown}
                            ></Input>
							<Search placeholder="Search Label..." 
								autoComplete='off'
								enterButton="Search"
								size="large"
								id="search"
								onChange={(e) => setLabel(e.target.value)}
								loading={loading}
								onSearch={loadAsync} />
						</div>
						{ permissions.includes('permissions.create') && (
							<div className='flex flex-end my-4'>
								<Button className='ml-auto' 
									icon={<FileAddOutlined />} 
									type="primary" onClick={handClickNew}>
									New
								</Button>     
							</div>
						)}
						<Table dataSource={data}
							loading={loading}
							rowKey={(data) => data.id}
							pagination={false}>

							<Column title="Id" dataIndex="id"/>
							<Column title="Module" dataIndex="module_name" key="module_name"/>

							<Column title="Label" dataIndex="label" key="label"/>

							<Column title="Name" dataIndex="name" key="name"/>
							<Column title="Description" dataIndex="description" key="description"/>
							<Column title="Guard" dataIndex="guard_name" key="description"/>
							
							<Column title="Action" key="action" 
								render={(_, data:Permission) => (
									<Space size="small">
										{ permissions.includes('permissions.edit') && (
											<Button shape="circle" icon={<EditOutlined/>} onClick={ ()=> handleEditClick(data.id) } />
										)}
										
										{ permissions.includes('permissions.destroy') && (
											<Button danger shape="circle"
												onClick={()=> (
													Modal.confirm({
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
										)}
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


			{/* Modal with Cancel and Save button*/}
			<Modal
                open={open}
                title="PERMISSION INFORMATION"
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
							module_name: '',
							label: '',
							name: '',
							description: '',
							guard_name: '',
                        }}
                        clearOnDestroy
                        onFinish={(values) => onFinish(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    name="module_name"
                    label="Module Name"
                    validateStatus={errors.module_name ? 'error' : ''}
                    help={errors.module_name ? errors.module_name[0] : ''}
                >
                    <Input placeholder="Module Name"/>
                </Form.Item>

                <Form.Item
                    name="label"
                    label="Label"
                    validateStatus={errors.label ? 'error' : ''}
                    help={errors.label ? errors.label[0] : ''}
                >
                    <Input placeholder="Label"/>
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Name"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name ? errors.name[0] : ''}
                >
                    <Input placeholder="Name"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    validateStatus={errors.description ? 'error' : ''}
                    help={errors.description ? errors.description[0] : ''}
                >
                    <Input.TextArea placeholder="Description"/>
                </Form.Item>
                
            </Modal>

		</Authenticated>
	)
}
