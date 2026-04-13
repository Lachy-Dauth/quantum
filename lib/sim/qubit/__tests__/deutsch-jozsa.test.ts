/**
 * Deutsch-Jozsa algorithm tests from spec section 7.2.2.
 *
 * n=1: 1 query qubit + 1 ancilla
 * n=2: 2 query qubits + 1 ancilla
 * n=3: 3 query qubits + 1 ancilla
 *
 * Constant oracle: f(x) = 0 or f(x) = 1 for all x → measure all 0s on query qubits
 * Balanced oracle: f(x) = 0 for half, 1 for other half → measure at least one 1
 */

import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'

function runDeutschJozsa(
  nQuery: number,
  oracleGates: { type: string; targets: number[]; column: number }[],
): number[] {
  const nTotal = nQuery + 1
  const ancilla = nQuery // Last qubit is ancilla

  const sim = new CircuitSimulator(nTotal, 42)

  // Step 1: Prepare ancilla in |1>
  sim.addGate({ type: 'X', targets: [ancilla], column: 0 })

  // Step 2: Apply H to all qubits
  for (let q = 0; q < nTotal; q++) {
    sim.addGate({ type: 'H', targets: [q], column: 1 })
  }

  // Step 3: Apply oracle
  for (const g of oracleGates) {
    sim.addGate({ type: g.type as any, targets: g.targets, column: g.column })
  }

  // Step 4: Apply H to query qubits
  const hCol = oracleGates.length > 0
    ? Math.max(...oracleGates.map(g => g.column)) + 1
    : 2
  for (let q = 0; q < nQuery; q++) {
    sim.addGate({ type: 'H', targets: [q], column: hCol })
  }

  // Simulate and check state before measurement
  const result = sim.simulate()
  const state = result.finalState

  // Check probability of measuring all 0s on query qubits
  // For constant oracle: should be ~1 (all amplitude in |0...0 x>)
  // For balanced oracle: should be ~0 (no amplitude in |0...0 x>)
  const outcomes: number[] = []
  for (let q = 0; q < nQuery; q++) {
    // Check probability of qubit q being 0
    let p0 = 0
    const bitPos = nTotal - 1 - q
    for (let i = 0; i < state.dim; i++) {
      if (((i >> bitPos) & 1) === 0) {
        p0 += state.real[i]! * state.real[i]! + state.imag[i]! * state.imag[i]!
      }
    }
    // If p0 ~ 1, outcome is 0; if p0 ~ 0, outcome is 1
    outcomes.push(p0 > 0.5 ? 0 : 1)
  }

  return outcomes
}

describe('Deutsch-Jozsa n=1', () => {
  // 2 qubits: q0 = query, q1 = ancilla

  it('constant oracle f(x)=0 → measure 0', () => {
    // No oracle gates (identity)
    const outcomes = runDeutschJozsa(1, [])
    expect(outcomes).toEqual([0])
  })

  it('constant oracle f(x)=1 → measure 0', () => {
    // Oracle: X on ancilla (flips ancilla for all inputs)
    const outcomes = runDeutschJozsa(1, [
      { type: 'X', targets: [1], column: 2 },
    ])
    expect(outcomes).toEqual([0])
  })

  it('balanced oracle f(x)=x → measure 1', () => {
    // Oracle: CNOT(q0, q1)
    const outcomes = runDeutschJozsa(1, [
      { type: 'CNOT', targets: [0, 1], column: 2 },
    ])
    expect(outcomes).toEqual([1])
  })

  it('balanced oracle f(x)=NOT(x) → measure 1', () => {
    // Oracle: X(q0), CNOT(q0, q1), X(q0)
    const outcomes = runDeutschJozsa(1, [
      { type: 'X', targets: [0], column: 2 },
      { type: 'CNOT', targets: [0, 1], column: 3 },
      { type: 'X', targets: [0], column: 4 },
    ])
    expect(outcomes).toEqual([1])
  })
})

describe('Deutsch-Jozsa n=2', () => {
  // 3 qubits: q0, q1 = query, q2 = ancilla

  it('constant oracle f(x)=0 → measure 00', () => {
    const outcomes = runDeutschJozsa(2, [])
    expect(outcomes).toEqual([0, 0])
  })

  it('balanced oracle: CNOT(q0, q2) → measure non-zero', () => {
    // f(x0, x1) = x0 (balanced)
    const outcomes = runDeutschJozsa(2, [
      { type: 'CNOT', targets: [0, 2], column: 2 },
    ])
    // At least one qubit measures 1
    expect(outcomes.some(o => o === 1)).toBe(true)
  })

  it('balanced oracle: CNOT(q1, q2) → measure non-zero', () => {
    // f(x0, x1) = x1 (balanced)
    const outcomes = runDeutschJozsa(2, [
      { type: 'CNOT', targets: [1, 2], column: 2 },
    ])
    expect(outcomes.some(o => o === 1)).toBe(true)
  })

  it('balanced oracle: CNOT(q0, q2), CNOT(q1, q2) → measure non-zero', () => {
    // f(x0, x1) = x0 XOR x1 (balanced)
    const outcomes = runDeutschJozsa(2, [
      { type: 'CNOT', targets: [0, 2], column: 2 },
      { type: 'CNOT', targets: [1, 2], column: 3 },
    ])
    expect(outcomes.some(o => o === 1)).toBe(true)
  })
})

describe('Deutsch-Jozsa n=3', () => {
  // 4 qubits: q0, q1, q2 = query, q3 = ancilla

  it('constant oracle → measure 000', () => {
    const outcomes = runDeutschJozsa(3, [])
    expect(outcomes).toEqual([0, 0, 0])
  })

  it('balanced oracle: CNOT(q0, q3) → measure non-zero', () => {
    const outcomes = runDeutschJozsa(3, [
      { type: 'CNOT', targets: [0, 3], column: 2 },
    ])
    expect(outcomes.some(o => o === 1)).toBe(true)
  })

  it('balanced oracle: CNOT(q0, q3), CNOT(q1, q3) → non-zero', () => {
    const outcomes = runDeutschJozsa(3, [
      { type: 'CNOT', targets: [0, 3], column: 2 },
      { type: 'CNOT', targets: [1, 3], column: 3 },
    ])
    expect(outcomes.some(o => o === 1)).toBe(true)
  })
})
