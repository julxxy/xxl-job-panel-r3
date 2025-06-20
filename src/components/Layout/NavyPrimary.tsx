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

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar.tsx'
import { type LucideIcon } from 'lucide-react'

export type NavSidebarGroupItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export function NavyPrimary({
  items,
  activeItem,
  onItemClick,
}: {
  items: NavSidebarGroupItem[]
  activeItem: NavSidebarGroupItem
  onItemClick: (item: NavSidebarGroupItem) => void
}) {
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>系统管理</SidebarGroupLabel>
      <SidebarGroupContent className="px-1.5 md:px-0">
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={{
                  children: item.title,
                  hidden: open,
                }}
                onClick={() => {
                  onItemClick(item)
                }}
                isActive={activeItem.title === item.title}
                className="px-2.5 md:px-2"
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
