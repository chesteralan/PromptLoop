import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from 'sonner'
import { router } from './routes'
import { useTheme } from './hooks/useTheme'

function App() {
  useTheme()

  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}

export default App
