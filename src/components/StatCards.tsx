import { format, parseISO } from 'date-fns'
import type { Stats } from '../lib/analytics'
import type { Profile, UnitSystem } from '../types'
import { displayWeight, weightUnitLabel } from '../lib/units'
import { Card, Pill } from './ui'

interface Props {
  stats: Stats
  profile: Profile
  unit: UnitSystem
}

export default function StatCards({ stats, profile, unit }: Props) {
  const wLabel = weightUnitLabel(unit)
  const goalDir =
    profile.goalWeightKg < profile.startWeightKg ? 'lose' : 'gain'

  const trendVal =
    stats.latestTrendKg != null
      ? displayWeight(stats.latestTrendKg, unit).toFixed(1)
      : '—'
  const latestVal =
    stats.latestKg != null
      ? displayWeight(stats.latestKg, unit).toFixed(1)
      : '—'

  const weekly = displayWeight(Math.abs(stats.weeklyRateKg), unit)
  const weeklyDir =
    stats.weeklyRateKg < -0.01
      ? 'losing'
      : stats.weeklyRateKg > 0.01
        ? 'gaining'
        : 'holding'

  const total = displayWeight(Math.abs(stats.totalChangeKg), unit)
  const totalDir = stats.totalChangeKg < 0 ? 'down' : stats.totalChangeKg > 0 ? 'up' : 'flat'

  const remainingKg =
    stats.latestTrendKg != null
      ? profile.goalWeightKg - stats.latestTrendKg
      : 0
  const remaining = displayWeight(Math.abs(remainingKg), unit)
  const reached =
    (goalDir === 'lose' && remainingKg >= -0.05) ||
    (goalDir === 'gain' && remainingKg <= 0.05)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card className="p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
          Trend weight
        </div>
        <div className="mt-1 text-2xl font-bold text-ink-50">
          {trendVal}
          <span className="ml-1 text-sm font-normal text-ink-500">{wLabel}</span>
        </div>
        <div className="mt-1 text-xs text-ink-500">
          last weigh-in {latestVal} {wLabel}
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
          Weekly rate
        </div>
        <div className="mt-1 text-2xl font-bold text-ink-50">
          {weeklyDir === 'holding' ? '0.0' : weekly.toFixed(2)}
          <span className="ml-1 text-sm font-normal text-ink-500">
            {wLabel}/wk
          </span>
        </div>
        <div className="mt-1">
          <Pill
            tone={
              weeklyDir === 'holding'
                ? 'neutral'
                : (weeklyDir === 'losing') === (goalDir === 'lose')
                  ? 'good'
                  : 'warn'
            }
          >
            {weeklyDir}
          </Pill>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
          Total change
        </div>
        <div className="mt-1 text-2xl font-bold text-ink-50">
          {totalDir === 'flat' ? '0.0' : `${totalDir === 'down' ? '−' : '+'}${total.toFixed(1)}`}
          <span className="ml-1 text-sm font-normal text-ink-500">{wLabel}</span>
        </div>
        <div className="mt-1 text-xs text-ink-500">since you started</div>
      </Card>

      <Card className="p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
          {reached ? 'Goal' : 'To goal'}
        </div>
        {reached ? (
          <>
            <div className="mt-1 text-2xl font-bold text-brand-300">Reached 🎉</div>
            <div className="mt-1 text-xs text-ink-500">
              target {displayWeight(profile.goalWeightKg, unit).toFixed(1)}{' '}
              {wLabel}
            </div>
          </>
        ) : (
          <>
            <div className="mt-1 text-2xl font-bold text-ink-50">
              {remaining.toFixed(1)}
              <span className="ml-1 text-sm font-normal text-ink-500">
                {wLabel}
              </span>
            </div>
            <div className="mt-1 text-xs text-ink-500">
              {stats.goalDate
                ? `~${format(parseISO(stats.goalDate), 'MMM d, yyyy')}`
                : 'keep logging to project'}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
