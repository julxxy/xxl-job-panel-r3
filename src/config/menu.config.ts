import { NavSidebarGroupItem } from '@/components/Layout/NavyPrimary.tsx'
import { BookOpenCheck, LayoutDashboard, ListChecks, ServerCog, Users2 } from 'lucide-react'
import URIs from '@/assets/URIs.json'
import React from 'react'
import { useLocation } from 'react-router-dom'

export interface MenuItem {
  name: string
  path: string
  icon?: React.ReactNode | string // 可选：图标组件名
  children?: MenuItem[]
}

type NavMainItem = NavSidebarGroupItem & {
  closable?: boolean
}

const menuConfig: MenuItem[] = [
  { name: '首页', path: URIs.root },
  { name: '任务管理', path: URIs.tasks },
  { name: '调度日志', path: URIs.logs },
  { name: '执行器管理', path: URIs.executors },
  { name: '用户管理', path: URIs.users },
]

const navMainItems: NavMainItem[] = [
  { title: '工作台', url: URIs.dashboard, icon: LayoutDashboard },
  { title: '任务管理', url: URIs.tasks, icon: ListChecks },
  { title: '调度日志', url: URIs.logs, icon: BookOpenCheck },
  { title: '执行器管理', url: URIs.executors, icon: ServerCog },
  { title: '用户管理', url: URIs.users, icon: Users2 },
]

function useActiveNavMainItemByURI(url?: string) {
  const location = useLocation()
  const currentPath = location.pathname
  // 如果传了 url，就用 url，否则用当前路由
  const targetPath = url || currentPath
  const found = navMainItems.find(item => targetPath.startsWith(item.url))
  return found || navMainItems[0]
}

export { navMainItems, menuConfig, useActiveNavMainItemByURI }
