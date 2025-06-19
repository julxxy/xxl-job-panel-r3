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
    const parts = value.split('/').map(v => parseInt(v, 10))
    from = isNaN(parts[0]) ? 0 : parts[0]
    interval = isNaN(parts[1]) ? 1 : parts[1]
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
        max={59}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;秒开始，每&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={59}
        value={interval}
        size="small"
        onChange={handleIntervalChange}
        style={{ width: 100 }}
      />
      &nbsp;秒执行一次（使用 <code>/</code> 步长值）
    </span>
  )
}

export default IntervalInput
