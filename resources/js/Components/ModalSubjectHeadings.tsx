import React, { useEffect } from 'react'
import { Button, Input, Modal, Table } from 'antd';
import { SubjectHeading } from '@/types/subject';
import axios from 'axios';
import Search from 'antd/es/input/Search';

const ModalSubjectHeadings = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [subjectHeadings, setSubjectHeadings] = React.useState<SubjectHeading[]>([]);
  const [search, setSearch] = React.useState<string>("");

  const loadSubjectHeadings = () => {
    // Load subject headings from the server or use static data
    // setSubjectHeadings(data);
    axios.get(`/get-subject-headings?search=${search}`).then(res => {
      setSubjectHeadings(res.data);
    });
  }

  useEffect(() => {
    loadSubjectHeadings();
  }, []);

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  return (
    <div>

      <Button
        onClick={() => setIsModalOpen(true)}>
        Add Manually
      </Button>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>

        <div className='my-2'>
          <Input placeholder="Search Subject Headings"
          onChange={ (e) => setSearch(e.target.value) }
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              loadSubjectHeadings();
            }
          }} />
        </div>
        <Table
          dataSource={subjectHeadings}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id'
            },
            {
              title: 'Subject Heading',
              dataIndex: 'subject_heading',
              key: 'subject_heading'
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button type="link" onClick={() => {
                  // Handle adding the subject heading to the article
                  console.log('Add subject heading:', record);
                }}>
                  Add
                </Button>
              )
            }
          ]}
        ></Table>

      </Modal>

    </div>
  )
}

export default ModalSubjectHeadings

