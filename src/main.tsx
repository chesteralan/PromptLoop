import './styles/globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AuthProvider } from './components/auth/AuthProvider'
import { initRendererSentry } from './lib/sentry'
import { injectElectronMock } from './lib/electron-mock'
import { createQueryClient } from '@/lib/query-client'

try {
  injectElectronMock()
} catch (e) {
  console.warn('Failed to inject Electron mock:', e)
}
initRendererSentry()

const queryClient = createQueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
