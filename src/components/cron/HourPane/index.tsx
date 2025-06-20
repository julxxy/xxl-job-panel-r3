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

import { Radio, RadioChangeEvent } from 'antd'
import IntervalInput from './IntervalInput.tsx'
import FromToInput from './FromToInput.tsx'
import SpecifiedInput from './SpecifiedInput.tsx'

const radioStyle = { display: 'block', lineHeight: '32px' }

function HourPane(props: any) {
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
    const defaultValues = ['*', '0-10', '0/5', '0']
    onChange(defaultValues[valueType])
  }

  return (
    <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
      <Radio style={radioStyle} value={0}>
        每一小时
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

export default HourPane
