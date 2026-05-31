import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Profile, WeightEntry } from '../types'

export interface TrendPoint {
  date: string
  /** raw recorded weight in kg, if any on this date */
  weightKg: number
  /** exponentially-smoothed trend weight in kg */
  trendKg: number
  bodyFat?: number
}

/**
 * Compute an exponentially weighted moving average (EWMA) trend line, the
 * approach popularized by the Hacker's Diet. It smooths out daily noise
 * (water weight, food in gut) to reveal the real underlying trend.
 *
 * Entries must be sorted ascending by date.
 */
export function computeTrend(entries: WeightEntry[], alpha = 0.1): TrendPoint[] {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const out: TrendPoint[] = []
  let trend: number | null = null
  for (const e of sorted) {
    if (trend === null) {
      trend = e.weightKg
    } else {
      trend = trend + alpha * (e.weightKg - trend)
    }
    out.push({
      date: e.date,
      weightKg: e.weightKg,
      trendKg: trend,
      bodyFat: e.bodyFat,
    })
  }
  return out
}

/** BMI from weight (kg) and height (cm). */
export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  if (m <= 0) return 0
  return weightKg / (m * m)
}

export type BmiCategory =
  | 'Underweight'
  | 'Healthy'
  | 'Overweight'
  | 'Obese'

export function bmiCategory(value: number): BmiCategory {
  if (value < 18.5) return 'Underweight'
  if (value < 25) return 'Healthy'
  if (value < 30) return 'Overweight'
  return 'Obese'
}

/** The weight range (kg) for a healthy BMI at a given height. */
export function healthyWeightRange(heightCm: number): [number, number] {
  const m = heightCm / 100
  return [18.5 * m * m, 24.9 * m * m]
}

/**
 * Linear regression slope (kg per day) over the provided trend points,
 * using the day offset from the first point as x.
 */
export function ratePerDay(points: TrendPoint[]): number {
  if (points.length < 2) return 0
  const x0 = parseISO(points[0].date)
  const xs = points.map((p) => differenceInCalendarDays(parseISO(p.date), x0))
  const ys = points.map((p) => p.trendKg)
  const n = xs.length
  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = ys.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((a, b, i) => a + b * ys[i], 0)
  const sumXX = xs.reduce((a, b) => a + b * b, 0)
  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

/** Filter trend points to those within the last `days` of the most recent. */
export function lastNDays(points: TrendPoint[], days: number): TrendPoint[] {
  if (points.length === 0) return []
  const last = parseISO(points[points.length - 1].date)
  return points.filter(
    (p) => differenceInCalendarDays(last, parseISO(p.date)) < days,
  )
}

export interface Stats {
  latestKg: number | null
  latestTrendKg: number | null
  /** change in trend vs first entry */
  totalChangeKg: number
  /** kg/week based on a recent regression window */
  weeklyRateKg: number
  /** estimated days until goal reached at current rate, or null */
  daysToGoal: number | null
  /** projected date (ISO) of reaching goal, or null */
  goalDate: string | null
  bmiValue: number | null
  bmiCat: BmiCategory | null
  /** percent of the way from start weight to goal weight (0-100, can exceed) */
  goalProgressPct: number | null
  entryCount: number
  /** consecutive-day logging streak ending today/most-recent */
  currentStreak: number
  longestStreak: number
  minKg: number | null
  maxKg: number | null
}

export function computeStats(
  entries: WeightEntry[],
  profile: Profile | null,
  trend: TrendPoint[],
): Stats {
  const empty: Stats = {
    latestKg: null,
    latestTrendKg: null,
    totalChangeKg: 0,
    weeklyRateKg: 0,
    daysToGoal: null,
    goalDate: null,
    bmiValue: null,
    bmiCat: null,
    goalProgressPct: null,
    entryCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    minKg: null,
    maxKg: null,
  }
  if (entries.length === 0 || trend.length === 0) return empty

  const latest = trend[trend.length - 1]
  const first = trend[0]
  const latestKg = latest.weightKg
  const latestTrendKg = latest.trendKg
  const totalChangeKg = latest.trendKg - first.trendKg

  // Use up to the last 28 days for the rate estimate so it reflects current behaviour.
  const recent = lastNDays(trend, 28)
  const window = recent.length >= 2 ? recent : trend
  const perDay = ratePerDay(window)
  const weeklyRateKg = perDay * 7

  // Goal projection.
  let daysToGoal: number | null = null
  let goalDate: string | null = null
  if (profile && Math.abs(perDay) > 1e-6) {
    const remaining = profile.goalWeightKg - latestTrendKg
    // Only project if we're moving toward the goal.
    if (Math.sign(remaining) === Math.sign(perDay)) {
      const d = Math.ceil(remaining / perDay)
      if (d > 0 && d < 100000) {
        daysToGoal = d
        const projected = new Date(parseISO(latest.date))
        projected.setDate(projected.getDate() + d)
        goalDate = projected.toISOString().slice(0, 10)
      }
    }
  }

  const bmiValue = profile ? bmi(latestTrendKg, profile.heightCm) : null
  const bmiCat = bmiValue !== null ? bmiCategory(bmiValue) : null

  let goalProgressPct: number | null = null
  if (profile) {
    const span = profile.goalWeightKg - profile.startWeightKg
    if (Math.abs(span) > 1e-6) {
      goalProgressPct = ((latestTrendKg - profile.startWeightKg) / span) * 100
    } else {
      goalProgressPct = 100
    }
  }

  const weights = trend.map((t) => t.weightKg)
  const minKg = Math.min(...weights)
  const maxKg = Math.max(...weights)

  const { currentStreak, longestStreak } = computeStreaks(entries)

  return {
    latestKg,
    latestTrendKg,
    totalChangeKg,
    weeklyRateKg,
    daysToGoal,
    goalDate,
    bmiValue,
    bmiCat,
    goalProgressPct,
    entryCount: entries.length,
    currentStreak,
    longestStreak,
    minKg,
    maxKg,
  }
}

/**
 * Compute logging streaks. A streak counts consecutive calendar days that
 * have at least one entry. currentStreak is anchored to the most recent entry
 * (and only counts as "current" if that entry is today or yesterday).
 */
export function computeStreaks(entries: WeightEntry[]): {
  currentStreak: number
  longestStreak: number
} {
  if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 }
  const days = Array.from(new Set(entries.map((e) => e.date))).sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const gap = differenceInCalendarDays(
      parseISO(days[i]),
      parseISO(days[i - 1]),
    )
    if (gap === 1) {
      run += 1
    } else {
      run = 1
    }
    if (run > longest) longest = run
  }

  // current streak: walk backwards from the last logged day
  const today = new Date()
  const lastDay = parseISO(days[days.length - 1])
  const sinceLast = differenceInCalendarDays(today, lastDay)
  let current = 0
  if (sinceLast <= 1) {
    current = 1
    for (let i = days.length - 1; i > 0; i--) {
      const gap = differenceInCalendarDays(
        parseISO(days[i]),
        parseISO(days[i - 1]),
      )
      if (gap === 1) current += 1
      else break
    }
  }
  return { currentStreak: current, longestStreak: longest }
}

/**
 * Mifflin-St Jeor basal metabolic rate (kcal/day). Returns null if we lack
 * the needed profile inputs.
 */
export function estimateBmr(
  profile: Profile | null,
  weightKg: number | null,
): number | null {
  if (!profile || weightKg === null || !profile.sex || !profile.birthDate) {
    return null
  }
  const age = ageFromBirth(profile.birthDate)
  if (age === null) return null
  const base = 10 * weightKg + 6.25 * profile.heightCm - 5 * age
  if (profile.sex === 'male') return base + 5
  if (profile.sex === 'female') return base - 161
  // 'other' — average of the two offsets
  return base - 78
}

const ACTIVITY_FACTOR: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

/** Total daily energy expenditure estimate (kcal/day). */
export function estimateTdee(
  profile: Profile | null,
  weightKg: number | null,
): number | null {
  const base = estimateBmr(profile, weightKg)
  if (base === null || !profile) return null
  const factor = ACTIVITY_FACTOR[profile.activity ?? 'sedentary'] ?? 1.2
  return base * factor
}

export function ageFromBirth(birthDate: string): number | null {
  const d = parseISO(birthDate)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1
  return age
}
