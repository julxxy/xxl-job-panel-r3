import React, { useMemo } from 'react'
import { Checkbox, Col, Row } from 'antd'

function SpecifiedInput(props: any) {
  const { disabled, value, onChange } = props
  let selected = []
  if (!disabled) {
    selected = value.split(',').map((v: string) => parseInt(v, 10))
  }
  const onChangeSelected = (v: any[]) => onChange(v.length === 0 ? '1' : v.join(','))

  const checkList = useMemo(() => {
    const checks = []
    for (let i = 1; i < 32; i++) {
      checks.push(
        <Col key={i} span={4}>
          <Checkbox disabled={disabled} value={i}>
            {i}
          </Checkbox>
        </Col>
      )
    }
    return checks
  }, [disabled])

  return (
    <React.Fragment>
      指定日
      <br />
      <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={onChangeSelected}>
        <Row>{checkList}</Row>
      </Checkbox.Group>
    </React.Fragment>
  )
}

export default SpecifiedInput
