import { useCallback, useEffect, useState } from 'react'
import { useStore } from './store'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Footer from './components/Footer'
import { Button, cx } from './components/ui'
import { useInstallPrompt } from './lib/useInstallPrompt'
import { loadReminderPrefs, startReminderScheduler } from './lib/reminders'

type Tab = 'dashboard' | 'settings'

export default function App() {
  const { hasProfile, state } = useStore()
  const [tab, setTab] = useState<Tab>('dashboard')
  const { canInstall, promptInstall } = useInstallPrompt()

  const hasEntryToday = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10)
    return state.entries.some((e) => e.date === today)
  }, [state.entries])

  // Run the in-app reminder scheduler while the app is open.
  useEffect(() => {
    if (!hasProfile) return
    const stop = startReminderScheduler(loadReminderPrefs, hasEntryToday)
    return stop
  }, [hasProfile, hasEntryToday])

  if (!hasProfile) {
    return <Onboarding />
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col px-4 pb-10 pt-5 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path
                d="M7 21 L13 14 L18 18 L25 9"
                stroke="#34d399"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="25" cy="9" r="2.6" fill="#34d399" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-ink-50">
            Trendweight
          </span>
        </div>
        <div className="flex items-center gap-2">
          {canInstall && (
            <Button size="sm" variant="subtle" onClick={promptInstall}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Install
            </Button>
          )}
          <nav className="flex gap-1 rounded-xl bg-white/5 p-1">
            <TabButton
              active={tab === 'dashboard'}
              onClick={() => setTab('dashboard')}
            >
              Dashboard
            </TabButton>
            <TabButton
              active={tab === 'settings'}
              onClick={() => setTab('settings')}
            >
              Settings
            </TabButton>
          </nav>
        </div>
      </header>

      <main className="flex-1 animate-fade-in">
        {tab === 'dashboard' ? <Dashboard /> : <Settings />}
      </main>

      <Footer />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-brand-500 text-ink-950' : 'text-ink-300 hover:text-ink-50',
      )}
    >
      {children}
    </button>
  )
}
