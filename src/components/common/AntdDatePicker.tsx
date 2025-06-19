import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { FormAntdWrapper } from '@/components/common/FormAntdWrapper.tsx'

export function AntdDatePicker({ name, control, label, required }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => (
        <DatePicker
          value={field.value ? dayjs(field.value) : null}
          onChange={date => field.onChange(date?.toISOString())}
          style={{ width: '100%' }}
        />
      )}
    />
  )
}
