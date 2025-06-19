import React from 'react'
import { Navigate } from 'react-router-dom'
import storage from '@/utils/storage.ts'
import useZustandStore from '@/stores/useZustandStore.ts'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useZustandStore()
  const isAuthenticated = userInfo?.username === storage.get('token') && !!storage.get('token')
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
