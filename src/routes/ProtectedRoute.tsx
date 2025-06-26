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

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import storage from '@/utils/storage.ts'
import useZustandStore from '@/stores/useZustandStore.ts'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useZustandStore()
  const location = useLocation()
  const pathname = location.pathname

  // 判断路由是否有权限
  const isAuthenticated = userInfo?.username === storage.get('token') && !!storage.get('token')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
