import { FC } from 'react'
import WeekSelect from './WeekSelect'

interface FromToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const FromToInput: FC<FromToInputProps> = ({ disabled, value, onChange }) => {
  let from = 'SUN'
  let to = 'MON'

  if (!disabled && value.includes('-')) {
    const parts = value.split('-')
    from = parts[0] || 'SUN'
    to = parts[1] || 'MON'
  }

  const handleFromChange = (v: string) => onChange(`${v || 'SUN'}-${to}`)
  const handleToChange = (v: string) => onChange(`${from}-${v || 'MON'}`)

  return (
    <>
      从&nbsp;
      <WeekSelect disabled={disabled} value={from} size="small" onChange={handleFromChange} style={{ width: 100 }} />
      &nbsp;到&nbsp;
      <WeekSelect disabled={disabled} value={to} size="small" onChange={handleToChange} style={{ width: 100 }} />
      &nbsp;，每周在此范围内执行一次
    </>
  )
}

export default FromToInput
