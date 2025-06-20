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
