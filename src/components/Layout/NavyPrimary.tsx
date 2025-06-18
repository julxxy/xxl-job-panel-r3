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
