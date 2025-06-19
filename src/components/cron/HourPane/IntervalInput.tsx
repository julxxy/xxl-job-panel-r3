import { FC } from 'react'
import { InputNumber } from 'antd'

interface IntervalInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const IntervalInput: FC<IntervalInputProps> = ({ disabled, value, onChange }) => {
  let from = 0
  let interval = 1

  if (!disabled && value.includes('/')) {
    const [startStr, stepStr] = value.split('/')
    const parsedFrom = parseInt(startStr, 10)
    const parsedInterval = parseInt(stepStr, 10)
    from = isNaN(parsedFrom) ? 0 : parsedFrom
    interval = isNaN(parsedInterval) ? 1 : parsedInterval
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? 0
    onChange(`${newFrom}/${interval}`)
  }

  const handleIntervalChange = (v: number | null) => {
    const newInterval = v ?? 1
    onChange(`${from}/${newInterval}`)
  }

  return (
    <span>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={23}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;时开始，每&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={23}
        value={interval}
        size="small"
        onChange={handleIntervalChange}
        style={{ width: 100 }}
      />
      &nbsp;小时执行一次（使用 <code>/</code> 步长值）
    </span>
  )
}

export default IntervalInput
