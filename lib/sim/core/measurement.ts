/**
 * Quantum measurement operations.
 *
 * measureQubit is optimised to iterate basis states directly —
 * it does NOT build projector matrices.
 *
 * Qubit ordering: q0 = MSB. Bit position for qubit q = numQubits - 1 - q.
 */

import type { DenseMatrix, StateVector } from './types'
import { matVecMul } from './matrix'
import { innerProduct, vecNormalize } from './vector'

// ---------------------------------------------------------------------------
// measurementProbability
// ---------------------------------------------------------------------------

/**
 * Compute P(outcome) = <psi|P|psi> for projector P.
 * Result is clamped to [0, 1] to handle floating-point drift.
 */
export function measurementProbability(state: StateVector, projector: DenseMatrix): number {
  const projected = matVecMul(projector, state)
  const prob = innerProduct(state, projected).re
  return Math.max(0, Math.min(1, prob))
}

// ---------------------------------------------------------------------------
// projectiveMeasurement
// ---------------------------------------------------------------------------

/**
 * Perform a projective measurement with arbitrary projectors summing to I.
 * Returns the outcome index, post-measurement state, and probability.
 */
export function projectiveMeasurement(
  state: StateVector,
  projectors: DenseMatrix[],
  rng: () => number = Math.random,
): { outcome: number; postState: StateVector; probability: number } {
  const probs: number[] = []
  for (const P of projectors) {
    probs.push(measurementProbability(state, P))
  }

  const r = rng()
  let cumulative = 0
  let outcome = probs.length - 1 // default to last
  for (let k = 0; k < probs.length; k++) {
    cumulative += probs[k]!
    if (r < cumulative) {
      outcome = k
      break
    }
  }

  // Post-measurement state: normalize(P_k |psi>)
  const projected = matVecMul(projectors[outcome]!, state)
  const postState = vecNormalize(projected)

  return { outcome, postState, probability: probs[outcome]! }
}

// ---------------------------------------------------------------------------
// measureQubit (optimised — no projector construction)
// ---------------------------------------------------------------------------

/**
 * Measure a single qubit in the computational basis.
 * Iterates basis states directly to compute probabilities and collapse.
 */
export function measureQubit(
  state: StateVector,
  numQubits: number,
  qubitIndex: number,
  rng: () => number = Math.random,
): { outcome: number; postState: StateVector; probability: number } {
  const dim = state.dim
  const bitPos = numQubits - 1 - qubitIndex

  // Compute probability of outcome 0
  let p0 = 0
  for (let i = 0; i < dim; i++) {
    if (((i >> bitPos) & 1) === 0) {
      p0 += state.real[i]! * state.real[i]! + state.imag[i]! * state.imag[i]!
    }
  }
  p0 = Math.max(0, Math.min(1, p0))

  // Draw outcome
  const r = rng()
  const outcome = r < p0 ? 0 : 1
  const prob = outcome === 0 ? p0 : 1 - p0

  // Collapse: zero out amplitudes inconsistent with outcome, renormalize
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    if (((i >> bitPos) & 1) === outcome) {
      real[i] = state.real[i]!
      imag[i] = state.imag[i]!
    }
    // else remains 0
  }

  // Normalize
  const norm = Math.sqrt(prob)
  if (norm > 1e-15) {
    const invNorm = 1 / norm
    for (let i = 0; i < dim; i++) {
      real[i] = real[i]! * invNorm
      imag[i] = imag[i]! * invNorm
    }
  }

  return {
    outcome,
    postState: { dim, real, imag },
    probability: prob,
  }
}

// ---------------------------------------------------------------------------
// measureQubits (multi-qubit sequential measurement)
// ---------------------------------------------------------------------------

/**
 * Measure multiple qubits sequentially in the computational basis.
 * Each measurement collapses the state before the next.
 */
export function measureQubits(
  state: StateVector,
  numQubits: number,
  qubitIndices: number[],
  rng: () => number = Math.random,
): { outcomes: number[]; postState: StateVector; probability: number } {
  let currentState = state
  const outcomes: number[] = []
  let totalProb = 1

  for (const qi of qubitIndices) {
    const result = measureQubit(currentState, numQubits, qi, rng)
    outcomes.push(result.outcome)
    currentState = result.postState
    totalProb *= result.probability
  }

  return { outcomes, postState: currentState, probability: totalProb }
}
