import { lazy, Suspense } from 'react'
import { Navigate, createHashRouter } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'

const LoginPage = lazy(() => import('./pages/Login').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })),
)
const WorkflowEditorPage = lazy(() =>
  import('./pages/WorkflowEditor').then((m) => ({ default: m.WorkflowEditorPage })),
)
const ExecutionViewerPage = lazy(() =>
  import('./pages/ExecutionViewer').then((m) => ({ default: m.ExecutionViewerPage })),
)
const OnboardingPage = lazy(() =>
  import('./pages/Onboarding').then((m) => ({ default: m.OnboardingPage })),
)
const SettingsPage = lazy(() =>
  import('./pages/Settings').then((m) => ({ default: m.SettingsPage })),
)
const ApiKeysPage = lazy(() => import('./pages/ApiKeys').then((m) => ({ default: m.ApiKeysPage })))

/* eslint-disable react-refresh/only-export-components */
function NotFoundPage() {
  return <Navigate to="/" replace />
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createHashRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <SuspenseWrapper>
        <OnboardingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <AppLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'workflows/:workflowId',
        element: (
          <SuspenseWrapper>
            <WorkflowEditorPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'workflows/:workflowId/execute',
        element: (
          <SuspenseWrapper>
            <ExecutionViewerPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings/api-keys',
        element: (
          <SuspenseWrapper>
            <ApiKeysPage />
          </SuspenseWrapper>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
