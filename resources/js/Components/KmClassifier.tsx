import { SubjectHeading } from '@/types/subject';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const KmClassifier = () => {

  const [loading, setLoading] = useState(false);
  const [subjectHeadings, setSubjectHeadings] = useState<SubjectHeading[]>([]);
  const [errros, setErrors] = useState<Record<string, string>>({});

  const getchSubjectHeadings = () => {
    setLoading(true);
    axios.get('/get-subject-headings').then(res => {
      setSubjectHeadings(res.data);
      setLoading(false);
    }).catch(err => {
      setErrors(err.response.data.errors);
      setLoading(false);
    });
  };

  const handleOnClick = () => {

  }

  useEffect(() => {
    getchSubjectHeadings();
  },[])

  return (
    <div className='my-4'>


    </div>
  )
}

export default KmClassifier
