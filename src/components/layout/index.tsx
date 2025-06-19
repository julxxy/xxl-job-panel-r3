import React, { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx'
import { Sidebar } from '@/components/layout/Sidebar.tsx'
import Header from '@/components/layout/Header.tsx'
import Footer from '@/components/layout/Footer.tsx'
import Lazy from '@/components/Lazy.tsx'
import useZustandStore from '@/stores/useZustandStore.ts'

const Layout: React.FC = () => {
  const { collapsed } = useZustandStore()

  return (
    <SidebarProvider defaultOpen={collapsed}>
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header className="sticky top-0 z-50 bg-background" />
          <main className="flex-1 overflow-auto px-3 mb-3">
            <div className="flex flex-col min-h-full bg-muted/40 border border-border rounded-lg p-4">
              <div className="flex-1 overflow-auto">
                <Outlet context={<Lazy Component={lazy(() => import('@/pages/dashboard'))} />} />
              </div>
              <Footer />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
