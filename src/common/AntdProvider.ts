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
      borderRadius: parseFloat(cssVariableValue('--radius-md')) || 6,
    },
  }
}

export { message, notification, modal, useAntdThemeToken }
