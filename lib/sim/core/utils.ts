/**
 * Utility functions: Bloch sphere conversion, seeded RNG, formatting.
 */

import type { Complex, StateVector } from './types'
import { complex } from './complex'
import { vecFromArray } from './vector'
import { trace as matTrace, matMul } from './matrix'
import { PAULI_X, PAULI_Y, PAULI_Z } from './gates'
import { partialTrace } from './partial-trace'

// ---------------------------------------------------------------------------
// Bloch sphere conversion
// ---------------------------------------------------------------------------

/**
 * Convert a single-qubit pure state to Bloch sphere coordinates.
 * x = 2Re(conj(alpha)*beta)
 * y = 2Im(conj(alpha)*beta)
 * z = |alpha|^2 - |beta|^2
 */
export function stateToBloch(state: StateVector): { x: number; y: number; z: number } {
  if (state.dim !== 2) {
    throw new Error('stateToBloch: state must be 2-dimensional (single qubit)')
  }

  const alphaR = state.real[0]!
  const alphaI = state.imag[0]!
  const betaR = state.real[1]!
  const betaI = state.imag[1]!

  // conj(alpha) * beta = (alphaR - i*alphaI)(betaR + i*betaI)
  const prodR = alphaR * betaR + alphaI * betaI
  const prodI = alphaR * betaI - alphaI * betaR

  const x = 2 * prodR
  const y = 2 * prodI
  const z = (alphaR * alphaR + alphaI * alphaI) - (betaR * betaR + betaI * betaI)

  return { x, y, z }
}

/**
 * Convert Bloch coordinates back to a state vector.
 * |psi> = cos(theta/2)|0> + e^{i*phi}*sin(theta/2)|1>
 */
export function blochToState(x: number, y: number, z: number): StateVector {
  // Clamp z for numerical safety
  const zc = Math.max(-1, Math.min(1, z))
  const theta = Math.acos(zc)
  const phi = Math.atan2(y, x)

  const cosHalf = Math.cos(theta / 2)
  const sinHalf = Math.sin(theta / 2)

  return vecFromArray([
    complex(cosHalf),
    complex(sinHalf * Math.cos(phi), sinHalf * Math.sin(phi)),
  ])
}

// ---------------------------------------------------------------------------
// Reduced Bloch vector
// ---------------------------------------------------------------------------

/**
 * Compute the Bloch vector for a single qubit's reduced density matrix
 * in an n-qubit system.
 *
 * Returns (x, y, z, purity) where purity = Tr(rho^2).
 * Purity < 1 means the qubit is entangled with others.
 */
export function reducedBlochVector(
  state: StateVector,
  numQubits: number,
  qubitIndex: number,
): { x: number; y: number; z: number; purity: number } {
  // Build subsystem dims (all qubits are dim 2)
  const subsystemDims = new Array(numQubits).fill(2) as number[]

  // Trace out all qubits except qubitIndex
  const traceOutIndices: number[] = []
  for (let i = 0; i < numQubits; i++) {
    if (i !== qubitIndex) traceOutIndices.push(i)
  }

  const rho = partialTrace(state, subsystemDims, traceOutIndices)

  // Bloch vector components: x = Tr(rho * sigma_x), etc.
  const trRhoX = matTrace(matMul(rho, PAULI_X))
  const trRhoY = matTrace(matMul(rho, PAULI_Y))
  const trRhoZ = matTrace(matMul(rho, PAULI_Z))

  // Purity = Tr(rho^2)
  const rhoSq = matMul(rho, rho)
  const purity = matTrace(rhoSq).re

  return {
    x: trRhoX.re,
    y: trRhoY.re,
    z: trRhoZ.re,
    purity: Math.max(0, Math.min(1, purity)),
  }
}

// ---------------------------------------------------------------------------
// Seeded PRNG (xoshiro256**)
// ---------------------------------------------------------------------------

/**
 * Create a seeded pseudo-random number generator using xoshiro256**.
 * Produces values in [0, 1). State is seeded via splitmix64.
 */
export function createRng(seed: number): () => number {
  // Splitmix64 for seeding xoshiro256** state
  let smState = BigInt(seed) & 0xFFFFFFFFFFFFFFFFn

  function splitmix64(): bigint {
    smState = (smState + 0x9E3779B97F4A7C15n) & 0xFFFFFFFFFFFFFFFFn
    let z = smState
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & 0xFFFFFFFFFFFFFFFFn
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & 0xFFFFFFFFFFFFFFFFn
    return (z ^ (z >> 31n)) & 0xFFFFFFFFFFFFFFFFn
  }

  // Initialize 4x64-bit state
  let s0 = splitmix64()
  let s1 = splitmix64()
  let s2 = splitmix64()
  let s3 = splitmix64()

  const MASK = 0xFFFFFFFFFFFFFFFFn

  function rotl(x: bigint, k: bigint): bigint {
    return ((x << k) | (x >> (64n - k))) & MASK
  }

  return function next(): number {
    const result = (rotl((s1 * 5n) & MASK, 7n) * 9n) & MASK

    const t = (s1 << 17n) & MASK

    s2 = (s2 ^ s0) & MASK
    s3 = (s3 ^ s1) & MASK
    s1 = (s1 ^ s2) & MASK
    s0 = (s0 ^ s3) & MASK

    s2 = (s2 ^ t) & MASK
    s3 = rotl(s3, 45n)

    // Convert to [0, 1): take upper 53 bits
    const upper53 = Number(result >> 11n)
    return upper53 / 9007199254740992
  }
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Format a complex number for display.
 * Examples: "0.707 + 0.707i", "-1", "i", "0"
 */
export function formatComplex(c: Complex, precision = 3): string {
  const re = c.re
  const im = c.im
  const eps = Math.pow(10, -(precision + 1))

  const reZero = Math.abs(re) < eps
  const imZero = Math.abs(im) < eps

  if (reZero && imZero) return '0'

  if (imZero) {
    return re.toFixed(precision).replace(/\.?0+$/, '')
  }

  if (reZero) {
    if (Math.abs(im - 1) < eps) return 'i'
    if (Math.abs(im + 1) < eps) return '-i'
    return `${im.toFixed(precision).replace(/\.?0+$/, '')}i`
  }

  const rePart = re.toFixed(precision).replace(/\.?0+$/, '')
  const imAbs = Math.abs(im)
  const imSign = im > 0 ? '+' : '-'

  let imPart: string
  if (Math.abs(imAbs - 1) < eps) {
    imPart = 'i'
  } else {
    imPart = `${imAbs.toFixed(precision).replace(/\.?0+$/, '')}i`
  }

  return `${rePart} ${imSign} ${imPart}`
}

/**
 * Format a state vector in ket notation.
 * Example: "0.707|00> + 0.707|11>"
 */
export function formatStateKet(
  state: StateVector,
  numQubits: number,
  threshold = 1e-10,
): string {
  const terms: string[] = []

  for (let i = 0; i < state.dim; i++) {
    const re = state.real[i]!
    const im = state.imag[i]!
    const amp = Math.hypot(re, im)
    if (amp < threshold) continue

    const c = complex(re, im)
    const label = i.toString(2).padStart(numQubits, '0')
    const ampStr = formatComplex(c)
    terms.push(`${ampStr}|${label}>`)
  }

  if (terms.length === 0) return '0'

  return terms.join(' + ').replace(/\+ -/g, '- ')
}
