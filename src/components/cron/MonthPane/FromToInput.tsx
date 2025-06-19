import { FC } from 'react'
import { InputNumber } from 'antd'

interface FromToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const FromToInput: FC<FromToInputProps> = ({ disabled, value, onChange }) => {
  let from = 1
  let to = 1

  if (!disabled && value.includes('-')) {
    const parts = value.split('-').map(v => parseInt(v, 10))
    from = isNaN(parts[0]) ? 1 : parts[0]
    to = isNaN(parts[1]) ? 1 : parts[1]
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? 1
    onChange(`${newFrom}-${to}`)
  }

  const handleToChange = (v: number | null) => {
    const newTo = v ?? 1
    onChange(`${from}-${newTo}`)
  }

  return (
    <span>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={12}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;月到&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={12}
        value={to}
        size="small"
        onChange={handleToChange}
        style={{ width: 100 }}
      />
      &nbsp;月，每月执行一次（使用 <code>-</code> 范围）
    </span>
  )
}

export default FromToInput
