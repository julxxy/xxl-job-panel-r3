// XXL-JOB React 第三方技术栈重构版（R3）

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import '@ant-design/v5-patch-for-react-19'
import { Environment } from '@/types/enum.ts'

const root = createRoot(document.getElementById('root')!)

const appElement = Environment.isProduction() ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <App />
)

root.render(appElement)
