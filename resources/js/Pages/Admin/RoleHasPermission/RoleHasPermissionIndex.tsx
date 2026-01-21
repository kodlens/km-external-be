import Authenticated from '@/Layouts/AuthenticatedLayout'
import { RoleHasPermission,  PageProps, Permission, Role } from '@/types'
import { Head } from '@inertiajs/react'

import { FileAddOutlined,
    DeleteOutlined, EditOutlined, 
    QuestionCircleOutlined } from '@ant-design/icons';

import { Card, Space, Table, 
    Pagination, Button, Modal,
    Form, Input, Select, Checkbox,
    notification, 
	Divider} from 'antd';


import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { NotificationPlacement } from 'antd/es/notification/interface';


const { Column } = Table;
const { Search } = Input;

export default function RoleHasPermissionIndex({ auth, permissions, selectPermissions, selectRoles }: PageProps<
	{
		permissions:string[] , 
		selectPermissions: Permission[],
		selectRoles: Role[],
	}>) {
	
	const [form] = Form.useForm();

    const [data, setData] = useState<RoleHasPermission[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [open, setOpen] = useState(false); //for modal

	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [role, setRole] = useState('');
    const [module, setModule] = useState('');
    const [errors, setErrors] = useState<any>({});

    const [sortBy, setSortBy] = useState<any>('id.desc');

    const [id, setId] = useState(0);
		
	interface PaginationResponse {
		data: any[];
		total: number;
	}

	const loadAsync = async () => {

        setLoading(true)
        const params = [
			`role=${role}`,
			`module=${module}`,
            `perpage=${perPage}`,
            `sort_by=${sortBy}`,
            `page=${page}`
        ].join('&');

		try{
			const res = await axios.get<PaginationResponse>(`/panel/get-role-has-permissions?${params}`);
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
			const res = await axios.get<RoleHasPermission>(`/panel/role-has-permissions/${id}`);
			form.setFields([
				{ name: 'permission_id', value: res.data.permission_id },
				{ name: 'role_id', value: res.data.role_id },
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
	

	const onFinish = async (values:RoleHasPermission) =>{

		if(id > 0){
			try{
				const res = await axios.put('/panel/role-has-permissions/' + id, values)
				if(res.data.status === 'updated'){
                    setOpen(false)
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
				const res = await axios.post('/panel/role-has-permissions', values)
				if(res.data.status === 'saved'){
					openNotification('bottomRight', 'Saved!', 'Permission successfully save.')
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
					<div className="font-bold mb-4">List of Role Has Permission</div>
					{/* card body */}
					<div>
						<div className='mb-2 flex gap-2'>
                            <Input placeholder="Search Module..." 
								onChange={(e) => setModule(e.target.value)}
                                onKeyDown={handleModuleKeyDown}
                            ></Input>

							<Search placeholder="Search Role..." 
								autoComplete='off'
								enterButton="Search"
								size="large"
								id="search"
								onChange={(e) => setRole(e.target.value)}
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
							<Column title="Module" dataIndex="permission.module_name" key="permission_id"
								render ={ (text: string, record: any) => (
									<div>
										<div>{text}</div>
										<div style={{ color: 'gray' }}>{record.permission.module_name}</div>
									</div>
							)}/>

							<Column title="Role" dataIndex="role.role" key="role_id"
								render ={ (text: string, record: any) => (
									<div>
										<div>{text}</div>
										<div style={{ color: 'gray' }}>{record.role.role}</div>
									</div>
							)}/>
							
							<Column title="Name" dataIndex="permission.name"
								render ={ (text: string, record: any) => (
									<div>
										<div>{text}</div>
										<div style={{ color: 'gray' }}>{record.permission.name}</div>
									</div>
							)}/>
							
							<Column title="Action" key="action" 
								render={(_, data:RoleHasPermission) => (
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
							pageSize={10}
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
					name="permission"
					className='w-full'
					label="Select Permission"
					validateStatus={errors.permission ? 'error' : ''}
					help={errors.permission ? errors.permission[0] : ''}>
					<Select
						showSearch
						optionFilterProp="label"
						options={selectPermissions.map((item) => ({
							value: item.id,
							label: item.label
						}))}>
					</Select>
				</Form.Item>


                <Form.Item
					name="role"
					className='w-full'
					label="Select Role"
					validateStatus={errors.role ? 'error' : ''}
					help={errors.role ? errors.role[0] : ''}>
					<Select
						options={selectRoles.map((item) => ({
							value: item.id,
							label: item.role
						}))}>
					</Select>
				</Form.Item>
                
            </Modal>

		</Authenticated>
	)
}
