import { FeaturedVideo } from "@/types";
import { Button, Form, InputNumber, Modal, notification } from "antd"
import axios from "axios";
import { ArrowDownUp } from "lucide-react"
import { EventHandler, useState } from "react";

const ModalOrderNo = ( {video, onDone }: {video:FeaturedVideo, onDone: ()=>void}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const submit = async (fields:any) => {
    setLoading(true)
    try {
      const res = await axios.post(`/admin/page-sections/video/update-order-no/${video.id}`, fields)
      if(res.data.status === 'order_updated'){
        notification.success({
          message: 'Order No. Updated!',
          description: 'Order no. successfully updated.'
        })
        setLoading(false)
        setIsModalOpen(false)
        onDone()
      }
    }catch(err) {
      setLoading(false)
      console.log(err);
    }
  }

  return (
    <>
      <Button type="primary"
        loading={loading}
        icon={<ArrowDownUp size={16} />} onClick={showModal} />
        <Modal
          title="Order No."
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          okButtonProps={{
              autoFocus: true,
              htmlType: "submit",
          }}
          onCancel={handleCancel}
          destroyOnClose
          confirmLoading={loading}
          modalRender={(dom) => (
            <Form initialValues={{
                order_no: video.order_no
              }}
              layout="vertical"
              onFinish={submit}
            >
               {dom}
            </Form>
          )}
        >
          <Form.Item
            name="order_no"
            className="w-full">
              <InputNumber className="w-full" />
          </Form.Item>
            
        </Modal>
        
    </>
  )
}

export default ModalOrderNo