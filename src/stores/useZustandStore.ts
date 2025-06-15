import { create } from 'zustand'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { isTrue } from '@/common/booleanUtils.ts'
import storage from '@/utils/storage.ts'
import { TriggerStats, User } from '@/types'

/**
 * This is the store for the app. implemented using Zustand library.
 */
const useZustandStore = create<{
  /* state defined */
  token: string
  userInfo: User.Info
  collapsed: boolean
  isDarkEnable: boolean
  activeTab: string
  chartData: TriggerStats
  chartTimeRange: { startDate: string; endDate: string }
  navTitle: string
  /* setters */
  setToken: (token: string) => void
  setUserInfo: (userInfo: User.Info) => void
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
    const stored = storage.get('user-info') as User.Info
    return stored && typeof stored === 'object' ? stored : ({} as User.Info)
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
    storage.set('user-info', userInfo)
    logStateUpdate(userInfo)
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
