/**
 * Potential functions for the 1D Schrödinger simulator.
 */

import type { PotentialType, Potential } from './types'

interface PotentialConfig {
  defaultParams: Record<string, number>
  label: string
  compute: (x: Float64Array, params: Record<string, number>) => Float64Array
}

export const POTENTIAL_CONFIGS: Record<PotentialType, PotentialConfig> = {
  infinite_well: {
    defaultParams: { L: 10 },
    label: 'Infinite Square Well',
    compute: (x) => new Float64Array(x.length),
  },
  finite_well: {
    defaultParams: { V0: 5, L: 4 },
    label: 'Finite Square Well',
    compute: (x, { V0 = 5, L = 4 }) => {
      const v = new Float64Array(x.length)
      for (let i = 0; i < x.length; i++) {
        v[i] = Math.abs(x[i]!) < L / 2 ? -V0 : 0
      }
      return v
    },
  },
  harmonic: {
    defaultParams: { omega: 1 },
    label: 'Harmonic Oscillator',
    compute: (x, { omega = 1 }) => {
      const v = new Float64Array(x.length)
      for (let i = 0; i < x.length; i++) {
        v[i] = 0.5 * omega * omega * x[i]! * x[i]!
      }
      return v
    },
  },
  step: {
    defaultParams: { V0: 2 },
    label: 'Step Potential',
    compute: (x, { V0 = 2 }) => {
      const v = new Float64Array(x.length)
      for (let i = 0; i < x.length; i++) {
        v[i] = x[i]! >= 0 ? V0 : 0
      }
      return v
    },
  },
  barrier: {
    defaultParams: { V0: 5, width: 1 },
    label: 'Potential Barrier',
    compute: (x, { V0 = 5, width = 1 }) => {
      const v = new Float64Array(x.length)
      for (let i = 0; i < x.length; i++) {
        v[i] = Math.abs(x[i]!) < width / 2 ? V0 : 0
      }
      return v
    },
  },
  double_well: {
    defaultParams: { a: 0.1, b: 4 },
    label: 'Double Well',
    compute: (x, { a = 0.1, b = 4 }) => {
      const v = new Float64Array(x.length)
      for (let i = 0; i < x.length; i++) {
        const t = x[i]! * x[i]! - b
        v[i] = a * t * t
      }
      return v
    },
  },
  custom: {
    defaultParams: {},
    label: 'Custom',
    compute: (x) => new Float64Array(x.length),
  },
}

/**
 * Create a potential from type and parameters.
 */
export function createPotential(
  type: PotentialType,
  x: Float64Array,
  params?: Record<string, number>,
): Potential {
  const config = POTENTIAL_CONFIGS[type]
  const mergedParams = { ...config.defaultParams, ...params }
  return {
    type,
    values: config.compute(x, mergedParams),
    label: config.label,
    params: mergedParams,
  }
}
