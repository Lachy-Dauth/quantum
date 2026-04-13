import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'
import { generateAlgebra } from '../algebra'
import { gate } from './helpers'

describe('generateAlgebra', () => {
  it('generates LaTeX for H|0>', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps.length).toBe(1)
    expect(steps[0]!.column).toBe(0)
    // Should contain H and ket notation
    expect(steps[0]!.latex).toContain('H')
    expect(steps[0]!.latex).toContain('\\rangle')
  })

  it('generates tensor product notation for multi-qubit', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('H', [0], 0))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps.length).toBe(1)
    // Should show H ⊗ I
    expect(steps[0]!.latex).toContain('\\otimes')
  })

  it('generates steps for multi-column circuit', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('CNOT', [0, 1], 1))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps.length).toBe(2)
    expect(steps[0]!.column).toBe(0)
    expect(steps[1]!.column).toBe(1)
    expect(steps[1]!.latex).toContain('CNOT')
  })

  it('expanded form includes matrix', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps[0]!.latexExpanded).toContain('\\begin{pmatrix}')
  })

  it('handles parameterised gates', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('RX', [0], 0, { theta: Math.PI / 2 }))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps[0]!.latex).toContain('R_x')
  })

  it('handles measurement gates', () => {
    const sim = new CircuitSimulator(1, 42)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('MEASURE', [0], 1))
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)

    expect(steps.length).toBe(2)
    expect(steps[1]!.latex).toContain('M')
  })

  it('returns empty for empty circuit', () => {
    const sim = new CircuitSimulator(1)
    const result = sim.simulate()
    const steps = generateAlgebra(sim.circuit, result.snapshots)
    expect(steps.length).toBe(0)
  })
})
