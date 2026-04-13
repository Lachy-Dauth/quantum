import { describe, it, expect } from 'vitest'
import {
  vecAdd, vecScale, vecScaleReal, innerProduct, vecNorm, vecNormalize,
  tensorProduct, vecFromArray, vecToArray, vecZero, basisState,
  STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS,
  BELL_PHI_PLUS,
} from '../vector'
import { complex, cabsSq } from '../complex'
import { DimensionMismatchError, ZeroVectorError } from '../types'
import { expectComplex, expectStateVec } from './helpers'

const SQRT1_2 = Math.SQRT1_2

describe('vector constructors', () => {
  it('vecZero creates zero vector', () => {
    const v = vecZero(4)
    expect(v.dim).toBe(4)
    for (let i = 0; i < 4; i++) {
      expect(v.real[i]).toBe(0)
      expect(v.imag[i]).toBe(0)
    }
  })

  it('basisState creates computational basis state', () => {
    const v = basisState(4, 2)
    expect(v.dim).toBe(4)
    expect(v.real[2]).toBe(1)
    expect(v.real[0]).toBe(0)
  })

  it('vecFromArray / vecToArray round-trip', () => {
    const arr = [complex(1, 2), complex(3, 4)]
    const v = vecFromArray(arr)
    const back = vecToArray(v)
    expectComplex(back[0]!, complex(1, 2))
    expectComplex(back[1]!, complex(3, 4))
  })
})

describe('vector arithmetic', () => {
  it('vecAdd adds element-wise', () => {
    const u = vecFromArray([complex(1, 0), complex(0, 1)])
    const v = vecFromArray([complex(0, 1), complex(1, 0)])
    const w = vecAdd(u, v)
    expectComplex(vecToArray(w)[0]!, complex(1, 1))
    expectComplex(vecToArray(w)[1]!, complex(1, 1))
  })

  it('vecAdd throws on dimension mismatch', () => {
    expect(() => vecAdd(vecZero(2), vecZero(3))).toThrow(DimensionMismatchError)
  })

  it('vecScale scales by complex', () => {
    const v = vecFromArray([complex(1, 0), complex(0, 1)])
    const w = vecScale(v, complex(0, 1)) // multiply by i
    expectComplex(vecToArray(w)[0]!, complex(0, 1))  // 1 * i = i
    expectComplex(vecToArray(w)[1]!, complex(-1, 0)) // i * i = -1
  })

  it('vecScaleReal scales by real', () => {
    const v = vecFromArray([complex(1, 2), complex(3, 4)])
    const w = vecScaleReal(v, 2)
    expectComplex(vecToArray(w)[0]!, complex(2, 4))
    expectComplex(vecToArray(w)[1]!, complex(6, 8))
  })
})

describe('inner product', () => {
  it('<0|0> = 1', () => {
    expectComplex(innerProduct(STATE_ZERO, STATE_ZERO), complex(1, 0))
  })

  it('<0|1> = 0', () => {
    expectComplex(innerProduct(STATE_ZERO, STATE_ONE), complex(0, 0))
  })

  it('<+|+> = 1', () => {
    expectComplex(innerProduct(STATE_PLUS, STATE_PLUS), complex(1, 0))
  })

  it('<+|-> = 0', () => {
    expectComplex(innerProduct(STATE_PLUS, STATE_MINUS), complex(0, 0))
  })

  it('throws on dimension mismatch', () => {
    expect(() => innerProduct(STATE_ZERO, basisState(4, 0))).toThrow(DimensionMismatchError)
  })
})

describe('norm', () => {
  it('norm(|0>) = 1', () => {
    expect(vecNorm(STATE_ZERO)).toBeCloseTo(1, 12)
  })

  it('norm(2|0>) = 2', () => {
    expect(vecNorm(vecScaleReal(STATE_ZERO, 2))).toBeCloseTo(2, 12)
  })

  it('norm(zero vector) = 0', () => {
    expect(vecNorm(vecZero(4))).toBe(0)
  })
})

describe('normalize', () => {
  it('normalize(|0> + |1>) = |+>', () => {
    const v = vecAdd(STATE_ZERO, STATE_ONE)
    const n = vecNormalize(v)
    expectStateVec(n, STATE_PLUS)
  })

  it('normalize(zero vector) throws', () => {
    expect(() => vecNormalize(vecZero(2))).toThrow(ZeroVectorError)
  })
})

describe('tensor product', () => {
  it('|0> x |0> = |00>', () => {
    const result = tensorProduct(STATE_ZERO, STATE_ZERO)
    expect(result.dim).toBe(4)
    expect(result.real[0]).toBeCloseTo(1, 12)
    expect(result.real[1]).toBeCloseTo(0, 12)
    expect(result.real[2]).toBeCloseTo(0, 12)
    expect(result.real[3]).toBeCloseTo(0, 12)
  })

  it('|+> x |0> = (1/sqrt(2))[1,0,1,0]', () => {
    const result = tensorProduct(STATE_PLUS, STATE_ZERO)
    expect(result.dim).toBe(4)
    expect(result.real[0]).toBeCloseTo(SQRT1_2, 12)
    expect(result.real[1]).toBeCloseTo(0, 12)
    expect(result.real[2]).toBeCloseTo(SQRT1_2, 12)
    expect(result.real[3]).toBeCloseTo(0, 12)
  })

  it('|0> x |1> = |01> = [0,1,0,0]', () => {
    const result = tensorProduct(STATE_ZERO, STATE_ONE)
    expect(result.dim).toBe(4)
    expect(result.real[0]).toBeCloseTo(0, 12)
    expect(result.real[1]).toBeCloseTo(1, 12)
    expect(result.real[2]).toBeCloseTo(0, 12)
    expect(result.real[3]).toBeCloseTo(0, 12)
  })

  it('dimension: dim2 x dim2 = dim4', () => {
    const result = tensorProduct(STATE_ZERO, STATE_ZERO)
    expect(result.dim).toBe(4)
  })

  it('dimension: dim2 x dim4 = dim8', () => {
    const result = tensorProduct(STATE_ZERO, basisState(4, 0))
    expect(result.dim).toBe(8)
  })

  it('dimension: dim4 x dim2 = dim8', () => {
    const result = tensorProduct(basisState(4, 0), STATE_ZERO)
    expect(result.dim).toBe(8)
  })
})

describe('Cauchy-Schwarz inequality', () => {
  it('|<u|v>|^2 <= <u|u><v|v> for 100 random vectors', () => {
    const rng = () => Math.random() * 2 - 1
    for (let trial = 0; trial < 100; trial++) {
      const dim = 4
      const u = vecFromArray(
        Array.from({ length: dim }, () => complex(rng(), rng()))
      )
      const v = vecFromArray(
        Array.from({ length: dim }, () => complex(rng(), rng()))
      )
      const ip = innerProduct(u, v)
      const lhs = cabsSq(ip)
      const rhs = innerProduct(u, u).re * innerProduct(v, v).re
      expect(lhs).toBeLessThanOrEqual(rhs + 1e-10)
    }
  })
})

describe('predefined states', () => {
  it('Bell Phi+ is normalized', () => {
    expect(vecNorm(BELL_PHI_PLUS)).toBeCloseTo(1, 12)
  })

  it('Bell Phi+ has correct amplitudes', () => {
    expect(BELL_PHI_PLUS.real[0]).toBeCloseTo(SQRT1_2, 12)
    expect(BELL_PHI_PLUS.real[1]).toBeCloseTo(0, 12)
    expect(BELL_PHI_PLUS.real[2]).toBeCloseTo(0, 12)
    expect(BELL_PHI_PLUS.real[3]).toBeCloseTo(SQRT1_2, 12)
  })
})
