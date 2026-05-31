import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './store.tsx'
import { ToastProvider } from './components/Toast.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { registerServiceWorker } from './lib/registerSW.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)

registerServiceWorker()
