import { useRef, useState } from 'react'
import type { ActivityLevel, Sex, UnitSystem } from '../types'
import { useStore } from '../store'
import { exportCsv, exportJson } from '../lib/storage'
import {
  displayWeight,
  heightUnitLabel,
  toKg,
  weightUnitLabel,
} from '../lib/units'
import { Button, Card, Field, Input, Select, SectionTitle } from './ui'
import { useToast } from './Toast'
import RemindersPanel from './RemindersPanel.tsx'

export default function Settings() {
  const { state, updateProfile, importBackup, resetAll } = useStore()
  const toast = useToast()
  const profile = state.profile!
  const unit = profile.unit
  const wLabel = weightUnitLabel(unit)
  const hLabel = heightUnitLabel(unit)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  // Local editable string fields for weights/height in display units.
  const [goal, setGoal] = useState(
    displayWeight(profile.goalWeightKg, unit).toFixed(1),
  )
  const [start, setStart] = useState(
    displayWeight(profile.startWeightKg, unit).toFixed(1),
  )

  function flash(kind: 'ok' | 'err', text: string) {
    if (kind === 'ok') toast.success(text)
    else toast.error(text)
  }

  function download(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function onUnitChange(next: UnitSystem) {
    updateProfile({ unit: next })
    setGoal(displayWeight(profile.goalWeightKg, next).toFixed(1))
    setStart(displayWeight(profile.startWeightKg, next).toFixed(1))
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text()
      importBackup(text)
      flash('ok', 'Backup imported successfully.')
    } catch (err) {
      flash('err', `Import failed: ${(err as Error).message}`)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-3">
      <Card>
        <SectionTitle title="Profile" subtitle="Update your details anytime." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input
              value={profile.name ?? ''}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="Your name"
            />
          </Field>
          <Field label="Units">
            <Select
              value={unit}
              onChange={(e) => onUnitChange(e.target.value as UnitSystem)}
            >
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lb, in)</option>
            </Select>
          </Field>
          <Field label="Sex">
            <Select
              value={profile.sex ?? 'male'}
              onChange={(e) => updateProfile({ sex: e.target.value as Sex })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Date of birth">
            <Input
              type="date"
              max={today}
              value={profile.birthDate ?? ''}
              onChange={(e) => updateProfile({ birthDate: e.target.value })}
            />
          </Field>
          <Field label={`Height`}>
            <Input
              inputMode="decimal"
              defaultValue={
                unit === 'metric'
                  ? profile.heightCm.toFixed(0)
                  : (profile.heightCm / 2.54).toFixed(1)
              }
              onBlur={(e) => {
                const v = parseFloat(e.target.value)
                if (!v) return
                updateProfile({
                  heightCm: unit === 'metric' ? v : v * 2.54,
                })
                flash('ok', 'Height updated.')
              }}
              suffix={hLabel}
            />
          </Field>
          <Field label="Activity level">
            <Select
              value={profile.activity ?? 'moderate'}
              onChange={(e) =>
                updateProfile({ activity: e.target.value as ActivityLevel })
              }
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very active</option>
            </Select>
          </Field>
          <Field label="Starting weight">
            <Input
              inputMode="decimal"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              onBlur={() => {
                const v = parseFloat(start)
                if (v > 0) {
                  updateProfile({ startWeightKg: toKg(v, unit) })
                  flash('ok', 'Starting weight updated.')
                }
              }}
              suffix={wLabel}
            />
          </Field>
          <Field label="Goal weight">
            <Input
              inputMode="decimal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onBlur={() => {
                const v = parseFloat(goal)
                if (v > 0) {
                  updateProfile({ goalWeightKg: toKg(v, unit) })
                  flash('ok', 'Goal updated.')
                }
              }}
              suffix={wLabel}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          title="Your data"
          subtitle="Everything is stored locally in this browser."
        />
        <div className="flex flex-wrap gap-3">
          <Button
            variant="subtle"
            onClick={() =>
              download(
                `weight-backup-${today}.json`,
                exportJson(state),
                'application/json',
              )
            }
          >
            Export JSON backup
          </Button>
          <Button
            variant="subtle"
            onClick={() =>
              download(`weight-data-${today}.csv`, exportCsv(state), 'text/csv')
            }
          >
            Export CSV
          </Button>
          <Button variant="subtle" onClick={() => fileRef.current?.click()}>
            Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
        </div>
      </Card>

      <RemindersPanel />

      <Card>
        <SectionTitle title="Danger zone" />
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink-300">
              This deletes your profile and all weigh-ins. Are you sure?
            </span>
            <Button
              variant="danger"
              onClick={() => {
                resetAll()
                setConfirmReset(false)
              }}
            >
              Yes, delete everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Reset all data
          </Button>
        )}
      </Card>
    </div>
  )
}
