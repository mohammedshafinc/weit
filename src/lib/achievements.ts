import type { Stats } from './analytics'
import type { Profile, WeightEntry } from '../types'
import { displayWeight, weightUnitLabel } from './units'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  /** 0-100 progress toward unlocking (for locked ones) */
  progress: number
}

/**
 * Derive achievements from the current entries, stats and profile. Pure
 * function so it can be memoized and unit-tested.
 */
export function computeAchievements(
  entries: WeightEntry[],
  stats: Stats,
  profile: Profile,
): Achievement[] {
  const unit = profile.unit
  const wLabel = weightUnitLabel(unit)
  const goalDir = profile.goalWeightKg <= profile.startWeightKg ? 'lose' : 'gain'

  // How much progress toward the goal, in kg (always positive toward goal).
  const movedKg =
    stats.latestTrendKg != null
      ? goalDir === 'lose'
        ? profile.startWeightKg - stats.latestTrendKg
        : stats.latestTrendKg - profile.startWeightKg
      : 0

  const totalGoalKg = Math.abs(profile.goalWeightKg - profile.startWeightKg)
  const reached = totalGoalKg > 0 && movedKg >= totalGoalKg - 0.05

  const milestone = (kg: number): Achievement => {
    const shown = displayWeight(kg, unit)
    return {
      id: `move-${kg}`,
      title: `${shown.toFixed(0)} ${wLabel} ${goalDir === 'lose' ? 'lost' : 'gained'}`,
      description: `Move ${shown.toFixed(0)} ${wLabel} toward your goal`,
      icon: goalDir === 'lose' ? '📉' : '📈',
      unlocked: movedKg >= kg - 0.001,
      progress: clampPct((movedKg / kg) * 100),
    }
  }

  // Milestone thresholds in kg, scaled a bit by goal size.
  const m1 = Math.max(1, totalGoalKg * 0.25)
  const m2 = Math.max(2, totalGoalKg * 0.5)
  const m3 = Math.max(3, totalGoalKg * 0.75)

  const list: Achievement[] = [
    {
      id: 'first-entry',
      title: 'First step',
      description: 'Log your first weigh-in',
      icon: '🌱',
      unlocked: entries.length >= 1,
      progress: entries.length >= 1 ? 100 : 0,
    },
    {
      id: 'streak-7',
      title: 'One week strong',
      description: 'Reach a 7-day logging streak',
      icon: '🔥',
      unlocked: stats.longestStreak >= 7,
      progress: clampPct((stats.longestStreak / 7) * 100),
    },
    {
      id: 'streak-30',
      title: 'Habit formed',
      description: 'Reach a 30-day logging streak',
      icon: '⚡',
      unlocked: stats.longestStreak >= 30,
      progress: clampPct((stats.longestStreak / 30) * 100),
    },
    {
      id: 'entries-10',
      title: 'Getting consistent',
      description: 'Record 10 weigh-ins',
      icon: '📊',
      unlocked: entries.length >= 10,
      progress: clampPct((entries.length / 10) * 100),
    },
    {
      id: 'entries-50',
      title: 'Dedicated tracker',
      description: 'Record 50 weigh-ins',
      icon: '🏅',
      unlocked: entries.length >= 50,
      progress: clampPct((entries.length / 50) * 100),
    },
    milestone(m1),
    milestone(m2),
    milestone(m3),
    {
      id: 'goal-reached',
      title: 'Goal crusher',
      description: 'Reach your goal weight',
      icon: '🏆',
      unlocked: reached,
      progress: totalGoalKg > 0 ? clampPct((movedKg / totalGoalKg) * 100) : 0,
    },
  ]

  // De-duplicate milestone ids that can collide for tiny goals.
  const seen = new Set<string>()
  return list.filter((a) => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  })
}

function clampPct(n: number): number {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}
