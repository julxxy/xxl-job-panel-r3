import React, { useMemo } from 'react'
import { Checkbox, Col, Row } from 'antd'

const weekOptions = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function SpecifiedInput(props: any) {
  const { disabled, value, onChange } = props
  let selected = []
  if (!disabled) {
    selected = value.split(',')
  }
  const onChangeSelected = (v: any[]) => onChange(v.length === 0 ? 'SUN' : v.join(','))

  const checkList = useMemo(() => {
    return weekOptions.map(item => {
      return (
        <Col key={item} span={3}>
          <Checkbox disabled={disabled} value={item}>
            {item}
          </Checkbox>
        </Col>
      )
    })
  }, [disabled])

  return (
    <React.Fragment>
      指定周
      <br />
      <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={onChangeSelected}>
        <Row>{checkList}</Row>
      </Checkbox.Group>
    </React.Fragment>
  )
}

export default SpecifiedInput
