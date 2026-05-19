import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from 'sonner'
import { router } from './routes'
import { useTheme } from './hooks/useTheme'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

function AppContent() {
  useTheme()

  return <RouterProvider router={router} />
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
      <Toaster richColors position="bottom-right" />
    </ErrorBoundary>
  )
}

export default App
