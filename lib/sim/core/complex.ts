/**
 * Complex number arithmetic.
 * All functions return new Complex objects. Hot inner loops should
 * work directly on parallel Float64Arrays instead of boxing.
 */

import type { Complex } from './types'
import { DivisionByZeroError } from './types'

// ---------------------------------------------------------------------------
// Factory & constants
// ---------------------------------------------------------------------------

export function complex(re: number, im = 0): Complex {
  return { re, im }
}

export const ZERO: Complex = { re: 0, im: 0 }
export const ONE: Complex = { re: 1, im: 0 }
export const I: Complex = { re: 0, im: 1 }
export const NEG_I: Complex = { re: 0, im: -1 }

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

export function cadd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im }
}

export function csub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im }
}

export function cmul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }
}

export function cdiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im
  if (denom === 0) throw new DivisionByZeroError()
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  }
}

export function conj(a: Complex): Complex {
  return { re: a.re, im: -a.im }
}

export function cabs(a: Complex): number {
  return Math.hypot(a.re, a.im)
}

export function cabsSq(a: Complex): number {
  return a.re * a.re + a.im * a.im
}

export function cphase(a: Complex): number {
  return Math.atan2(a.im, a.re)
}

export function fromPolar(r: number, theta: number): Complex {
  return { re: r * Math.cos(theta), im: r * Math.sin(theta) }
}

export function cexp(a: Complex): Complex {
  const er = Math.exp(a.re)
  return { re: er * Math.cos(a.im), im: er * Math.sin(a.im) }
}

export function csqrt(a: Complex): Complex {
  const r = cabs(a)
  const theta = cphase(a)
  return fromPolar(Math.sqrt(r), theta / 2)
}

export function cneg(a: Complex): Complex {
  return { re: -a.re, im: -a.im }
}

export function cscale(a: Complex, s: number): Complex {
  return { re: a.re * s, im: a.im * s }
}

export function ceq(a: Complex, b: Complex, eps = 1e-12): boolean {
  return Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps
}
