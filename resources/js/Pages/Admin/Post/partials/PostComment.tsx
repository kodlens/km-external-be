import { Comments, PageProps } from '@/types';
import { App, Button, Form, Input } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import dayjs from 'dayjs';
import { usePage } from '@inertiajs/react';


export default function PostComment( 
    { id, className } : 
    { id:number,
        className: string
     }
) {

    const [form] = Form.useForm();
    const {auth} = usePage<PageProps>().props;

    const [data, setData] = useState<Comments[]>([])
    const [errors, setErrors] = useState<any>({})

    const [loading, setLoading] = useState<boolean>(false)
    const { message } = App.useApp();

    useEffect(()=>{
        loadAsync()
    },[])
    
    const submit = (values:object) => {
        setLoading(true)
        axios.post('/panel/posts-comments/' + id, values).then(res=>{
            if(res.data.status === 'comment-saved'){
                setLoading(false)

                message.success("Comment successfully saved");
                form.resetFields()
                loadAsync()
            }
        }).catch(err => {
            setLoading(false)
            if(err.response.status === 422)
                setErrors(err.response.data.errors)
            else{
                message.error('Unexpected error occured. Please contact system administrator. Error: ' + err)
            }
        })
    }

    const loadAsync = () => {
        axios.get('/panel/get-posts-comments/'+ id).then(res=>{
            setData(res.data);
        }).catch(err=>{
            message.error('Unexpected error occured. Please contact system administrator. Error: ' + err)
        })
    }

    const postDate = (item:Date):string=> {
        return dayjs(item).format('MMM-DD-YYYY, hh:mm a')
    }

  return (
    <div className={`${className} bg-white p-6 mx-2 h-[680px]`}>
        <div className="font-bold text-lg pb-2 mb-2 border-b">COMMENTS</div>

        <div className="h-[450px] overflow-auto">
            {data.map((item:Comments) => 
                (
                    <div key={item.id}
                        className='mb-2 mx-1'>
                       
                        {auth.user.role?.toUpperCase() === item.role.toUpperCase() ? (
                            <div className='flex flex-col items-end'>
                               
                                <div className="font-bold font-secondary text-[14px]">{item.lastname?.toUpperCase()} {item.firstname[0]}.</div>
                                <div className="text-[12px]">{item.role?.toUpperCase()}</div>
                                <div className='text-gray-800 font-bold text-[10px]'>
                                    {
                                        postDate(item.created_at)
                                    }
                                </div>
                                <div className='text-black bg-blue-300 rounded-md p-2'>{item.comments}</div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-start'>
                                <div className="font-bold font-secondary text-[14px]">{item.lastname?.toUpperCase()} {item.firstname[0]}.</div>
                                <div className="text-[12px]">{item.role?.toUpperCase()}</div>
                                <div className='text-gray-800 font-bold text-[10px]'>
                                    {
                                        postDate(item.created_at)
                                    }
                                </div>
                                <div className='text-black bg-green-300 rounded-md p-2'>{item.comments}</div>
                            </div>
                        )}

                    </div>
                )
            )}
        </div>
       
        <div className='border-t mt-2'>

            <Form onFinish={submit}
                className='mt-2'
                form={form}
                layout='vertical'
                autoComplete='off'
                initialValues={{
                    comments: ''
                }}
            >
                <Form.Item
                    name="comments"
                    validateStatus={errors.comments ? 'error' : ''}
                    help={errors.comments ? errors.comments[0] : ''}>
                    <Input.TextArea placeholder="Comments"></Input.TextArea>
                </Form.Item>

                <Button 
                    className=''
                    loading={loading}
                    htmlType='submit'
                    type='primary'>Comment</Button>
            </Form>
        </div>
    </div>
  )
}
