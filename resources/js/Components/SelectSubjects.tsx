import { Subject, SubjectHeading } from '@/types/subject';
import { Button, Form, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  form: FormInstance;
};

const SelectSubjects = ({ form }: Props) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [headingsByIndex, setHeadingsByIndex] = useState<
    Record<number, SubjectHeading[]>
  >({});
  const [loadingIndex, setLoadingIndex] = useState<Record<number, boolean>>({});

  const loadedRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    axios.get('/get-subjects').then(res => setSubjects(res.data));
  }, []);

  const loadSubjectHeadings = async (subjectId: number, index: number) => {
    setLoadingIndex(prev => ({ ...prev, [index]: true }));

    const res = await axios.get(`/get-subject-headings/${subjectId}`);

    setHeadingsByIndex(prev => ({
      ...prev,
      [index]: res.data
    }));

    setLoadingIndex(prev => ({ ...prev, [index]: false }));
  };

  // ✅ SAFE preload for edit mode
  useEffect(() => {
    const rows = form.getFieldValue('subjects') || [];

    rows.forEach((row: any, index: number) => {
      if (row?.subject_id && !loadedRef.current[index]) {
        loadedRef.current[index] = true;
        loadSubjectHeadings(row.subject_id, index);
      }
    });
  }, [form]);

  return (
    <Form.List name="subjects">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }, index) => (
            <div
              key={key}
              className="grid grid-cols-12 gap-4 w-full items-start"
            >
              <Form.Item
                name={[name, 'subject_id']}
                label="Subject"
                className="col-span-4 min-w-0"

              >
                <Select
                  className="w-full"
                  options={subjects.map(s => ({
                    label: s.subject,
                    value: s.id
                  }))}
                  onChange={(value) => {
                    form.setFieldValue(
                      ['subjects', index, 'subject_heading_id'],
                      undefined
                    );
                    loadedRef.current[index] = true;
                    loadSubjectHeadings(value, index);
                  }}
                />
              </Form.Item>

              <Form.Item
                name={[name, 'subject_heading_id']}
                label="Subject Heading"
                className="col-span-7 min-w-0"
              >
                <Select
                  className="w-full"
                  loading={loadingIndex[index]}
                  options={(headingsByIndex[index] || []).map(h => ({
                    label: h.subject_heading,
                    value: h.id
                  }))}
                />
              </Form.Item>

              <div className="col-span-1 flex items-center mt-7">
                <Button
                  danger
                  onClick={() => remove(name)}
                  icon={<Trash size={16} />}
                />
              </div>
            </div>
          ))}

          <Button type="primary" onClick={() => add()} className="mt-2">
            Add Subject
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default SelectSubjects;
