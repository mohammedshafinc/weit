/** Register the service worker for offline support (production only). */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  // Vite sets import.meta.env.PROD in production builds.
  if (!import.meta.env.PROD) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
