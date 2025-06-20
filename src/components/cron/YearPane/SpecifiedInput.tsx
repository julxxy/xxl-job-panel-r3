/**
 * This file is part of xxl-job-panel-r3.
 *
 * Copyright (C) 2025 Julian
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
