
import { Info } from "@/types/info";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const menuItems = (
  {
    handleEditClick,
    handleTrashClick,
    handleView,
    handlePublish,
    handleDraft,
    handleDelete,
    info,
    prefix
  }:
  {
    handleEditClick?: () => void,
    handleTrashClick?: () => void,
    handleView?: () => void,
    handlePublish?: () => void,
    handleDraft?: () => void,
    handleDelete?: () => void
    info?: Info,
    prefix: string
  }
) => {
  const items = []

  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: `${prefix}.infos.edit`,
      disabled: info?.status === 'publish',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: `${prefix}.infos.trash`,
      disabled: info?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    })
  }

  if(handlePublish){
    items.push({
      label: 'Publish',
      key: `${prefix}.infos.publish`,
      disabled: info?.status === 'publish',
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    })
  }

  if(handleDraft) {
    items.push({
      label: 'Draft',
      disabled: info?.status === 'draft',
      key: `${prefix}.infos.draft`,
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    })
  }

  if(handleView){
    items.push({
      label: 'View',
      key: `${prefix}.infos.view`,
      icon: <Eye size={15} />,
      onClick: () => handleView()
    })
  }


  if(handleDelete){
    items.push(
      {
        type: 'divider'
      },
      {
      label: 'Delete',
      key: `${prefix}.infos.delete`,
      disabled: info?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    })
  }



  return items
}
