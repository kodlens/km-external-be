import { Head, router } from '@inertiajs/react'
import {
  Button,
  Input,
  Select,

} from 'antd'
import {  ReactNode, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { statusDropdownMenu } from '@/helper/statusMenu'
import Error404 from '@/Components/Error404'
import TableInfos from '@/Components/TableInfos'
import { ListPlus, Search } from 'lucide-react'
import SideBarLayout from '@/Layouts/SideBarLayout'

export default function EncoderInfoIndex() {


  const [page, setPage] = useState(1)
  const perPage = 10

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')



  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['infos', { perPage, page, status }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${search ? search : ''}`,
        `status=${status ? status : ''}`,
        `page=${page}`,
        `status=${status}`,
      ].join('&')

      const res = await axios.get(`/encoder/get-infos?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <Error404 error={error} />
  }


  return (
    <>
      <Head title="Information" />

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1300px] bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          {/* ================= HEADER ================= */}
          <div className="mb-6 flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Informations
              </h1>
              <p className="text-sm text-slate-500">
                Manage, review, and publish science & technology informations
              </p>
            </div>

            <Button
              className='ml-auto'
              icon={<ListPlus size={15} />}
              loading={isFetching}
              type="primary"
              onClick={() => router.visit('/encoder/infos/create')}
            >
              New Information
            </Button>

          </div>

          {/* ================= FILTERS ================= */}
          <div className="flex flex-col md:flex-row gap-3 mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">

            <Select
              className="w-[180px]"
              value={status}
              onChange={(v) =>
                setStatus(v)
              }
              options={statusDropdownMenu('encoder')}

            />

            <Input
              placeholder="Search by article title"
              className="w-full"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e)=>{
                if(e.key === 'Enter')
                  refetch()
              }}
              allowClear
            />

            <Button className="ml-auto"
              icon={<Search size={15} />}
              type="primary"
              loading={isFetching}
              onClick={()=> refetch()}>
              Search
            </Button>
          </div>


          <div className='overflow-auto'>
              <TableInfos
                routePrefix='encoder'
                data={data}
                isFetching={isFetching}
                refetch={refetch}
                paginationPageChange={(v) => {
                  console.log(v);
                  setPage(v)
                }}
                page={page}
                showDelete={false}
                showEdit={true}
                showPublish={false}
                showDraft={false}
                showView={true}
                showTrash={false}
              />

          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end mb-4">
            <Button
              loading={isFetching}
              icon={<ListPlus size={15} />}
              type="primary"
              onClick={() => router.visit('/encoder/infos/create')}
            >
              New Information
            </Button>
          </div>


        </div>
      </div>
    </>
  )
}

EncoderInfoIndex.layout = (page: ReactNode) => (
  <SideBarLayout user={(page as any).props.auth.user}>
    {page}
  </SideBarLayout>
)
