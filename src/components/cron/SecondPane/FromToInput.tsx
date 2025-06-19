import { InputNumber } from 'antd'

function FromToInput(props: any) {
  const { disabled, value, onChange } = props
  let from = 0
  let to = 0
  if (!disabled) {
    ;[from, to] = value.split('-').map((v: string) => parseInt(v, 10))
  }

  const onChangeFrom = (v: any) => onChange(`${v ?? 0}-${to}`)
  const onChangeTo = (v: any) => onChange(`${from}-${v ?? 0}`)

  return (
    <span>
      每秒执行一次，范围从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={from}
        size="small"
        onChange={onChangeFrom}
        style={{ width: 100 }}
      />
      &nbsp;到&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={to}
        size="small"
        onChange={onChangeTo}
        style={{ width: 100 }}
      />
      &nbsp;秒（使用 <code>-</code> 范围值）
    </span>
  )
}

export default FromToInput
