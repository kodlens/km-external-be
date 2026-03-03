import { SubjectHeading } from '@/types/subject';
import { App, Button, Form, FormInstance, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { Key } from 'react';
import ModalSubjectHeadings from './ModalSubjectHeadings';


type PageProps = {
  form: FormInstance
  errors: Record<string, string[]>
}

type ClassifierProps = {
  id: number,
  subject_heading_id: number,
  subject_heading?: string,
  score: number,
  analysis: string
}

const Classifier = ( { form, errors } : PageProps) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  const [data, setData] = useState<ClassifierProps[]>([]);
  const [newData, setNewData] = useState<ClassifierProps[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [subjectHeadings, setSubjectHeadings] = useState<SubjectHeading[]>([]);

  const handleClassification = () => {
    setLoading(true)
    const content = form.getFieldValue("description");

    if (content === undefined || content.trim() === "") {
      notification.error({
        message: "Empty Content",
        description: "Description is empty. Please provide content for classification.",
        duration: 5,
      });
      setLoading(false);
      return;
    }

    axios.post("/classify-article", { content: content }).then((res) => {
      if (res.data.results.length === 0) {
        notification.info({
          message: "No Relevant Subject Headings",
          description: "The AI did not find any relevant subject headings for this article.",
          duration: 5,
        });
      }
      setData(res.data.results);
      setSelectedRowKeys([]);
      setLoading(false)

    }).catch((err) => {
      //message.error(`Classification failed: ${err.message}`);
      console.log(err);
      setLoading(false);
    });
  }

  const loadSubjectHeadings = async () => {
    const res = await axios.get(`/get-subject-headings`);
    setSubjectHeadings(res.data);
  };

  useEffect(() => {
    loadSubjectHeadings();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const matchedHeadings = data.map(item => {
        const matched = subjectHeadings.find(heading => heading.id === item.id);
        console.log('matched', matched);

        return matched ? { ...item, subject_heading: matched?.subject_heading } : item;
      });
      setNewData(matchedHeadings);
    } else {
      setNewData([]);
    }
  }, [data]);


  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      const selectedHeadings = newData.filter(item => selectedRowKeys.includes(item.subject_heading_id));
      form.setFieldValue("subjects", selectedHeadings.map(item => { return {
        subject_heading_id: item.subject_heading_id,
        subject_heading: item.subject_heading,
        score: item.score,
        analysis: item.analysis
      } }));
    } else {
      form.setFieldValue("subjects", []);
    }

    //console.log('update selectedRowKeys:', form.getFieldValue("subjects"));

  }, [selectedRowKeys]);

  useEffect(() => {
    //console.log('newData updated:', newData);
  }, [newData]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleClickModal = () => {
    setModalOpen(true);
  }

  return (
    <>
      <Button
        type="primary"
        loading={loading}
        onClick={() => {
          handleClassification();
        }}>
        Classify Information
      </Button>

      <Form.Item name="subjects"
        className="mt-4"
        validateStatus={errors.subjects ? "error" : ""}
        help={errors.subjects ? errors.subjects[0] : ""}>
        {data.length > 0 && (
          <div>
            <h3 className='my-2'>AI Classification Results:</h3>
            <Table
              rowKey="id"
              dataSource={newData}
              pagination={false}
              size="small"
              rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys) => {
                  setSelectedRowKeys(newSelectedRowKeys);
                },
              }}
              columns={[
                {
                  title: "Id",
                  dataIndex: "id",
                  key: "id",
                  width: 120,
                },
                {
                  title: "Subject Heading",
                  dataIndex: "subject_heading",
                  key: "subject_heading",
                  width: 120,
                },
                {
                  title: "Score",
                  dataIndex: "score",
                  key: "score",
                  width: 120,
                },
                {
                  title: "Analysis",
                  dataIndex: "analysis",
                  key: "analysis",
                },
              ]}
            />
          </div>
        )}
      </Form.Item>

      <ModalSubjectHeadings  />

    </>
  )
}

export default Classifier
