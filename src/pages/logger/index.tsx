import { useForm } from 'antd/es/form/Form'
import { User } from '@/types'
import { useRef, useState } from 'react'
import { IAction, ModalAction } from '@/types/modal.ts'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import LoggerPageList from '@/pages/logger/LoggerPageList.tsx'

export default function LogViewerComponent() {
  const [form] = useForm<User.UserPageQuery>()
  const [action, setAction] = useState<IAction>('create')
  const { confirm, dialog } = useConfirmDialog()

  const modalRef = useRef<ModalAction>({
    openModal: (action, data) => {
      if (isDebugEnable) log.info('打开弹窗:', action, data)
      setAction(action)
    },
  })

  function onRefresh() {}

  return (
    <div>
      <LoggerPageList />
    </div>
  )
}
