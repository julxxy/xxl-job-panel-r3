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

import { lazy } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { Spin } from 'antd'
import LoginPage from '@/pages/login'
import NotFound from '@/pages/error/NotFound'
import NoPermission from '@/pages/error/NoPermission'
import ProtectedRoute from '@/routes/ProtectedRoute'
import Lazy from '@/components/Lazy'
import URIs from '@/assets/URIs.json'
import Layout from '@/components/Layout'

type IRouteObject = RouteObject & {
  enableAuth?: boolean
  children?: IRouteObject[]
}

// eslint-disable-next-line react-refresh/only-export-components
export const RouteConstants = {
  layoutId: 'layout',
}

const components = {
  dashboard: <Lazy Render={lazy(() => import('@/pages/dashboard'))} />,
  tasks: <Lazy Render={lazy(() => import('@/pages/task'))} />,
  logs: <Lazy Render={lazy(() => import('@/pages/logger'))} />,
  executors: <Lazy Render={lazy(() => import('@/pages/executor'))} />,
  users: <Lazy Render={lazy(() => import('@/pages/user'))} />,
  overflow: <Lazy Render={lazy(() => import('@/pages/extra/OverflowTest'))} />,
}

function wrapProtectedRoutes(routes: IRouteObject[]): IRouteObject[] {
  return routes.map(route => {
    const newRoute: IRouteObject = { ...route }

    if (route.enableAuth && route.element) {
      newRoute.element = <ProtectedRoute>{route.element}</ProtectedRoute>
    }

    if (route.children) {
      newRoute.children = wrapProtectedRoutes(route.children)
    }

    return newRoute
  })
}

const routes: IRouteObject[] = [
  { path: URIs.root, element: <Navigate to={URIs.dashboard} /> },
  { path: URIs.auth.login, element: <LoginPage /> },
  { path: '*', element: <Navigate to={URIs.error.notFound} /> },
  {
    id: RouteConstants.layoutId,
    enableAuth: true,
    element: <Layout />,
    hydrateFallbackElement: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Spin tip="页面加载中..." size="large" />
      </div>
    ),
    children: [
      { path: URIs.dashboard, element: components.dashboard },
      { path: URIs.tasks, element: components.tasks },
      { path: URIs.logs, element: components.logs },
      { path: URIs.executors, element: components.executors },
      { path: URIs.users, element: components.users },
      { path: URIs.overflow, element: components.overflow },
    ],
  },
  { path: URIs.error.notFound, element: <NotFound /> },
  { path: URIs.auth.noPermission, element: <NoPermission /> },
]

export const AppRouter = createBrowserRouter(wrapProtectedRoutes(routes))
