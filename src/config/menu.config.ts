import { NavSidebarGroupItem } from '@/components/layout/NavyPrimary.tsx'

import { BookOpenCheck, LayoutDashboard, ListChecks, ServerCog, Users2 } from 'lucide-react'

export interface MenuItem {
  name: string
  path: string
  icon?: string // 可选：图标组件名
  children?: MenuItem[]
}

const menuConfig: MenuItem[] = [
  { name: '首页', path: '/' },
  { name: '任务管理', path: '/tasks' },
  { name: '调度日志', path: '/logs' },
  { name: '执行器管理', path: '/executors' },
  { name: '用户管理', path: '/users' },
]

const navMainItems: NavSidebarGroupItem[] = [
  { title: '工作台', url: '/dashboard', icon: LayoutDashboard },
  { title: '任务管理', url: '/tasks', icon: ListChecks },
  { title: '调度日志', url: '/logs', icon: BookOpenCheck },
  { title: '执行器管理', url: '/executors', icon: ServerCog },
  { title: '用户管理', url: '/users', icon: Users2 },
]

export { navMainItems, menuConfig }
