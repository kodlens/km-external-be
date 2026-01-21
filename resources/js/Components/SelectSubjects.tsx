import { Subject, SubjectHeading } from '@/types/subject';
import { Button, Form, Select } from 'antd'
import { FormInstance } from 'antd/es/form';
import axios from 'axios';
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
    <div className=''>
      { formSubjects.length > 0 && formSubjects.map((formSubject, index) => (

        <div key={index} className="flex gap-4">

          <Form.Item
              name={`subjects[${index}][subject_id]`}
              className="w-full"
              label="Subject"
              validateStatus={
                errors.subjects && errors.subjects[index] && errors.subjects[index].subject_id ? "error" : ""
              }
              help={errors.subjects && errors.subjects[index] && errors.subjects[index].subject_id ? errors.subjects[index].subject_id[0] : ""}
            >
              <Select
                options={subjects.map((subject) => ({
                  label: subject.subject,
                  value: subject.id
                }))}
                onChange={(value) => {
                  const selectedSubject = subjects.find(subject => subject.id === value);
                  setSubject(selectedSubject);
                }}
              >
              </Select>
            </Form.Item>

            <Form.Item
              name={`subjects[${index}][subject_heading_id]`}
              className="w-full"
              label="Subject Heading"
              validateStatus={
                errors.subjects && errors.subjects[index] && errors.subjects[index].subject_heading_id ? "error" : ""
              }
              help={errors.subjects && errors.subjects[index] && errors.subjects[index].subject_heading_id ? errors.subjects[index].subject_heading_id[0] : ""}
            >
              <Select
                options={subjectHeadings.map((subjectHeading) => ({
                  label: subjectHeading.subject_heading,
                  value: subjectHeading.id
                }))}
                onChange={(value) => {
                  const selectedSubjectHeading = subjectHeadings.find(subjectHeading => subjectHeading.id === value);
                  setSubjectHeading(selectedSubjectHeading);
                }}
              >
              </Select>
            </Form.Item>




            <Button size='small' danger onClick={() => {
              const newFormSubjects = [...formSubjects];
              newFormSubjects.splice(index, 1);
              setFormSubjects(newFormSubjects);
            }}>Remove</Button>

        </div>

      ))}

      <Button size='small' type="primary" onClick={addFormSubject}>Add Subject</Button>



    </div>

  )
}

export default SelectSubjects
