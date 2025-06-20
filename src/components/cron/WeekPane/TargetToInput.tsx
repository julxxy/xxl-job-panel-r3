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
import WeekSelect from './WeekSelect'

interface TargetToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const TargetToInput: FC<TargetToInputProps> = ({ disabled, value, onChange }) => {
  let weekOfMonth = 1
  let dayOfWeek = 'MON'

  if (!disabled && value.includes('#')) {
    const [weekStr, dayStr] = value.split('#')
    const parsedWeek = parseInt(weekStr, 10)
    weekOfMonth = isNaN(parsedWeek) ? 1 : parsedWeek
    dayOfWeek = dayStr || 'MON'
  }

  const handleWeekChange = (val: number | null) => {
    const newWeek = val ?? 1
    onChange(`${newWeek}#${dayOfWeek}`)
  }

  const handleDayChange = (val: string) => {
    onChange(`${weekOfMonth}#${val || 'MON'}`)
  }

  return (
    <>
      本月第&nbsp;
      <InputNumber
        disabled={disabled}
        min={1}
        max={5}
        value={weekOfMonth}
        size="small"
        onChange={handleWeekChange}
        style={{ width: 100 }}
      />
      &nbsp;周的&nbsp;
      <WeekSelect
        disabled={disabled}
        value={dayOfWeek}
        size="small"
        onChange={handleDayChange}
        style={{ width: 100 }}
      />
      &nbsp;执行一次
    </>
  )
}

export default TargetToInput
