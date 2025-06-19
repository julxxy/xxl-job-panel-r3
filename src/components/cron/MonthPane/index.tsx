import { Radio, RadioChangeEvent } from 'antd'
import IntervalInput from './IntervalInput.tsx'
import FromToInput from './FromToInput.tsx'
import SpecifiedInput from './SpecifiedInput.tsx'

const radioStyle = { display: 'block', lineHeight: '32px' }

function MonthPane(props: any) {
  const { value, onChange } = props
  let currentRadio = 0
  if (value === '*') {
    currentRadio = 0
  } else if (value.indexOf('-') > -1) {
    currentRadio = 1
  } else if (value.indexOf('/') > -1) {
    currentRadio = 2
  } else {
    currentRadio = 3
  }

  const onChangeRadio = (e: RadioChangeEvent) => {
    const valueType = e.target.value
    const defaultValues = ['*', '1-1', '1/1', '1']
    onChange(defaultValues[valueType])
  }

  return (
    <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
      <Radio style={radioStyle} value={0}>
        每一月
      </Radio>
      <Radio style={radioStyle} value={1}>
        <FromToInput disabled={currentRadio !== 1} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={2}>
        <IntervalInput disabled={currentRadio !== 2} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={3}>
        <SpecifiedInput disabled={currentRadio !== 3} value={value} onChange={onChange} />
      </Radio>
    </Radio.Group>
  )
}

export default MonthPane
