import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Tabs } from 'antd'
import { CloseCircleFilled, PushpinFilled } from '@ant-design/icons'
import useZustandStore from '@/stores/useZustandStore.ts'
import URIs from '@/assets/URIs.json'
import { isDebugEnable, log } from '@/common/Logger'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActiveNavMainItemByURI } from '@/config/menu.config.ts'
import { TabItem } from '@/types'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

// 默认首页Tab
const defaultTab: TabItem = {
  key: URIs.dashboard,
  label: '工作台',
  icon: <PushpinFilled style={{ color: '#faad14' }} />,
  closable: false,
}

/**
 * 顶部多页签组件（ShadcnAntdTab）
 * - 动态增删页签
 * - 记忆激活页签
 * - 与路由和全局状态联动
 */
const ShadcnAntdTab: React.FC = () => {
  const { activeTab, setActiveTab } = useZustandStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const navMainItem = useActiveNavMainItemByURI(pathname)

  // 用ref追踪最新tabItems，防止闭包问题
  const tabItemsRef = useRef<TabItem[]>([defaultTab])
  const [tabItems, setTabItems] = React.useState<TabItem[]>([defaultTab])

  // 保证tabItemsRef始终最新
  useEffect(() => {
    tabItemsRef.current = tabItems
  }, [tabItems])

  // 创建或激活Tab
  const createOrActivateTab = useCallback(() => {
    if (!navMainItem) return
    const exists = tabItemsRef.current.some(item => item.key === navMainItem.url)
    if (!exists) {
      const newTab: TabItem = {
        key: navMainItem.url,
        label: navMainItem.title,
        closable: navMainItem.url !== URIs.dashboard,
      }
      setTabItems(prev => [...prev, newTab])
      setActiveTab(navMainItem.url)
    } else {
      setActiveTab(navMainItem.url)
    }
  }, [navMainItem, setActiveTab])

  // 路由变化时同步Tab
  useEffect(() => {
    if (pathname === URIs.dashboard) {
      setActiveTab(URIs.dashboard)
    } else {
      createOrActivateTab()
    }
    // eslint-disable-next-line
  }, [pathname, createOrActivateTab])

  // 切换Tab
  const onChange = useCallback(
    (newActiveKey: string) => {
      setActiveTab(newActiveKey)
      navigate(newActiveKey)
    },
    [setActiveTab, navigate],
  )

  useEffect(() => {
    if (isDebugEnable) log.info('Current Tabs:', tabItems)
  }, [tabItems])

  // 关闭Tab
  const remove = useCallback(
    (targetKey: TargetKey) => {
      const currentTabs = tabItemsRef.current
      const idx = currentTabs.findIndex(item => item.key === targetKey)
      if (idx === -1) return
      const nextTab = currentTabs[idx + 1] || currentTabs[idx - 1] || { key: URIs.dashboard }
      setTabItems(currentTabs.filter(item => item.key !== targetKey))
      setActiveTab(nextTab.key)
      navigate(nextTab.key)
      if (isDebugEnable) log.info('Removed Tab: ', targetKey, currentTabs)
    },
    [setActiveTab, navigate],
  )

  // Tab编辑事件
  const onEdit = useCallback(
    (targetKey: TargetKey, action: 'add' | 'remove') => {
      if (action === 'remove') remove(targetKey)
    },
    [remove],
  )

  // Tab渲染优化：只渲染激活Tab内容
  const items = useMemo(
    () =>
      tabItems.map(tab => ({
        ...tab,
        label: <span style={{ marginLeft: tab.icon ? 4 : 0 }}>{tab.label}</span>,
      })),
    [tabItems],
  )

  // 兜底：只剩首页且当前不是首页时不渲染
  if (tabItems.length === 1 && tabItems[0].key === URIs.dashboard && pathname !== URIs.dashboard) return null

  return (
    <Tabs
      type="editable-card"
      hideAdd
      size="small"
      tabBarGutter={6}
      activeKey={activeTab}
      onChange={onChange}
      onEdit={onEdit}
      items={items}
      destroyOnHidden
      tabBarStyle={{ margin: 0, padding: 0, bottom: 0 }}
      removeIcon={<CloseCircleFilled />}
    />
  )
}

export default React.memo(ShadcnAntdTab)
