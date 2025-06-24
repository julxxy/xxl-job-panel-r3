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

export { navMainItems, useActiveNavMainItemByURI }
