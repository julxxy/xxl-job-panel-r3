import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '@/components/layout'
import Dashboard from '@/pages/dashboard/index'
import LoginPage from '@/pages/login'
import OverflowTest from '@/pages/extra/OverflowTest'
import NotFound from '@/pages/error/NotFound.tsx'
import { isFalse } from '@/common/booleanUtils'
import ProtectedRoute from '@/routes/ProtectedRoute.tsx'
import UserComponent from '@/pages/user'
import ExecutorComponent from '@/pages/executor'
import TaskManageComponent from '@/pages/task'
import LogViewerComponent from '@/pages/logger'

const URIs = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  overflow: '/overflow',
  tasks: '/tasks',
  logs: '/logs',
  users: '/users',
  executors: '/executors',
  notFound: '/404',
  noPermission: '/403',
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={URIs.login} element={<LoginPage />} />

      <Route
        path={URIs.home}
        element={
          isFalse(import.meta.env.VITE_ENABLE_AUTH) ? (
            <Layout />
          ) : (
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={URIs.dashboard} element={<Dashboard />} />
        <Route path={URIs.tasks} element={<TaskManageComponent />} />
        <Route path={URIs.logs} element={<LogViewerComponent />} />
        <Route path={URIs.executors} element={<ExecutorComponent />} />
        <Route path={URIs.users} element={<UserComponent />} />
        <Route path={URIs.overflow} element={<OverflowTest />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export { URIs, AppRoutes }
