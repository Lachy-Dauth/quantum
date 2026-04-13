import { describe, it, expect } from 'vitest'
import { eigenstateUp, eigenstateDown } from '../sg-simulator'
import { innerProduct, STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS, STATE_PLUS_I, STATE_MINUS_I } from '../../core/vector'

function expectClose(actual: number, expected: number, eps = 1e-10) {
  expect(Math.abs(actual - expected)).toBeLessThan(eps)
}

function probUp(state: { dim: number; real: Float64Array; imag: Float64Array }, theta: number, phi: number): number {
  const up = eigenstateUp(theta, phi)
  const overlap = innerProduct(up, state)
  return overlap.re * overlap.re + overlap.im * overlap.im
}

describe('eigenstateUp / eigenstateDown', () => {
  it('Z-axis eigenstates match |0> and |1>', () => {
    const up = eigenstateUp(0, 0) // theta=0 => |0>
    const down = eigenstateDown(0, 0) // theta=0 => |1>

    expectClose(up.real[0]!, 1)
    expectClose(up.real[1]!, 0)
    expectClose(down.real[0]!, 0)
    // down should be -|1> or |1> up to phase
    expect(Math.abs(down.real[1]!) + Math.abs(down.imag[1]!)).toBeGreaterThan(0.99)
  })

  it('X-axis eigenstates match |+> and |->', () => {
    const up = eigenstateUp(Math.PI / 2, 0) // |+x> = (|0>+|1>)/√2
    const down = eigenstateDown(Math.PI / 2, 0) // |-x> = (|0>-|1>)/√2
    const s2 = Math.SQRT1_2

    expectClose(up.real[0]!, s2)
    expectClose(up.real[1]!, s2)
    expectClose(down.real[0]!, s2)
    expectClose(down.real[1]!, -s2)
  })

  it('Y-axis eigenstates are correct', () => {
    const up = eigenstateUp(Math.PI / 2, Math.PI / 2) // |+y>
    const s2 = Math.SQRT1_2

    expectClose(up.real[0]!, s2)
    expectClose(up.imag[1]!, s2) // e^{i*pi/2} * sin(pi/4) = i * 1/√2
    expectClose(up.real[1]!, 0)
  })

  it('eigenstates are orthonormal', () => {
    for (const theta of [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, Math.PI]) {
      for (const phi of [0, Math.PI / 4, Math.PI / 2, Math.PI]) {
        const up = eigenstateUp(theta, phi)
        const down = eigenstateDown(theta, phi)

        // Normalized
        const normUp = innerProduct(up, up)
        const normDown = innerProduct(down, down)
        expectClose(normUp.re, 1)
        expectClose(normDown.re, 1)

        // Orthogonal
        const overlap = innerProduct(up, down)
        expectClose(overlap.re * overlap.re + overlap.im * overlap.im, 0, 1e-9)
      }
    }
  })
})

describe('measurement probabilities', () => {
  it('Z-measure |+z>: P(up)=1', () => {
    expectClose(probUp(STATE_ZERO, 0, 0), 1)
  })

  it('Z-measure |-z>: P(up)=0', () => {
    expectClose(probUp(STATE_ONE, 0, 0), 0)
  })

  it('X-measure |+z>: P(up)=0.5', () => {
    expectClose(probUp(STATE_ZERO, Math.PI / 2, 0), 0.5)
  })

  it('X-measure |+x>: P(up)=1', () => {
    expectClose(probUp(STATE_PLUS, Math.PI / 2, 0), 1)
  })

  it('Y-measure |+z>: P(up)=0.5', () => {
    expectClose(probUp(STATE_ZERO, Math.PI / 2, Math.PI / 2), 0.5)
  })

  it('theta=pi/3: P(up) = cos²(pi/6) = 3/4', () => {
    expectClose(probUp(STATE_ZERO, Math.PI / 3, 0), 0.75)
  })

  it('theta=pi/2: P(up) = 1/2', () => {
    expectClose(probUp(STATE_ZERO, Math.PI / 2, 0), 0.5)
  })

  it('theta=pi (=-z): P(up) = 0', () => {
    expectClose(probUp(STATE_ZERO, Math.PI, 0), 0)
  })
})
