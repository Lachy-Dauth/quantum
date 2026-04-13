import { describe, it, expect } from 'vitest'
import { createPotential, POTENTIAL_CONFIGS } from '../potentials'
import type { PotentialType } from '../types'

function makeGrid(N: number, xMin: number, xMax: number): Float64Array {
  const x = new Float64Array(N)
  const dx = (xMax - xMin) / (N - 1)
  for (let i = 0; i < N; i++) x[i] = xMin + i * dx
  return x
}

describe('potentials', () => {
  const N = 101
  const x = makeGrid(N, -5, 5)

  it('infinite_well returns zero everywhere', () => {
    const p = createPotential('infinite_well', x)
    expect(p.type).toBe('infinite_well')
    expect(p.label).toBe('Infinite Square Well')
    for (let i = 0; i < N; i++) {
      expect(p.values[i]).toBe(0)
    }
  })

  it('harmonic oscillator V = 0.5 * omega^2 * x^2', () => {
    const omega = 2
    const p = createPotential('harmonic', x, { omega })
    for (let i = 0; i < N; i++) {
      expect(p.values[i]).toBeCloseTo(0.5 * omega * omega * x[i]! * x[i]!, 10)
    }
  })

  it('finite_well is -V0 inside [-L/2, L/2], 0 outside', () => {
    const V0 = 3
    const L = 4
    const p = createPotential('finite_well', x, { V0, L })
    for (let i = 0; i < N; i++) {
      if (Math.abs(x[i]!) < L / 2) {
        expect(p.values[i]).toBe(-V0)
      } else if (Math.abs(x[i]!) > L / 2) {
        expect(p.values[i]).toBe(0)
      }
    }
  })

  it('step potential is V0 for x >= 0, 0 for x < 0', () => {
    const V0 = 7
    const p = createPotential('step', x, { V0 })
    for (let i = 0; i < N; i++) {
      if (x[i]! >= 0) expect(p.values[i]).toBe(V0)
      else expect(p.values[i]).toBe(0)
    }
  })

  it('barrier potential is V0 inside [-w/2, w/2], 0 outside', () => {
    const V0 = 10
    const width = 2
    const p = createPotential('barrier', x, { V0, width })
    for (let i = 0; i < N; i++) {
      if (Math.abs(x[i]!) < width / 2) {
        expect(p.values[i]).toBe(V0)
      } else if (Math.abs(x[i]!) > width / 2) {
        expect(p.values[i]).toBe(0)
      }
    }
  })

  it('double_well V = a*(x^2 - b)^2', () => {
    const a = 0.1
    const b = 4
    const p = createPotential('double_well', x, { a, b })
    for (let i = 0; i < N; i++) {
      const t = x[i]! * x[i]! - b
      expect(p.values[i]).toBeCloseTo(a * t * t, 10)
    }
    // Should have two minima at x = ±√b
    const sqrtB = Math.sqrt(b)
    const iMin1 = Math.round((sqrtB - (-5)) / (10 / (N - 1)))
    const iMin2 = Math.round((-sqrtB - (-5)) / (10 / (N - 1)))
    expect(p.values[iMin1]).toBeCloseTo(0, 1)
    expect(p.values[iMin2]).toBeCloseTo(0, 1)
  })

  it('custom returns zero by default', () => {
    const p = createPotential('custom', x)
    for (let i = 0; i < N; i++) {
      expect(p.values[i]).toBe(0)
    }
  })

  it('uses default params when none provided', () => {
    const allTypes: PotentialType[] = [
      'infinite_well', 'finite_well', 'harmonic', 'step', 'barrier', 'double_well', 'custom',
    ]
    for (const type of allTypes) {
      const p = createPotential(type, x)
      expect(p.type).toBe(type)
      expect(p.values.length).toBe(N)
      expect(p.params).toEqual(POTENTIAL_CONFIGS[type].defaultParams)
    }
  })

  it('merges custom params with defaults', () => {
    const p = createPotential('finite_well', x, { V0: 99 })
    expect(p.params.V0).toBe(99)
    expect(p.params.L).toBe(4) // default
  })
})
