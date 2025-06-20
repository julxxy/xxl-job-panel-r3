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

import React, { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx'
import { Sidebar } from '@/components/Layout/Sidebar.tsx'
import Header from '@/components/Layout/Header.tsx'
import Footer from '@/components/Layout/Footer.tsx'
import Lazy from '@/components/Lazy.tsx'
import useZustandStore from '@/stores/useZustandStore.ts'
import ShadcnAntdTabs from '@/components/ShadcnAntdTab.tsx'

const Layout: React.FC = () => {
  const { collapsed } = useZustandStore()

  return (
    <SidebarProvider defaultOpen={collapsed}>
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header className="sticky top-0 z-50 bg-background" />
          <div className="ml-4 mr-6 rounded-bl-md">
            <ShadcnAntdTabs />
          </div>
          <main className="flex-1 px-3 mb-3">
            <div className="flex flex-col min-h-full bg-muted/40 border border-border rounded-lg p-4">
              <div className="flex-1 overflow-auto">
                <Outlet context={<Lazy Render={lazy(() => import('@/pages/dashboard'))} />} />
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
