import { useMemo } from 'react'
import { useStore } from '../store'
import { computeStats, computeTrend } from '../lib/analytics'
import { computeAchievements } from '../lib/achievements'
import { Card, Pill, SectionTitle, cx } from './ui'

export default function Achievements() {
  const { state } = useStore()
  const profile = state.profile!

  const achievements = useMemo(() => {
    const trend = computeTrend(state.entries)
    const stats = computeStats(state.entries, profile, trend)
    return computeAchievements(state.entries, stats, profile)
  }, [state.entries, profile])

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card>
      <SectionTitle
        title="Achievements"
        subtitle="Milestones to keep you motivated"
        action={
          <Pill tone="brand">
            {unlockedCount}/{achievements.length} unlocked
          </Pill>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={cx(
              'relative overflow-hidden rounded-xl border p-3 transition-colors',
              a.unlocked
                ? 'border-brand-400/40 bg-brand-500/10'
                : 'border-white/5 bg-ink-950/50',
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cx(
                  'text-2xl leading-none transition-all',
                  !a.unlocked && 'opacity-30 grayscale',
                )}
              >
                {a.icon}
              </span>
              <div className="min-w-0">
                <div
                  className={cx(
                    'truncate text-sm font-semibold',
                    a.unlocked ? 'text-ink-50' : 'text-ink-400',
                  )}
                >
                  {a.title}
                </div>
                <div className="mt-0.5 text-xs text-ink-500">
                  {a.description}
                </div>
              </div>
            </div>
            {!a.unlocked && a.progress > 0 && (
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand-400/70"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            )}
            {a.unlocked && (
              <span className="absolute right-2 top-2 text-brand-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
