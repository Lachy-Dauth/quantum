/**
 * Type definitions for the Stern-Gerlach Simulator.
 */

import type { StateVector } from '../core/types'

// ---------------------------------------------------------------------------
// Apparatus configuration
// ---------------------------------------------------------------------------

/** Configuration of a single Stern-Gerlach magnet. */
export interface SGApparatus {
  id: string
  /** Measurement axis in spherical coordinates. */
  axis: {
    theta: number // polar angle from z-axis, [0, pi]
    phi: number   // azimuthal angle in x-y plane, [0, 2*pi)
  }
  /** Which input beam feeds this apparatus.
   *  For the first apparatus: 'source'.
   *  For subsequent: { apparatusId: string, output: 'up' | 'down' }. */
  input: 'source' | { apparatusId: string; output: 'up' | 'down' }
  /** Whether the 'up' or 'down' output beam is blocked. null = neither blocked. */
  blocked: 'up' | 'down' | null
}

/** Full configuration of the experiment. */
export interface SGExperiment {
  /** Initial spin state of particles from the source. */
  initialState: StateVector
  /** Chain of apparatuses. Max 4. */
  apparatuses: SGApparatus[]
}

// ---------------------------------------------------------------------------
// Simulation results
// ---------------------------------------------------------------------------

/** Result for a single particle traversing the chain. */
export interface SGSingleResult {
  /** For each apparatus, which output the particle took. */
  outcomes: Array<{
    apparatusId: string
    output: 'up' | 'down'
    probability: number
    stateAfter: StateVector
  }>
  /** Whether the particle was blocked at some apparatus. */
  blocked: boolean
  blockedAt?: string
  /** Final output: detector id (apparatusId:output), or null if blocked. */
  finalDetector: string | null
}

/** Accumulated statistics from batch mode. */
export interface SGBatchResult {
  /** Count per final detector (detector identified by apparatusId:output). */
  detectorCounts: Map<string, number>
  totalEmitted: number
  totalBlocked: number
  totalDetected: number
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface SternGerlachProps {
  /** Initial spin state. Defaults to |+z> = |0>.
   *  Accepts ket strings: "|0>", "|1>", "|+>", "|->", "|+x>", "|-x>",
   *  "|+y>", "|-y>", or a StateVector. */
  initialState?: string | StateVector
  /** Pre-configured apparatus chain. If omitted, starts with one Z-axis apparatus. */
  apparatuses?: SGApparatus[]
  /** Maximum number of apparatuses. Default 4. */
  maxApparatuses?: number
  /** Whether the user can modify the apparatus chain. Default true. */
  editable?: boolean
  /** Show the state vector at each stage. Default true. */
  showStateDisplay?: boolean
  /** Show the "what's the math?" panel. Default false. */
  showMath?: boolean
  /** Show particle counter / histogram. Default true. */
  showStatistics?: boolean
  /** Preset buttons for axis selection (e.g. X, Y, Z). Default true. */
  showPresetAxes?: boolean
  /** Callback on each single-shot result. */
  onParticleDetected?: (result: SGSingleResult) => void
  /** Callback when batch completes. */
  onBatchComplete?: (result: SGBatchResult) => void
  /** CSS class name. */
  className?: string
}
