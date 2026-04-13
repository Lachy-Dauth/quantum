/**
 * Type definitions for the 1D Schrödinger Simulator.
 */

import type { Complex } from '../core/types'

/** Discretised 1D wavefunction. */
export interface Wavefunction {
  N: number
  xMin: number
  xMax: number
  dx: number
  x: Float64Array
  psiRe: Float64Array
  psiIm: Float64Array
}

/** Potential function. */
export interface Potential {
  type: PotentialType
  values: Float64Array
  label: string
  params: Record<string, number>
}

export type PotentialType =
  | 'infinite_well'
  | 'finite_well'
  | 'harmonic'
  | 'step'
  | 'barrier'
  | 'double_well'
  | 'custom'

/** Energy eigenstate. */
export interface Eigenstate {
  index: number
  energy: number
  wavefunction: Float64Array // real-valued, length N
  label: string
}

/** Superposition coefficient. */
export interface SuperpositionCoeff {
  eigenstateIndex: number
  amplitude: Complex
}

/** Real-time observables. */
export interface Observables {
  expectationX: number
  expectationP: number
  expectationE: number
  norm: number
  time: number
}

/** Initial state configuration. */
export type InitialStateConfig =
  | { type: 'ground' }
  | { type: 'eigenstate'; n: number }
  | { type: 'gaussian'; center: number; width: number; momentum: number }
  | { type: 'superposition'; coefficients: SuperpositionCoeff[] }
  | { type: 'custom'; wavefunction: Wavefunction }

/** Component props. */
export interface SchrodingerSimulatorProps {
  gridPoints?: 256 | 512
  domain?: [number, number]
  potential?: PotentialType
  potentialParams?: Record<string, number>
  customPotential?: (x: number) => number
  initialState?: InitialStateConfig
  dt?: number
  numEigenstates?: number
  showProbabilityDensity?: boolean
  showRealPart?: boolean
  showImagPart?: boolean
  showPotential?: boolean
  showEigenstates?: boolean
  showExpectationValues?: boolean
  editablePotential?: boolean
  showControls?: boolean
  onFrame?: (state: Wavefunction, observables: Observables) => void
  className?: string
}
