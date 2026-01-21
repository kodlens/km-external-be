import {App, Checkbox, Form, Input, Modal} from "antd";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Section} from "@/types";
import axios from "axios";


export type ModalCreateEditSectionHandle = {
  openModal: (id: number) => void;
};

type Props = {
  onRefresh: () => void;
};

const ModalCreateEditSection = forwardRef<ModalCreateEditSectionHandle, Props>( ({onRefresh}, ref) => {

  const [open, setOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<any>({})
  const [id, setId] = useState<number>(0)
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  useImperativeHandle(ref, () => ({
    openModal: async (id: number) => {
      setId(id);
      setOpen(true);

      if(id > 0){
        try {
          const res = await axios.get<Section>(`/admin/sections/${id}`);
          form.setFields([
            { name: 'section', value: res.data.section },
            { name: 'active', value: !!res.data.active },
          ]);
        } catch (err) {}
      }
      //form.resetFields()
    },
  }))


  const onFinish = async (values:Section) =>{

    if(id > 0){
      try{
        const res = await axios.put('/admin/sections/' + id, values)
        if(res.data.status === 'updated'){
          notification.success({
            message: 'Updated!',
            description: 'Section successfully update.',
            placement: 'bottomRight',
          });

          onRefresh()
          setOpen(false)
        }
      }catch(err:any){
        if(err.response.status === 422){
          setErrors(err.response.data.errors)
        }
      }
    }else{
      try{
        const res = await axios.post('/admin/sections', values)
        if(res.data.status === 'saved'){
          notification.success({
            message: 'Saved!',
            description: 'Section successfully save.',
            placement: 'bottomRight',
          });

          onRefresh()
          setOpen(false)
        }
      }catch(err:any){
        if(err.response.status === 422){
          setErrors(err.response.data.errors)
        }
      }
    }
  }


  return (
    <>
      {/* Modal with Cancel and Save button*/}
      <Modal
        open={open}
        title="SECTION INFORMATION"
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            autoComplete='off'
            initialValues={{
              section: '',
              active: true,
            }}
            clearOnDestroy
            onFinish={(values) => onFinish(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="section"
          label="Section"
          validateStatus={errors.section ? 'error' : ''}
          help={errors.section ? errors.section[0] : ''}
        >
          <Input placeholder="Category"/>
        </Form.Item>

        <Form.Item
          name="active"
          valuePropName="checked"
        >
          <Checkbox>Active</Checkbox>
        </Form.Item>
      </Modal>
    </>
  )
})

export default ModalCreateEditSection;
