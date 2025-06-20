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

import '@/App.css'

import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from '@/routes'
import { Toaster } from 'sonner'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Environment } from '@/types/enum.ts'
import { App as AntdApp, ConfigProvider, theme } from 'antd'
import useZustandStore from '@/stores/useZustandStore.ts'
import AntdProvider, { useAntdThemeToken } from '@/common/AntdProvider.ts'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

if (Environment.isLocaleCN()) dayjs.locale('zh-cn')
if (isDebugEnable) log.debug(`Debug enabled on '${Environment.current}' mode.`)

function App() {
  const { isDarkEnable } = useZustandStore()
  const themeToken = useAntdThemeToken()
  return (
    <ThemeProvider defaultTheme={isDarkEnable ? 'dark' : 'light'} storageKey="vite-ui-theme">
      <Toaster />
      {/* 尽可能减少 Antd 覆盖范围 */}
      <ConfigProvider
        theme={{ ...themeToken, algorithm: isDarkEnable ? theme.darkAlgorithm : theme.defaultAlgorithm }}
        locale={Environment.isLocaleCN() ? zhCN : enUS}
      >
        <AntdApp>
          <AntdProvider />
          <div className="antd-wrapper">
            <RouterProvider router={AppRouter} />
          </div>
        </AntdApp>
      </ConfigProvider>
    </ThemeProvider>
  )
}

export default App
