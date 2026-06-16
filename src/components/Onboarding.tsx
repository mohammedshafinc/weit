import { useMemo, useState } from 'react'
import type { ActivityLevel, Profile, Sex, UnitSystem } from '../types'
import { useStore } from '../store'
import { Button, Card, Field, Input, Select } from './ui'
import {
  displayWeight,
  heightUnitLabel,
  inToCm,
  toKg,
  weightUnitLabel,
} from '../lib/units'
import { bmi, bmiCategory, healthyWeightRange } from '../lib/analytics'

const STEPS = ['Welcome', 'About you', 'Your numbers', 'Your goal'] as const

export default function Onboarding() {
  const { saveProfile } = useStore()
  const [step, setStep] = useState(0)

  const [unit, setUnit] = useState<UnitSystem>('metric')
  const [name, setName] = useState('')
  const [sex, setSex] = useState<Sex>('male')
  const [birthDate, setBirthDate] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')

  // Height: metric uses cm; imperial uses ft + in.
  const [heightCm, setHeightCm] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')

  const [weight, setWeight] = useState('')
  const [goal, setGoal] = useState('')

  const resolvedHeightCm = useMemo(() => {
    if (unit === 'metric') return parseFloat(heightCm) || 0
    const ft = parseFloat(heightFt) || 0
    const inch = parseFloat(heightIn) || 0
    return inToCm(ft * 12 + inch)
  }, [unit, heightCm, heightFt, heightIn])

  const startKg = useMemo(
    () => (weight ? toKg(parseFloat(weight), unit) : 0),
    [weight, unit],
  )
  const goalKg = useMemo(
    () => (goal ? toKg(parseFloat(goal), unit) : 0),
    [goal, unit],
  )

  const wLabel = weightUnitLabel(unit)
  const hLabel = heightUnitLabel(unit)

  const previewBmi = startKg && resolvedHeightCm ? bmi(startKg, resolvedHeightCm) : 0
  const [healthyLo, healthyHi] =
    resolvedHeightCm > 0 ? healthyWeightRange(resolvedHeightCm) : [0, 0]

  function canProceed(): boolean {
    if (step === 1) {
      return resolvedHeightCm > 50 && resolvedHeightCm < 280
    }
    if (step === 2) {
      return startKg > 0
    }
    if (step === 3) {
      return goalKg > 0
    }
    return true
  }

  function finish() {
    const profile: Profile = {
      name: name.trim() || undefined,
      heightCm: resolvedHeightCm,
      sex,
      birthDate: birthDate || undefined,
      activity,
      startWeightKg: startKg,
      goalWeightKg: goalKg,
      unit,
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
  }

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-4 py-10">
      <div className="mb-8 animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15">
          <LogoMark />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-50">
          Supercomp
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Track your weight, see the real trend, reach your goal.
        </p>
      </div>

      <Card className="animate-fade-in">
        <Stepper step={step} />

        {step === 0 && (
          <div className="space-y-5">
            <p className="text-ink-300">
              Welcome! This is a private weight tracker. Everything stays on this
              device in your browser. No account, no cloud, no tracking.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <UnitChoice
                active={unit === 'metric'}
                onClick={() => setUnit('metric')}
                title="Metric"
                desc="kg · cm"
              />
              <UnitChoice
                active={unit === 'imperial'}
                onClick={() => setUnit('imperial')}
                title="Imperial"
                desc="lb · ft/in"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Name (optional)">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sex">
                <Select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as Sex)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="Date of birth (optional)">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Field>
            </div>

            {unit === 'metric' ? (
              <Field label="Height" hint="Used for BMI and calorie estimates.">
                <Input
                  inputMode="decimal"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  suffix={hLabel}
                />
              </Field>
            ) : (
              <Field label="Height" hint="Used for BMI and calorie estimates.">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    inputMode="decimal"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="5"
                    suffix="ft"
                  />
                  <Input
                    inputMode="decimal"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="9"
                    suffix="in"
                  />
                </div>
              </Field>
            )}

            <Field
              label="Activity level"
              hint="Helps estimate your daily energy needs."
            >
              <Select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              >
                <option value="sedentary">Sedentary (little exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very active (physical job)</option>
              </Select>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field
              label="Current weight"
              hint="This is your starting point. You can log new weigh-ins any day."
            >
              <Input
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? '72.5' : '160'}
                suffix={wLabel}
              />
            </Field>
            {previewBmi > 0 && (
              <div className="rounded-xl bg-ink-950/50 p-3 text-sm text-ink-300">
                Your BMI is{' '}
                <span className="font-semibold text-ink-100">
                  {previewBmi.toFixed(1)}
                </span>{' '}
                ({bmiCategory(previewBmi)}). A healthy weight for your height is{' '}
                <span className="font-semibold text-ink-100">
                  {displayWeight(healthyLo, unit).toFixed(0)}–
                  {displayWeight(healthyHi, unit).toFixed(0)} {wLabel}
                </span>
                .
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Field
              label="Goal weight"
              hint="Where do you want to be? We'll track your progress and project a date."
            >
              <Input
                inputMode="decimal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={unit === 'metric' ? '68' : '150'}
                suffix={wLabel}
              />
            </Field>
            {goalKg > 0 && startKg > 0 && (
              <div className="rounded-xl bg-ink-950/50 p-3 text-sm text-ink-300">
                {goalKg < startKg ? (
                  <>
                    You want to lose{' '}
                    <span className="font-semibold text-brand-300">
                      {displayWeight(startKg - goalKg, unit).toFixed(1)} {wLabel}
                    </span>
                    .
                  </>
                ) : goalKg > startKg ? (
                  <>
                    You want to gain{' '}
                    <span className="font-semibold text-brand-300">
                      {displayWeight(goalKg - startKg, unit).toFixed(1)} {wLabel}
                    </span>
                    .
                  </>
                ) : (
                  <>You want to maintain your current weight. Nice.</>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={finish} disabled={!canProceed()}>
              Start tracking
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-ink-600">
        Your data never leaves this browser. Export a backup anytime from
        Settings.
      </p>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col gap-1.5">
          <div
            className={`h-1.5 rounded-full transition-colors ${
              i <= step ? 'bg-brand-500' : 'bg-white/10'
            }`}
          />
          <span
            className={`text-[11px] ${
              i === step ? 'text-brand-300' : 'text-ink-600'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

function UnitChoice({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean
  onClick: () => void
  title: string
  desc: string
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active
          ? 'border-brand-400/70 bg-brand-500/10'
          : 'border-white/10 bg-ink-950/40 hover:border-white/20'
      }`}
    >
      <div className="font-semibold text-ink-50">{title}</div>
      <div className="text-sm text-ink-400">{desc}</div>
    </button>
  )
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path
        d="M7 21 L13 14 L18 18 L25 9"
        stroke="#34d399"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="9" r="2.4" fill="#34d399" />
    </svg>
  )
}
