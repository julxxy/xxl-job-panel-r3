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

import { useCallback, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog.tsx'

interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  onConfirm: () => Promise<void> | void
}

export function useConfirmDialog() {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setVisible(true)
  }, [])

  const dialog = options ? (
    <ConfirmDialog
      open={visible}
      title={options.title}
      description={options.description}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      loadingText={options.loadingText}
      onCancel={() => setVisible(false)}
      onConfirm={async () => {
        await options.onConfirm?.()
        setVisible(false)
      }}
    />
  ) : null

  return { confirm, dialog }
}
