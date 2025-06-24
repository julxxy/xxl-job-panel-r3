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

import { create } from 'zustand'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { isTrue } from '@/common/BooleanUtils.ts'
import storage from '@/utils/storage.ts'
import { TriggerStats, User } from '@/types'

/**
 * This is the store for the app. implemented using Zustand library.
 */
const useZustandStore = create<{
  /* state defined */
  token: string
  userInfo: User.Info
  userRole: User.Role
  collapsed: boolean
  isDarkEnable: boolean
  activeTab: string
  chartData: TriggerStats
  chartTimeRange: { startDate: string; endDate: string }
  navTitle: string
  /* setters */
  setToken: (token: string) => void
  setUserInfo: (userInfo: User.Info) => void
  setUserRole: (role: User.Role) => void
  setCollapsed: () => void
  setIsDarkEnable: () => void
  setActiveTab: (activeTab: string) => void
  setChartData: (data: TriggerStats) => void
  setChartTimeRange: (timeRange: { startDate: string; endDate: string }) => void
  setNavTitle: (title: string) => void
}>(set => ({
  /* state init value */
  token: '',
  userInfo: ((): User.Info => {
    const stored = storage.get('user') as User.Info
    return stored && typeof stored === 'object' ? stored : ({} as User.Info)
  })(),
  userRole: ((): User.Role => {
    const stored = storage.get('role') as User.Role
    return stored && typeof stored === 'object' ? stored : ({} as User.Role)
  })(),
  collapsed: isTrue(storage.get('collapsed')),
  isDarkEnable: isTrue(storage.get('enableDark')),
  activeTab: '',
  chartData: {} as TriggerStats,
  chartTimeRange: { startDate: '', endDate: '' },
  navTitle: '工作台', // 默认
  /* setters impl */
  setToken: (token: string) => set(() => ({ token })),
  setUserInfo: (userInfo: User.Info) => {
    set(() => ({ userInfo }))
    storage.set('user', userInfo)
    logStateUpdate(userInfo)
  },
  setUserRole: (role: User.Role) => {
    set(() => ({ userRole: role }))
    storage.set('role', role)
    logStateUpdate(role)
  },
  setCollapsed: () => {
    set(state => {
      const newValue = !state.collapsed
      storage.set('collapsed', newValue)
      logStateUpdate(newValue)
      return { collapsed: newValue }
    })
  },
  setIsDarkEnable: () => {
    set(state => {
      const nextIsDark = !state.isDarkEnable
      storage.set('enableDark', nextIsDark)
      logStateUpdate(nextIsDark)
      return { isDarkEnable: nextIsDark }
    })
  },
  setActiveTab: (activeTab: string) => {
    logStateUpdate(activeTab)
    storage.set('activeTab', activeTab)
    set(() => ({ activeTab }))
  },
  setChartData: (chartData: TriggerStats) => {
    logStateUpdate(chartData)
    set(() => ({ chartData }))
  },
  setChartTimeRange(chartTimeRange: { startDate: string; endDate: string }) {
    logStateUpdate(chartTimeRange)
    set(() => ({ chartTimeRange }))
  },
  setNavTitle: (title: string) => {
    logStateUpdate(title, 'navTitle')
    set({ navTitle: title })
  },
}))

function logStateUpdate(data: unknown, key?: any) {
  if (!isDebugEnable) return
  if (arguments.length === 1) {
    if (isDebugEnable) {
      log.debug('[Zustand] State Update (batch)', {
        updates: data,
        timestamp: new Date().toISOString(),
        source: 'zustandStore',
      })
    }
    return
  }
  if (typeof key === 'string' && arguments.length === 2) {
    if (isDebugEnable) {
      log.debug('[Zustand] State Update', {
        key,
        value: data,
        timestamp: new Date().toISOString(),
        source: 'zustandStore',
      })
    }
    return
  }
  log.warn('[Zustand] Invalid state update log format', { key, data })
}

export default useZustandStore
