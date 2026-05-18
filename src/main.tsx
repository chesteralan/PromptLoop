import './styles/globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import App from './App'
import { AuthProvider } from './components/auth/AuthProvider'
import { initRendererSentry } from './lib/sentry'
import { injectElectronMock } from './lib/electron-mock'

try {
  injectElectronMock()
} catch (e) {
  console.warn('Failed to inject Electron mock:', e)
}
initRendererSentry()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
