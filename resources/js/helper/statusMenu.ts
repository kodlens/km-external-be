export const statusDropdownMenu = (role:string) => {
  switch (role) {
    case 'admin':
      return [
        { value: 'draft', label: 'Draft' },
        { value: 'publish', label: 'Publish' },
        //{ value: 'unpublish', label: 'Unpublish' },
        //{ value: 'archive', label: 'Archive' },
        //{ value: 'return', label: 'Return' },
        //{ value: 'submit', label: 'Submit for Publishing' }
      ]
    case 'publisher':
      return [
        { value: 'draft', label: 'Draft' },
        { value: 'publish', label: 'Publish' },
        //{ value: 'unpublish', label: 'Unpublish' },
        //{ value: 'return', label: 'Return' },
        //{ value: 'submit', label: 'Submit for Publishing' }
      ]
    case 'encoder':
      return [
        { value: 'draft', label: 'Draft' },
        { value: 'submit', label: 'Submit for Review' }
      ]
  }

}
