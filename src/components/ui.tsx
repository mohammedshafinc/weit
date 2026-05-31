import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-white/5 bg-ink-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'subtle'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
  }
  const variants = {
    primary: 'bg-brand-500 text-ink-950 hover:bg-brand-400 active:bg-brand-600',
    ghost: 'bg-transparent text-ink-200 hover:bg-white/5',
    subtle: 'bg-white/5 text-ink-100 hover:bg-white/10',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
  }
  return (
    <button
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  )
}

type FieldProps = {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  suffix?: string
}

export function Input({ suffix, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cx(
          'w-full rounded-xl border border-white/10 bg-ink-950/60 px-3.5 py-2.5 text-ink-50 placeholder:text-ink-600',
          'focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30',
          suffix && 'pr-12',
          className,
        )}
        {...props}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-500">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function Select({
  className,
  children,
  ...props
}: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={cx(
        'w-full appearance-none rounded-xl border border-white/10 bg-ink-950/60 px-3.5 py-2.5 text-ink-50',
        'focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30',
        className,
      )}
      {...(props as object)}
    >
      {children}
    </select>
  )
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'brand'
}) {
  const tones = {
    neutral: 'bg-white/5 text-ink-300',
    good: 'bg-emerald-500/15 text-emerald-300',
    warn: 'bg-amber-500/15 text-amber-300',
    bad: 'bg-red-500/15 text-red-300',
    brand: 'bg-brand-500/15 text-brand-300',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink-50">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
