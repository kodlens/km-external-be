import { PageProps, User, Status } from '@/types'
import { Head, router } from '@inertiajs/react'

import {
	DropboxOutlined,
	DeleteOutlined, EditOutlined,
	EyeOutlined, UserOutlined,
	ProjectOutlined, PaperClipOutlined,
	PicRightOutlined,
	CalendarOutlined
} from '@ant-design/icons';

import {
	Space, Table,
	Pagination, Button, Modal,
	Form, Input, Select,
	notification,
	Dropdown,
	MenuProps,
	App,
	DatePicker
} from 'antd';


import React, { KeyboardEvent, useEffect, useState } from 'react'
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
import ArticleView from '@/Components/Post/ArticleView';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTitle from '@/Components/CardTitle';
import { Post } from '@/types/post';
import { dateFormat, truncate } from '@/helper/helperFunctions';
import { useQuery } from '@tanstack/react-query';


const AdminPostIndex = (
	{ auth, statuses, permissions }:
		PageProps) => {

	const { modal } = App.useApp();

	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);

	const [perPage, setPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const [errors, setErrors] = useState<any>({});
	const [open, setOpen] = useState(false);
	const [id, setId] = useState(0);

	const createMenuItems = (data: Post) => {

		const items: MenuProps['items'] = [];

		items.push({
			label: 'Edit',
			key: 'admin.posts.edit',
			icon: <EditOutlined />,
			onClick: () => handleEditClick(data.id),
		}, {
			label: 'Trash',
			key: 'admin.posts.trash',
			icon: <DeleteOutlined />,
			onClick: () => handleTrashClick(data.id),
		}, {
			label: 'Archive',
			key: 'admin.posts.archive',
			icon: <DropboxOutlined />,
			onClick: () => {
				axios.post('/admin/posts-archive/' + data.id).then(res => {
					if (res.data.status === 'archived') {
						modal.info({
							title: 'Archived!',
							content: 'Successfully archived.'
						})
						refetch()
					}
				})
			},
		}, {
			label: 'Draft',
			key: 'admin.posts-draft',
			icon: <PaperClipOutlined />,
			onClick: () => {
				axios.post('/admin/posts.draft/' + data.id).then(res => {
					if (res.data.status === 'draft') {
						modal.info({
							title: 'Draft!',
							content: 'Successfully draft.'
						})
						refetch()
					}
				})
			},
		}, {
			label: 'Publish',
			key: 'admin.posts-publish',
			icon: <PicRightOutlined />,
			onClick: () => {
				axios.post('/admin/posts.publish/' + data.id).then(res => {
					if (res.data.status === 'publish') {
						modal.info({
							title: 'Published!',
							content: 'Successfully published.'
						})
						refetch()
					}
				})
			},
		}, {
			key: 'admin.posts-submit',
			icon: <ProjectOutlined />,
			label: 'Submit for Publishing',
			onClick: () => {
				axios.post('/admin/posts-submit-for-publishing/' + data.id).then(res => {
					if (res.data.status === 'submit-for-publishing') {
						modal.info({
							title: 'Submitted!',
							content: 'Successfully submitted.'
						})
						refetch()
					}
				})
			},
		}, {
			label: 'Featured',
			key: 'admin.posts.featured',
			icon: <PicRightOutlined />,
			onClick: () => {
				axios.post('/admin/posts-featured/' + data.id).then(res => {
					if (res.data.status === 'featured') {
						modal.info({
							title: 'Featured!',
							content: 'Successfully added to featured articles.'
						})
						refetch()
					}
				})
			},
		}, {
			label: 'Unfeatured',
			key: 'admin.posts-unfeatured',
			icon: <PicRightOutlined />,
			onClick: () => {
				axios.post('/admin/posts-unfeatured/' + data.id).then(res => {
					if (res.data.status === 'unfeatured') {
						modal.info({
							title: 'Unfeatured!',
							content: 'Remove from featured articles.'
						})
						refetch()
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
				label: 'Delete',
				key: 'admin.posts-destroy',
				icon: <DeleteOutlined />,
				onClick: () => handleDeleteClick(data.id),
			},
			{
				label: 'Set Publish Date',
				key: 'admin.posts-set-publish-date',
				icon: <CalendarOutlined />,
				onClick: () => openModalSetPublishDate(data.id),
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

	function openModalSetPublishDate(id: number): void {
		setId(id);
		setOpen(true);
	}



	const { data, isFetching, refetch } = useQuery({
		queryKey: ['posts', page, perPage],
		queryFn: async () => {
			const params = [
				`perpage=${perPage}`,
				`search=${search}`,
				`page=${page}`,
				`status=${status}`
			].join('&');

			const res = await axios.get(`/admin/get-posts?perpage=${perPage}&page=${page}&status=${status}`);
			return res.data;
		},
	});


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
	const handleTrashClick = (id: number) => {
		modal.confirm({
			title: 'Trash?',
			content: 'Are you sure you want to move to trash this post?',
			onOk: async () => {
				const res = await axios.post('/admin/posts-trash/' + id);
				if (res.data.status === 'trashed') {
					refetch();
				}
			}
		})
	}

	const handleDeleteClick = (id: number) => {
		modal.confirm({
			title: 'Delete?',
			content: 'Are you sure you want to delete this post?',
			onOk: async () => {
				setLoading(true)
				const res = await axios.delete('/admin/posts/' + id);
				if (res.data.status === 'deleted') {
					refetch();
					setLoading(false)
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

	function onFinishSetPublishDate(values: any): void {

		setLoading(true);
		axios.post(`/admin/post-set-publish-date/${values.post_id}`, {
			publication_date: values.publish_date
		})
			.then((response) => {
				if (response.data.status === 'success') {
					notification.success({
						message: 'Success',
						description: 'Publish date updated successfully.',
					});
					refetch();
					setOpen(false);
					form.resetFields();
				} else {
					notification.error({
						message: 'Error',
						description: 'Failed to update publish date.',
					});
				}
			})
			.catch((error) => {
				notification.error({
					message: 'Error',
					description: 'An error occurred while updating the publish date.',
				});
				if (error.response && error.response.data.errors) {
					setErrors(error.response.data.errors);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}
	return (

		<>
			<Head title="POST/ARTICLE"></Head>

			<div className='flex justify-center items-center'>
				{/* card */}
				<div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]'>
					{/* card header */}
					<CardTitle title="LIST OF POST/ARTICLES" />

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
								{ label: 'Return to Author', value: 'draft' },
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

						<Table dataSource={data?.data || []}
							loading={loading}
							rowKey={(data) => data.id}
							pagination={false}>

							<Column title="Id" dataIndex="id" />
							<Column title="Title" dataIndex="title" key="title" />

							<Column title="Publication Date" dataIndex="publication_date" key="publication_date"
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

							<Column title="Trash" dataIndex="trash" key="trash" render={(trash) => (

								trash > 0 ? (
									<span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

								) : (
									<span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
								)

							)} />


							<Column title="Action" key="action"
								render={(_, data: Post) => (
									<Space size="small">
										<Dropdown trigger={['click']}
											menu={{ items: createMenuItems(data) }} >
											<Button>
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
							defaultCurrent={1}
							total={data?.total || 0} />
					</div>
				</div>
				{/* card */}

				<Modal
					title="Update Publish Date"
					open={open}
					onCancel={() => {
						setOpen(false);
						setId(0);
						setErrors({});
					}}
					okButtonProps={{
						autoFocus: true,
						htmlType: "submit",
					}}
					okText="Save"
					cancelText="Close"
					destroyOnClose
					modalRender={(dom) => (
						<Form
							layout="vertical"
							form={form}
							name="form_in_modal"
							autoComplete="off"
							initialValues={{
								publish_date: null,
								post_id: id
							}}
							clearOnDestroy
							onFinish={(values) => onFinishSetPublishDate(values)}
						>
							{dom}
						</Form>
					)}
				>
					<Form.Item
						name="publish_date"
						className="w-full"
						label="Publish Date"
						validateStatus={errors.publish_date ? "error" : ""}
						help={errors.publish_date ? errors.publish_date[0] : ''}>
						<DatePicker placeholder="Select date" className="w-full" format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item
						name="post_id"
						className="w-full"
						label="Publish Date"
						hidden>
						<Input hidden></Input>
					</Form.Item>
				</Modal>

			</div>

		</>
	)
}

AdminPostIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminPostIndex;


