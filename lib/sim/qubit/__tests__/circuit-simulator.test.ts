/**
 * CircuitSimulator core API tests: construction, gate manipulation,
 * snapshots, batch runs, and circuit unitary.
 */

import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'
import { gate, expectAmplitude } from './helpers'
import { matMul, matIdentity } from '../../core/matrix'
import { adjoint } from '../../core/matrix'

const S2 = Math.SQRT1_2

describe('CircuitSimulator construction', () => {
  it('creates a simulator with default |0...0> state', () => {
    const sim = new CircuitSimulator(2)
    const result = sim.simulate()
    expectAmplitude(result.finalState, 0, 1, 0)
    expectAmplitude(result.finalState, 1, 0, 0)
    expectAmplitude(result.finalState, 2, 0, 0)
    expectAmplitude(result.finalState, 3, 0, 0)
  })

  it('throws for invalid qubit count', () => {
    expect(() => new CircuitSimulator(0)).toThrow()
    expect(() => new CircuitSimulator(7)).toThrow()
  })

  it('accepts 1-6 qubits', () => {
    for (let n = 1; n <= 6; n++) {
      const sim = new CircuitSimulator(n)
      expect(sim.numQubits).toBe(n)
    }
  })
})

describe('gate manipulation', () => {
  it('addGate returns a unique id', () => {
    const sim = new CircuitSimulator(2)
    const id1 = sim.addGate(gate('H', [0], 0))
    const id2 = sim.addGate(gate('X', [1], 0))
    expect(id1).not.toBe(id2)
  })

  it('removeGate removes a gate by id', () => {
    const sim = new CircuitSimulator(1)
    const id = sim.addGate(gate('X', [0], 0))
    sim.removeGate(id)
    const result = sim.simulate()
    // No X gate → still |0>
    expectAmplitude(result.finalState, 0, 1, 0)
  })

  it('moveGate changes column and targets', () => {
    const sim = new CircuitSimulator(2)
    const id = sim.addGate(gate('X', [0], 0))
    sim.moveGate(id, 1, [1])
    const result = sim.simulate()
    // X now on q1, col 1 → |01>
    expectAmplitude(result.finalState, 0, 0, 0)
    expectAmplitude(result.finalState, 1, 1, 0) // |01>
  })

  it('updateGateParams changes parameters', () => {
    const sim = new CircuitSimulator(1)
    const id = sim.addGate(gate('RX', [0], 0, { theta: 0 }))
    sim.updateGateParams(id, { theta: Math.PI })
    const result = sim.simulate()
    // Rx(pi)|0> = -i|1>
    expectAmplitude(result.finalState, 0, 0, 0)
    expectAmplitude(result.finalState, 1, 0, -1)
  })

  it('clearCircuit removes all gates', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('X', [0], 0))
    sim.addGate(gate('H', [0], 1))
    sim.clearCircuit()
    const result = sim.simulate()
    expectAmplitude(result.finalState, 0, 1, 0) // back to |0>
  })
})

describe('setInitialState', () => {
  it('accepts ket string', () => {
    const sim = new CircuitSimulator(1)
    sim.setInitialState('|1>')
    const result = sim.simulate()
    expectAmplitude(result.finalState, 0, 0, 0)
    expectAmplitude(result.finalState, 1, 1, 0)
  })

  it('accepts named state', () => {
    const sim = new CircuitSimulator(2)
    sim.setInitialState('bell_phi_plus')
    const result = sim.simulate()
    expectAmplitude(result.finalState, 0, S2, 0)
    expectAmplitude(result.finalState, 3, S2, 0)
  })
})

describe('snapshots', () => {
  it('produces snapshots for each column + initial', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('X', [0], 1))
    const result = sim.simulate()
    // 3 snapshots: initial (col 0), after col 0, after col 1
    expect(result.snapshots.length).toBe(3)
    expect(result.snapshots[0]!.column).toBe(0)
    expect(result.snapshots[1]!.column).toBe(1)
    expect(result.snapshots[2]!.column).toBe(2)
  })

  it('getStateAtStep returns correct snapshot', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    sim.simulate()

    const initial = sim.getStateAtStep(0)
    expectAmplitude(initial.state, 0, 1, 0)

    const afterH = sim.getStateAtStep(1)
    expectAmplitude(afterH.state, 0, S2, 0)
    expectAmplitude(afterH.state, 1, S2, 0)
  })

  it('snapshots include Bloch vectors', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    sim.simulate()

    const afterH = sim.getStateAtStep(1)
    expect(afterH.blochVectors.length).toBe(1)
    // |+> is on the equator: x≈1, y≈0, z≈0
    expect(afterH.blochVectors[0]!.x).toBeCloseTo(1, 5)
    expect(afterH.blochVectors[0]!.z).toBeCloseTo(0, 5)
    expect(afterH.blochVectors[0]!.purity).toBeCloseTo(1, 5)
  })

  it('throws for out-of-range step', () => {
    const sim = new CircuitSimulator(1)
    sim.simulate()
    expect(() => sim.getStateAtStep(-1)).toThrow()
    expect(() => sim.getStateAtStep(5)).toThrow()
  })
})

describe('measurement', () => {
  it('records measurement outcomes in snapshot', () => {
    const sim = new CircuitSimulator(1, 42)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('MEASURE', [0], 1))
    const result = sim.simulate()
    const snap = result.snapshots[2]!
    expect(snap.measurementOutcomes).toBeDefined()
    expect(snap.measurementOutcomes!.has(0)).toBe(true)
    const outcome = snap.measurementOutcomes!.get(0)!
    expect(outcome === 0 || outcome === 1).toBe(true)
  })

  it('collapses state on measurement', () => {
    const sim = new CircuitSimulator(1, 42)
    sim.addGate(gate('MEASURE', [0], 0))
    const result = sim.simulate()
    // |0> measured → always 0
    const snap = result.snapshots[1]!
    expect(snap.measurementOutcomes!.get(0)).toBe(0)
    expectAmplitude(result.finalState, 0, 1, 0)
  })
})

describe('batchRun', () => {
  it('collects measurement statistics', () => {
    const sim = new CircuitSimulator(1, 42)
    sim.addGate(gate('H', [0], 0))
    const batch = sim.batchRun(1000)
    expect(batch.totalRuns).toBe(1000)
    const count0 = batch.counts.get('0') ?? 0
    const count1 = batch.counts.get('1') ?? 0
    expect(count0 + count1).toBe(1000)
    // H|0> = |+> → roughly 50/50
    expect(count0).toBeGreaterThan(400)
    expect(count1).toBeGreaterThan(400)
  })

  it('Bell state batch gives correlated outcomes', () => {
    const sim = new CircuitSimulator(2, 42)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('CNOT', [0, 1], 1))
    const batch = sim.batchRun(1000)
    // Only |00> and |11> should appear
    const count00 = batch.counts.get('00') ?? 0
    const count11 = batch.counts.get('11') ?? 0
    const count01 = batch.counts.get('01') ?? 0
    const count10 = batch.counts.get('10') ?? 0
    expect(count00 + count11).toBe(1000)
    expect(count01).toBe(0)
    expect(count10).toBe(0)
  })

  it('deterministic state gives deterministic batch', () => {
    const sim = new CircuitSimulator(1, 42)
    // No gates → |0> → always measure 0
    const batch = sim.batchRun(100)
    expect(batch.counts.get('0')).toBe(100)
  })
})

describe('getCircuitUnitary', () => {
  it('returns identity for empty circuit', () => {
    const sim = new CircuitSimulator(1)
    const U = sim.getCircuitUnitary()
    expect(U.rows).toBe(2)
    expect(U.cols).toBe(2)
    expect(U.real[0]).toBeCloseTo(1, 10) // U[0][0]
    expect(U.real[3]).toBeCloseTo(1, 10) // U[1][1]
  })

  it('H circuit unitary is the H matrix', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    const U = sim.getCircuitUnitary()
    expect(U.real[0]).toBeCloseTo(S2, 10)
    expect(U.real[1]).toBeCloseTo(S2, 10)
    expect(U.real[2]).toBeCloseTo(S2, 10)
    expect(U.real[3]).toBeCloseTo(-S2, 10)
  })

  it('circuit unitary is unitary (U*U† = I)', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('CNOT', [0, 1], 1))
    sim.addGate(gate('S', [1], 2))

    const U = sim.getCircuitUnitary()
    const Udagger = adjoint(U)
    const product = matMul(U, Udagger)

    const I = matIdentity(4)
    for (let i = 0; i < 16; i++) {
      expect(product.real[i]).toBeCloseTo(I.real[i]!, 8)
      expect(product.imag[i]).toBeCloseTo(I.imag[i]!, 8)
    }
  })
})

describe('barrier gate', () => {
  it('barrier does not change state', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('BARRIER', [0], 1))
    const result = sim.simulate()
    expectAmplitude(result.finalState, 0, S2, 0)
    expectAmplitude(result.finalState, 1, S2, 0)
  })
})
