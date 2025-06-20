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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React, { useMemo } from 'react'
import { Radio, RadioChangeEvent } from 'antd'

import FromToInput from './FromToInput.tsx'
import SpecifiedInput from './SpecifiedInput.tsx'
import IntervalInput from './IntervalInput.tsx'

const radioStyle = { display: 'block', lineHeight: '20px' }

function YearPane(props: { value: string; onChange: (val: string) => void }) {
  const { value, onChange } = props

  const currentYear = useMemo(() => new Date().getUTCFullYear(), [])
  const defaultValues = useMemo(
    () => ['*', '?', `${currentYear}-${currentYear + 10}`, `${currentYear}/1`, `${currentYear}`],
    [currentYear]
  )

  const currentRadio = useMemo(() => {
    if (value === '*') return 0
    if (value === '?') return 1
    if (value.includes('-')) return 2
    if (value.includes('/')) return 3
    return 4
  }, [value])

  const onChangeRadio = (e: RadioChangeEvent) => {
    const valueType = e.target.value
    onChange(defaultValues[valueType])
  }

  return (
    <Radio.Group style={{ width: '100%' }} value={currentRadio} onChange={onChangeRadio}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Radio style={radioStyle} value={0}>
          每年
        </Radio>
        <Radio style={radioStyle} value={1}>
          不指定年
        </Radio>
      </div>
      <Radio style={radioStyle} value={2}>
        <FromToInput disabled={currentRadio !== 2} value={value} onChange={onChange} />
      </Radio>
      <Radio style={radioStyle} value={3}>
        <IntervalInput disabled={currentRadio !== 3} value={value} onChange={onChange} />
      </Radio>
      <Radio style={{ marginTop: '5px', ...radioStyle }} value={4}>
        <SpecifiedInput disabled={currentRadio !== 4} value={value} onChange={onChange} />
      </Radio>
    </Radio.Group>
  )
}

export default YearPane
