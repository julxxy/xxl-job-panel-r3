import { useMemo } from 'react'
import { Checkbox, Col, Row } from 'antd'

interface SpecifiedInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

function SpecifiedInput({ disabled, value, onChange }: SpecifiedInputProps) {
  const currentYear = new Date().getUTCFullYear()

  // 将选中的年份解析成数组
  let selected: number[] = []
  if (!disabled && value) {
    selected = value.split(',').map(v => parseInt(v, 10))
  }

  // 处理选择的年份
  const onChangeSelected = (v: number[]) => {
    onChange(v.length === 0 ? `${currentYear}` : v.join(','))
  }

  // 生成复选框列表
  const checkList = useMemo(() => {
    const checks = []
    for (let i = currentYear - 6; i < currentYear + 48; i++) {
      checks.push(
        <Col key={i} span={4}>
          <Checkbox disabled={disabled} value={i}>
            {i}
          </Checkbox>
        </Col>
      )
    }
    return checks
  }, [currentYear, disabled])

  return (
    <>
      指定年
      <br />
      <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={onChangeSelected}>
        <Row>{checkList}</Row>
      </Checkbox.Group>
    </>
  )
}

export default SpecifiedInput
