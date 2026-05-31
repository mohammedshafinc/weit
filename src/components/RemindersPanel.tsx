import { useEffect, useState } from 'react'
import {
  loadReminderPrefs,
  notificationsSupported,
  requestNotificationPermission,
  saveReminderPrefs,
  type ReminderPrefs,
} from '../lib/reminders'
import { Button, Card, Field, Input, SectionTitle } from './ui'
import { useToast } from './Toast'

export default function RemindersPanel() {
  const toast = useToast()
  const supported = notificationsSupported()
  const [prefs, setPrefs] = useState<ReminderPrefs>(() => loadReminderPrefs())
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : 'denied',
  )

  useEffect(() => {
    saveReminderPrefs(prefs)
  }, [prefs])

  async function enableReminders() {
    const result = await requestNotificationPermission()
    setPermission(result)
    if (result === 'granted') {
      setPrefs((p) => ({ ...p, enabled: true }))
      toast.success('Daily reminders enabled.')
    } else {
      toast.error('Notification permission was not granted.')
    }
  }

  function disableReminders() {
    setPrefs((p) => ({ ...p, enabled: false }))
    toast.info('Reminders turned off.')
  }

  return (
    <Card>
      <SectionTitle
        title="Daily reminder"
        subtitle="Get a nudge to log your weight each day."
      />

      {!supported ? (
        <p className="text-sm text-ink-500">
          Your browser doesn't support notifications. Reminders work best when
          you install the app to your home screen.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {prefs.enabled && permission === 'granted' ? (
              <>
                <span className="inline-flex items-center gap-2 text-sm text-brand-300">
                  <span className="h-2 w-2 rounded-full bg-brand-400" />
                  Reminders on
                </span>
                <Button size="sm" variant="ghost" onClick={disableReminders}>
                  Turn off
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={enableReminders}>
                Enable daily reminders
              </Button>
            )}
          </div>

          {prefs.enabled && permission === 'granted' && (
            <Field label="Remind me at" className="max-w-[200px]">
              <Input
                type="time"
                value={prefs.time}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, time: e.target.value }))
                }
              />
            </Field>
          )}

          <p className="text-xs text-ink-600">
            Reminders only fire while the app is open in your browser, and only
            if you haven't logged a weigh-in that day. Install the app for the
            most reliable experience.
          </p>
        </div>
      )}
    </Card>
  )
}
