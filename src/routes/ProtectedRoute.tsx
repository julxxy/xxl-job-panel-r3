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

import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import storage from '@/utils/storage.ts'
import useZustandStore from '@/stores/useZustandStore.ts'
import api from '@/api'
import { log } from '@/common/Logger.ts'
import useIsAdmin from '@/hooks/useIsAdmin.ts'
import URIs from '@/assets/URIs.json'

/**
 * 路由保护/鉴权
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo, setUserRole } = useZustandStore()
  const location = useLocation()
  const isAdmin = useIsAdmin()
  const pathname = location.pathname

  // 登录 token 校验
  const token = storage.get('token')
  const isLoggedIn = userInfo?.username === token && !!token

  // 所有受保护页面
  const adminRoutes = [URIs.dashboard, URIs.tasks, URIs.logs, URIs.users, URIs.executors, URIs.overflow]

  // 管理员有全部权限，普通用户仅能访问 dashboard
  const canAccess = isAdmin ? adminRoutes.includes(pathname) : pathname === URIs.dashboard

  useEffect(() => {
    // 实时刷新角色
    if (isLoggedIn) {
      api.user
        .getUserRole(userInfo.username)
        .then(res => {
          const { code, content } = res
          if (code === 200 && content) {
            setUserRole({ ...content })
          }
        })
        .catch(err => {
          log.error('getUserRole error:', err)
        })
    }
  }, [isLoggedIn, userInfo.username])

  // 未登录
  if (!isLoggedIn) {
    return <Navigate to={URIs.auth.login} replace state={{ from: location }} />
  }

  // 登录但无权访问
  if (!canAccess) {
    return <Navigate to={URIs.auth.noPermission} replace />
  }

  // 正常放行
  return <>{children}</>
}

export default ProtectedRoute
