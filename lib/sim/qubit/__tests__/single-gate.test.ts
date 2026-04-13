/**
 * Single-gate application tests from spec section 7.2.1.
 */

import { describe, it, expect } from 'vitest'
import { simulateGates, gate, expectAmplitude } from './helpers'

const S2 = Math.SQRT1_2

describe('single-gate tests (spec 7.2.1)', () => {
  it('X|0> = |1>', () => {
    const r = simulateGates(1, [gate('X', [0], 0)])
    expectAmplitude(r.finalState, 0, 0, 0)
    expectAmplitude(r.finalState, 1, 1, 0)
  })

  it('Y|0> = i|1>', () => {
    const r = simulateGates(1, [gate('Y', [0], 0)])
    expectAmplitude(r.finalState, 0, 0, 0)
    expectAmplitude(r.finalState, 1, 0, 1)
  })

  it('Z|0> = |0>', () => {
    const r = simulateGates(1, [gate('Z', [0], 0)])
    expectAmplitude(r.finalState, 0, 1, 0)
    expectAmplitude(r.finalState, 1, 0, 0)
  })

  it('H|0> = |+>', () => {
    const r = simulateGates(1, [gate('H', [0], 0)])
    expectAmplitude(r.finalState, 0, S2, 0)
    expectAmplitude(r.finalState, 1, S2, 0)
  })

  it('S|1> = i|1>', () => {
    const sim = simulateGates(1, [gate('X', [0], 0), gate('S', [0], 1)])
    expectAmplitude(sim.finalState, 0, 0, 0)
    expectAmplitude(sim.finalState, 1, 0, 1)
  })

  it('T|1> = e^{ipi/4}|1>', () => {
    const sim = simulateGates(1, [gate('X', [0], 0), gate('T', [0], 1)])
    expectAmplitude(sim.finalState, 0, 0, 0)
    expectAmplitude(sim.finalState, 1, S2, S2)
  })

  it('Rx(pi)|0> = -i|1>', () => {
    const r = simulateGates(1, [gate('RX', [0], 0, { theta: Math.PI })])
    expectAmplitude(r.finalState, 0, 0, 0)
    expectAmplitude(r.finalState, 1, 0, -1)
  })

  it('Ry(pi)|0> = |1>', () => {
    const r = simulateGates(1, [gate('RY', [0], 0, { theta: Math.PI })])
    expectAmplitude(r.finalState, 0, 0, 0)
    expectAmplitude(r.finalState, 1, 1, 0)
  })

  it('Rz(pi)|0> = -i|0> (global phase)', () => {
    const r = simulateGates(1, [gate('RZ', [0], 0, { theta: Math.PI })])
    // Rz(pi)|0> = e^{-ipi/2}|0> = -i|0>
    expectAmplitude(r.finalState, 0, 0, -1)
    expectAmplitude(r.finalState, 1, 0, 0)
  })

  it('Rx(pi/2)|0> = [1/sqrt(2), -i/sqrt(2)]', () => {
    const r = simulateGates(1, [gate('RX', [0], 0, { theta: Math.PI / 2 })])
    expectAmplitude(r.finalState, 0, S2, 0)
    expectAmplitude(r.finalState, 1, 0, -S2)
  })

  it('H applied to qubit 1 in 2-qubit system', () => {
    const r = simulateGates(2, [gate('H', [1], 0)])
    // |00> -> |0+> = (|00> + |01>) / sqrt(2)
    expectAmplitude(r.finalState, 0, S2, 0) // |00>
    expectAmplitude(r.finalState, 1, S2, 0) // |01>
    expectAmplitude(r.finalState, 2, 0, 0)  // |10>
    expectAmplitude(r.finalState, 3, 0, 0)  // |11>
  })

  it('X applied to qubit 0 in 2-qubit system', () => {
    const r = simulateGates(2, [gate('X', [0], 0)])
    // |00> -> |10>
    expectAmplitude(r.finalState, 0, 0, 0) // |00>
    expectAmplitude(r.finalState, 1, 0, 0) // |01>
    expectAmplitude(r.finalState, 2, 1, 0) // |10>
    expectAmplitude(r.finalState, 3, 0, 0) // |11>
  })

  it('Z|1> = -|1>', () => {
    const sim = simulateGates(1, [gate('X', [0], 0), gate('Z', [0], 1)])
    expectAmplitude(sim.finalState, 0, 0, 0)
    expectAmplitude(sim.finalState, 1, -1, 0)
  })

  it('H|1> = |-> = (|0> - |1>)/sqrt(2)', () => {
    const sim = simulateGates(1, [gate('X', [0], 0), gate('H', [0], 1)])
    expectAmplitude(sim.finalState, 0, S2, 0)
    expectAmplitude(sim.finalState, 1, -S2, 0)
  })

  it('HH = I', () => {
    const r = simulateGates(1, [gate('H', [0], 0), gate('H', [0], 1)])
    expectAmplitude(r.finalState, 0, 1, 0)
    expectAmplitude(r.finalState, 1, 0, 0)
  })

  it('XX = I', () => {
    const r = simulateGates(1, [gate('X', [0], 0), gate('X', [0], 1)])
    expectAmplitude(r.finalState, 0, 1, 0)
    expectAmplitude(r.finalState, 1, 0, 0)
  })
})
