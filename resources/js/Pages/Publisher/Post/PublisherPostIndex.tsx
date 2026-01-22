import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";


import {
  EnterOutlined,
  EditOutlined,
  EyeOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

import {
  Space,
  Table,
  Pagination,
  Button,
  Form,
  Input,
  Select,
  Dropdown,
  MenuProps,
  App,
  Modal,
  DatePicker,
} from "antd";

import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import ArticleView from "@/Components/Post/ArticleView";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { dateFormat, handleImageError, truncate } from "@/helper/helperFunctions";
import ModalUpdatePublishDate, { ModalUpdatePublishDateHandle } from "@/Components/ModalUpdatePublishDate";
import { PageProps } from "@/types";
import { Post } from "@/types/post";


const { Column } = Table;

interface PostResponse {
  data: any[];
  //data: Post[];
  total: number;
}


export default function PublisherPostIndex({
}: PageProps) {
  const { modal } = App.useApp();

  //const [form] = Form.useForm();

  const [status, setStatus] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const modalRef = useRef<ModalUpdatePublishDateHandle>(null)

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['posts' ,page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        perpage: perPage.toString(),
        search: search.toString(),
        status: status.toString()
      })

      const res = await axios.get(`/publisher/get-posts?${params}`);
      return res.data
    }
  })

  const createMenuItems = (post: Post) => {
    const items: MenuProps["items"] = [];

    if (post.status === 'submit' || post.status === 'unpublish') {
      //published (7)
      items.push(
        {
          label: "Form View",
          key: "1",
          icon: <EditOutlined />,
          onClick: () => {
            router.visit("/publisher/posts-form-view/" + post.id);
          },
        },
        {
          label: "Modal View",
          key: "2",
          icon: <EyeOutlined />,
          onClick: () => {
            modal.info({
              width: 1024,
              title: "Article Display",
              content: <ArticleView post={post} className="" />,
              onOk() { },
            });
          },
        },
        {
          key: "posts.published",
          icon: <ProjectOutlined />,
          label: "Publish",
          onClick: () => {

            axios
              .post("/publisher/posts-publish/" + post.id)
              .then((res) => {
                if (res.data.status === "publish") {
                  modal.success({
                    title: "Saved!",
                    content: "Post published.",
                  });
                  refetch()
                }
              });
          },
        },

        {
          key: "posts.return",
          icon: <EnterOutlined />,
          label: "Return to encoder",
          onClick: () => {

            axios
              .post(
                "/publisher/posts-return-to-encoder/" + post.id
              )
              .then((res) => {
                if (res.data.status === "return") {
                  modal.success({
                    title: "Saved!",
                    content:
                      "Post return to author successfully.",
                  });
                  refetch()
                }

              });
          }
        },
        {
          key: "posts.set-publish-date",
          icon: <ProjectOutlined />,
          label: "Set Publish Date",
          onClick: () => modalRef.current?.openModal(post.id)
        },
      );
    }


    if(post.status === 'publish'){
      items.push(
        {
          key: "posts.unpublish",
          icon: <ProjectOutlined />,
          label: "Unpublish",
          onClick: () => {

            axios
              .post("/publisher/posts-unpublish/" + post.id)
              .then((res) => {
                if (res.data.status === "unpublish") {
                  modal.success({
                    title: "Saved!",
                    content: "Post unpublished.",
                  })
                  refetch()
                }
              });
          },
        },
      );
    }


    // items.push()
    return items;
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    //loadAsync(search, perPage, page)
  };



  const handleTrashClick = (id: number) => {
    modal.confirm({
      title: "Trash?",
      content: "Are you sure you want to move to trash this post?",
      onOk: async () => {
        const res = await axios.post("/publisher/posts-trash/" + id);
        if (res.data.status === "trashed") {
          refetch()
        }
      },
    });
  };

  const handleSoftDelete = (id: number) => {
    modal.confirm({
      title: "Delete?",
      content: "Are you sure you want to delete this post?",
      onOk: async () => {
        const res = await axios.post(
          "/publisher/posts-soft-delete/" + id
        );
        if (res.data.status === "soft_deteled") {
          refetch()
        }
      },
    });
  };

  const handSearchClick = () => {
    refetch()
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") handSearchClick();
  }, [search, status]);

  return (
    <>
      <Head title="POST/ARTICLE"></Head>

      <div className="flex justify-center items-center">
        {/* card */}
        <div
          className="p-6 max-w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]"
        >
          {/* card header */}
          <div className="font-bold text-lg mb-4">
            LIST OF ARTICLES
          </div>

          {/* card body */}

          <div className="flex gap-2 mb-2">
            <Select
              style={{
                width: "200px",
              }}
              defaultValue=""
              onChange={handleStatusChange}
              options={[
                { label: "All", value: "" },
                {
                  label: "Submit for Publishing",
                  value: "submit",
                },
                { label: "Return to author", value: "return" },
              ]}
            />

            <Input
              placeholder="Search Id / Title"
              onKeyDown={handleKeyDown}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" onClick={handSearchClick}>
              SEARCH
            </Button>
          </div>

          <Table
            dataSource={data ? data.data : []}
            loading={isFetching}
            rowKey={(data) => data.id}
            pagination={false}
          >
            <Column title="Id" dataIndex="id" />
            <Column
              title="Title"
              dataIndex="title"
              key="title"
            />
            <Column
              title="Description"
              dataIndex="description_text"
              key="description_text"
              render={(description_text) => (
                <span>
                  {description_text ? truncate(description_text, 10) : ""}
                </span>
              )}
            />

            <Column
              title="Publication Date"
              key="publication_date"
              render={(data) => {
                return (
                  <>
                    {data.publish_date &&
                      dateFormat(data.publish_date)}
                  </>
                );
              }}
            />

            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(status) => (
                <div>
                  {status === "submit" && (
                    <div className="bg-green-300 font-bold text-center text-[10px] px-2 py-1 rounded-full">
                      SUBMIT FOR PUBLISHING
                    </div>
                  )}

                  {status === "draft" && (
                    <div className="bg-orange-200 font-bold text-center text-[10px] px-2 py-1 rounded-full">
                      DRAFT
                    </div>
                  )}

                  {status === "return" && (
                    <div className="bg-red-200 font-bold text-center text-[9px] px-2 py-1 rounded-full">
                      RETURN TO ENCODER
                    </div>
                  )}

                  {status === "unpublish" && (
                    <div className="bg-red-200 font-bold text-center text-[10px] px-2 py-1 rounded-full">
                      UNPUBLISH
                    </div>
                  )}
                  {status === "publish" && (
                    <div className="bg-green-200 font-bold text-center text-[10px] px-2 py-1 rounded-full">
                      PUBLISH
                    </div>
                  )}
                </div>
              )}
            />

            <Column
              title="Date Created"
              key="created_at"
              render={(data) => data.created_at && dateFormat(data.created_at)}
            />

            <Column
              title="Action"
              key="action"
              render={(_, data: Post) => (
                <Space size="small">
                  <Dropdown
                    menu={{
                      items: createMenuItems(data),
                    }}
                    trigger={['click']}
                  >
                    <Button variant="outlined">...</Button>
                  </Dropdown>
                </Space>
              )}
            />
          </Table>

          <Pagination
            className="mt-4"
            onChange={(page, pageSize) => {
              setPerPage(pageSize)
              setPage(page)
              refetch()
            }}
            defaultCurrent={1}
            total={data?.total}
          />

        </div>
        {/* card */}


        {/* component in updateing date using modal */}
        <ModalUpdatePublishDate
          uri="/publisher/post-set-publish-date"
          ref={modalRef}
          onRefresh={() => refetch()} />


      </div>
    </>
  );
}

PublisherPostIndex.layout = (page: any) => <Authenticated user={page.props.auth.user}>{page}</Authenticated>
