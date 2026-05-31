import type { Stats } from '../lib/analytics'
import {
  estimateBmr,
  estimateTdee,
  healthyWeightRange,
} from '../lib/analytics'
import type { Profile, UnitSystem } from '../types'
import { displayWeight, weightUnitLabel } from '../lib/units'
import { Card, Pill, SectionTitle } from './ui'

interface Props {
  stats: Stats
  profile: Profile
  unit: UnitSystem
}

export default function Insights({ stats, profile, unit }: Props) {
  const wLabel = weightUnitLabel(unit)
  const [healthyLo, healthyHi] = healthyWeightRange(profile.heightCm)

  const bmr = estimateBmr(profile, stats.latestTrendKg)
  const tdee = estimateTdee(profile, stats.latestTrendKg)

  // Goal progress clamped for the bar, but show real % in text.
  const pct = stats.goalProgressPct ?? 0
  const barPct = Math.max(0, Math.min(100, pct))

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card>
        <SectionTitle title="Goal progress" />
        <div className="mb-2 flex items-end justify-between">
          <span className="text-3xl font-bold text-ink-50">
            {Math.round(barPct)}%
          </span>
          <span className="text-sm text-ink-400">
            start {displayWeight(profile.startWeightKg, unit).toFixed(1)} →
            goal {displayWeight(profile.goalWeightKg, unit).toFixed(1)} {wLabel}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all"
            style={{ width: `${barPct}%` }}
          />
        </div>
        <div className="mt-3 text-sm text-ink-400">
          {stats.daysToGoal != null ? (
            <>
              At your current pace you'll reach your goal in about{' '}
              <span className="font-semibold text-brand-300">
                {formatDays(stats.daysToGoal)}
              </span>
              .
            </>
          ) : (
            <>Keep logging consistently to project your goal date.</>
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Body Mass Index" />
        {stats.bmiValue != null && stats.bmiCat ? (
          <>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-3xl font-bold text-ink-50">
                {stats.bmiValue.toFixed(1)}
              </span>
              <Pill tone={bmiTone(stats.bmiCat)}>{stats.bmiCat}</Pill>
            </div>
            <BmiBar value={stats.bmiValue} />
            <div className="mt-3 text-sm text-ink-400">
              Healthy weight for your height:{' '}
              <span className="font-semibold text-ink-200">
                {displayWeight(healthyLo, unit).toFixed(0)}–
                {displayWeight(healthyHi, unit).toFixed(0)} {wLabel}
              </span>
            </div>
          </>
        ) : (
          <div className="text-sm text-ink-500">
            Add a weigh-in to see your BMI.
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle
          title="Energy estimate"
          subtitle="Mifflin-St Jeor equation"
        />
        {tdee != null && bmr != null ? (
          <div className="grid grid-cols-2 gap-3">
            <Stat label="BMR (at rest)" value={`${Math.round(bmr)}`} unit="kcal/day" />
            <Stat
              label="Maintenance (TDEE)"
              value={`${Math.round(tdee)}`}
              unit="kcal/day"
            />
            <Stat
              label="Mild loss (−0.25 kg/wk)"
              value={`${Math.round(tdee - 275)}`}
              unit="kcal/day"
            />
            <Stat
              label="Steady loss (−0.5 kg/wk)"
              value={`${Math.round(tdee - 550)}`}
              unit="kcal/day"
            />
          </div>
        ) : (
          <div className="text-sm text-ink-500">
            Add your sex and date of birth in Settings to estimate your daily
            energy needs.
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle title="Consistency" />
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="Current streak"
            value={`${stats.currentStreak}`}
            unit={`day${stats.currentStreak === 1 ? '' : 's'}`}
          />
          <Stat
            label="Longest streak"
            value={`${stats.longestStreak}`}
            unit={`day${stats.longestStreak === 1 ? '' : 's'}`}
          />
          <Stat label="Total weigh-ins" value={`${stats.entryCount}`} unit="" />
          <Stat
            label="Range"
            value={
              stats.minKg != null && stats.maxKg != null
                ? `${displayWeight(stats.minKg, unit).toFixed(1)}–${displayWeight(stats.maxKg, unit).toFixed(1)}`
                : '—'
            }
            unit={wLabel}
          />
        </div>
      </Card>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="rounded-xl bg-ink-950/50 p-3">
      <div className="text-xs text-ink-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-ink-50">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-ink-500">{unit}</span>}
      </div>
    </div>
  )
}

function BmiBar({ value }: { value: number }) {
  // Map BMI 15..40 onto 0..100%.
  const pos = Math.max(0, Math.min(100, ((value - 15) / (40 - 15)) * 100))
  return (
    <div className="relative">
      <div className="flex h-2.5 overflow-hidden rounded-full">
        <div className="bg-sky-400" style={{ width: '14%' }} />
        <div className="bg-emerald-400" style={{ width: '26%' }} />
        <div className="bg-amber-400" style={{ width: '20%' }} />
        <div className="bg-red-400" style={{ width: '40%' }} />
      </div>
      <div
        className="absolute -top-1 h-4.5 w-1 -translate-x-1/2 rounded-full bg-white shadow"
        style={{ left: `${pos}%`, height: '1.1rem' }}
      />
    </div>
  )
}

function bmiTone(cat: string): 'good' | 'warn' | 'bad' | 'neutral' {
  if (cat === 'Healthy') return 'good'
  if (cat === 'Overweight') return 'warn'
  if (cat === 'Obese') return 'bad'
  return 'neutral'
}

function formatDays(days: number): string {
  if (days < 14) return `${days} days`
  if (days < 60) return `${Math.round(days / 7)} weeks`
  return `${Math.round(days / 30.4)} months`
}
