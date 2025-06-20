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

import * as React from 'react'
import { useEffect } from 'react'
import { Clock } from 'lucide-react'

import { NavUser } from '@/components/Layout/NavUser.tsx'

import {
  Sidebar as ShadUISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import useZustandStore from '@/stores/useZustandStore'
import { isDebugEnable, log } from '@/common/Logger'
import { NavSidebarGroupItem, NavyPrimary } from '@/components/Layout/NavyPrimary.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { navMainItems, useActiveNavMainItemByURI } from '@/config/menu.config.ts'

/**
 * 侧边栏菜单（左）
 */
export function Sidebar({ ...props }: React.ComponentProps<typeof ShadUISidebar>) {
  const { userInfo, setNavTitle } = useZustandStore()
  const [activeItem, setActiveItem] = React.useState<NavSidebarGroupItem>(navMainItems[0])
  const { activeTab, setActiveTab } = useZustandStore()
  const activeNavMainItem = useActiveNavMainItemByURI()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const username = userInfo.username || 'user'
  const user = {
    name: username,
    email: username + '@example.com',
    avatar: 'https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/Hanfu_2.png',
  }

  function getOnItemClick(item: NavSidebarGroupItem) {
    if (isDebugEnable) log.info('item: ', item)
    setActiveItem(item)
    setNavTitle(item.title)
    setActiveTab(item.url)
    navigate(item.url)
  }

  // 组件挂载时: 获取菜单数据/恢复菜单状态
  useEffect(() => {
    if (activeTab) {
      setActiveItem(activeNavMainItem)
      setNavTitle(activeNavMainItem.title)
      navigate(activeNavMainItem.url)
    } else {
      setActiveTab(activeNavMainItem.url)
    }
  }, [pathname])

  return (
    <ShadUISidebar collapsible="icon" variant="sidebar" {...props}>
      {/* 顶部区域 */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Clock className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{import.meta.env.VITE_APP_NAME}</span>
                <span className="truncate text-xs">{import.meta.env.VITE_APP_VERSION}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 内容区 */}
      <SidebarContent>
        <NavyPrimary items={navMainItems} activeItem={activeItem} onItemClick={item => getOnItemClick(item)} />
      </SidebarContent>

      {/* 底部区域 */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      {/* 收起栏 */}
      <SidebarRail />
    </ShadUISidebar>
  )
}
