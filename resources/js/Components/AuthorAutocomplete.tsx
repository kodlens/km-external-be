import { Author } from '@/types/author'
import { AutoComplete } from 'antd'
import { useState } from 'react'

type Props = {
  //options: AutoCompleteOption[]
  authors: Author[]
  value?: string
  onChange?: (value: string) => void
}

type AutoCompleteOption = {
  value: string
}
export default function AuthorAutoComplete({
  onChange,
  authors,
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

    const filtered = authors
      .filter(author =>
        author.author_name?.toLowerCase().includes(value.toLowerCase())
      )
      .filter(author => author.author_name !== undefined)
      .map(author => ({
        value: author.author_name as string, // ✅ required by AntD
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
      placeholder="Author"

      allowClear
    >
    </AutoComplete>
  )
}
