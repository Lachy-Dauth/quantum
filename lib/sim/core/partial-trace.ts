/**
 * Partial trace operations for reducing density matrices.
 *
 * Computes reduced density matrices by tracing out specified subsystems.
 * The key challenge is mapping (keptIndex, tracedIndex) -> flat index
 * by interleaving according to original subsystem ordering.
 */

import type { DenseMatrix, StateVector } from './types'

// ---------------------------------------------------------------------------
// Index mapping helpers
// ---------------------------------------------------------------------------

/**
 * Decompose a flat index into a multi-index given subsystem dimensions.
 * E.g., for dims=[2,3,2], flat=7 -> [0,2,1] (most-significant first).
 */
function flatToMulti(flat: number, dims: number[]): number[] {
  const multi = new Array(dims.length)
  let remaining = flat
  for (let i = dims.length - 1; i >= 0; i--) {
    multi[i] = remaining % dims[i]!
    remaining = Math.floor(remaining / dims[i]!)
  }
  return multi
}

/**
 * Convert a multi-index back to a flat index.
 */
function multiToFlat(multi: number[], dims: number[]): number {
  let flat = 0
  let stride = 1
  for (let i = dims.length - 1; i >= 0; i--) {
    flat += multi[i]! * stride
    stride *= dims[i]!
  }
  return flat
}

/**
 * Build a flat index from kept and traced sub-indices,
 * interleaved into their original positions.
 */
function buildFlatIndex(
  keptIdx: number,
  tracedIdx: number,
  subsystemDims: number[],
  keptPositions: number[],
  tracedPositions: number[],
  keptDims: number[],
  tracedDims: number[],
): number {
  // Decompose keptIdx and tracedIdx into multi-indices
  const keptMulti = flatToMulti(keptIdx, keptDims)
  const tracedMulti = flatToMulti(tracedIdx, tracedDims)

  // Interleave into full multi-index
  const fullMulti = new Array(subsystemDims.length)
  for (let i = 0; i < keptPositions.length; i++) {
    fullMulti[keptPositions[i]!] = keptMulti[i]
  }
  for (let i = 0; i < tracedPositions.length; i++) {
    fullMulti[tracedPositions[i]!] = tracedMulti[i]
  }

  return multiToFlat(fullMulti, subsystemDims)
}

// ---------------------------------------------------------------------------
// partialTrace (from pure state)
// ---------------------------------------------------------------------------

/**
 * Compute the reduced density matrix by tracing out specified subsystems
 * from a pure state. Does NOT materialise the full density matrix.
 *
 * rho_reduced[i][j] = sum_k conj(psi[f(i,k)]) * psi[f(j,k)]
 * where f maps (keptIndex, tracedIndex) -> flat index.
 */
export function partialTrace(
  state: StateVector,
  subsystemDims: number[],
  traceOutIndices: number[],
): DenseMatrix {
  const traceOutSet = new Set(traceOutIndices)

  const keptPositions: number[] = []
  const tracedPositions: number[] = []
  const keptDims: number[] = []
  const tracedDims: number[] = []

  for (let i = 0; i < subsystemDims.length; i++) {
    if (traceOutSet.has(i)) {
      tracedPositions.push(i)
      tracedDims.push(subsystemDims[i]!)
    } else {
      keptPositions.push(i)
      keptDims.push(subsystemDims[i]!)
    }
  }

  const dKept = keptDims.reduce((a, b) => a * b, 1)
  const dTraced = tracedDims.reduce((a, b) => a * b, 1)

  const real = new Float64Array(dKept * dKept)
  const imag = new Float64Array(dKept * dKept)

  for (let i = 0; i < dKept; i++) {
    for (let j = 0; j < dKept; j++) {
      let re = 0
      let im = 0
      for (let k = 0; k < dTraced; k++) {
        const fi = buildFlatIndex(i, k, subsystemDims, keptPositions, tracedPositions, keptDims, tracedDims)
        const fj = buildFlatIndex(j, k, subsystemDims, keptPositions, tracedPositions, keptDims, tracedDims)

        // conj(psi[fi]) * psi[fj]
        const psiIr = state.real[fi]!
        const psiIi = state.imag[fi]!
        const psiJr = state.real[fj]!
        const psiJi = state.imag[fj]!

        re += psiIr * psiJr + psiIi * psiJi
        im += psiIr * psiJi - psiIi * psiJr
      }
      const idx = i * dKept + j
      real[idx] = re
      imag[idx] = im
    }
  }

  return { rows: dKept, cols: dKept, real, imag }
}

// ---------------------------------------------------------------------------
// partialTraceDensity (from density matrix)
// ---------------------------------------------------------------------------

/**
 * Partial trace from a density matrix (not just pure state).
 * rho_reduced[i][j] = sum_k rho[f(i,k), f(j,k)]
 */
export function partialTraceDensity(
  rho: DenseMatrix,
  subsystemDims: number[],
  traceOutIndices: number[],
): DenseMatrix {
  const traceOutSet = new Set(traceOutIndices)

  const keptPositions: number[] = []
  const tracedPositions: number[] = []
  const keptDims: number[] = []
  const tracedDims: number[] = []

  for (let i = 0; i < subsystemDims.length; i++) {
    if (traceOutSet.has(i)) {
      tracedPositions.push(i)
      tracedDims.push(subsystemDims[i]!)
    } else {
      keptPositions.push(i)
      keptDims.push(subsystemDims[i]!)
    }
  }

  const dKept = keptDims.reduce((a, b) => a * b, 1)
  const dTraced = tracedDims.reduce((a, b) => a * b, 1)
  const fullDim = rho.rows

  const real = new Float64Array(dKept * dKept)
  const imag = new Float64Array(dKept * dKept)

  for (let i = 0; i < dKept; i++) {
    for (let j = 0; j < dKept; j++) {
      let re = 0
      let im = 0
      for (let k = 0; k < dTraced; k++) {
        const fi = buildFlatIndex(i, k, subsystemDims, keptPositions, tracedPositions, keptDims, tracedDims)
        const fj = buildFlatIndex(j, k, subsystemDims, keptPositions, tracedPositions, keptDims, tracedDims)

        const rhoIdx = fi * fullDim + fj
        re += rho.real[rhoIdx]!
        im += rho.imag[rhoIdx]!
      }
      const idx = i * dKept + j
      real[idx] = re
      imag[idx] = im
    }
  }

  return { rows: dKept, cols: dKept, real, imag }
}
