import { Subject, SubjectHeading } from '@/types/subject';
import { Button, Form, Select } from 'antd'
import { FormInstance } from 'antd/es/form';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react'

type FormSubject = {
  subject_id: number;
  subject_heading_id: number;
}

const SelectSubjects = ({form}: {form: FormInstance}) => {

  const [errors, setErrors] = useState<any>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectHeadings, setSubjectHeadings] = useState<SubjectHeading[]>([]);

  const [formSubjects, setFormSubjects] = useState<FormSubject[]>([]);

  const [subject, setSubject] = useState<Subject>();
  const [subjectHeading, setSubjectHeading] = useState<SubjectHeading>();

  const loadSubjects = () => {
    //axios call to load subjects
    axios.get('/get-subjects').then(res => {
      setSubjects(res.data)
    }).catch(error => {
      console.log(error);
    });
  }

  const loadSubjectHeadings = (subjectId: number) => {
    axios.get(`/get-subject-headings/${subjectId}`).then(res => {
      setSubjectHeadings(res.data);
    }).catch(error => {
      console.log(error);
    });
  }


  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {

    form.setFieldsValue({
      subject: subject?.id,
      subject_heading: subjectHeading?.id
    });


    loadSubjectHeadings(subject?.id || 1);
  }, [subject]);


  const addFormSubject = () => {
    setFormSubjects([...formSubjects, { subject_id: 0, subject_heading_id: 0 }]);
  }


  return (
    <Form.List name="subjects">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }, index) => (
            <div key={key} className="flex gap-4 w-full items-center">

              <Form.Item
                name={[name, 'subject_id']}
                label="Subject"
                className="w-1/3 min-w-0"
              >
                <Select
                  className='w-full'
                  options={subjects.map(s => ({
                    label: s.subject,
                    value: s.id
                  }))}
                  onChange={(value) => {
                    form.setFieldValue(
                      ['subjects', index, 'subject_heading_id'],
                      undefined
                    );
                    loadSubjectHeadings(value);
                  }}
                />
              </Form.Item>

              <Form.Item
                name={[name, 'subject_heading_id']}
                label="Subject Heading"
                className="w-2/3 min-w-0"
              >
                <Select
                  className='w-full'
                  options={(subjectHeadings || []).map(h => ({
                    label: h.subject_heading,
                    value: h.id
                  }))}
                />
              </Form.Item>

              <div>
                <Button danger
                  className=''
                  onClick={() => remove(name)}>
                    <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}

          <Button type="primary" onClick={() => add()}>
            Add Subject
          </Button>
        </>
      )}
    </Form.List>

  )
}

export default SelectSubjects
