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
