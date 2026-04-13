/**
 * Type definitions for the CHSH Inequality Simulator.
 */

import type { StateVector } from '../core/types'

/** A single trial in the CHSH experiment. */
export interface CHSHTrial {
  /** Alice's chosen setting (index 0 or 1). */
  aliceSetting: 0 | 1
  /** Bob's chosen setting (index 0 or 1). */
  bobSetting: 0 | 1
  /** Alice's measurement outcome. */
  aliceOutcome: 1 | -1
  /** Bob's measurement outcome. */
  bobOutcome: 1 | -1
  /** Product of outcomes. */
  product: 1 | -1
}

/** Accumulated statistics for one setting pair. */
export interface SettingPairStats {
  aliceAngle: number
  bobAngle: number
  trials: number
  sumProduct: number
  correlation: number     // sumProduct / trials = empirical E(a,b)
  theoreticalCorrelation: number
}

/** Full CHSH experiment state. */
export interface CHSHExperimentState {
  aliceAngles: [number, number]
  bobAngles: [number, number]
  /** Stats for each of the 4 setting combinations.
   *  Order: (a1,b1), (a1,b2), (a2,b1), (a2,b2) */
  pairStats: [SettingPairStats, SettingPairStats, SettingPairStats, SettingPairStats]
  empiricalS: number
  theoreticalS: number
  trials: CHSHTrial[]
  totalTrials: number
}

/** Shared entangled state type. */
export type EntangledState = 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus' | 'product'

/** Preset configuration. */
export interface CHSHPreset {
  name: string
  aliceAngles: [number, number]
  bobAngles: [number, number]
  description: string
}

/** Component props. */
export interface CHSHSimulatorProps {
  entangledState?: EntangledState
  aliceAngles?: [number, number]
  bobAngles?: [number, number]
  presets?: CHSHPreset[]
  editable?: boolean
  showTrialTable?: boolean
  showCorrelationPlot?: boolean
  showConvergencePlot?: boolean
  maxTrials?: number
  onTrial?: (trial: CHSHTrial) => void
  onSValueChange?: (empiricalS: number, theoreticalS: number) => void
  className?: string
}
