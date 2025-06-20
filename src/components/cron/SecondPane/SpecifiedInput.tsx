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

function SpecifiedInput(props: any) {
  const { disabled, value, onChange } = props
  let selected = []
  if (!disabled) {
    selected = value.split(',').map((v: string) => parseInt(v, 10))
  }
  const onChangeSelected = (v: any) => onChange(v.length === 0 ? '0' : v.join(','))

  const checkList = useMemo(() => {
    const checks = []
    for (let i = 0; i < 60; i++) {
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
    <>
      指定秒
      <br />
      <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={onChangeSelected}>
        <Row>{checkList}</Row>
      </Checkbox.Group>
    </>
  )
}

export default SpecifiedInput
