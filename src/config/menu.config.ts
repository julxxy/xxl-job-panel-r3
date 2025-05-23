import { NavSidebarGroupItem } from '@/components/layout/NavyPrimary.tsx'
import { BookOpenCheck, LayoutDashboard, ListChecks, ServerCog, Users2 } from 'lucide-react'
import URIs from '@/assets/URIs.json'
import React from 'react'

export interface MenuItem {
  name: string
  path: string
  icon?: React.ReactNode | string // 可选：图标组件名
  children?: MenuItem[]
}

const menuConfig: MenuItem[] = [
  { name: '首页', path: URIs.root },
  { name: '任务管理', path: URIs.tasks },
  { name: '调度日志', path: URIs.logs },
  { name: '执行器管理', path: URIs.executors },
  { name: '用户管理', path: URIs.users },
]

const navMainItems: NavSidebarGroupItem[] = [
  { title: '工作台', url: URIs.dashboard, icon: LayoutDashboard },
  { title: '任务管理', url: URIs.tasks, icon: ListChecks },
  { title: '调度日志', url: URIs.logs, icon: BookOpenCheck },
  { title: '执行器管理', url: URIs.executors, icon: ServerCog },
  { title: '用户管理', url: URIs.users, icon: Users2 },
]

export { navMainItems, menuConfig }
