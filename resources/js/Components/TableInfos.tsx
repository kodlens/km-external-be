import { dateFormat, formatNumber, truncate } from '@/helper/helperFunctions'

import { router } from '@inertiajs/react'
import { Table, Dropdown, Button, Pagination, App, MenuProps, Space } from 'antd'
import Column from 'antd/es/table/Column'
import axios from 'axios'
import InfoView from '@/Components/InfoView'
import { Info } from '@/types/info'
import { menuItems } from '@/helper/menuItems'
import { EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons'
import { Ellipsis } from 'lucide-react'
//import { adminMenuItems } from '@/helper/adminMenuItems'


type Props = {
  routePrefix: string
  data: { data: Info[], total: number }
  isFetching: boolean
  page: number
  paginationPageChange: (page: number) => void
  refetch: () => void
  // New Props
  showEdit?: boolean
  showDelete?: boolean
  showTrash?: boolean
  showPublish?: boolean
  showDraft?: boolean
  showView?: boolean
  showReturn?: boolean
  showSubmit?: boolean
  extraActions?: (info: Info) => MenuProps['items']

}
const TableInfos = (
  { routePrefix, data, isFetching, refetch, page, paginationPageChange,
    showEdit, showTrash, showView, showPublish, showDraft, showDelete, showReturn, showSubmit
}: Props) => {

  const {notification, modal} = App.useApp();

  const statusMeta: Record<string, { label: string; className: string }> = {
    submit: { label: 'For Review', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
    publish: { label: 'Published', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border border-slate-200' },
    return: { label: 'Returned', className: 'bg-rose-100 text-rose-800 border border-rose-200' },
  }

  const lineClampTwoStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: 2,
    overflow: 'hidden',
  }

  const handleView = (info: Info) => {
    modal.info({
      width: 1024,
      title: 'Information Preview',
      content: <InfoView info={info} className={''} />,
    })
  }

  return (
    <>
      {/* ================= TABLE ================= */}
      <Table
        size="middle"
        bordered
        loading={isFetching}
        dataSource={data?.data}
        rowKey={(row: Info) => row.id}
        pagination={false}
        expandable={{
          expandedRowRender: (info: Info) => (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="grid md:grid-cols-5 gap-4 text-sm">
                {/* <div>
                  <div className="text-slate-500">Category</div>
                  <div className="font-medium">{info.category?.name}</div>
                </div> */}
                {/* <div>
                  <div className="text-slate-500">Section</div>
                  <div className="font-medium">{info.section?.name}</div>
                </div> */}
                <div>
                  <div className="text-slate-500">Author</div>
                  <div className="font-medium">{info.author_name}</div>
                </div>
                <div>
                  <div className="text-slate-500">Modified</div>
                  <div>{dateFormat(info.last_updated_at?.toString() ?? '')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Encoded</div>
                  <div>{dateFormat(info.encoded_at?.toString() ?? '')}</div>
                </div>
              </div>
            </div>
          ),
        }}
      >

        {/* ID */}
        <Column title="ID" dataIndex="id" width={70} />

        {/* TITLE */}
        <Column
          title="Title"
          width={300}
          dataIndex="title"
          render={(title) => (
            <div className="font-medium text-slate-900 leading-6" style={lineClampTwoStyle} title={title}>
              {title}
            </div>
          )}
        />

        {/* SUMMARY */}
        <Column
          title="Information"
          width={300}
          render={(_, info: Info) => (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 leading-6" style={lineClampTwoStyle} title={info.description_text ?? ''}>
                {info.description_text
                  ? truncate(info.description_text, 10)
                  : '-'}
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Encoded By:</span>
                { info.encoded_by ? (
                  <span
                  className={`px-2 py-0.5 rounded-full font-medium `}
                >
                  {info.encoded_by_name?.fname} {info.encoded_by_name?.lname}
                </span>
                ):null}

              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Modified By:</span>
                { info.last_updated_by ? (
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium `}
                  >
                    {info.last_updated_by_name ? info.last_updated_by_name.fname : ''} {info.last_updated_by_name ? info.last_updated_by_name.lname : ''}
                  </span>
                ): null}
              </div>

            </div>
          )}
        />

        {/* PUBLICATION DATE */}
        <Column
          title="Publication Date"
          render={(_, info: Info) => (
            <span className="text-sm text-slate-700">
              {info.publish_date
                ? dateFormat(info.publish_date.toString())
                : '-'}
            </span>
          )}
        />

        {/* STATUS */}
        <Column
          title="Status"
          width={200}
          dataIndex="status"
          render={(status: string) => (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta[status]?.className ?? 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
              {statusMeta[status]?.label ?? status.toUpperCase()}
            </span>
          )}
        />

        {/* ACTION */}
        <Column
          title="Action"
          render={(_, info: Info) => (
            <Space size={4}>

              <Dropdown
                trigger={['click']}
                menu={{
                  items: menuItems({
                    info,
                    prefix: routePrefix,
                    handleEditClick: showEdit ? () =>
                      router.visit(`/${routePrefix}/infos/${info.id}/edit`)
                    : undefined,
                    handleTrashClick: showTrash ? async () => {
                      modal.confirm({
                        title: 'Move to Trash?',
                        content: 'This information will be moved to trash.',
                        onOk: async () => {
                          await axios.post(`/${routePrefix}/info-trash/${info.id}`)
                          refetch()
                        },
                      })
                    } : undefined,
                    handleView: showView ? () => handleView(info) : undefined,
                    handlePublish: showPublish ? async () => {
                      await axios.post(`/${routePrefix}/info-publish/${info.id}`).then(() => {
                        notification.success({
                          message: 'Information has been published.',
                        })
                        refetch()
                      })
                    } : undefined,
                    handleDraft: showDraft ? async () => {
                      await axios.post(`/${routePrefix}/info-draft/${info.id}`).then(() => {
                        notification.success({
                          message: 'Information has been returned to draft.',
                        })
                        refetch()
                      })
                    } : undefined,
                    handleDelete: showDelete ? () => {
                      modal.confirm({
                        title: 'Delete Information?',
                        content: 'This information will be permanently deleted.',
                        onOk: async () => {
                          await axios.delete(`/${routePrefix}/infos/${info.id}`)
                          refetch()
                        },
                      })
                    } : undefined,
                    handleReturn: showReturn ? () => {
                      modal.confirm({
                        title: 'Return Information?',
                        content: 'This information will be return to encoder.',
                        onOk: async () => {
                          await axios.post(`/${routePrefix}/info-return/${info.id}`)
                          refetch()
                        },
                      })
                    } : undefined,
                    handleSubmit: showSubmit ? () => {
                      modal.confirm({
                        title: 'Submit Information?',
                        content: 'This information will be submitted for review.',
                        onOk: async () => {
                          await axios.post(`/${routePrefix}/info-submit/${info.id}`)
                          refetch()
                        },
                      })
                    } : undefined,
                  }) as MenuProps['items'],
                }}
              >
                <Button icon={<Ellipsis size={15}/>} aria-label="More actions" />
              </Dropdown>
            </Space>
          )}
        />

      </Table>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Pagination
          size="small"
          current={page}
          total={data?.total}
          onChange={(value) => {
            paginationPageChange(value)
          }}
        />

        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span>Total:</span>
          <span className="font-bold text-gray-900">{formatNumber(data?.total)}</span>
        </div>
      </div>

    </>
  )
}

export default TableInfos

