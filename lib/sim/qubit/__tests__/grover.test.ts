/**
 * 3-qubit Grover search test from spec section 7.2.2.
 *
 * Target: |101> (index 5)
 * 1 iteration: expected target amplitude ~0.8839, probability ~0.7813
 */

import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'

describe('3-qubit Grover (1 iteration)', () => {
  it('amplifies |101> to ~0.8839 amplitude', () => {
    const sim = new CircuitSimulator(3, 42)

    let col = 0

    // Step 1: H on all qubits → uniform superposition
    sim.addGate({ type: 'H', targets: [0], column: col })
    sim.addGate({ type: 'H', targets: [1], column: col })
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++

    // Step 2: Oracle — flip phase of |101>
    // |101> means q0=1, q1=0, q2=1
    // To select when q1=0, apply X to q1 before and after Toffoli
    sim.addGate({ type: 'X', targets: [1], column: col })
    col++

    // CCZ = Toffoli with phase. We implement via H(q2), Toffoli(q0,q1,q2), H(q2)
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++
    sim.addGate({ type: 'TOFFOLI', targets: [0, 1, 2], column: col })
    col++
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++

    // Undo the X on q1
    sim.addGate({ type: 'X', targets: [1], column: col })
    col++

    // Step 3: Diffusion operator (2|s><s| - I)
    // H on all
    sim.addGate({ type: 'H', targets: [0], column: col })
    sim.addGate({ type: 'H', targets: [1], column: col })
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++

    // X on all
    sim.addGate({ type: 'X', targets: [0], column: col })
    sim.addGate({ type: 'X', targets: [1], column: col })
    sim.addGate({ type: 'X', targets: [2], column: col })
    col++

    // CCZ (multi-controlled Z) = H(q2), Toffoli(q0,q1,q2), H(q2)
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++
    sim.addGate({ type: 'TOFFOLI', targets: [0, 1, 2], column: col })
    col++
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++

    // X on all
    sim.addGate({ type: 'X', targets: [0], column: col })
    sim.addGate({ type: 'X', targets: [1], column: col })
    sim.addGate({ type: 'X', targets: [2], column: col })
    col++

    // H on all
    sim.addGate({ type: 'H', targets: [0], column: col })
    sim.addGate({ type: 'H', targets: [1], column: col })
    sim.addGate({ type: 'H', targets: [2], column: col })
    col++

    const result = sim.simulate()
    const state = result.finalState

    // |101> = index 5 (q0=1, q1=0, q2=1 → binary 101 = 5)
    const targetAmp = Math.hypot(state.real[5]!, state.imag[5]!)
    const targetProb = targetAmp * targetAmp

    // Expected: amplitude ~0.8839, probability ~0.7813
    expect(targetAmp).toBeCloseTo(0.8839, 2)
    expect(targetProb).toBeCloseTo(0.7813, 2)

    // Non-target amplitudes should be ~0.1768
    for (let i = 0; i < 8; i++) {
      if (i === 5) continue
      const amp = Math.hypot(state.real[i]!, state.imag[i]!)
      expect(amp).toBeCloseTo(0.1768, 2)
    }
  })
})
