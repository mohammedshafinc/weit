export type UnitSystem = 'metric' | 'imperial'

export type Sex = 'male' | 'female' | 'other'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'

export type GoalDirection = 'lose' | 'gain' | 'maintain'

/** A single weigh-in. Weight is always stored internally in kilograms. */
export interface WeightEntry {
  id: string
  /** ISO date string, day precision: YYYY-MM-DD */
  date: string
  /** Weight in kilograms (canonical unit). */
  weightKg: number
  /** Optional body-fat percentage (0-100). */
  bodyFat?: number
  /** Optional free-text note. */
  note?: string
}

/** The user profile captured during onboarding. */
export interface Profile {
  name?: string
  /** Height in centimeters (canonical unit). */
  heightCm: number
  sex?: Sex
  /** ISO date string YYYY-MM-DD. */
  birthDate?: string
  activity?: ActivityLevel
  /** Starting weight in kg, captured at onboarding. */
  startWeightKg: number
  /** Target weight in kg. */
  goalWeightKg: number
  /** Preferred display unit system. */
  unit: UnitSystem
  /** ISO timestamp of profile creation. */
  createdAt: string
}

export interface AppState {
  profile: Profile | null
  entries: WeightEntry[]
  /** schema version for migrations */
  version: number
}
