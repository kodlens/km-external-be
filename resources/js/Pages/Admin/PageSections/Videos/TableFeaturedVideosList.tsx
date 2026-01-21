import CardTitle from "@/Components/CardTitle"
import { FeaturedVideo, PaginateResponse } from "@/types";
import { App, Button, Pagination, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FileAddOutlined,
  DeleteOutlined, EditOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import Column from "antd/es/table/Column";
import { ArrowDownUp, ArrowLeft, FolderSearch } from "lucide-react";
import ModalOrderNo from "./ModalOrderNo";

const TableFeaturedVideosList = () => {

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(0)
  const [page, setPage] = useState(0)


  const { notification, modal } = App.useApp();

  const loadAsync = async () => {

    setLoading(true)
    const params = [
      `title=${search}`,
      `perpage=${perPage}`,
      `page=${page}`,
      `sort_by=id.desc`
    ].join('&');

    try {
      const res = await axios.get<PaginateResponse>(`/admin/page-sections/get-featured-videos?${params}`);
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

  const handleUnfeatured = async (data:FeaturedVideo) => {
    try{ 
      const res = await axios.post(`/admin/page-sections/video/set-unfeatured/${data.id}`)
      if(res.data.status === 'unfeatured'){
        notification.success({
          message: 'Successfully unfeatured.',
          description: 'Video successfully set to unfeatured.'
        })
        loadAsync()
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <CardTitle title="LIST OF FEATURED VIDEOS" />
      {/* card body */}
      <div>
        <div className='mb-2 flex gap-2'>

          <Search 
            placeholder="Search..."
            autoComplete='off'
            enterButton="Search"
            size="large"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            loading={loading}
            onSearch={loadAsync} />
        </div>

        <Table dataSource={data}
          loading={loading}
          rowKey={(data) => data.id}
          pagination={false}>

          <Column title="Id" dataIndex="id" />
          <Column title="Title" dataIndex="title" key="title" />
          <Column title="Excerpt" dataIndex="excerpt" key="excerpt" />
          <Column title="Link" dataIndex="link" key="link" render={(link) => (
            <a target='_blank' href={link}>{link}</a>
          )} />

          <Column title="Order No." dataIndex="order_no" key="order_no" />

          <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured) => (
            is_featured ? (
              <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

            ) : (
              <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
            )
          )} />

          <Column title="Action" key="action"
            render={(_, data: any) => (
              <Space size="small">
                 <Button
                  loading={loading}
                  icon={<ArrowLeft size={16} />} onClick={()=>handleUnfeatured(data)}/>

                <ModalOrderNo video={data} onDone={()=>{
                  loadAsync()
                }}/>
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
    </>
  )
}

export default TableFeaturedVideosList