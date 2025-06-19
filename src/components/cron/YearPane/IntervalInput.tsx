import { FC } from 'react'
import { InputNumber } from 'antd'

interface IntervalInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const IntervalInput: FC<IntervalInputProps> = ({ disabled, value, onChange }) => {
  const currentYear = new Date().getUTCFullYear()
  let from = currentYear
  let interval = 1

  // 解析输入的值
  if (!disabled && value.includes('/')) {
    ;[from, interval] = value.split('/').map(v => parseInt(v, 10))
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? currentYear
    onChange(`${newFrom}/${interval}`)
  }

  const handleIntervalChange = (v: number | null) => {
    const newInterval = v ?? 1
    onChange(`${from}/${newInterval}`)
  }

  return (
    <>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={9999}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;年开始， 每&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={99}
        value={interval}
        size="small"
        onChange={handleIntervalChange}
        style={{ width: 100 }}
      />
      &nbsp;年执行一次
    </>
  )
}

export default IntervalInput
