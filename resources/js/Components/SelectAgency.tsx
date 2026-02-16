
import { Agency } from "@/types/agency";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string>
}
export const SelectAgency = ( { errors } : Props ) => {

  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/get-agencies').then(res => {
      setAgencies(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return agencies.map(item => ({ value: item.code, label: item.code }))
  }


  return (
    <>
      <Form.Item
        name="agency"
        label="Select Agency"
        className="w-full"
        validateStatus={errors.agency ? "error" : ""}
        help={errors.agency ? errors.agency[0] : ""}
      >
        <Select loading={loading} options={agencies ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
