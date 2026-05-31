import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Profile, WeightEntry } from './types'
import { importJson, loadState, saveState } from './lib/storage'

interface Store {
  state: AppState
  hasProfile: boolean
  saveProfile: (profile: Profile) => void
  updateProfile: (patch: Partial<Profile>) => void
  /** Add or replace the entry for a given date. */
  upsertEntry: (entry: Omit<WeightEntry, 'id'> & { id?: string }) => void
  deleteEntry: (id: string) => void
  replaceState: (next: AppState) => void
  importBackup: (text: string) => void
  resetAll: () => void
}

const StoreContext = createContext<Store | null>(null)

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const saveProfile = useCallback((profile: Profile) => {
    setState((s) => ({ ...s, profile }))
  }, [])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) =>
      s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s,
    )
  }, [])

  const upsertEntry = useCallback(
    (entry: Omit<WeightEntry, 'id'> & { id?: string }) => {
      setState((s) => {
        const entries = [...s.entries]
        // If editing by id, update in place.
        if (entry.id) {
          const idx = entries.findIndex((e) => e.id === entry.id)
          if (idx >= 0) {
            entries[idx] = { ...entries[idx], ...entry, id: entry.id }
            return { ...s, entries }
          }
        }
        // Otherwise treat date as the unique key (one weigh-in per day).
        const sameDay = entries.findIndex((e) => e.date === entry.date)
        if (sameDay >= 0) {
          entries[sameDay] = {
            ...entries[sameDay],
            ...entry,
            id: entries[sameDay].id,
          }
          return { ...s, entries }
        }
        entries.push({ ...entry, id: entry.id ?? genId() })
        return { ...s, entries }
      })
    },
    [],
  )

  const deleteEntry = useCallback((id: string) => {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))
  }, [])

  const replaceState = useCallback((next: AppState) => {
    setState(next)
  }, [])

  const importBackup = useCallback((text: string) => {
    const next = importJson(text)
    setState(next)
  }, [])

  const resetAll = useCallback(() => {
    setState({ profile: null, entries: [], version: 1 })
  }, [])

  const value = useMemo<Store>(
    () => ({
      state,
      hasProfile: state.profile !== null,
      saveProfile,
      updateProfile,
      upsertEntry,
      deleteEntry,
      replaceState,
      importBackup,
      resetAll,
    }),
    [
      state,
      saveProfile,
      updateProfile,
      upsertEntry,
      deleteEntry,
      replaceState,
      importBackup,
      resetAll,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
