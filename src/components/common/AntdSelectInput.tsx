import { Select } from 'antd'
import { FormAntdWrapper } from '@/components/common/FormAntdWrapper.tsx'

export function AntdSelectInput({ name, control, label, required, options = [] }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => (
        <Select value={field.value} onChange={field.onChange} options={options} style={{ width: '100%' }} />
      )}
    />
  )
}
