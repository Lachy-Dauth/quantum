import { describe, it, expect } from 'vitest'
import {
  complex, ZERO, ONE, I, NEG_I,
  cadd, csub, cmul, cdiv, conj, cabs, cabsSq, cphase,
  fromPolar, cexp, csqrt, cneg, cscale, ceq,
} from '../complex'
import { DivisionByZeroError } from '../types'
import { expectComplex } from './helpers'

describe('complex factory & constants', () => {
  it('creates complex numbers', () => {
    expectComplex(complex(3, 4), { re: 3, im: 4 })
    expectComplex(complex(5), { re: 5, im: 0 })
  })

  it('has correct constants', () => {
    expectComplex(ZERO, { re: 0, im: 0 })
    expectComplex(ONE, { re: 1, im: 0 })
    expectComplex(I, { re: 0, im: 1 })
    expectComplex(NEG_I, { re: 0, im: -1 })
  })
})

describe('complex arithmetic', () => {
  it('add: (1+2i) + (3+4i) = 4+6i', () => {
    expectComplex(cadd(complex(1, 2), complex(3, 4)), complex(4, 6))
  })

  it('subtract: (5+3i) - (2+i) = 3+2i', () => {
    expectComplex(csub(complex(5, 3), complex(2, 1)), complex(3, 2))
  })

  it('multiply: (1+i)(1-i) = 2', () => {
    expectComplex(cmul(complex(1, 1), complex(1, -1)), complex(2, 0))
  })

  it('multiply: i*i = -1', () => {
    expectComplex(cmul(I, I), complex(-1, 0))
  })

  it('multiply by zero: (3+4i) * 0 = 0', () => {
    expectComplex(cmul(complex(3, 4), ZERO), ZERO)
  })

  it('divide: (1+i)/(1-i) = i', () => {
    expectComplex(cdiv(complex(1, 1), complex(1, -1)), I)
  })

  it('divide by zero throws', () => {
    expect(() => cdiv(ONE, ZERO)).toThrow(DivisionByZeroError)
  })

  it('conjugate: conj(3+4i) = 3-4i', () => {
    expectComplex(conj(complex(3, 4)), complex(3, -4))
  })

  it('modulus: |3+4i| = 5', () => {
    expect(cabs(complex(3, 4))).toBeCloseTo(5, 12)
  })

  it('modulus: |0| = 0', () => {
    expect(cabs(ZERO)).toBe(0)
  })

  it('cabsSq: |3+4i|^2 = 25', () => {
    expect(cabsSq(complex(3, 4))).toBeCloseTo(25, 12)
  })

  it('phase: phase(1+i) = pi/4', () => {
    expect(cphase(complex(1, 1))).toBeCloseTo(Math.PI / 4, 12)
  })

  it('phase: phase(-1) = pi', () => {
    expect(cphase(complex(-1, 0))).toBeCloseTo(Math.PI, 12)
  })

  it('phase: phase(0) = 0', () => {
    expect(cphase(ZERO)).toBe(0)
  })

  it('fromPolar: fromPolar(2, pi/3) = 1 + sqrt(3)i', () => {
    expectComplex(fromPolar(2, Math.PI / 3), complex(1, Math.sqrt(3)))
  })

  it('cexp: e^(i*pi) = -1 (Euler identity)', () => {
    expectComplex(cexp(complex(0, Math.PI)), complex(-1, 0))
  })

  it('cexp: e^1 = e', () => {
    expectComplex(cexp(ONE), complex(Math.E, 0))
  })

  it('csqrt: sqrt(-1) = i', () => {
    expectComplex(csqrt(complex(-1, 0)), I)
  })

  it('cneg: -(3+4i) = -3-4i', () => {
    expectComplex(cneg(complex(3, 4)), complex(-3, -4))
  })

  it('cscale: (3+4i)*2 = 6+8i', () => {
    expectComplex(cscale(complex(3, 4), 2), complex(6, 8))
  })

  it('ceq: equality comparison', () => {
    expect(ceq(complex(1, 2), complex(1, 2))).toBe(true)
    expect(ceq(complex(1, 2), complex(1, 3))).toBe(false)
    expect(ceq(complex(1, 2), complex(1, 2 + 1e-13))).toBe(true)
  })
})
