import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: string
  kind: ToastKind
  message: string
}

interface ToastApi {
  show: (message: string, kind?: ToastKind) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const show = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `t-${Date.now()}-${Math.random()}`
      setToasts((t) => [...t, { id, kind, message }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (m) => show(m, 'success'),
      error: (m) => show(m, 'error'),
      info: (m) => show(m, 'info'),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur animate-fade-in ${toneClass(
              t.kind,
            )}`}
          >
            <ToastIcon kind={t.kind} />
            <span className="text-left">{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function toneClass(kind: ToastKind): string {
  switch (kind) {
    case 'success':
      return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
    case 'error':
      return 'border-red-400/30 bg-red-500/15 text-red-100'
    default:
      return 'border-white/10 bg-ink-900/90 text-ink-100'
  }
}

function ToastIcon({ kind }: { kind: ToastKind }) {
  const common = 'h-5 w-5 shrink-0'
  if (kind === 'success') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" className="fill-emerald-400/20" />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (kind === 'error') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" className="fill-red-400/20" />
        <path
          d="M12 7v6m0 4h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" className="fill-white/10" />
      <path
        d="M12 11v5m0-8h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
