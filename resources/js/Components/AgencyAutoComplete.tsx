
import { Agency } from '@/types/agency'
import { AutoComplete } from 'antd'
import { useState } from 'react'




type Props = {
  //options: AutoCompleteOption[]
  agencies: Agency[]
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}
export default function AgencyAutoComplete({
  onChange,
  agencies,
  value }:
  Props
) {

 // const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>([])

  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredOptions([])
      return
    }

    const filtered = agencies
      .filter(item =>
        item.agency?.toLowerCase().includes(value.toLowerCase())
      )
      .filter(item => item.agency !== undefined)
      .map(item => ({
        value: item.agency as string, // ✅ required by AntD
      }))

    setFilteredOptions(filtered)
  }

  // const handleSelect = (value: string) => {
  //   form.setFieldsValue({
  //     author: value
  //   })
  // }


  return (
    <AutoComplete
      options={filteredOptions}
      onSearch={handleSearch}
      value={value}
      onChange={onChange}

      style={{ width: '100%' }}
      placeholder="Type Agency to Search"

      allowClear
    >
    </AutoComplete>
  )
}
