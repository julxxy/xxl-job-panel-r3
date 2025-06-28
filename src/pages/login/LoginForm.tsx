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
    const form = document.querySelector('form')
    if (!form) return
    const formData = new FormData(form)
    const userName = formData.get('userName') as string
    const password = formData.get('password') as string

    // 简单参数校验
    if (!userName || !password) {
      toast.error('请输入账号和密码')
      return
    }

    setLoading(true)
    api.user
      .loginByLdap({
        userName,
        password,
        ifRemember: rememberMe,
      })
      .then(async ({ code, msg }) => {
        if (code === 200) {
          const _userInfo = { username: userName }
          setUserInfo(_userInfo)
          const { code, content } = await api.user.getUserRole(userName)
          if (code === 200) {
            await handleRoleUpdate(content)
          }
          storage.set('token', userName)
          toast.success(`LDAP登录成功, 欢迎 ${userName}`)
          setTimeout(() => {
            const urlSearchParams = new URLSearchParams(window.location.search)
            location.href = urlSearchParams.get('callback') || '/'
          }, 800)
        } else {
          toast.error(msg)
          setLoading(false)
        }
      })
      .catch(e => {
        log.error('LDAP 登录失败:', e)
        setLoading(false)
      })
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
        <p className="text-balance text-sm text-muted-foreground">可用 XXL-JOB 账号或企业域账号（LDAP）登录</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="userName">账号</Label>
          <Input
            id="userName"
            name="userName"
            type="text"
            placeholder="XXL-JOB 用户名或企业域账号"
            defaultValue=""
            required
          />
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
            defaultValue=""
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
          <Button variant="outline" type="button" onClick={onLdapLogin} disabled={loading}>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="256" height="256">
              <path d="M191.5 818.6c0-24.1-19.5-43.6-43.6-43.6H60.6C36.5 775 17 794.5 17 818.6s19.5 43.6 43.6 43.6h87.3c24.1 0 43.6-19.5 43.6-43.6zM60.6 644.1h87.3c24.1 0 43.6-19.5 43.6-43.6s-19.5-43.6-43.6-43.6H60.6c-24.1 0-43.6 19.5-43.6 43.6 0 24 19.5 43.6 43.6 43.6zM60.6 425.9h87.3c24.1 0 43.6-19.5 43.6-43.6s-19.5-43.6-43.6-43.6H60.6c-24.1 0-43.6 19.5-43.6 43.6 0 24 19.5 43.6 43.6 43.6zM60.6 207.7h87.3c24.1 0 43.6-19.5 43.6-43.6s-19.5-43.6-43.6-43.6H60.6C36.5 120.4 17 140 17 164.1s19.5 43.6 43.6 43.6zM463.3 455.4c-14.4-8.3-32.8-3.4-41.2 11-8.3 14.4-3.4 32.8 11 41.2 14.4 8.3 32.8 3.4 41.2-11 8.3-14.4 3.4-32.8-11-41.2zM569.4 233.9l-71.6 124c-1 1.8-0.4 4.1 1.4 5.1s4.1 0.4 5.1-1.4l71.6-124c1-1.8 0.4-4.1-1.4-5.1s-4.1-0.4-5.1 1.4z" />
              <path d="M955.1 76.8H846c0-24.1-19.5-43.6-43.6-43.6H126c-24.1 0-43.6 19.5-43.6 43.6v21.8h65.5c36.1 0 65.5 29.3 65.5 65.5s-29.3 65.5-65.5 65.5H82.4v87.3h65.5c36.1 0 65.5 29.3 65.5 65.5s-29.3 65.5-65.5 65.5H82.4V535h65.5c36.1 0 65.5 29.3 65.5 65.5 0 36.1-29.3 65.5-65.5 65.5H82.4v87.3h65.5c36.1 0 65.5 29.3 65.5 65.5 0 36.1-29.3 65.5-65.5 65.5H82.4v65.5c0 24.1 19.5 43.6 43.6 43.6h676.4c24.1 0 43.6-19.5 43.6-43.6V928h109.1c24.1 0 43.6-19.5 43.6-43.6v-764c0.1-24.1-19.5-43.6-43.6-43.6zM351.3 855.2h-97.7V693.8h32.3v134.4h65.5v27z m33.7-445c19.7-34.1 58.2-50.4 94.8-43.6l90.9-157.4c1.4-2.4 3.7-4.2 6.4-4.9l26.7-7.2c5.6-1.5 11.4 1.8 12.9 7.5l7.2 26.7c0.7 2.7 0.3 5.6-1.1 8l-16.7 28.8 26.1 15.1c7.2 4.2 9.7 13.4 5.5 20.6-4.2 7.2-13.4 9.7-20.6 5.5L591 294.2l-7.5 13.1 26.1 15.1c7.2 4.2 9.7 13.4 5.5 20.6-4.2 7.2-13.4 9.7-20.6 5.5l-26.1-15.1-7.5 13.1 26.1 15.1c7.2 4.2 9.7 13.4 5.5 20.6-4.2 7.2-13.4 9.7-20.6 5.5l-26.1-15.1-13.8 24.2c24.2 28.3 29.3 69.8 9.6 103.9-25 43.2-80.3 58.1-123.5 33.1-43.3-25-58.1-80.3-33.1-123.6z m102.9 424.7c-13.7 13.5-32.7 20.3-56.9 20.3h-46V693.8h44.3c25.3 0 44.8 6.5 58.5 19.6 14.3 13.7 21.4 33.8 21.4 60.4s-7.2 47-21.3 61.1z m142.7 20.3l-11.3-41.5h-52.4l-11.3 41.5h-32.7l51.7-161.5h38l51.9 161.5h-33.9zM787 785c-11.1 8.6-25.8 12.9-44.3 12.9h-21.6v57.4h-32.3V693.8h53c42.2 0 63.3 16.9 63.3 50.6 0 17.6-6 31.1-18.1 40.6z m146.3 77.2H846V731.3h87.3v130.9z m0-196.3H846V535h87.3v130.9z m0-196.4H846V338.6h87.3v130.9z m0-196.4H846V142.2h87.3v130.9z" />
              <path d="M600.3 744.8c-3.6-14.1-6-23-7-26.6h-0.9c-4.1 17.5-8.7 35-13.7 52.8l-4.8 17.7h38.4l-4.8-17.7c-1.9-6.4-4.3-15.1-7.2-26.2zM427.3 719.5h-10v109.8h10c32.6 0 48.9-18.5 48.9-55.4-0.1-36.3-16.4-54.4-48.9-54.4zM739.5 719.3h-18.3v53h19.4c22 0 33-9.3 33-27.9 0-9-2.9-15.6-8.7-19.6-5.5-3.7-13.9-5.5-25.4-5.5z" />
            </svg>
            <span className="inline-flex items-center bg-muted text-sm font-bold px-1 py-0.5 rounded border-muted-foreground/20">
              LDAP
            </span>
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
