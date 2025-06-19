import { InputNumber } from 'antd'
import { FormAntdWrapper } from '@/components/common/FormAntdWrapper.tsx'

export function AntdNumberInput({ name, control, label, required, min, max }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => (
        <InputNumber value={field.value} onChange={field.onChange} min={min} max={max} style={{ width: '100%' }} />
      )}
    />
  )
}
