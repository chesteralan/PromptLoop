import { createHashRouter } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { WorkflowEditorPage } from './pages/WorkflowEditor'
import { ExecutionViewerPage } from './pages/ExecutionViewer'
import { OnboardingPage } from './pages/Onboarding'
import { SettingsPage } from './pages/Settings'
import { ApiKeysPage } from './pages/ApiKeys'

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'workflows/:workflowId', element: <WorkflowEditorPage /> },
      { path: 'workflows/:workflowId/execute', element: <ExecutionViewerPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/api-keys', element: <ApiKeysPage /> },
      { path: '*', element: <DashboardPage /> },
    ],
  },
])
