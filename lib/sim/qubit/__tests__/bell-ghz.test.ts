/**
 * Bell pair and GHZ state tests from spec section 7.2.2.
 */

import { describe, it, expect } from 'vitest'
import { simulateGates, gate, expectAmplitude } from './helpers'

const S2 = Math.SQRT1_2

describe('Bell pair preparation', () => {
  it('H on q0 then CNOT(0,1) on |00> = (|00>+|11>)/sqrt(2)', () => {
    const r = simulateGates(2, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
    ])
    expectAmplitude(r.finalState, 0, S2, 0)  // |00>
    expectAmplitude(r.finalState, 1, 0, 0)   // |01>
    expectAmplitude(r.finalState, 2, 0, 0)   // |10>
    expectAmplitude(r.finalState, 3, S2, 0)  // |11>
  })

  it('creates Phi- with H, CNOT, Z', () => {
    const r = simulateGates(2, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
      gate('Z', [0], 2),
    ])
    // Phi- = (|00> - |11>) / sqrt(2)
    expectAmplitude(r.finalState, 0, S2, 0)
    expectAmplitude(r.finalState, 3, -S2, 0)
  })

  it('creates Psi+ with H, CNOT, X', () => {
    const r = simulateGates(2, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
      gate('X', [1], 2),
    ])
    // Psi+ = (|01> + |10>) / sqrt(2)
    expectAmplitude(r.finalState, 1, S2, 0)
    expectAmplitude(r.finalState, 2, S2, 0)
  })

  it('Bell pair Bloch vectors show entanglement (purity < 1)', () => {
    const r = simulateGates(2, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
    ])
    const finalSnapshot = r.snapshots[r.snapshots.length - 1]!
    for (const bv of finalSnapshot.blochVectors) {
      // Entangled qubits have purity ~0.5
      expect(bv.purity).toBeCloseTo(0.5, 1)
    }
  })
})

describe('GHZ state (3 qubits)', () => {
  it('H, CNOT(0,1), CNOT(0,2) on |000> = (|000>+|111>)/sqrt(2)', () => {
    const r = simulateGates(3, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
      gate('CNOT', [0, 2], 2),
    ])
    expectAmplitude(r.finalState, 0, S2, 0) // |000>
    expectAmplitude(r.finalState, 7, S2, 0) // |111>
    // All others zero
    for (let i = 1; i < 7; i++) {
      expectAmplitude(r.finalState, i, 0, 0)
    }
  })

  it('GHZ Bloch vectors: all qubits entangled', () => {
    const r = simulateGates(3, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
      gate('CNOT', [0, 2], 2),
    ])
    const finalSnapshot = r.snapshots[r.snapshots.length - 1]!
    for (const bv of finalSnapshot.blochVectors) {
      expect(bv.purity).toBeCloseTo(0.5, 1)
    }
  })
})

describe('GHZ state (4 qubits)', () => {
  it('H, CNOT chain on |0000> = (|0000>+|1111>)/sqrt(2)', () => {
    const r = simulateGates(4, [
      gate('H', [0], 0),
      gate('CNOT', [0, 1], 1),
      gate('CNOT', [0, 2], 2),
      gate('CNOT', [0, 3], 3),
    ])
    expectAmplitude(r.finalState, 0, S2, 0)  // |0000>
    expectAmplitude(r.finalState, 15, S2, 0) // |1111>
  })
})
