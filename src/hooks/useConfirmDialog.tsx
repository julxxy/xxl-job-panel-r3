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
