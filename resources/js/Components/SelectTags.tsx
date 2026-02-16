import { Select } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

const SelectTags = (  ) => {

  const [tags, setTags] = useState<string[]>([])
  const [loading,setLoading] = useState<boolean>(false)
  const loadTags = ( ) => {
    setLoading(true)
    axios.get('/get-tags').then(res => {
      setTags(res.data)
      setLoading(false)
    })
  }

  useEffect(()=>{
    loadTags();
    //console.log(form.getFieldValue('tags'));
  }, [])
  return (
    <>
      <Select
        loading={loading}
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Tags Mode"

        options={tags.map(item => ({ value: item, label: item }))}
      />
    </>
  )
}

export default SelectTags
