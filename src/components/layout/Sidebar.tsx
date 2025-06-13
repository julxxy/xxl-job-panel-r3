import * as React from 'react'
import { Clock } from 'lucide-react'

import { NavUser } from '@/components/layout/NavUser.tsx'

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
import { log } from '@/common/Logger'
import { NavSidebarGroupItem, NavyPrimary } from '@/components/layout/NavyPrimary.tsx'
import { useNavigate } from 'react-router-dom'
import URIs from '@/assets/URIs.json'
import { navMainItems } from '@/config/menu.config.ts'

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadUISidebar>) {
  const { userInfo } = useZustandStore()
  const [activeItem, setActiveItem] = React.useState<NavSidebarGroupItem>(navMainItems[0])
  const { setNavTitle } = useZustandStore()
  const navigate = useNavigate()

  const username = userInfo.username || 'user'
  const user = {
    name: username,
    email: username + '@example.com',
    avatar: 'https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/Hanfu_2.png',
  }

  return (
    <ShadUISidebar collapsible="icon" variant="sidebar" {...props}>
      {/* 顶部区域 */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={URIs.root}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Clock className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">{import.meta.env.VITE_APP_NAME}</span>
                  <span>{import.meta.env.VITE_APP_VERSION}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 内容区 */}
      <SidebarContent>
        <NavyPrimary
          items={navMainItems}
          activeItem={activeItem}
          onItemClick={item => {
            log.info(item)
            setActiveItem(item)
            setNavTitle(item.title)
            navigate(item.url)
          }}
        />
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
