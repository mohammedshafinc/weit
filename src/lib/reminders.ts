const PREF_KEY = 'weight-tracker.reminders.v1'

export interface ReminderPrefs {
  enabled: boolean
  /** HH:MM 24h local time */
  time: string
}

const DEFAULTS: ReminderPrefs = { enabled: false, time: '08:00' }

export function loadReminderPrefs(): ReminderPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULTS }
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<ReminderPrefs>) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveReminderPrefs(prefs: ReminderPrefs): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

const LAST_NOTIFIED_KEY = 'weight-tracker.reminders.lastNotified'

/**
 * Lightweight in-app scheduler. While the tab is open it checks once a minute
 * whether the reminder time has passed today and a reminder hasn't already
 * fired today. Returns a cleanup function.
 */
export function startReminderScheduler(
  getPrefs: () => ReminderPrefs,
  hasEntryToday: () => boolean,
): () => void {
  if (!notificationsSupported()) return () => {}

  const tick = () => {
    const prefs = getPrefs()
    if (!prefs.enabled) return
    if (Notification.permission !== 'granted') return
    if (hasEntryToday()) return

    const now = new Date()
    const [h, m] = prefs.time.split(':').map((n) => parseInt(n, 10))
    if (Number.isNaN(h) || Number.isNaN(m)) return

    const due = now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)
    if (!due) return

    const today = now.toISOString().slice(0, 10)
    const last = localStorage.getItem(LAST_NOTIFIED_KEY)
    if (last === today) return

    localStorage.setItem(LAST_NOTIFIED_KEY, today)
    try {
      new Notification('Time to weigh in ⚖️', {
        body: "Log today's weight to keep your trend accurate.",
        icon: '/favicon.svg',
      })
    } catch {
      // ignore notification construction failures
    }
  }

  // Run shortly after start, then every minute.
  const initial = window.setTimeout(tick, 4000)
  const interval = window.setInterval(tick, 60_000)
  return () => {
    window.clearTimeout(initial)
    window.clearInterval(interval)
  }
}
