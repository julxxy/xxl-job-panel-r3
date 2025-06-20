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
  modalRender?: (node: React.ReactNode) => React.ReactNode
  className?: string
  style?: CSSProperties
  styles?: ModalStyles
  action?: 'create' | 'clone' | 'edit' | 'view'
  forceRender?: boolean
  destroyOnHidden?: boolean
  confirmLoading?: boolean
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
  modalRender,
  className,
  style,
  styles,
  action = 'create',
  forceRender = false,
  destroyOnHidden = true,
  confirmLoading = false,
  children,
}: ShadModalProps<T>) {
  const contentPadding = 'px-6 pt-4'
  const footerPadding = 'px-6 pb-4'

  const renderDefaultFooter = () => (
    <div className={clsx('flex justify-end gap-2', footerPadding)}>
      {/* 取消按钮 */}
      {(action === 'create' || action === 'edit' || action === 'clone') && (
        <Button size="sm" variant="outline" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
      )}
      {/* 重置按钮（可选） */}
      {onReset && (action === 'create' || action === 'edit' || action === 'clone') && (
        <Button size="sm" variant="ghost" onClick={onReset} disabled={loading}>
          {resetText}
        </Button>
      )}
      {/* 确认按钮 */}
      {(action === 'create' || action === 'edit' || action === 'clone') && (
        <Button size="sm" onClick={onOk} disabled={loading}>
          {loading ? '处理中...' : okText}
        </Button>
      )}
    </div>
  )

  return (
    <Modal
      open={open}
      centered={centered}
      title={<div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</div>}
      onCancel={onCancel}
      onOk={onOk}
      modalRender={modalRender}
      footer={footer !== undefined ? footer : renderDefaultFooter()}
      confirmLoading={confirmLoading}
      width={width}
      className={clsx('rounded-md', 'w-full max-w-full', className)}
      style={style}
      styles={styles}
      forceRender={forceRender}
      destroyOnHidden={destroyOnHidden}
      loading={confirmLoading ? confirmLoading : loading}
    >
      <div className={clsx(contentPadding)}>{children?.(data)}</div>
    </Modal>
  )
}
