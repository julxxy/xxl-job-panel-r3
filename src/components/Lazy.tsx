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

import React, {
  CSSProperties,
  LazyExoticComponent,
  startTransition,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Spin } from 'antd'

interface LazyProps {
  Render: LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>
}

const lazyContainer: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  minHeight: '200px',
}

const lazyContent: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  borderRadius: '16px',
  minWidth: '280px',
  maxWidth: '90%',
  maxHeight: '60%',
}

/**
 * 延迟加载 HOC 组件
 * @author weasley
 * @example
 * <Lazy Render={Dashboard} />
 */
const Lazy: React.FC<LazyProps> = ({ Render }) => {
  const [bgColor, setBgColor] = useState<string | null>(null)
  const fallbackRef = useRef<HTMLDivElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const fallback = (
    <div ref={fallbackRef} style={lazyContainer}>
      <Spin tip="加载中..." size="large">
        <div style={{ ...lazyContent, backgroundColor: bgColor ?? 'transparent' }}></div>
      </Spin>
    </div>
  )

  useEffect(() => {
    if (fallbackRef.current?.parentElement) {
      const parentBgColor = window.getComputedStyle(fallbackRef.current.parentElement!).backgroundColor
      if (parentBgColor !== bgColor) {
        setBgColor(parentBgColor)
      }
    }
  }, [bgColor])

  useEffect(() => {
    startTransition(() => setIsTransitioning(false))
  }, [])

  if (isTransitioning) {
    return fallback
  }

  return (
    <Suspense fallback={fallback}>
      <Render />
    </Suspense>
  )
}

export default Lazy
