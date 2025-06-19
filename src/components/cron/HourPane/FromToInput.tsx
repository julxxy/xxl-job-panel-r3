import { FC } from 'react'
import { InputNumber } from 'antd'

interface FromToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const FromToInput: FC<FromToInputProps> = ({ disabled, value, onChange }) => {
  let from = 0
  let to = 0

  if (!disabled && value.includes('-')) {
    const parts = value.split('-').map(v => parseInt(v, 10))
    from = isNaN(parts[0]) ? 0 : parts[0]
    to = isNaN(parts[1]) ? 0 : parts[1]
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? 0
    onChange(`${newFrom}-${to}`)
  }

  const handleToChange = (v: number | null) => {
    const newTo = v ?? 0
    onChange(`${from}-${newTo}`)
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
      &nbsp;时 到&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={23}
        value={to}
        size="small"
        onChange={handleToChange}
        style={{ width: 100 }}
      />
      &nbsp;时，每小时执行一次（使用 <code>-</code> 范围值）
    </span>
  )
}

export default FromToInput
