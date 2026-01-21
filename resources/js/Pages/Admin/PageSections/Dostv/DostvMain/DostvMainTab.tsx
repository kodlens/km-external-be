import { App, Button, Dropdown, Pagination, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";

import {
  FileAddOutlined,
  DeleteOutlined, EditOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { router } from "@inertiajs/react";
import { Dostv, PaginateResponse } from "@/types";
import axios from "axios";
import { CheckCheck, EyeIcon, Trash } from "lucide-react";
import CardTitle from "@/Components/CardTitle";
import { truncate } from "@/helper/helperFunctions";

const DostvMainTab = () => {

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<Dostv[]>([])

  const { notification, modal } = App.useApp();


  const loadAsync = async () => {

    setLoading(true)
    const params = [
      `search=${search}`,
      `perpage=${perPage}`,
      `page=${page}`,
      `sort_by=id.desc`
    ].join('&');

    try {
      const res = await axios.get<PaginateResponse>(`/admin/page-sections/get-dostvs?${params}`);
      setData(res.data.data)
      setTotal(res.data.total)
      setLoading(false)

      
      
    } catch (err) {
      setLoading(false)
    }
  }

  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }

  useEffect(() => {
    loadAsync()
  }, [perPage, page])

  // useEffect(()=>{
  //   console.log(data);
  // },[data])

  const handClickNew = () => {
    router.visit('/admin/page-sections/dostvs/create');
  }

  const handleEditClick = (id: number) => {
    router.visit('/admin/page-sections/dostvs/' + id + '/edit');
  }


  const handleSetActive = (d: Dostv) => {
    axios.post('/admin/page-sections/dostv-set-active/' + d.id).then(res => {
      if (res.data.status === 'active') {
        notification.success({
          message: 'Successfully set to active.'
        })
        loadAsync()
      }
    })
  }

  const handleDeleteClick = async (id: number) => {
    const res = await axios.delete('/admin/page-sections/dostvs/' + id);
    if (res.data.status === 'deleted') {
      notification.success({
        message: 'Deleted!',
        description: 'Banner image deleted.'
      })
      loadAsync()
    }
  }

  return (
    <>
      <CardTitle title="DOSTv Main" />

      <div className='flex flex-end my-4'>
        <Button className='ml-auto' 
          icon={<FileAddOutlined />} 
          type="primary" onClick={handClickNew}>
          New
        </Button>     
      </div>

      <div className="overflow-auto">

        <Table dataSource={data}
          loading={loading}
          rowKey={(data) => data.id}
          pagination={false}>

          <Column title="Id" dataIndex="id" />
          <Column title="Title" dataIndex="title" key="title" />
          <Column title="Description" dataIndex="description" responsive={['md']} render={(desc) => (
            truncate(desc, 5)
          )} />
          <Column title="Website" dataIndex="website" key="website" responsive={['md']} />
          <Column title="Link" dataIndex="link" key="link" responsive={['md']} />
          <Column title="Featured" dataIndex="featured_image" key="featured_image" render={(featured) => (
            <div>
              <img src={`/storage/dostv/${featured}`} width={50} />
            </div>
          )} />
          <Column title="Active" dataIndex="active" key="active" render={(active) => (
            active ? (
              <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

            ) : (
              <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
            )
          )} />

          <Column title="Action" key="action"
            render={(_, data: Dostv) => (

              <Space size="small">

                <Dropdown 
                  trigger={['click']}
                  menu={{
                  items: [
                    {
                      label: 'Edit',
                      key: 'admin.page-sections.dostv.edit',
                      icon: <EditOutlined />,
                      onClick: () => handleEditClick(data.id),
                    },
                    {
                      label: 'Set Active',
                      key: 'admin.page-sections.dostv.set-active',
                      icon: <CheckCheck size={16} />,
                      onClick: () => (
                        modal.confirm({
                          title: 'Acive?',
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
                      key: 'admin.page-sections.dostv.view-banner-photo',
                      icon: <EyeIcon size={16} />,
                      onClick: () => (
                        modal.info({
                          title: 'Banner',
                          content: (
                            <div>
                              <hr />
                              <img src={`/storage/dostv/${data?.featured_image}`} />
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
      </div>

      <Pagination className='mt-4'
        onChange={onPageChange}
        pageSize={5}
        defaultCurrent={1}
        total={total} />
    </>
  )
}

export default DostvMainTab;