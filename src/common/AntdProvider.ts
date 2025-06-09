/**
 * 在 App.tsx 中导入了 AntdProvider.ts 文件，并在 ConfigProvider 组件中使用了自定义主题.
 * 入口处初始化一次
 * @file Antd global message, notification and modal
 */
import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { ThemeConfig } from 'antd/es/config-provider'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

/**
 * 作为一个 Provider 组件，负责提供 Antd 全局的 message, notification, modal 实例
 */
export default function AntdProvider(): null {
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return null
}

/**
 * AntD global theme variables（使其符合 Shadcn UI + tailwindcss 风格）
 */

const useAntdThemeToken = (): ThemeConfig => {
  const cssVariableValue = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

  return {
    token: {
      colorSuccess: cssVariableValue('--color-success'),
      colorError: cssVariableValue('--color-failed'),
      colorPrimary: cssVariableValue('--color-primary'),
      borderRadius: parseFloat(cssVariableValue('--radius-md')) || 6,
    },
  }
}

export { message, notification, modal, useAntdThemeToken }
