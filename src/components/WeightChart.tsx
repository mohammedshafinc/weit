import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { TrendPoint } from '../lib/analytics'
import type { Profile, UnitSystem } from '../types'
import { displayWeight, weightUnitLabel } from '../lib/units'

interface Props {
  trend: TrendPoint[]
  profile: Profile
  unit: UnitSystem
  rangeDays: number | 'all'
}

export default function WeightChart({ trend, profile, unit, rangeDays }: Props) {
  const data = useMemo(() => {
    const points = trend.map((p) => ({
      date: p.date,
      raw: displayWeight(p.weightKg, unit),
      trend: displayWeight(p.trendKg, unit),
    }))
    if (rangeDays === 'all') return points
    return points.slice(Math.max(0, points.length - rangeDays))
  }, [trend, unit, rangeDays])

  const goal = displayWeight(profile.goalWeightKg, unit)
  const wLabel = weightUnitLabel(unit)

  const yDomain = useMemo<[number, number]>(() => {
    const vals = data.flatMap((d) => [d.raw, d.trend])
    vals.push(goal)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = Math.max(1, (max - min) * 0.12)
    return [Math.floor(min - pad), Math.ceil(max + pad)]
  }, [data, goal])

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-500">
        No data yet — log your first weigh-in to see the chart.
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => format(parseISO(d), 'MMM d')}
            tick={{ fill: '#64748b', fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            minTickGap={28}
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: '#64748b', fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            width={48}
            tickFormatter={(v: number) => v.toFixed(0)}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null
              const raw = payload.find((p) => p.dataKey === 'raw')?.value
              const tr = payload.find((p) => p.dataKey === 'trend')?.value
              return (
                <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-xl">
                  <div className="mb-1 font-medium text-ink-200">
                    {format(parseISO(String(label)), 'EEE, MMM d yyyy')}
                  </div>
                  {typeof raw === 'number' && (
                    <div className="text-ink-400">
                      Weighed:{' '}
                      <span className="text-ink-100">
                        {raw.toFixed(1)} {wLabel}
                      </span>
                    </div>
                  )}
                  {typeof tr === 'number' && (
                    <div className="text-brand-300">
                      Trend: {tr.toFixed(1)} {wLabel}
                    </div>
                  )}
                </div>
              )
            }}
          />
          <ReferenceLine
            y={goal}
            stroke="#f59e0b"
            strokeDasharray="5 4"
            label={{
              value: `Goal ${goal.toFixed(1)}`,
              position: 'insideTopRight',
              fill: '#f59e0b',
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="trend"
            stroke="none"
            fill="url(#trendFill)"
            isAnimationActive={false}
          />
          <Scatter dataKey="raw" fill="#475569" line={false} shape="circle" />
          <Line
            type="monotone"
            dataKey="trend"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
