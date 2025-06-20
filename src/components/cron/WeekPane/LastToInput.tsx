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

interface LastToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const LastToInput: FC<LastToInputProps> = ({ disabled, value, onChange }) => {
  let lastDay = 'SUN'

  if (!disabled && value.endsWith('L')) {
    lastDay = value.slice(0, -1) || 'SUN'
  }

  const handleChange = (val: string) => {
    onChange(`${val}L`)
  }

  return (
    <>
      本月的最后一个&nbsp;
      <WeekSelect disabled={disabled} value={lastDay} size="small" onChange={handleChange} style={{ width: 100 }} />
      &nbsp;执行一次
    </>
  )
}

export default LastToInput
