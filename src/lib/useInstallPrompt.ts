import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Captures the browser's install prompt so we can offer an "Install app"
 * button at a moment of our choosing. Returns null when install isn't
 * available (already installed, unsupported, or iOS).
 */
export function useInstallPrompt(): {
  canInstall: boolean
  promptInstall: () => Promise<void>
} {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    const installed = () => setDeferred(null)
    window.addEventListener('appinstalled', installed)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  return {
    canInstall: deferred !== null,
    promptInstall: async () => {
      if (!deferred) return
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
    },
  }
}
