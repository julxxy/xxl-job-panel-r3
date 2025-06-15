import { toast as sonnerToast } from 'sonner'
import { message as antdMsg } from '@/common/AntdProvider.ts'

const toast = {
  success: (msg: string, useAntd?: boolean) => {
    if (useAntd) {
      antdMsg.success(msg)
    } else {
      sonnerToast.success(msg)
    }
  },
  error: (msg: string, useAntd?: boolean) => {
    if (useAntd) {
      antdMsg.error(msg)
    } else {
      sonnerToast.error(msg)
    }
  },
  warning(msg: string, useAntd?: boolean) {
    if (useAntd) {
      antdMsg.warning(msg)
    } else {
      sonnerToast.error(msg)
    }
  },
}

function handleToastMsg(code: number, msg: string) {
  if (code !== 200) {
    toast.error(msg || 'Error!')
  } else {
    toast.success('SUCCESS')
  }
}

export { toast, handleToastMsg }
