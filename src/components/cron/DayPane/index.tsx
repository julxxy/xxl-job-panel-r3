import { Radio, RadioChangeEvent } from 'antd'
import IntervalInput from './IntervalInput.tsx'
import FromToInput from './FromToInput.tsx'
import SpecifiedInput from './SpecifiedInput.tsx'

const radioStyle = { display: 'block', lineHeight: '32px' }

function DayPane(props: any) {
  const { value, onChange } = props
  let currentRadio = 0
  if (value === '*') {
    currentRadio = 0
  } else if (value === '?') {
    currentRadio = 1
  } else if (value.indexOf('-') > -1) {
    currentRadio = 2
  } else if (value.indexOf('/') > -1) {
    currentRadio = 3
  } else {
    currentRadio = 4
  }

  const onChangeRadio = (e: RadioChangeEvent) => {
    const valueType = e.target.value
    const defaultValues = ['*', '?', '1-1', '1/1', '1']
    onChange(defaultValues[valueType])
  }

  return (
    <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Radio style={radioStyle} value={0}>
          每一日
        </Radio>
        <Radio style={radioStyle} value={1}>
          不指定日
        </Radio>
      </div>
      <Radio style={radioStyle} value={2}>
        <FromToInput disabled={currentRadio !== 2} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={3}>
        <IntervalInput disabled={currentRadio !== 3} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={4}>
        <SpecifiedInput disabled={currentRadio !== 4} value={value} onChange={onChange} />
      </Radio>
    </Radio.Group>
  )
}

export default DayPane
