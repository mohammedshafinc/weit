import { useEffect, useState } from 'react'
import type { UnitSystem, WeightEntry } from '../types'
import { useStore } from '../store'
import { Button, Field, Input } from './ui'
import { displayWeight, toKg, weightUnitLabel } from '../lib/units'
import { useToast } from './Toast'

interface Props {
  unit: UnitSystem
  /** When provided, the form edits this entry instead of creating a new one. */
  editing?: WeightEntry | null
  onDone?: () => void
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function AddEntry({ unit, editing, onDone }: Props) {
  const { upsertEntry, state } = useStore()
  const toast = useToast()
  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [note, setNote] = useState('')

  const wLabel = weightUnitLabel(unit)

  useEffect(() => {
    if (editing) {
      setDate(editing.date)
      setWeight(displayWeight(editing.weightKg, unit).toFixed(1))
      setBodyFat(editing.bodyFat != null ? String(editing.bodyFat) : '')
      setNote(editing.note ?? '')
    }
  }, [editing, unit])

  // Pre-fill weight with the most recent value as a convenience.
  useEffect(() => {
    if (editing || weight) return
    const sorted = [...state.entries].sort((a, b) =>
      b.date.localeCompare(a.date),
    )
    if (sorted.length > 0) {
      setWeight(displayWeight(sorted[0].weightKg, unit).toFixed(1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!w || w <= 0) return
    const bf = bodyFat ? parseFloat(bodyFat) : undefined
    upsertEntry({
      id: editing?.id,
      date,
      weightKg: toKg(w, unit),
      bodyFat: bf && bf > 0 && bf < 100 ? bf : undefined,
      note: note.trim() || undefined,
    })
    if (editing) {
      onDone?.()
      toast.success('Weigh-in updated.')
      return
    }
    toast.success(`Saved ${w.toFixed(1)} ${wLabel} for ${date}.`)
    setBodyFat('')
    setNote('')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <Input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label={`Weight`}>
          <Input
            autoFocus
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '72.4' : '160'}
            suffix={wLabel}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Body fat (optional)">
          <Input
            inputMode="decimal"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="22"
            suffix="%"
          />
        </Field>
        <Field label="Note (optional)">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. post-workout"
          />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit">{editing ? 'Save changes' : 'Add weigh-in'}</Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={() => onDone?.()}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
