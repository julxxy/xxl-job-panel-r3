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

import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import React, { useEffect, useState } from 'react'
import api from '@/api'
import storage from '@/utils/storage.ts'
import { toast } from 'sonner'
import { isDebugEnable, log } from '@/common/Logger.ts'
import useZustandStore from '@/stores/useZustandStore.ts'
import { LogInIcon } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { userRole, setUserInfo, setUserRole } = useZustandStore()
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const userName = formData.get('userName') as string
    const password = formData.get('password') as string

    try {
      setLoading(true)
      const { code, msg } = await api.user.login({
        userName,
        password,
        ifRemember: rememberMe,
      })
      if (code === 200) {
        const _userInfo = { username: userName }
        setUserInfo(_userInfo)
        const { code, content } = await api.user.getUserRole(userName)
        if (code === 200) {
          await handleRoleUpdate(content)
        }
        storage.set('token', userName)
        toast.success(`登录成功, 欢迎 ${userName}`)
        setTimeout(() => {
          const urlSearchParams = new URLSearchParams(window.location.search)
          location.href = urlSearchParams.get('callback') || '/'
        }, 800)
      } else {
        toast.error(msg)
        setLoading(false)
      }
    } catch (e) {
      log.error('登录失败:', e)
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (content: any) => {
    setUserRole({ ...content })
    if (isDebugEnable) {
      log.debug('content: ', content)
      log.debug('userRole (may not updated): ', userRole)
    }
  }

  function onLdapLogin() {
    if (isDebugEnable) {
      log.debug('On ldap login.')
    }
  }

  useEffect(() => {
    if (isDebugEnable) {
      log.debug('user role updated: ', userRole)
    }
  }, [userRole])

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">欢迎回来</h1>
        <p className="text-balance text-sm text-muted-foreground">使用你的 xxl-job 账号登录</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="userName">账号</Label>
          <Input id="userName" name="userName" type="text" defaultValue="admin" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">密码</Label>
          </div>
          <Input
            id="password"
            name="password"
            placeholder="请输入密码"
            type="password"
            required={false}
            defaultValue="123456"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            记住我
          </label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          <LogInIcon />
          登录
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">或者继续使用以下方式登录</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" type="button" className="w-full" onClick={onLdapLogin} disabled={loading}>
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="256"
              height="256"
            >
              <path
                d="M927.004444 776.732444V257.137778a36.408889 36.408889 0 0 0-36.380444-36.408889H135.224889V162.986667c0-20.138667 16.355556-36.408889 36.408889-36.408889h810.296889c20.110222 0 36.408889 16.298667 36.408889 36.408889v576.995555a36.408889 36.408889 0 0 1-36.039112 36.750222H927.004444z m-45.027555-473.088v576.341334a36.408889 36.408889 0 0 1-36.408889 36.408889H36.408889A36.408889 36.408889 0 0 1 0 879.985778v-576.284445c0-20.138667 16.270222-36.408889 36.408889-36.408889h809.102222c20.053333 0 36.323556 16.270222 36.323556 36.408889l0.142222-0.056889zM164.750222 671.488H73.500444V464.497778H21.390222v250.624h143.36v-43.633778z m117.845334-206.990222h-84.764445v250.624h84.48a129.308444 129.308444 0 0 0 93.838222-35.328 123.022222 123.022222 0 0 0 36.323556-93.070222c0-81.464889-43.292444-122.225778-129.820445-122.225778h-0.056888z m295.68 0h-61.525334l-89.429333 250.624h56.746667l17.806222-57.514667h88.718222l18.574222 57.457778h56.746667L578.275556 464.497778z m202.524444 0h-83.968v250.624h52.024889v-87.296h26.88a99.982222 99.982222 0 0 0 68.721778-22.528 75.946667 75.946667 0 0 0 27.648-61.525334c0-53.077333-30.549333-79.274667-91.306667-79.274666z m-9.415111 122.140444h-22.528v-80.753778h22.869333a37.660444 37.660444 0 0 1 45.482667 39.651556 38.428444 38.428444 0 0 1-45.824 41.102222z m-230.229333-53.361778c2.190222-7.025778 3.669333-14.136889 4.380444-21.475555h1.422222c0.398222 7.537778 1.678222 14.933333 3.640889 22.186667l27.676445 86.926222h-65.137778l28.017778-87.608889z m-262.570667 141.937778h-28.387556v-163.328h28.017778a79.957333 79.957333 0 0 1 57.457778 20.764445c15.473778 15.473778 23.495111 36.750222 22.186667 58.510222a86.044444 86.044444 0 0 1-21.134223 61.44 76.032 76.032 0 0 1-58.140444 22.528v0.085333z"
                fill="#515151"
              ></path>
            </svg>
            <span className="sr-only">Login with LDAP</span>
          </Button>

          <Button variant="outline" type="button" className="w-full" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Google</span>
          </Button>
          <Button variant="outline" type="button" className="w-full" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Meta</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
