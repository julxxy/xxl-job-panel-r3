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
  let from = 0
  let interval = 1

  if (!disabled && value.includes('/')) {
    const parts = value.split('/').map(v => parseInt(v, 10))
    from = isNaN(parts[0]) ? 0 : parts[0]
    interval = isNaN(parts[1]) ? 1 : parts[1]
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? 0
    onChange(`${newFrom}/${interval}`)
  }

  const handleIntervalChange = (v: number | null) => {
    const newInterval = v ?? 1
    onChange(`${from}/${newInterval}`)
  }

  return (
    <span>
      从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={from}
        size="small"
        onChange={handleFromChange}
        style={{ width: 100 }}
      />
      &nbsp;秒开始，每&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={59}
        value={interval}
        size="small"
        onChange={handleIntervalChange}
        style={{ width: 100 }}
      />
      &nbsp;秒执行一次（使用 <code>/</code> 步长值）
    </span>
  )
}

export default IntervalInput
