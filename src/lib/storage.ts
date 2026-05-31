import type { AppState } from '../types'

const STORAGE_KEY = 'weight-tracker.state.v1'
const SCHEMA_VERSION = 1

const EMPTY: AppState = {
  profile: null,
  entries: [],
  version: SCHEMA_VERSION,
}

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return { ...EMPTY }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as AppState
    return migrate(parsed)
  } catch (err) {
    console.error('Failed to load state, starting fresh.', err)
    return { ...EMPTY }
  }
}

export function saveState(state: AppState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Failed to persist state.', err)
  }
}

function migrate(state: AppState): AppState {
  // Single schema version today; placeholder for future migrations.
  if (!state.version) state.version = SCHEMA_VERSION
  if (!Array.isArray(state.entries)) state.entries = []
  return state
}

/** Serialize the full state to a pretty JSON string for backup/export. */
export function exportJson(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

/** Parse and validate an imported JSON backup. Throws on malformed input. */
export function importJson(text: string): AppState {
  const parsed = JSON.parse(text) as Partial<AppState>
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Backup is not a valid object.')
  }
  if (!Array.isArray(parsed.entries)) {
    throw new Error('Backup is missing the entries list.')
  }
  return migrate({
    profile: parsed.profile ?? null,
    entries: parsed.entries,
    version: parsed.version ?? SCHEMA_VERSION,
  } as AppState)
}

/** Export entries to a CSV string (weights in kg). */
export function exportCsv(state: AppState): string {
  const header = 'date,weight_kg,body_fat_pct,note'
  const rows = [...state.entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => {
      const note = (e.note ?? '').replace(/"/g, '""')
      const bf = e.bodyFat ?? ''
      return `${e.date},${e.weightKg},${bf},"${note}"`
    })
  return [header, ...rows].join('\n')
}
