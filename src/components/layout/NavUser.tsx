'use client'

import { useState } from 'react'
import { ChevronsUpDown, KeyRound, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar.tsx'
import api from '@/api'
import storage from '@/utils/storage.ts'
import { toast } from '@/utils/toast.ts'
import URIs from '@/assets/URIs.json'

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const [openPwdDialog, setOpenPwdDialog] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')

  async function handleLogout() {
    const { code } = await api.user.logout()
    if (code === 200) {
      toast.success('登出成功')
      storage.clear()
      setTimeout(() => {
        location.href = URIs.auth.login
      }, 1000)
    }
  }

  async function handleEditPwd() {
    try {
      const { code, msg } = await api.user.editPwd({ oldPassword: oldPwd, password: newPwd })
      if (code === 200) {
        storage.remove('token')
        toast.success('修改成功，请重新登录')
        setOpenPwdDialog(false)
        setTimeout(() => {
          location.href = URIs.auth.login
        }, 1000)
      } else {
        toast.error(msg)
      }
    } catch (e) {
      toast.error('修改失败，请检查密码')
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpenPwdDialog(true)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  修改密码
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={openPwdDialog} onOpenChange={setOpenPwdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="原密码"
              value={oldPwd}
              required
              onChange={e => setOldPwd(e.target.value)}
            />
            <Input
              type="password"
              placeholder="新密码"
              value={newPwd}
              required
              onChange={e => setNewPwd(e.target.value)}
            />
            <Button onClick={handleEditPwd} className="w-full">
              确认修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
