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

import React, { forwardRef, useState } from 'react'
import type { InputProps } from 'antd'
import { Input } from 'antd'
import styles from './index.module.css'

interface FloatingInputProps extends InputProps {
  label: string
  className?: string // 允许传 className 覆盖
  style?: React.CSSProperties // 允许传 style 覆盖
}

const FloatingInput = forwardRef<any, FloatingInputProps>((props, ref) => {
  const { label, value, onFocus, onBlur, className, style, ...rest } = props

  const [focused, setFocused] = useState(false)
  const isActive = focused || !!value

  const wrapperClass = `${styles.inputWrapper} ${isActive ? styles.active : ''} ${className ?? ''}`

  return (
    <div className={wrapperClass} style={style}>
      <Input
        ref={ref}
        {...rest}
        value={value}
        onFocus={e => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={e => {
          setFocused(false)
          onBlur?.(e)
        }}
        placeholder=" "
        className={styles.customInput}
      />
      <label className={styles.floatingLabel}>{label}</label>
    </div>
  )
})

FloatingInput.displayName = 'FloatingInput'

export default FloatingInput
