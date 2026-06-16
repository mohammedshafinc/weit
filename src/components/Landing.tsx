import { useState, type ReactNode } from 'react'
import {
  Activity,
  Award,
  BellRing,
  Calculator,
  ChartLine,
  ChartNoAxesCombined,
  Globe,
  NotebookPen,
  Scale,
  Shield,
  Target,
  TrendingDown,
  User,
  WifiOff,
  Zap,
} from 'lucide-react'
import { cx } from './ui'

const LINKEDIN = 'https://www.linkedin.com/in/mohammedshafin'

interface LandingProps {
  onEnterApp: () => void
}

export default function Landing({ onEnterApp }: LandingProps) {
  return (
    <div className="relative min-h-screen bg-ink-950 text-ink-100 overflow-x-hidden">
      <Noise />
      <Nav onEnterApp={onEnterApp} />
      <Hero onEnterApp={onEnterApp} />
      <LogoStrip />
      <HowItWorks />
      <Features />
      <AISection />
      <Comparison />
      <FAQ />
      <CTA onEnterApp={onEnterApp} />
      <LandingFooter />
    </div>
  )
}

/* ── Subtle grain overlay ──────────────────────────────────────────── */
function Noise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

/* ── Navigation ─────────────────────────────────────────────────────── */
function Nav({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
          <TrendIcon size={18} />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          Supercomp
        </span>
      </div>
      <nav className="hidden items-center gap-7 text-sm text-ink-400 sm:flex">
        <a href="#how" className="transition-colors hover:text-ink-100">How it works</a>
        <a href="#features" className="transition-colors hover:text-ink-100">Features</a>
        <a href="#ai" className="transition-colors hover:text-ink-100">AI Analytics</a>
        <a href="#faq" className="transition-colors hover:text-ink-100">FAQ</a>
      </nav>
      <button
        onClick={onEnterApp}
        className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
      >
        Open AI app →
      </button>
    </header>
  )
}

/* ── Hero ───────────────────────────────────────────────────────────── */
function Hero({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" />

      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3.5 py-1 text-xs font-medium text-brand-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
        AI-Native · Private · Offline · Free forever
      </span>

      <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-[1.07] tracking-tight text-white sm:text-6xl lg:text-7xl">
        AI-powered weight tracking.<br />
        <span className="bg-gradient-to-r from-brand-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
          See the real trend.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg text-ink-400 leading-relaxed">
        Daily weight is noisy. Supercomp's AI-native analytics engine cuts
        through water-weight fluctuations and reveals your true fat-loss or
        gain trajectory — not the random number on the scale this morning.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onEnterApp}
          className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-base font-bold text-ink-950 shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-400 hover:shadow-brand-400/30"
        >
          Start tracking free
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
        <a
          href="#how"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-medium text-ink-300 transition-colors hover:border-white/20 hover:text-white"
        >
          See how it works ↓
        </a>
      </div>

      <p className="mt-4 text-xs text-ink-600">
        No account. No cloud. Your data stays on your device.
      </p>

      {/* Floating mock dashboard */}
      <MockDashboard />
    </section>
  )
}

/* ── Mock dashboard preview ─────────────────────────────────────────── */
function MockDashboard() {
  const bars = [72, 56, 80, 48, 88, 60, 72, 52, 84, 66, 78, 56, 70, 62, 76, 52, 68, 58, 74, 64]
  const trendY = [68, 67, 66.5, 66, 65.5, 65, 64.5, 64, 63.5, 63, 62.5, 62, 61.5, 61, 60.5, 60, 59.5, 59, 58.5, 58]

  const W = 400; const H = 100
  const minY = 48; const maxY = 92; const range = maxY - minY
  const pts = trendY.map((y, i) => {
    const px = (i / (trendY.length - 1)) * W
    const py = H - ((y - minY) / range) * H
    return `${px},${py}`
  }).join(' ')

  return (
    <div className="relative mx-auto mt-14 max-w-2xl animate-fade-in">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-500/10 to-transparent blur-2xl" />
      <div className="relative rounded-2xl border border-white/8 bg-ink-900/80 p-5 shadow-2xl shadow-black/50 backdrop-blur">
        {/* mini stat row */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {[['Trend','78.0 kg'],['Weekly','−0.5 kg'],['To goal','3.0 kg'],['Streak','12 days']].map(([l,v]) => (
            <div key={l} className="rounded-xl bg-white/5 p-2.5">
              <div className="text-[10px] text-ink-500 uppercase tracking-wide">{l}</div>
              <div className="mt-0.5 text-sm font-bold text-ink-50">{v}</div>
            </div>
          ))}
        </div>
        {/* mini chart */}
        <div className="rounded-xl bg-ink-950/60 p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{height:'90px'}}>
            <defs>
              <linearGradient id="lp-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* area fill under trend */}
            <polyline points={`0,${H} ${pts} ${W},${H}`} fill="url(#lp-fill)" />
            {/* raw dots */}
            {bars.map((b, i) => {
              const px = (i / (bars.length - 1)) * W
              const py = H - ((b - minY) / range) * H
              return <circle key={i} cx={px} cy={py} r="3" fill="#475569" opacity="0.8" />
            })}
            {/* trend line */}
            <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* goal line */}
            <line x1="0" y1={H - ((75 - minY) / range) * H} x2={W} y2={H - ((75 - minY) / range) * H}
              stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7" />
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-ink-600">
            <span>30 days ago</span><span className="text-amber-400/70">Goal: 75 kg</span><span>Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Scrolling logo strip ───────────────────────────────────────────── */
function LogoStrip() {
  const badges = [
    'AI-Native Analytics', 'AI-Powered Trend', 'AI Goal Projection', 'Offline PWA',
    'AI Calorie Engine', 'Streak Tracking', 'Body Fat %', 'CSV Export',
    'Daily Reminders', 'Achievements', 'No Account Needed', 'AI-Driven Insights',
  ]
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/5 bg-ink-950/70 py-3 backdrop-blur">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...badges, ...badges].map((b, i) => (
          <span key={i} className="mx-5 inline-flex items-center gap-2 text-sm font-medium text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {b}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── How it works ───────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Set up your profile',
      body: 'Enter your height, current weight, and goal. The AI engine personalises calorie targets and projections from day one. Takes under 60 seconds.',
      icon: <User className="w-8 h-8 text-brand-400" strokeWidth={1.5} />,
    },
    {
      n: '02',
      title: 'Log your weight each day',
      body: 'Step on the scale, open the app, type the number. Add optional body-fat %, notes, or backfill any missed day — the AI adapts to gaps.',
      icon: <Scale className="w-8 h-8 text-brand-400" strokeWidth={1.5} />,
    },
    {
      n: '03',
      title: 'AI finds your true trend',
      body: 'The AI-powered EWMA engine eliminates daily noise — water weight, food, time of day — to surface the real underlying direction of your body weight.',
      icon: <TrendingDown className="w-8 h-8 text-brand-400" strokeWidth={1.5} />,
    },
    {
      n: '04',
      title: 'AI analytics guide decisions',
      body: 'AI-driven weekly rate, projected goal date, BMI score, personalised calorie targets, and streak data — all recalculated in real time as you log.',
      icon: <Target className="w-8 h-8 text-brand-400" strokeWidth={1.5} />,
    },
  ]
  return (
    <section id="how" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel>Process</SectionLabel>
      <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
        Four steps.<br />AI clarity, instantly.
      </h2>
      <p className="mt-4 max-w-lg text-ink-400">
        No complicated setup. A clean AI-powered loop that takes seconds a day
        and gives you a full analytical picture of your progress.
      </p>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n}
            className="group relative overflow-hidden rounded-2xl border border-white/7 bg-ink-900/50 p-6 transition-all hover:border-brand-400/30 hover:bg-ink-900/80">
            <div className="absolute right-4 top-4 text-5xl font-black text-white/3 select-none">{s.n}</div>
            <div className="mb-4">{s.icon}</div>
            <h3 className="text-base font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-ink-400 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Features grid ──────────────────────────────────────────────────── */
const FEATURES: Array<{icon: ReactNode; title: string; body: string; tag: string}> = [
  {
    icon: <ChartLine className="w-6 h-6 text-purple-300" strokeWidth={1.5} />,
    title: 'AI-Powered Trend Line',
    body: 'An AI-native exponentially weighted moving average cuts through water-weight and food noise to surface your real weight direction.',
    tag: 'AI-Core',
  },
  {
    icon: <Target className="w-6 h-6 text-violet-300" strokeWidth={1.5} />,
    title: 'AI Goal Projection',
    body: 'AI-driven linear regression over your last 28 entries projects exactly when you\'ll hit your target at the current pace — recalculated every log.',
    tag: 'AI',
  },
  {
    icon: <Calculator className="w-6 h-6 text-amber-300" strokeWidth={1.5} />,
    title: 'BMI & Healthy Range',
    body: 'AI calculates your live BMI from your smoothed trend weight, shows your category on a colour scale, and your personalised healthy range.',
    tag: 'Analytics',
  },
  {
    icon: <Activity className="w-6 h-6 text-violet-300" strokeWidth={1.5} />,
    title: 'AI Calorie Engine',
    body: 'AI-powered Mifflin-St Jeor TDEE model uses your age, sex, live weight, height, and activity level for personalised daily calorie targets.',
    tag: 'AI',
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-300" strokeWidth={1.5} />,
    title: 'Consistency Streaks',
    body: 'Current and longest logging streaks, total weigh-ins, and min/max range — AI-driven insights only improve with daily consistency.',
    tag: 'Motivation',
  },
  {
    icon: <Award className="w-6 h-6 text-brand-300" strokeWidth={1.5} />,
    title: 'Smart Achievements',
    body: 'AI-aware milestones for streaks, weight lost/gained, and goal completion. Progress bars on locked ones so you always know what\'s next.',
    tag: 'Motivation',
  },
  {
    icon: <WifiOff className="w-6 h-6 text-emerald-300" strokeWidth={1.5} />,
    title: 'Offline-first PWA',
    body: 'AI analytics run entirely in your browser — no cloud, no internet needed. Install to your home screen like a native app via service worker.',
    tag: 'Privacy',
  },
  {
    icon: <BellRing className="w-6 h-6 text-rose-300" strokeWidth={1.5} />,
    title: 'AI-Timed Reminders',
    body: 'Smart daily notifications fire only if you haven\'t logged that day — so the AI always has fresh data to work with.',
    tag: 'UX',
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-300" strokeWidth={1.5} />,
    title: 'Fully Private AI',
    body: 'All AI computations run locally in your browser. No account, no server, no telemetry. Your raw data never leaves your device.',
    tag: 'Privacy',
  },
  {
    icon: <ChartNoAxesCombined className="w-6 h-6 text-purple-300" strokeWidth={1.5} />,
    title: 'AI Interactive Chart',
    body: 'AI-rendered trend overlaid on raw data with 1M/3M/6M/1Y/All ranges, a goal reference line, and AI-computed tooltips on every point.',
    tag: 'AI-Core',
  },
  {
    icon: <NotebookPen className="w-6 h-6 text-purple-300" strokeWidth={1.5} />,
    title: 'Body-fat & Notes',
    body: 'Log an optional body-fat percentage and free-text note. The AI factors body-fat trends separately from total weight movement.',
    tag: 'AI-Core',
  },
  {
    icon: <Globe className="w-6 h-6 text-rose-300" strokeWidth={1.5} />,
    title: 'Metric & Imperial',
    body: 'Switch units any time — all AI models store data canonically in kg so conversions are lossless and projections stay accurate.',
    tag: 'UX',
  },
]

const TAG_COLORS: Record<string, string> = {
  'AI-Core': 'bg-purple-500/12 text-purple-300',
  AI: 'bg-violet-500/12 text-violet-300',
  Analytics: 'bg-amber-500/12 text-amber-300',
  Motivation: 'bg-brand-500/12 text-brand-300',
  Privacy: 'bg-emerald-500/12 text-emerald-300',
  UX: 'bg-rose-500/12 text-rose-300',
}

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <div className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-purple-500/6 blur-3xl" />
      <SectionLabel>AI Features</SectionLabel>
      <h2 className="mt-3 max-w-lg text-4xl font-black tracking-tight text-white sm:text-5xl">
        AI-native from the ground up.<br />
        <span className="text-ink-400">Nothing bolted on.</span>
      </h2>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title}
            className="group rounded-2xl border border-white/6 bg-ink-900/40 p-5 transition-all hover:border-white/12 hover:bg-ink-900/70">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                {f.icon}
              </div>
              <span className={cx('rounded-full px-2 py-0.5 text-[11px] font-medium', TAG_COLORS[f.tag] ?? 'bg-white/5 text-ink-400')}>
                {f.tag}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm text-ink-400 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── AI section ─────────────────────────────────────────────────────── */
function AISection() {
  return (
    <section id="ai" className="relative z-10 border-y border-white/5 bg-ink-900/30 py-24">
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-brand-500/8 blur-3xl" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>AI Analytics Engine</SectionLabel>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              AI-native analytics.<br />
              <span className="bg-gradient-to-r from-brand-300 to-cyan-400 bg-clip-text text-transparent">
                Runs at the edge.
              </span>
            </h2>
            <p className="mt-5 text-ink-400 leading-relaxed">
              Supercomp is AI-powered at its core — four battle-tested
              statistical models run entirely on your device, with zero latency,
              zero cloud, and zero privacy trade-off.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  title: 'AI Trend Smoothing — EWMA',
                  body: 'The AI-native alpha-weighted smoother (α = 0.1) models your scale\'s noise profile. Each day the AI trend nudges toward your actual weight — responding to real fat changes while filtering out water, food, and time-of-day artefacts.',
                  label: 'EWMA',
                },
                {
                  title: 'AI Rate Engine — OLS Regression',
                  body: 'AI-powered ordinary least-squares regression over your last 28 trend points delivers a statistically robust kg/week rate. Short enough to reflect current behaviour, long enough to reject single-day outliers.',
                  label: 'OLS',
                },
                {
                  title: 'AI Calorie Model — Mifflin-St Jeor',
                  body: 'The most validated BMR equation in clinical literature powers Supercomp\'s AI calorie engine. Combined with your activity level it gives a personalised TDEE accurate to ±10% for most adults.',
                  label: 'MSJ',
                },
                {
                  title: 'AI Goal Date Projection',
                  body: 'The AI projection engine extrapolates your OLS rate to your goal weight, gated on directionality — it only projects when you\'re actually moving toward the goal, never misleadingly against it.',
                  label: 'PROJ',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 mt-0.5">
                    <div className="flex h-7 items-center rounded-md bg-brand-500/15 px-2">
                      <span className="text-[11px] font-bold tracking-wider text-brand-300">{item.label}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <p className="mt-0.5 text-sm text-ink-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm visual */}
          <AlgoVisual />
        </div>
      </div>
    </section>
  )
}

function AlgoVisual() {
  const raw   = [80.6, 79.4, 81.2, 78.8, 82.0, 79.2, 80.8, 78.4, 81.6, 79.0, 80.2, 77.8, 79.6, 77.2, 78.8, 76.4, 77.9, 75.8, 77.2, 75.6]
  let trend = raw[0]
  const trends = raw.map((v) => { trend = trend + 0.1 * (v - trend); return +trend.toFixed(2) })

  const W = 360; const H = 120
  const minV = 74; const maxV = 84
  const toX = (i: number) => (i / (raw.length - 1)) * W
  const toY = (v: number) => H - ((v - minV) / (maxV - minV)) * H
  const trendPath = trends.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')
  const areaPath = `M ${toX(0)} ${H} ` + trends.map((v, i) => `L ${toX(i)} ${toY(v)}`).join(' ') + ` L ${toX(trends.length - 1)} ${H} Z`

  return (
    <div className="rounded-2xl border border-white/8 bg-ink-950/70 p-6 shadow-2xl">
      <div className="mb-1 text-xs font-medium text-ink-500 uppercase tracking-wide">AI engine · live output</div>
      <svg viewBox={`0 0 ${W} ${H + 8}`} className="w-full mt-3">
        <defs>
          <linearGradient id="ai-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#ai-fill)" />
        {raw.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill="#334155" stroke="#475569" strokeWidth="1" />
        ))}
        <path d={trendPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-3 flex items-center gap-5 text-xs text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#475569]" />Daily weight (noisy)</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 rounded bg-brand-400" />EWMA trend (smooth)</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[['Weekly rate','−0.62 kg/wk'],['Projected goal','~11 weeks']].map(([l,v]) => (
          <div key={l} className="rounded-xl bg-white/5 px-3 py-2.5">
            <div className="text-[10px] text-ink-500 uppercase tracking-wide">{l}</div>
            <div className="mt-0.5 text-sm font-bold text-brand-300">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Comparison table ───────────────────────────────────────────────── */
function Comparison() {
  const rows = [
    ['AI-powered trend smoothing (EWMA)', true,  false, false],
    ['AI goal date projection',           true,  false, true ],
    ['AI calorie engine (TDEE/BMR)',      true,  true,  false],
    ['Offline / no internet needed',      true,  false, false],
    ['No account required',               true,  false, false],
    ['Fully private (AI runs locally)',   true,  false, false],
    ['Installable AI PWA',               true,  false, false],
    ['AI-timed daily reminders',         true,  true,  true ],
    ['Body-fat tracking',                true,  true,  true ],
    ['Smart achievements / streaks',     true,  false, true ],
    ['CSV & JSON export',                true,  true,  false],
    ['Free forever',                     true,  false, false],
  ]

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <SectionLabel>Comparison</SectionLabel>
      <h2 className="mt-3 max-w-lg text-4xl font-black tracking-tight text-white sm:text-5xl">
        The only AI-native<br />
        <span className="text-ink-400">weight tracker that's free.</span>
      </h2>
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 pr-6 text-left font-medium text-ink-500">Feature</th>
              {['Supercomp','MyFitnessPal','Libra / HappyScale'].map((h) => (
                <th key={h} className={cx('pb-3 px-4 text-center font-semibold', h === 'Supercomp' ? 'text-brand-300' : 'text-ink-400')}>
                  {h === 'Supercomp' ? <span className="inline-flex items-center gap-1.5"><TrendIcon size={14} />{h}</span> : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, a, b, c], i) => (
              <tr key={String(label)} className={cx('border-b border-white/5', i % 2 === 0 ? 'bg-white/[0.015]' : '')}>
                <td className="py-2.5 pr-6 text-ink-300">{String(label)}</td>
                {[a, b, c].map((v, j) => (
                  <td key={j} className="py-2.5 px-4 text-center">
                    {v
                      ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">✓</span>
                      : <span className="text-ink-700">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-600">* Comparison based on free tiers as of 2025. Features may change.</p>
    </section>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: 'Is Supercomp really free?', a: 'Yes. Supercomp is an AI-native client-side app — every AI model runs in your browser, so there is no server to pay for. Your data never leaves your device. Free forever.' },
  { q: 'Where is my data stored?', a: 'Everything is stored in your browser\'s localStorage. The AI analytics engine reads it locally — no data is ever sent to a server. Export a JSON backup from Settings to keep a copy.' },
  { q: 'What is the AI trend line?', a: 'An AI-powered Exponentially Weighted Moving Average (EWMA). Each day the AI trend nudges toward your actual weight with a smoothing factor of 0.1 — filtering noise while responding to real fat changes within days.' },
  { q: 'How accurate is the AI goal projection?', a: 'The AI uses ordinary least-squares regression over your last 28 trend points to estimate your current rate, then extrapolates to your goal. The more data the AI has, the more accurate the projection — log daily for best results.' },
  { q: 'Can I use it on my phone?', a: 'Yes. Supercomp is an AI-powered Progressive Web App. Open it in Chrome or Safari, tap "Add to Home Screen", and it installs like a native app. The AI runs fully offline via a service worker.' },
  { q: 'Can I switch between kg and lb?', a: 'Yes, at any time in Settings. All weights are stored internally in kg so the AI models always work in a canonical unit — switching back and forth never degrades data or projections.' },
  { q: 'How do I back up my data?', a: 'Settings → Your data → Export JSON backup. Import it on any device to restore your full AI analytics history. CSV export is also available for spreadsheets.' },
  { q: 'Does it track calories or food?', a: 'Not directly. Supercomp\'s AI focuses on weight trend analysis. The AI calorie engine estimates your TDEE so you know your calorie target, but food logging lives in a separate app.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="relative z-10 border-t border-white/5 bg-ink-900/20 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Questions people<br />actually ask.
        </h2>
        <div className="mt-12 space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/7 bg-ink-900/40">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-white">{item.q}</span>
                <span className={cx('shrink-0 text-brand-400 transition-transform', open === i ? 'rotate-45' : '')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="border-t border-white/5 px-5 pb-4 pt-3 text-sm text-ink-400 leading-relaxed animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA banner ─────────────────────────────────────────────────────── */
function CTA({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-500/15 via-ink-900 to-ink-900 p-12 text-center shadow-2xl shadow-brand-500/10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            AI-powered clarity.<br />Zero confusion.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-ink-400">
            One tap to set up. Seconds a day to log. A lifetime of AI-driven
            insights about your body weight — private, offline, free.
          </p>
          <button
            onClick={onEnterApp}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-ink-950 shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 hover:shadow-brand-400/40"
          >
            Try the AI tracker — it's free
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
          <div className="mt-4 text-xs text-ink-600">AI-native · No account · No cloud · Runs locally</div>
        </div>
      </div>
    </section>
  )
}

/* ── Landing footer ─────────────────────────────────────────────────── */
function LandingFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-white/5 bg-ink-950/80">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
              <TrendIcon size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-ink-100">Supercomp</div>
              <div className="text-xs text-ink-600">AI-native private weight tracker</div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-100"
            >
              <span>Designed &amp; developed by</span>
              <span className="font-semibold text-brand-300 group-hover:text-brand-200">Mohammed Shafin</span>
              <LinkedInIcon />
            </a>
            <div className="mt-1 text-xs text-ink-700">
              © {year} · Built with React, TypeScript &amp; ❤️
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Shared primitives ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-400">
      {children}
    </div>
  )
}

function TrendIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M7 21 L13 14 L18 18 L25 9" stroke="#34d399" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25" cy="9" r="2.6" fill="#34d399" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#0a66c2]" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
