/**
 * Predefined quantum gate constants and parameterised gate factories.
 * All constant gates are frozen DenseMatrix instances created at module load.
 */

import type { DenseMatrix } from './types'
import { complex } from './complex'
import { matFromArray, matIdentity } from './matrix'

// ---------------------------------------------------------------------------
// Pauli matrices (2x2)
// ---------------------------------------------------------------------------

export const PAULI_I: DenseMatrix = matIdentity(2)

export const PAULI_X: DenseMatrix = matFromArray(2, 2, [
  [complex(0), complex(1)],
  [complex(1), complex(0)],
])

export const PAULI_Y: DenseMatrix = matFromArray(2, 2, [
  [complex(0), complex(0, -1)],
  [complex(0, 1), complex(0)],
])

export const PAULI_Z: DenseMatrix = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(-1)],
])

// ---------------------------------------------------------------------------
// Standard gates (2x2)
// ---------------------------------------------------------------------------

const SQRT1_2 = Math.SQRT1_2

export const GATE_H: DenseMatrix = matFromArray(2, 2, [
  [complex(SQRT1_2), complex(SQRT1_2)],
  [complex(SQRT1_2), complex(-SQRT1_2)],
])

export const GATE_S: DenseMatrix = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(0, 1)],
])

export const GATE_T: DenseMatrix = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(SQRT1_2, SQRT1_2)], // e^{i*pi/4} = (1+i)/sqrt(2)
])

export const GATE_S_DAG: DenseMatrix = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(0, -1)],
])

export const GATE_T_DAG: DenseMatrix = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(SQRT1_2, -SQRT1_2)], // e^{-i*pi/4}
])

// ---------------------------------------------------------------------------
// Multi-qubit gates
// ---------------------------------------------------------------------------

export const GATE_CNOT: DenseMatrix = matFromArray(4, 4, [
  [complex(1), complex(0), complex(0), complex(0)],
  [complex(0), complex(1), complex(0), complex(0)],
  [complex(0), complex(0), complex(0), complex(1)],
  [complex(0), complex(0), complex(1), complex(0)],
])

export const GATE_CZ: DenseMatrix = matFromArray(4, 4, [
  [complex(1), complex(0), complex(0), complex(0)],
  [complex(0), complex(1), complex(0), complex(0)],
  [complex(0), complex(0), complex(1), complex(0)],
  [complex(0), complex(0), complex(0), complex(-1)],
])

export const GATE_SWAP: DenseMatrix = matFromArray(4, 4, [
  [complex(1), complex(0), complex(0), complex(0)],
  [complex(0), complex(0), complex(1), complex(0)],
  [complex(0), complex(1), complex(0), complex(0)],
  [complex(0), complex(0), complex(0), complex(1)],
])

// Toffoli (8x8): identity except |110><111| + |111><110|
function buildToffoli(): DenseMatrix {
  const n = 8
  const real = new Float64Array(n * n)
  const imag = new Float64Array(n * n)
  // Start with identity
  for (let i = 0; i < n; i++) real[i * n + i] = 1
  // Swap rows 6 and 7 (|110> <-> |111>)
  real[6 * n + 6] = 0
  real[7 * n + 7] = 0
  real[6 * n + 7] = 1
  real[7 * n + 6] = 1
  return { rows: n, cols: n, real, imag }
}

export const GATE_TOFFOLI: DenseMatrix = buildToffoli()

// ---------------------------------------------------------------------------
// LRU cache for parameterised gates
// ---------------------------------------------------------------------------

const CACHE_CAPACITY = 16
const gateCache = new Map<string, DenseMatrix>()

function cachedGate(key: string, factory: () => DenseMatrix): DenseMatrix {
  const cached = gateCache.get(key)
  if (cached) {
    // Move to end (most recent)
    gateCache.delete(key)
    gateCache.set(key, cached)
    return cached
  }
  const gate = factory()
  if (gateCache.size >= CACHE_CAPACITY) {
    // Evict oldest (first key)
    const firstKey = gateCache.keys().next().value!
    gateCache.delete(firstKey)
  }
  gateCache.set(key, gate)
  return gate
}

// ---------------------------------------------------------------------------
// Parameterised gate factories
// ---------------------------------------------------------------------------

export function gateRx(theta: number): DenseMatrix {
  return cachedGate(`Rx:${theta}`, () => {
    const c = Math.cos(theta / 2)
    const s = Math.sin(theta / 2)
    return matFromArray(2, 2, [
      [complex(c), complex(0, -s)],
      [complex(0, -s), complex(c)],
    ])
  })
}

export function gateRy(theta: number): DenseMatrix {
  return cachedGate(`Ry:${theta}`, () => {
    const c = Math.cos(theta / 2)
    const s = Math.sin(theta / 2)
    return matFromArray(2, 2, [
      [complex(c), complex(-s)],
      [complex(s), complex(c)],
    ])
  })
}

export function gateRz(theta: number): DenseMatrix {
  return cachedGate(`Rz:${theta}`, () => {
    const c = Math.cos(theta / 2)
    const s = Math.sin(theta / 2)
    return matFromArray(2, 2, [
      [complex(c, -s), complex(0)],
      [complex(0), complex(c, s)],
    ])
  })
}

export function gateU(theta: number, phi: number, lambda: number): DenseMatrix {
  return cachedGate(`U:${theta}:${phi}:${lambda}`, () => {
    const ct = Math.cos(theta / 2)
    const st = Math.sin(theta / 2)
    return matFromArray(2, 2, [
      [complex(ct), complex(
        -st * Math.cos(lambda), -st * Math.sin(lambda)
      )],
      [complex(
        st * Math.cos(phi), st * Math.sin(phi)
      ), complex(
        ct * Math.cos(phi + lambda), ct * Math.sin(phi + lambda)
      )],
    ])
  })
}

export function gatePhase(phi: number): DenseMatrix {
  return cachedGate(`Phase:${phi}`, () => {
    return matFromArray(2, 2, [
      [complex(1), complex(0)],
      [complex(0), complex(Math.cos(phi), Math.sin(phi))],
    ])
  })
}
