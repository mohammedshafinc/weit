import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { computeStats, computeTrend } from '../lib/analytics'
import { Card, SectionTitle, cx } from './ui'
import WeightChart from './WeightChart'
import StatCards from './StatCards'
import Insights from './Insights'
import AddEntry from './AddEntry'
import History from './History'
import Achievements from './Achievements'
import type { WeightEntry } from '../types'

const RANGES: Array<{ label: string; days: number | 'all' }> = [
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 182 },
  { label: '1Y', days: 365 },
  { label: 'All', days: 'all' },
]

export default function Dashboard() {
  const { state } = useStore()
  const profile = state.profile!
  const unit = profile.unit
  const [range, setRange] = useState<number | 'all'>(90)
  const [editing, setEditing] = useState<WeightEntry | null>(null)

  const trend = useMemo(() => computeTrend(state.entries), [state.entries])
  const stats = useMemo(
    () => computeStats(state.entries, profile, trend),
    [state.entries, profile, trend],
  )

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    const part = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
    return profile.name ? `${part}, ${profile.name}` : part
  }, [profile.name])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-50">
          {greeting} 👋
        </h1>
        <p className="text-sm text-ink-400">
          Here's how your weight is trending.
        </p>
      </div>

      <StatCards stats={stats} profile={profile} unit={unit} />

      <Card>
        <SectionTitle
          title="Weight trend"
          subtitle="Dots are daily weigh-ins; the line is your smoothed trend."
          action={
            <div className="flex gap-1 rounded-lg bg-white/5 p-1">
              {RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRange(r.days)}
                  className={cx(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    range === r.days
                      ? 'bg-brand-500 text-ink-950'
                      : 'text-ink-400 hover:text-ink-100',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          }
        />
        <WeightChart
          trend={trend}
          profile={profile}
          unit={unit}
          rangeDays={range}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card>
          <SectionTitle
            title={editing ? 'Edit weigh-in' : 'Log a weigh-in'}
            subtitle={editing ? undefined : "Add today's weight or backfill a past day."}
          />
          <AddEntry
            unit={unit}
            editing={editing}
            onDone={() => setEditing(null)}
          />
        </Card>
        <Card>
          <History unit={unit} onEdit={setEditing} />
        </Card>
      </div>

      <Insights stats={stats} profile={profile} unit={unit} />

      <Achievements />
    </div>
  )
}
