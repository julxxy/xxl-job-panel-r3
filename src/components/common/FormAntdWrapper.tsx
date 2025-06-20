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

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import React from 'react'
import { isDebugEnable, log } from '@/common/Logger.ts'

interface FormAntdWrapperProps<T extends FieldValues = any> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  render: (field: any) => React.ReactNode
}

export function FormAntdWrapper<T extends FieldValues>({
  name,
  control,
  label,
  required,
  render,
}: FormAntdWrapperProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (isDebugEnable) log.info('Field state: ', fieldState)
        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && ' *'}
              </FormLabel>
            )}
            <FormControl>{render(field)}</FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
