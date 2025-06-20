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

import { FC } from 'react'
import { InputNumber } from 'antd'

interface IntervalInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const IntervalInput: FC<IntervalInputProps> = ({ disabled, value, onChange }) => {
  const currentYear = new Date().getUTCFullYear()
  let from = currentYear
  let interval = 1

  // 解析输入的值
  if (!disabled && value.includes('/')) {
    ;[from, interval] = value.split('/').map(v => parseInt(v, 10))
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? currentYear
    onChange(`${newFrom}/${interval}`)
  }

  const handleIntervalChange = (v: number | null) => {
    const newInterval = v ?? 1
    onChange(`${from}/${newInterval}`)
  }

  return (
    <>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={9999}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;年开始， 每&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={99}
        value={interval}
        size="small"
        onChange={handleIntervalChange}
        style={{ width: 100 }}
      />
      &nbsp;年执行一次
    </>
  )
}

export default IntervalInput
