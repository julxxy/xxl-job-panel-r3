import { Radio, RadioChangeEvent } from 'antd'
import FromToInput from './FromToInput.tsx'
import LastToInput from './LastToInput.tsx'
import SpecifiedInput from './SpecifiedInput.tsx'
import TargetToInput from './TargetToInput.tsx'

const radioStyle = { display: 'block', lineHeight: '32px' }

function WeekPane(props: any) {
  const { value, onChange } = props
  let currentRadio = 0
  if (value === '*') {
    currentRadio = 0
  } else if (value === '?') {
    currentRadio = 1
  } else if (value.indexOf('-') > -1) {
    currentRadio = 2
  } else if (value.indexOf('#') > -1) {
    currentRadio = 3
  } else if (value.indexOf('L') > -1) {
    currentRadio = 4
  } else {
    currentRadio = 5
  }

  const onChangeRadio = (e: RadioChangeEvent) => {
    const valueType = e.target.value
    const defaultValues = ['*', '?', 'SUN-MON', '1#MON', 'SUNL', 'SUN']
    onChange(defaultValues[valueType])
  }

  return (
    <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Radio style={radioStyle} value={0}>
          每一周
        </Radio>
        <Radio style={radioStyle} value={1}>
          不指定周
        </Radio>
      </div>
      <Radio style={radioStyle} value={2}>
        <FromToInput disabled={currentRadio !== 2} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={3}>
        <TargetToInput disabled={currentRadio !== 3} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={4}>
        <LastToInput disabled={currentRadio !== 4} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={5}>
        <SpecifiedInput disabled={currentRadio !== 5} value={value} onChange={onChange} />
      </Radio>
    </Radio.Group>
  )
}

export default WeekPane
