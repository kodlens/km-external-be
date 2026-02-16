import { dateFormat, formatNumber, truncate } from '@/helper/helperFunctions'

import { router } from '@inertiajs/react'
import { Table, Dropdown, Button, Pagination, App, MenuProps } from 'antd'
import modal from 'antd/es/modal'
import Column from 'antd/es/table/Column'
import axios from 'axios'
import ArticleView from '@/Components/InfoView'
import { Info } from '@/types/info'
import { menuItems } from '@/helper/menuItems'
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
  extraActions?: (info: Info) => MenuProps['items']

}
const TableInfos = (
  { routePrefix, data, isFetching, refetch, page, paginationPageChange,
    showEdit, showTrash, showView, showPublish, showDraft, showDelete
}: Props) => {

  const {notification} = App.useApp();

  const statusStyles: Record<string, string> = {
    submit: 'bg-blue-100 text-blue-700',
    publish: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-700',
    return: 'bg-red-100 text-red-700',
  }
  const handleView = (info: Info) => {
    modal.info({
      width: 1024,
      title: 'Article Preview',
      content: <ArticleView info={info} className={''} />,
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
          dataIndex="title"
          render={(title) => (
            <div className="font-medium text-slate-900">
              {title}
            </div>
          )}
        />

        {/* SUMMARY */}
        <Column
          title="Information"
          render={(_, info: Info) => (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                {info.description_text
                  ? truncate(info.description_text, 14)
                  : '—'}
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
                : '—'}
            </span>
          )}
        />

        {/* STATUS */}
        <Column
          title="Status"
          dataIndex="status"
          render={(status: string) => (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] ?? 'bg-slate-100'
                }`}
            >
              {status.toUpperCase()}
            </span>
          )}
        />

        {/* ACTION */}
        <Column
          title="Action"
          render={(_, info: Info) => (
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
                      content: 'This article will be moved to trash.',
                      onOk: async () => {
                        await axios.post(`/${routePrefix}/article-trash/${info.id}`)
                        refetch()
                      },
                    })
                  } : undefined,
                  handleView: showView ? () => handleView(info) : undefined,
                  handlePublish: showPublish ? async () => {
                    await axios.post(`/${routePrefix}/article-publish/${info.id}`).then(() => {
                       notification.success({
                        message: 'Article has been published.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDraft: showDraft ? async () => {
                    await axios.post(`/${routePrefix}/article-draft/${info.id}`).then(() => {
                       notification.success({
                        message: 'Article has been returned to draft.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDelete: showDelete ? () => {
                    modal.confirm({
                      title: 'Delete Article?',
                      content: 'This article will be permanently deleted.',
                      onOk: async () => {
                        await axios.delete(`/${routePrefix}/articles/${info.id}`)
                        refetch()
                      },
                    })
                  } : undefined
                }) as MenuProps['items'],
              }}
            >
              <Button size="small" type="text">
                •••
              </Button>
            </Dropdown>
          )}
        />

      </Table>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6 mb-4 flex justify-between">
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
