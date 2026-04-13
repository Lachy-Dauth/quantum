/**
 * State vector operations for quantum states in C^n.
 * All vectors use parallel Float64Arrays for real/imag parts.
 */

import type { Complex, StateVector } from './types'
import { DimensionMismatchError, ZeroVectorError } from './types'
import { complex } from './complex'

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function vecZero(dim: number): StateVector {
  return { dim, real: new Float64Array(dim), imag: new Float64Array(dim) }
}

export function basisState(dim: number, index: number): StateVector {
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  real[index] = 1
  return { dim, real, imag }
}

export function vecFromArray(components: Complex[]): StateVector {
  const dim = components.length
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    real[i] = components[i]!.re
    imag[i] = components[i]!.im
  }
  return { dim, real, imag }
}

export function vecToArray(v: StateVector): Complex[] {
  const result: Complex[] = new Array(v.dim)
  for (let i = 0; i < v.dim; i++) {
    result[i] = complex(v.real[i]!, v.imag[i]!)
  }
  return result
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

export function vecAdd(u: StateVector, v: StateVector): StateVector {
  if (u.dim !== v.dim) {
    throw new DimensionMismatchError(`vecAdd: dimensions ${u.dim} and ${v.dim} do not match`)
  }
  const dim = u.dim
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    real[i] = u.real[i]! + v.real[i]!
    imag[i] = u.imag[i]! + v.imag[i]!
  }
  return { dim, real, imag }
}

export function vecScale(v: StateVector, c: Complex): StateVector {
  const dim = v.dim
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    const vr = v.real[i]!
    const vi = v.imag[i]!
    real[i] = vr * c.re - vi * c.im
    imag[i] = vr * c.im + vi * c.re
  }
  return { dim, real, imag }
}

export function vecScaleReal(v: StateVector, s: number): StateVector {
  const dim = v.dim
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    real[i] = v.real[i]! * s
    imag[i] = v.imag[i]! * s
  }
  return { dim, real, imag }
}

// ---------------------------------------------------------------------------
// Inner product, norm, normalize
// ---------------------------------------------------------------------------

/** Compute <u|v> (conjugate-linear in first slot, physics convention). */
export function innerProduct(u: StateVector, v: StateVector): Complex {
  if (u.dim !== v.dim) {
    throw new DimensionMismatchError(`innerProduct: dimensions ${u.dim} and ${v.dim} do not match`)
  }
  let re = 0
  let im = 0
  for (let i = 0; i < u.dim; i++) {
    const ur = u.real[i]!
    const ui = u.imag[i]!
    const vr = v.real[i]!
    const vi = v.imag[i]!
    // conj(u_i) * v_i = (ur - i*ui)(vr + i*vi)
    re += ur * vr + ui * vi
    im += ur * vi - ui * vr
  }
  return { re, im }
}

export function vecNorm(v: StateVector): number {
  let sum = 0
  for (let i = 0; i < v.dim; i++) {
    sum += v.real[i]! * v.real[i]! + v.imag[i]! * v.imag[i]!
  }
  return Math.sqrt(sum)
}

export function vecNormalize(v: StateVector): StateVector {
  const n = vecNorm(v)
  if (n < 1e-15) throw new ZeroVectorError()
  return vecScaleReal(v, 1 / n)
}

// ---------------------------------------------------------------------------
// Tensor product
// ---------------------------------------------------------------------------

export function tensorProduct(u: StateVector, v: StateVector): StateVector {
  const dim = u.dim * v.dim
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < u.dim; i++) {
    const ur = u.real[i]!
    const ui = u.imag[i]!
    const base = i * v.dim
    for (let j = 0; j < v.dim; j++) {
      const vr = v.real[j]!
      const vi = v.imag[j]!
      real[base + j] = ur * vr - ui * vi
      imag[base + j] = ur * vi + ui * vr
    }
  }
  return { dim, real, imag }
}

// ---------------------------------------------------------------------------
// Predefined states
// ---------------------------------------------------------------------------

const SQRT1_2 = Math.SQRT1_2

export const STATE_ZERO: StateVector = basisState(2, 0)
export const STATE_ONE: StateVector = basisState(2, 1)

export const STATE_PLUS: StateVector = vecFromArray([
  complex(SQRT1_2), complex(SQRT1_2),
])
export const STATE_MINUS: StateVector = vecFromArray([
  complex(SQRT1_2), complex(-SQRT1_2),
])
export const STATE_PLUS_I: StateVector = vecFromArray([
  complex(SQRT1_2), complex(0, SQRT1_2),
])
export const STATE_MINUS_I: StateVector = vecFromArray([
  complex(SQRT1_2), complex(0, -SQRT1_2),
])

// Bell states (2-qubit)
export const BELL_PHI_PLUS: StateVector = vecFromArray([
  complex(SQRT1_2), complex(0), complex(0), complex(SQRT1_2),
])
export const BELL_PHI_MINUS: StateVector = vecFromArray([
  complex(SQRT1_2), complex(0), complex(0), complex(-SQRT1_2),
])
export const BELL_PSI_PLUS: StateVector = vecFromArray([
  complex(0), complex(SQRT1_2), complex(SQRT1_2), complex(0),
])
export const BELL_PSI_MINUS: StateVector = vecFromArray([
  complex(0), complex(SQRT1_2), complex(-SQRT1_2), complex(0),
])
