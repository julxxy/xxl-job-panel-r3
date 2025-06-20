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
import WeekSelect from './WeekSelect'

interface FromToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const FromToInput: FC<FromToInputProps> = ({ disabled, value, onChange }) => {
  let from = 'SUN'
  let to = 'MON'

  if (!disabled && value.includes('-')) {
    const parts = value.split('-')
    from = parts[0] || 'SUN'
    to = parts[1] || 'MON'
  }

  const handleFromChange = (v: string) => onChange(`${v || 'SUN'}-${to}`)
  const handleToChange = (v: string) => onChange(`${from}-${v || 'MON'}`)

  return (
    <>
      从&nbsp;
      <WeekSelect disabled={disabled} value={from} size="small" onChange={handleFromChange} style={{ width: 100 }} />
      &nbsp;到&nbsp;
      <WeekSelect disabled={disabled} value={to} size="small" onChange={handleToChange} style={{ width: 100 }} />
      &nbsp;，每周在此范围内执行一次
    </>
  )
}

export default FromToInput
