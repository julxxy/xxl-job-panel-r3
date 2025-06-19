import '@/App.css'

import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/routes'
import { Toaster } from 'sonner'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Environment } from '@/types/enum.ts'
import { App as AntdApp, ConfigProvider, theme } from 'antd'
import useZustandStore from '@/stores/useZustandStore.ts'
import AntdProvider, { antdTheme } from '@/common/AntdProvider.ts'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

if (Environment.isLocaleCN()) dayjs.locale('zh-cn')
if (isDebugEnable) log.debug(`Debug enabled on '${Environment.current}' mode.`)

function App() {
  const { isDarkEnable } = useZustandStore()

  return (
    <ThemeProvider defaultTheme={isDarkEnable ? 'dark' : 'light'} storageKey="vite-ui-theme">
      <Toaster />
      <BrowserRouter>
        {/* 尽可能减少 Antd 覆盖范围 */}
        <ConfigProvider
          theme={{ ...antdTheme, algorithm: isDarkEnable ? theme.darkAlgorithm : theme.defaultAlgorithm }}
          locale={Environment.isLocaleCN() ? zhCN : enUS}
        >
          <AntdApp>
            <AntdProvider />
            <div className="antd-wrapper">
              <AppRoutes />
            </div>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
