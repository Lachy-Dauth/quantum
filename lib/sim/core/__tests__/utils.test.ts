import { describe, it, expect } from 'vitest'
import {
  stateToBloch, blochToState, reducedBlochVector,
  createRng, formatComplex, formatStateKet,
} from '../utils'
import {
  STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS,
  STATE_PLUS_I, STATE_MINUS_I,
  BELL_PHI_PLUS, vecFromArray, vecNorm,
} from '../vector'
import { complex } from '../complex'

describe('stateToBloch', () => {
  it('|0> = north pole (0, 0, 1)', () => {
    const { x, y, z } = stateToBloch(STATE_ZERO)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(1, 10)
  })

  it('|1> = south pole (0, 0, -1)', () => {
    const { x, y, z } = stateToBloch(STATE_ONE)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(-1, 10)
  })

  it('|+> = (1, 0, 0)', () => {
    const { x, y, z } = stateToBloch(STATE_PLUS)
    expect(x).toBeCloseTo(1, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(0, 10)
  })

  it('|-> = (-1, 0, 0)', () => {
    const { x, y, z } = stateToBloch(STATE_MINUS)
    expect(x).toBeCloseTo(-1, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(0, 10)
  })

  it('|+i> = (0, 1, 0)', () => {
    const { x, y, z } = stateToBloch(STATE_PLUS_I)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(1, 10)
    expect(z).toBeCloseTo(0, 10)
  })

  it('|-i> = (0, -1, 0)', () => {
    const { x, y, z } = stateToBloch(STATE_MINUS_I)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(-1, 10)
    expect(z).toBeCloseTo(0, 10)
  })

  it('throws for non-2D state', () => {
    expect(() => stateToBloch(vecFromArray([complex(1), complex(0), complex(0), complex(0)]))).toThrow()
  })
})

describe('blochToState', () => {
  it('north pole -> |0>', () => {
    const state = blochToState(0, 0, 1)
    // Up to global phase, should match |0>
    const { x, y, z } = stateToBloch(state)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(1, 10)
  })

  it('south pole -> |1>', () => {
    const state = blochToState(0, 0, -1)
    const { x, y, z } = stateToBloch(state)
    expect(x).toBeCloseTo(0, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(-1, 10)
  })

  it('+x axis -> |+>', () => {
    const state = blochToState(1, 0, 0)
    const { x, y, z } = stateToBloch(state)
    expect(x).toBeCloseTo(1, 10)
    expect(y).toBeCloseTo(0, 10)
    expect(z).toBeCloseTo(0, 10)
  })

  it('round-trip: state -> bloch -> state preserves Bloch coords', () => {
    const original = vecFromArray([
      complex(0.8, 0.2),
      complex(0.3, 0.4),
    ])
    // Normalize
    const n = vecNorm(original)
    const normed = vecFromArray([
      complex(original.real[0]! / n, original.imag[0]! / n),
      complex(original.real[1]! / n, original.imag[1]! / n),
    ])
    const bloch = stateToBloch(normed)
    const recovered = blochToState(bloch.x, bloch.y, bloch.z)
    const bloch2 = stateToBloch(recovered)
    expect(bloch2.x).toBeCloseTo(bloch.x, 8)
    expect(bloch2.y).toBeCloseTo(bloch.y, 8)
    expect(bloch2.z).toBeCloseTo(bloch.z, 8)
  })

  it('produces normalized state', () => {
    const state = blochToState(0.5, 0.3, 0.8)
    expect(vecNorm(state)).toBeCloseTo(1, 10)
  })
})

describe('reducedBlochVector', () => {
  it('Bell Phi+: each qubit is maximally mixed (purity=0.5)', () => {
    const r0 = reducedBlochVector(BELL_PHI_PLUS, 2, 0)
    expect(r0.x).toBeCloseTo(0, 8)
    expect(r0.y).toBeCloseTo(0, 8)
    expect(r0.z).toBeCloseTo(0, 8)
    expect(r0.purity).toBeCloseTo(0.5, 8)

    const r1 = reducedBlochVector(BELL_PHI_PLUS, 2, 1)
    expect(r1.x).toBeCloseTo(0, 8)
    expect(r1.y).toBeCloseTo(0, 8)
    expect(r1.z).toBeCloseTo(0, 8)
    expect(r1.purity).toBeCloseTo(0.5, 8)
  })

  it('product state |0>|+>: qubit 0 is pure |0>, qubit 1 is pure |+>', () => {
    const state = vecFromArray([
      complex(Math.SQRT1_2), complex(Math.SQRT1_2), complex(0), complex(0),
    ])
    const r0 = reducedBlochVector(state, 2, 0)
    expect(r0.z).toBeCloseTo(1, 8) // |0>
    expect(r0.purity).toBeCloseTo(1, 8)

    const r1 = reducedBlochVector(state, 2, 1)
    expect(r1.x).toBeCloseTo(1, 8) // |+>
    expect(r1.purity).toBeCloseTo(1, 8)
  })
})

describe('createRng', () => {
  it('produces values in [0, 1)', () => {
    const rng = createRng(42)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('is reproducible (same seed = same sequence)', () => {
    const rng1 = createRng(123)
    const rng2 = createRng(123)
    for (let i = 0; i < 100; i++) {
      expect(rng1()).toBe(rng2())
    }
  })

  it('different seeds produce different sequences', () => {
    const rng1 = createRng(1)
    const rng2 = createRng(2)
    let sameCount = 0
    for (let i = 0; i < 100; i++) {
      if (rng1() === rng2()) sameCount++
    }
    expect(sameCount).toBeLessThan(5)
  })

  it('has reasonable uniformity', () => {
    const rng = createRng(12345)
    const buckets = new Array(10).fill(0)
    const n = 10000
    for (let i = 0; i < n; i++) {
      const bucket = Math.floor(rng() * 10)
      buckets[bucket]++
    }
    // Each bucket should be roughly n/10 = 1000
    for (const count of buckets) {
      expect(count).toBeGreaterThan(800)
      expect(count).toBeLessThan(1200)
    }
  })
})

describe('formatComplex', () => {
  it('formats zero', () => {
    expect(formatComplex(complex(0, 0))).toBe('0')
  })

  it('formats pure real', () => {
    expect(formatComplex(complex(1, 0))).toBe('1')
    expect(formatComplex(complex(-2.5, 0))).toBe('-2.5')
  })

  it('formats pure imaginary', () => {
    expect(formatComplex(complex(0, 1))).toBe('i')
    expect(formatComplex(complex(0, -1))).toBe('-i')
    expect(formatComplex(complex(0, 2))).toBe('2i')
  })

  it('formats general complex', () => {
    const result = formatComplex(complex(0.707, 0.707))
    expect(result).toBe('0.707 + 0.707i')
  })

  it('formats negative imaginary part', () => {
    const result = formatComplex(complex(1, -2))
    expect(result).toBe('1 - 2i')
  })

  it('respects precision', () => {
    expect(formatComplex(complex(0.12345, 0), 2)).toBe('0.12')
  })
})

describe('formatStateKet', () => {
  it('formats |0>', () => {
    expect(formatStateKet(STATE_ZERO, 1)).toBe('1|0>')
  })

  it('formats |1>', () => {
    expect(formatStateKet(STATE_ONE, 1)).toBe('1|1>')
  })

  it('formats Bell Phi+', () => {
    const result = formatStateKet(BELL_PHI_PLUS, 2)
    expect(result).toContain('|00>')
    expect(result).toContain('|11>')
    expect(result).toContain('0.707')
  })

  it('omits near-zero amplitudes', () => {
    const result = formatStateKet(STATE_ZERO, 1)
    expect(result).not.toContain('|1>')
  })
})
