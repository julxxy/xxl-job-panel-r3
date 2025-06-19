import { InputNumber } from 'antd'

function FromToInput(props: any) {
  const { disabled, value, onChange } = props
  let from = 0
  let to = 0
  if (!disabled) {
    ;[from, to] = value.split('-').map((v: string) => parseInt(v, 10))
  }
  const handleFromChange = (v: any) => onChange(`${v || 0}-${to}`)
  const handleToChange = (v: any) => onChange(`${from}-${v || 0}`)

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
      &nbsp;到&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={to}
        size="small"
        onChange={handleToChange}
        style={{ width: 100 }}
      />
      &nbsp;分钟，每分钟执行一次（使用 <code>-</code> 范围值）
    </span>
  )
}

export default FromToInput
