import type { UnitSystem } from '../types'

const KG_PER_LB = 0.45359237
const CM_PER_IN = 2.54

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB
}

export function cmToIn(cm: number): number {
  return cm / CM_PER_IN
}

export function inToCm(inch: number): number {
  return inch * CM_PER_IN
}

/** Convert a canonical kg value into the user's preferred display unit. */
export function displayWeight(kg: number, unit: UnitSystem): number {
  return unit === 'metric' ? kg : kgToLb(kg)
}

/** Convert a user-entered weight (in their unit) back to canonical kg. */
export function toKg(value: number, unit: UnitSystem): number {
  return unit === 'metric' ? value : lbToKg(value)
}

export function weightUnitLabel(unit: UnitSystem): string {
  return unit === 'metric' ? 'kg' : 'lb'
}

export function heightUnitLabel(unit: UnitSystem): string {
  return unit === 'metric' ? 'cm' : 'in'
}

/** Format a weight (given in kg) for display with unit suffix. */
export function formatWeight(
  kg: number,
  unit: UnitSystem,
  digits = 1,
): string {
  const v = displayWeight(kg, unit)
  return `${v.toFixed(digits)} ${weightUnitLabel(unit)}`
}

/** Round a number to a fixed number of decimals, returning a number. */
export function round(value: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}
