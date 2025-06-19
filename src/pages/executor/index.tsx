import { useForm } from 'antd/es/form/Form'
import { User } from '@/types'
import { useRef, useState } from 'react'
import { IAction, ModalAction } from '@/types/modal.ts'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Button } from '@/components/ui/button.tsx'
import ExecutorModal from '@/pages/executor/ExecutorModal.tsx'
import ExecutorPageList from '@/pages/executor/ExecutorPageList.tsx'

export default function ExecutorComponent() {
  const [form] = useForm<User.UserPageQuery>()
  const [action, setAction] = useState<IAction>('create')
  const { confirm, dialog } = useConfirmDialog()

  const currentRef = useRef<ModalAction>({
    openModal: (action, data) => {
      if (isDebugEnable) log.info('打开弹窗:', action, data)
      setAction(action)
    },
  })

  function onRefresh() {}

  return (
    <div>
      执行器
      <Button onClick={() => currentRef?.current.openModal('create')}>编辑</Button>
      <ExecutorPageList />
      <ExecutorModal parentRef={currentRef} onRefresh={onRefresh} />
    </div>
  )
}
