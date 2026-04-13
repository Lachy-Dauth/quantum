/**
 * Shared test helpers for qubit simulator tests.
 */

import { expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'
import type { Gate } from '../types'
import type { StateVector } from '../../core/types'

const eps = 1e-10

/** Assert two state vectors are element-wise close. */
export function expectStateClose(a: StateVector, b: StateVector, tolerance = eps) {
  expect(a.dim).toBe(b.dim)
  for (let i = 0; i < a.dim; i++) {
    expect(a.real[i]).toBeCloseTo(b.real[i]!, tolerance)
    expect(a.imag[i]).toBeCloseTo(b.imag[i]!, tolerance)
  }
}

/** Assert a specific amplitude (re + i*im) at a given basis index. */
export function expectAmplitude(
  state: StateVector,
  index: number,
  re: number,
  im: number,
  tolerance = eps,
) {
  expect(state.real[index]).toBeCloseTo(re, tolerance)
  expect(state.imag[index]).toBeCloseTo(im, tolerance)
}

/** Create a simulator, add gates, simulate, and return the result. */
export function simulateGates(numQubits: number, gates: Omit<Gate, 'id'>[], seed?: number) {
  const sim = new CircuitSimulator(numQubits, seed)
  for (const g of gates) {
    sim.addGate(g)
  }
  return sim.simulate()
}

/** Shorthand to make a gate object without id. */
export function gate(
  type: Gate['type'],
  targets: number[],
  column: number,
  params?: Gate['params'],
): Omit<Gate, 'id'> {
  return { type, targets, column, params }
}
