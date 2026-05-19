import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useOnboardingRedirect } from '../../hooks/useOnboardingRedirect'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'
import { ProtectedRoute } from './ProtectedRoute'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { checking } = useOnboardingRedirect()

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
          <StatusBar />
        </div>
      </div>
    </ProtectedRoute>
  )
}
