import { Input } from 'antd'
import { FormAntdWrapper } from './FormAntdWrapper.tsx'

export function AntdTextInput({ name, control, label, required }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => <Input {...field} />}
    />
  )
}
