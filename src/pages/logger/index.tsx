import { useForm } from 'antd/es/form/Form'
import { JobLog } from '@/types'
import { useState } from 'react'
import { IAction } from '@/types/modal.ts'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'

/**
 * 日志管理
 */
export default function LoggerComponent() {
  const [form] = useForm<JobLog.Item>()
  const [action, setAction] = useState<IAction>('create')
  const [loading, setLoading] = useState(false)
  const { confirm, dialog } = useConfirmDialog()

  return (
    <div>
      <div>日志</div>
      {dialog}
    </div>
  )
}
