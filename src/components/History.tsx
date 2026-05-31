import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { UnitSystem, WeightEntry } from '../types'
import { useStore } from '../store'
import { displayWeight, weightUnitLabel } from '../lib/units'
import { Button, Pill, SectionTitle } from './ui'

interface Props {
  unit: UnitSystem
  onEdit: (entry: WeightEntry) => void
}

export default function History({ unit, onEdit }: Props) {
  const { state, deleteEntry } = useStore()
  const wLabel = weightUnitLabel(unit)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const sorted = [...state.entries].sort((a, b) =>
      b.date.localeCompare(a.date),
    )
    return sorted.map((e, i) => {
      const prev = sorted[i + 1]
      const delta = prev ? e.weightKg - prev.weightKg : 0
      return { entry: e, delta, hasPrev: Boolean(prev) }
    })
  }, [state.entries])

  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-ink-500">
        No weigh-ins yet. Add your first one above.
      </div>
    )
  }

  return (
    <div>
      <SectionTitle
        title="History"
        subtitle={`${rows.length} weigh-in${rows.length === 1 ? '' : 's'}`}
      />
      <div className="overflow-hidden rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-ink-500">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Weight</th>
              <th className="px-4 py-2.5 font-medium">Change</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                Body fat
              </th>
              <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                Note
              </th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entry, delta, hasPrev }) => {
              const w = displayWeight(entry.weightKg, unit)
              const d = displayWeight(Math.abs(delta), unit)
              return (
                <tr
                  key={entry.id}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-2.5 text-ink-300">
                    {format(parseISO(entry.date), 'EEE, MMM d')}
                    <span className="ml-1 text-ink-600">
                      {format(parseISO(entry.date), 'yyyy')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-ink-50">
                    {w.toFixed(1)} {wLabel}
                  </td>
                  <td className="px-4 py-2.5">
                    {hasPrev && Math.abs(delta) > 0.001 ? (
                      <Pill tone={delta < 0 ? 'good' : 'warn'}>
                        {delta < 0 ? '−' : '+'}
                        {d.toFixed(1)}
                      </Pill>
                    ) : (
                      <span className="text-ink-600">—</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-2.5 text-ink-400 sm:table-cell">
                    {entry.bodyFat != null ? `${entry.bodyFat}%` : '—'}
                  </td>
                  <td className="hidden max-w-[200px] truncate px-4 py-2.5 text-ink-400 md:table-cell">
                    {entry.note || '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    {confirmId === entry.id ? (
                      <span className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            deleteEntry(entry.id)
                            setConfirmId(null)
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmId(null)}
                        >
                          No
                        </Button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmId(entry.id)}
                        >
                          Delete
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
