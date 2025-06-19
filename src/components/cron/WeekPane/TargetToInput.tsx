import { FC } from 'react'
import { InputNumber } from 'antd'
import WeekSelect from './WeekSelect'

interface TargetToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const TargetToInput: FC<TargetToInputProps> = ({ disabled, value, onChange }) => {
  let weekOfMonth = 1
  let dayOfWeek = 'MON'

  if (!disabled && value.includes('#')) {
    const [weekStr, dayStr] = value.split('#')
    const parsedWeek = parseInt(weekStr, 10)
    weekOfMonth = isNaN(parsedWeek) ? 1 : parsedWeek
    dayOfWeek = dayStr || 'MON'
  }

  const handleWeekChange = (val: number | null) => {
    const newWeek = val ?? 1
    onChange(`${newWeek}#${dayOfWeek}`)
  }

  const handleDayChange = (val: string) => {
    onChange(`${weekOfMonth}#${val || 'MON'}`)
  }

  return (
    <>
      本月第&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={5}
        value={weekOfMonth}
        size="small"
        onChange={handleWeekChange}
        style={{ width: 100 }}
      />
      &nbsp;周的&nbsp;
      <WeekSelect
        disabled={disabled}
        value={dayOfWeek}
        size="small"
        onChange={handleDayChange}
        style={{ width: 100 }}
      />
      &nbsp;执行一次
    </>
  )
}

export default TargetToInput
