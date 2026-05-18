import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../hooks/useAuth'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'
import { ProtectedRoute } from './ProtectedRoute'

export function AppLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) {
      setChecking(false)
      return
    }
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists() && snap.data().onboardingComplete === false) {
          navigate('/onboarding', { replace: true })
        }
      })
      .catch((err) => console.warn('Failed to check onboarding status:', err))
      .finally(() => setChecking(false))
  }, [user, navigate])

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
