import { TreeSelect } from 'antd'
import { FormAntdWrapper } from '@/components/common/FormAntdWrapper.tsx'

export function AntdTreeSelectInput({ name, control, label, required, treeData = [] }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => (
        <TreeSelect
          value={field.value}
          onChange={field.onChange}
          treeData={treeData}
          treeDefaultExpandAll
          style={{ width: '100%' }}
        />
      )}
    />
  )
}
