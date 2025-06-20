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

interface FromToInputProps {
  disabled: boolean
  value: string
  onChange: (val: string) => void
}

const FromToInput: FC<FromToInputProps> = ({ disabled, value, onChange }) => {
  const currentYear = new Date().getUTCFullYear()
  let from = currentYear
  let to = currentYear + 10

  if (!disabled && value.includes('-')) {
    ;[from, to] = value.split('-').map(v => parseInt(v, 10))
  }

  const handleFromChange = (v: number | null) => {
    const newFrom = v ?? currentYear
    onChange(`${newFrom}-${to}`)
  }

  const handleToChange = (v: number | null) => {
    const newTo = v ?? currentYear + 10
    onChange(`${from}-${newTo}`)
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
      &nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={9999}
        value={to}
        size="small"
        onChange={handleToChange}
        style={{ width: 100 }}
      />
      &nbsp;&nbsp;年，每年执行一次
    </>
  )
}

export default FromToInput
