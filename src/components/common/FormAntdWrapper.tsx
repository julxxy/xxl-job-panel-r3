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
