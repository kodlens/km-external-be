
import { Region } from "@/types/region";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string>
}

export const SelectRegion = ( { errors } : Props ) => {

  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const loadData = async () => {
    setLoading(true);
    await axios.get('/get-regions').then(res => {
      setRegions(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    const sdata = regions.map(item => ({ value: item.name, label: item.name }))
    return sdata;

  }


  return (
    <>
      <Form.Item
        name="region"
        label="Select Region"
        className="w-full"
        validateStatus={errors.region ? "error" : ""}
        help={errors.region ? errors.region[0] : ""}
      >
        <Select loading={loading} options={regions ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
