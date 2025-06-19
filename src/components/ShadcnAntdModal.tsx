import { Modal } from 'antd'
import { Button } from '@/components/ui/button'
import React, { CSSProperties } from 'react'
import clsx from 'clsx'
import { ModalStyles } from 'rc-dialog/lib/IDialogPropTypes'

interface ShadModalProps<T = any> {
  open: boolean
  title?: React.ReactNode
  data?: T
  onReset?: () => void | undefined
  onCancel: () => void
  onOk?: () => void
  resetText?: string
  cancelText?: string
  okText?: string
  width?: number | string
  centered?: boolean
  loading?: boolean
  footer?: React.ReactNode | null
  className?: string
  style?: CSSProperties
  styles?: ModalStyles
  destroyOnHidden?: boolean // 注意：保留 destroy，会配合 useEffect 延迟设置字段
  children: (data?: T) => React.ReactNode
}

export function ShadcnAntdModal<T = any>({
  open,
  title,
  data,
  onReset,
  onCancel,
  onOk,
  resetText = '重置',
  cancelText = '取消',
  okText = '确认',
  width = 720,
  centered = false,
  loading = false,
  footer,
  className,
  style,
  styles,
  destroyOnHidden = true,
  children,
}: ShadModalProps<T>) {
  const contentPadding = 'px-6 pt-4'
  const footerPadding = 'px-6 pb-4'

  const renderDefaultFooter = () => (
    <div className={clsx('flex justify-end gap-2', footerPadding)}>
      {/* 取消按钮 */}
      <Button size="sm" variant="outline" onClick={onCancel} disabled={loading}>
        {cancelText}
      </Button>
      {/* 重置按钮（可选） */}
      {onReset && (
        <Button size="sm" variant="ghost" onClick={onReset} disabled={loading}>
          {resetText}
        </Button>
      )}
      {/* 确认按钮 */}
      <Button size="sm" onClick={onOk} disabled={loading}>
        {loading ? '处理中...' : okText}
      </Button>
    </div>
  )

  return (
    <Modal
      open={open}
      centered={centered}
      title={<div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</div>}
      onCancel={onCancel}
      onOk={onOk}
      footer={footer !== undefined ? footer : renderDefaultFooter()}
      confirmLoading={false}
      width={width}
      className={clsx('rounded-md', 'w-full max-w-full', className)}
      style={style}
      styles={styles}
      destroyOnHidden={destroyOnHidden}
    >
      <div className={clsx(contentPadding)}>{children?.(data)}</div>
    </Modal>
  )
}
