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

import { InputNumber } from 'antd'

function FromToInput(props: any) {
  const { disabled, value, onChange } = props
  let from = 0
  let to = 0
  if (!disabled) {
    ;[from, to] = value.split('-').map((v: string) => parseInt(v, 10))
  }

  const onChangeFrom = (v: any) => onChange(`${v ?? 0}-${to}`)
  const onChangeTo = (v: any) => onChange(`${from}-${v ?? 0}`)

  return (
    <span>
      每秒执行一次，范围从&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={from}
        size="small"
        onChange={onChangeFrom}
        style={{ width: 100 }}
      />
      &nbsp;到&nbsp;
      <InputNumber
        disabled={disabled}
        min={0}
        max={59}
        value={to}
        size="small"
        onChange={onChangeTo}
        style={{ width: 100 }}
      />
      &nbsp;秒（使用 <code>-</code> 范围值）
    </span>
  )
}

export default FromToInput
