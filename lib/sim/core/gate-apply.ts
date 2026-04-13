/**
 * Optimised gate application for quantum state vectors.
 *
 * Single-qubit and two-qubit gates are applied directly to the state vector
 * without constructing the full 2^n x 2^n operator. General case falls back
 * to building the full operator via Kronecker products.
 *
 * Qubit ordering: q0 is MSB. |q0 q1 q2> maps to index q0*4 + q1*2 + q2.
 */

import type { DenseMatrix, StateVector } from './types'
import { matVecMul, matIdentity, kronecker } from './matrix'

// ---------------------------------------------------------------------------
// applyGate — optimised paths
// ---------------------------------------------------------------------------

/**
 * Apply a gate to specified qubit(s) within an n-qubit system.
 * @param gate - Gate matrix (2x2 for 1-qubit, 4x4 for 2-qubit, etc.)
 * @param targets - Qubit indices the gate acts on (0-indexed, q0 = MSB)
 * @param numQubits - Total number of qubits
 * @param state - Current state vector (dimension 2^numQubits)
 * @param out - Optional pre-allocated output vector (avoids allocation)
 */
export function applyGate(
  gate: DenseMatrix,
  targets: number[],
  numQubits: number,
  state: StateVector,
  out?: StateVector,
): StateVector {
  if (targets.length === 1) {
    return applySingleQubit(gate, targets[0]!, numQubits, state, out)
  }
  if (targets.length === 2) {
    return applyTwoQubit(gate, targets[0]!, targets[1]!, numQubits, state, out)
  }
  // General case: build full operator
  const fullOp = buildFullOperator(gate, targets, numQubits)
  return matVecMul(fullOp, state)
}

/**
 * Optimised single-qubit gate application. O(2^n) with no matrix construction.
 * Iterates over pairs of basis states differing only in the target qubit bit.
 */
function applySingleQubit(
  gate: DenseMatrix,
  target: number,
  numQubits: number,
  state: StateVector,
  out?: StateVector,
): StateVector {
  const dim = state.dim
  const outReal = out ? out.real : new Float64Array(dim)
  const outImag = out ? out.imag : new Float64Array(dim)

  // Copy state to output first (we'll overwrite pairs)
  outReal.set(state.real)
  outImag.set(state.imag)

  // Gate matrix elements (inline for speed)
  const g00r = gate.real[0]!, g00i = gate.imag[0]!
  const g01r = gate.real[1]!, g01i = gate.imag[1]!
  const g10r = gate.real[2]!, g10i = gate.imag[2]!
  const g11r = gate.real[3]!, g11i = gate.imag[3]!

  // Bit position for the target qubit (q0 = MSB)
  const bitPos = numQubits - 1 - target
  const stride = 1 << bitPos

  // Iterate over all pairs of basis states differing only in bit `bitPos`
  for (let block = 0; block < dim; block += stride << 1) {
    for (let i = 0; i < stride; i++) {
      const i0 = block + i            // bit `bitPos` = 0
      const i1 = i0 + stride          // bit `bitPos` = 1

      const s0r = state.real[i0]!, s0i = state.imag[i0]!
      const s1r = state.real[i1]!, s1i = state.imag[i1]!

      // [out[i0], out[i1]] = gate * [state[i0], state[i1]]
      outReal[i0] = g00r * s0r - g00i * s0i + g01r * s1r - g01i * s1i
      outImag[i0] = g00r * s0i + g00i * s0r + g01r * s1i + g01i * s1r
      outReal[i1] = g10r * s0r - g10i * s0i + g11r * s1r - g11i * s1i
      outImag[i1] = g10r * s0i + g10i * s0r + g11r * s1i + g11i * s1r
    }
  }

  return out ?? { dim, real: outReal, imag: outImag }
}

/**
 * Optimised two-qubit gate application.
 * Iterates over groups of 4 basis states corresponding to the
 * 4 combinations of the two target qubit bits.
 */
function applyTwoQubit(
  gate: DenseMatrix,
  target0: number,
  target1: number,
  numQubits: number,
  state: StateVector,
  out?: StateVector,
): StateVector {
  const dim = state.dim
  const outReal = out ? out.real : new Float64Array(dim)
  const outImag = out ? out.imag : new Float64Array(dim)

  // Bit positions (q0 = MSB)
  const bit0 = numQubits - 1 - target0
  const bit1 = numQubits - 1 - target1

  // Ensure highBit > lowBit for iteration
  const highBit = Math.max(bit0, bit1)
  const lowBit = Math.min(bit0, bit1)
  const highStride = 1 << highBit
  const lowStride = 1 << lowBit

  // Gate matrix elements (4x4, row-major)
  const gR = gate.real
  const gI = gate.imag

  // Map the 4 gate matrix rows/cols to the correct amplitude ordering.
  // Gate matrix indices are: |target0_bit, target1_bit>
  // = 0*2 + 0 = 0, 0*2 + 1 = 1, 1*2 + 0 = 2, 1*2 + 1 = 3
  // We need to map (bit0_val, bit1_val) -> gate index as target0_val*2 + target1_val
  // Amplitudes are indexed by flat basis state, so we extract bits at bit0 and bit1.

  // For each group of 4 amplitudes
  for (let block = 0; block < dim; block++) {
    // Skip if any of the target bits are set (we only want the "base" index)
    if (block & (highStride | lowStride)) continue

    // The 4 indices with all combinations of the two target bits
    // We need to order them as gate expects: |target0, target1>
    const offsets = [0, 0, 0, 0]
    // gate index 0: target0=0, target1=0 -> bit0=0, bit1=0
    offsets[0] = block
    // gate index 1: target0=0, target1=1 -> bit0=0, bit1=1
    offsets[1] = block | (1 << bit1)
    // gate index 2: target0=1, target1=0 -> bit0=1, bit1=0
    offsets[2] = block | (1 << bit0)
    // gate index 3: target0=1, target1=1 -> bit0=1, bit1=1
    offsets[3] = block | (1 << bit0) | (1 << bit1)

    // Read the 4 amplitudes
    const sr = [0, 0, 0, 0]
    const si = [0, 0, 0, 0]
    for (let k = 0; k < 4; k++) {
      sr[k] = state.real[offsets[k]!]!
      si[k] = state.imag[offsets[k]!]!
    }

    // Apply 4x4 gate
    for (let r = 0; r < 4; r++) {
      let re = 0, im = 0
      for (let c = 0; c < 4; c++) {
        const gIdx = r * 4 + c
        const gr = gR[gIdx]!, gi = gI[gIdx]!
        re += gr * sr[c]! - gi * si[c]!
        im += gr * si[c]! + gi * sr[c]!
      }
      outReal[offsets[r]!] = re
      outImag[offsets[r]!] = im
    }
  }

  // Fill non-target amplitudes (they pass through unchanged)
  // Actually, the loop above only writes the 4 amplitudes per group.
  // We need to ensure all amplitudes are written. Since we skip entries
  // where target bits are set in the outer loop, the non-group entries
  // aren't touched. Let's fix: copy first, then overwrite groups.

  // Re-do: copy state, then overwrite groups
  // This is simpler and still O(2^n)
  return applyTwoQubitFixed(gate, target0, target1, numQubits, state, out)
}

function applyTwoQubitFixed(
  gate: DenseMatrix,
  target0: number,
  target1: number,
  numQubits: number,
  state: StateVector,
  out?: StateVector,
): StateVector {
  const dim = state.dim
  const outReal = out ? out.real : new Float64Array(dim)
  const outImag = out ? out.imag : new Float64Array(dim)

  // Copy state to output
  outReal.set(state.real)
  outImag.set(state.imag)

  const bit0 = numQubits - 1 - target0
  const bit1 = numQubits - 1 - target1
  const gR = gate.real
  const gI = gate.imag

  // Iterate only over "base" indices where both target bits are 0
  for (let idx = 0; idx < dim; idx++) {
    if (idx & ((1 << bit0) | (1 << bit1))) continue

    // 4 indices ordered by gate convention: |target0_val, target1_val>
    const offsets = [
      idx,                                      // 00
      idx | (1 << bit1),                        // 01
      idx | (1 << bit0),                        // 10
      idx | (1 << bit0) | (1 << bit1),          // 11
    ]

    // Read the 4 amplitudes from original state
    const sr = [
      state.real[offsets[0]!]!, state.real[offsets[1]!]!,
      state.real[offsets[2]!]!, state.real[offsets[3]!]!,
    ]
    const si = [
      state.imag[offsets[0]!]!, state.imag[offsets[1]!]!,
      state.imag[offsets[2]!]!, state.imag[offsets[3]!]!,
    ]

    // Apply 4x4 gate
    for (let r = 0; r < 4; r++) {
      let re = 0, im = 0
      const rOff = r * 4
      for (let c = 0; c < 4; c++) {
        const gr = gR[rOff + c]!, gi = gI[rOff + c]!
        re += gr * sr[c]! - gi * si[c]!
        im += gr * si[c]! + gi * sr[c]!
      }
      outReal[offsets[r]!] = re
      outImag[offsets[r]!] = im
    }
  }

  return out ?? { dim, real: outReal, imag: outImag }
}

// ---------------------------------------------------------------------------
// buildFullOperator
// ---------------------------------------------------------------------------

/**
 * Build the full 2^n x 2^n operator for a gate on specified targets.
 * Handles non-adjacent and out-of-order targets via SWAP gates.
 */
export function buildFullOperator(
  gate: DenseMatrix,
  targets: number[],
  numQubits: number,
): DenseMatrix {
  // Check if targets are contiguous and in ascending order
  const sorted = [...targets].sort((a, b) => a - b)
  const isContiguous = sorted.every((v, i) =>
    i === 0 || v === sorted[i - 1]! + 1
  )
  const isInOrder = targets.every((v, i) => v === sorted[i])

  if (isContiguous && isInOrder) {
    // Simple case: I_{before} x gate x I_{after}
    const before = sorted[0]!
    const after = numQubits - sorted[sorted.length - 1]! - 1
    let result = gate as DenseMatrix
    if (before > 0) result = kronecker(matIdentity(1 << before), result)
    if (after > 0) result = kronecker(result, matIdentity(1 << after))
    return result
  }

  // General case: use SWAP gates to move targets into position
  // Strategy: build by applying gate via applyGate to each basis vector
  // This is simpler and always correct
  const dim = 1 << numQubits
  const real = new Float64Array(dim * dim)
  const imag = new Float64Array(dim * dim)

  for (let j = 0; j < dim; j++) {
    // Create basis state |j>
    const basisReal = new Float64Array(dim)
    const basisImag = new Float64Array(dim)
    basisReal[j] = 1
    const basis: StateVector = { dim, real: basisReal, imag: basisImag }

    // Apply gate to basis state
    const result = applyGate(gate, targets, numQubits, basis)

    // Column j of the full operator
    for (let i = 0; i < dim; i++) {
      real[i * dim + j] = result.real[i]!
      imag[i * dim + j] = result.imag[i]!
    }
  }

  return { rows: dim, cols: dim, real, imag }
}
