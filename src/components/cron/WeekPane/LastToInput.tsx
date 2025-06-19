import { FC } from 'react'
import WeekSelect from './WeekSelect'

interface LastToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const LastToInput: FC<LastToInputProps> = ({ disabled, value, onChange }) => {
  let lastDay = 'SUN'

  if (!disabled && value.endsWith('L')) {
    lastDay = value.slice(0, -1) || 'SUN'
  }

  const handleChange = (val: string) => {
    onChange(`${val}L`)
  }

  return (
    <>
      本月的最后一个&nbsp;
      <WeekSelect disabled={disabled} value={lastDay} size="small" onChange={handleChange} style={{ width: 100 }} />
      &nbsp;执行一次
    </>
  )
}

export default LastToInput
