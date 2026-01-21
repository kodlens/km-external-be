import { PageProps, Section } from '@/types'
import { Head } from '@inertiajs/react'

import {
  FileAddOutlined,
  DeleteOutlined, EditOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

import {
  App, Space, Table,
  Pagination, Button, Modal,
  Form, Input, Select, Checkbox
} from 'antd';

import { useRef, useState } from 'react'
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import ModalCreateEditSection, { ModalCreateEditSectionHandle } from './ModalCreateEditSection';
import { SearchIcon } from 'lucide-react';


const { Column } = Table;
const { Search } = Input;

const AdminSectionIndex = ({ auth, permissions }: PageProps<{ permissions: string[] }>) => {

  const [form] = Form.useForm();
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<any>('id.desc');

  const { notification, modal } = App.useApp();
  const modalRef = useRef<ModalCreateEditSectionHandle>(null)
  
  interface PaginateResponse {
    data: any[];
    total: number;
  }


  const { data, isFetching, refetch, error } = useQuery<PaginateResponse>({
    queryKey: ['sections', page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        perpage: perPage.toString(),
        search: search.toString(),
        page: page.toString(),
        sort_by: sortBy.toString(),
      });

      const res = await axios.get(`/admin/get-sections?${params}`)
      return res.data
    }
  });


  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }


  const handClickNew = () => {
    //router.visit('/');
    modalRef.current?.openModal(0)
  }

  const handleEditClick = (id: number) => {
    modalRef.current?.openModal(id)
  }

  const handleDeleteClick = async (id: number) => {
    const res = await axios.delete('/admin/sections/' + id);
    if (res.data.status === 'deleted') {
      notification.success({
        message: 'Deleted',
        description: 'Section successfully deleted.',
      });
      refetch()
    }
  }

  return (
    <>
      <Head title="Section Management"></Head>

      <div className='flex mt-10 justify-center items-center'>

        {/* card */}
        <div className='p-6 w-full overflow-auto mx-2 bg-white shadow-sm rounded-md
					md:w-[740px]
					sm:w-[740px]'>
          {/* card header */}
          <div className="font-bold mb-4 bg-red-600 text-white px-4 py-2">LIST OF SECTIONS</div>

          {/* card body */}
          <div>
            <div className='mb-2 flex gap-2 md:flex-row flex-col'>
              <Input placeholder="Search section here..."
                autoComplete='off'
                id="search"
                onChange={(end)=>{
                    setSearch(end.target.value)
                }}
                onKeyDown={ (e) => {
                  if(e.key === 'Enter'){
                    refetch()
                  }
                }} />

                 <Button className='ml-auto'
                  icon={<SearchIcon size={16} />}
                  type="primary" onClick={(e)=>{
                    refetch()
                  }}>
                  Search
                </Button>
            </div>

            <div className='flex flex-end my-4'>
              <Button className='ml-auto'
                icon={<FileAddOutlined />}
                type="primary" onClick={handClickNew}>
                New
              </Button>
            </div>

            <Table dataSource={data ? data?.data : []}
              loading={isFetching}
              rowKey={(data) => data.id}
              pagination={false}>

              <Column title="Id" dataIndex="id" />
              <Column title="Section" dataIndex="section" key="section" />
              <Column title="Active" dataIndex="active" key="active" render={(active) => (
                active ? (
                  <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>
                ) : (
                  <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                )
              )} />

              <Column title="Action" key="action"
                render={(_, data: Section) => (
                  <Space size="small">
                    <Button icon={<EditOutlined />} onClick={() => handleEditClick(data.id)} />

                    <Button danger
                      onClick={() => (
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
                      icon={<DeleteOutlined />} />
                  </Space>
                )}
              />
            </Table>

            <Pagination className='mt-4'
              onChange={onPageChange}
              pageSize={5}
              defaultCurrent={1}
              total={data?.total} />

          </div>
        </div>
        {/* card */}

      </div>

      <ModalCreateEditSection ref={modalRef} onRefresh={()=>{
        refetch()
      }}/>

    </>
  )
}

AdminSectionIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>

export default AdminSectionIndex;
