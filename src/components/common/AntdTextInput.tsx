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

import { Input } from 'antd'
import { FormAntdWrapper } from './FormAntdWrapper.tsx'

export function AntdTextInput({ name, control, label, required }: any) {
  return (
    <FormAntdWrapper
      name={name}
      control={control}
      label={label}
      required={required}
      render={field => <Input {...field} />}
    />
  )
}
