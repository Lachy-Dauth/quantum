import { describe, it, expect } from 'vitest'
import { applyGate, buildFullOperator } from '../gate-apply'
import {
  PAULI_X, PAULI_Y, PAULI_Z,
  GATE_H, GATE_S, GATE_T, GATE_CNOT, GATE_TOFFOLI,
  gateRx, gateRy, gateRz,
} from '../gates'
import { matMul, matIdentity } from '../matrix'
import {
  STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS,
  basisState, vecFromArray, tensorProduct,
} from '../vector'
import { complex } from '../complex'
import { expectStateVec, expectMatrix } from './helpers'
import type { StateVector } from '../types'

const SQRT1_2 = Math.SQRT1_2

// Helper: create n-qubit basis state |bits>
function nQubitBasis(numQubits: number, index: number): StateVector {
  return basisState(1 << numQubits, index)
}

describe('single-qubit gate application', () => {
  it('X|0> = |1>', () => {
    const result = applyGate(PAULI_X, [0], 1, STATE_ZERO)
    expectStateVec(result, STATE_ONE)
  })

  it('X|1> = |0>', () => {
    const result = applyGate(PAULI_X, [0], 1, STATE_ONE)
    expectStateVec(result, STATE_ZERO)
  })

  it('Y|0> = i|1>', () => {
    const result = applyGate(PAULI_Y, [0], 1, STATE_ZERO)
    expectStateVec(result, vecFromArray([complex(0), complex(0, 1)]))
  })

  it('Y|1> = -i|0>', () => {
    const result = applyGate(PAULI_Y, [0], 1, STATE_ONE)
    expectStateVec(result, vecFromArray([complex(0, -1), complex(0)]))
  })

  it('Z|0> = |0>', () => {
    const result = applyGate(PAULI_Z, [0], 1, STATE_ZERO)
    expectStateVec(result, STATE_ZERO)
  })

  it('Z|1> = -|1>', () => {
    const result = applyGate(PAULI_Z, [0], 1, STATE_ONE)
    expectStateVec(result, vecFromArray([complex(0), complex(-1)]))
  })

  it('H|0> = |+>', () => {
    const result = applyGate(GATE_H, [0], 1, STATE_ZERO)
    expectStateVec(result, STATE_PLUS)
  })

  it('H|1> = |->', () => {
    const result = applyGate(GATE_H, [0], 1, STATE_ONE)
    expectStateVec(result, STATE_MINUS)
  })

  it('H|+> = |0>', () => {
    const result = applyGate(GATE_H, [0], 1, STATE_PLUS)
    expectStateVec(result, STATE_ZERO)
  })

  it('S|0> = |0>', () => {
    const result = applyGate(GATE_S, [0], 1, STATE_ZERO)
    expectStateVec(result, STATE_ZERO)
  })

  it('S|1> = i|1>', () => {
    const result = applyGate(GATE_S, [0], 1, STATE_ONE)
    expectStateVec(result, vecFromArray([complex(0), complex(0, 1)]))
  })

  it('T|0> = |0>', () => {
    const result = applyGate(GATE_T, [0], 1, STATE_ZERO)
    expectStateVec(result, STATE_ZERO)
  })

  it('T|1> = e^{i*pi/4}|1>', () => {
    const result = applyGate(GATE_T, [0], 1, STATE_ONE)
    expectStateVec(result, vecFromArray([complex(0), complex(SQRT1_2, SQRT1_2)]))
  })

  it('Rx(pi)|0> = -i|1>', () => {
    const result = applyGate(gateRx(Math.PI), [0], 1, STATE_ZERO)
    expectStateVec(result, vecFromArray([complex(0), complex(0, -1)]), 1e-8)
  })

  it('Ry(pi)|0> = |1>', () => {
    const result = applyGate(gateRy(Math.PI), [0], 1, STATE_ZERO)
    expectStateVec(result, vecFromArray([complex(0), complex(1)]), 1e-8)
  })

  it('Rz(pi)|0> = e^{-i*pi/2}|0> = -i|0>', () => {
    const result = applyGate(gateRz(Math.PI), [0], 1, STATE_ZERO)
    expectStateVec(result, vecFromArray([complex(0, -1), complex(0)]), 1e-8)
  })

  it('Rx(pi/2)|0> = [1/sqrt(2), -i/sqrt(2)]', () => {
    const result = applyGate(gateRx(Math.PI / 2), [0], 1, STATE_ZERO)
    expectStateVec(result, vecFromArray([
      complex(SQRT1_2),
      complex(0, -SQRT1_2),
    ]), 1e-8)
  })
})

describe('single-qubit on multi-qubit system', () => {
  it('X on qubit 0 of |00> = |10>', () => {
    const state = nQubitBasis(2, 0) // |00>
    const result = applyGate(PAULI_X, [0], 2, state)
    expectStateVec(result, nQubitBasis(2, 2)) // |10> = index 2
  })

  it('X on qubit 1 of |00> = |01>', () => {
    const state = nQubitBasis(2, 0) // |00>
    const result = applyGate(PAULI_X, [1], 2, state)
    expectStateVec(result, nQubitBasis(2, 1)) // |01> = index 1
  })

  it('H on qubit 0 of |00> = |+0>', () => {
    const state = nQubitBasis(2, 0)
    const result = applyGate(GATE_H, [0], 2, state)
    const expected = tensorProduct(STATE_PLUS, STATE_ZERO)
    expectStateVec(result, expected)
  })
})

describe('two-qubit gate application', () => {
  it('CNOT(0,1)|00> = |00>', () => {
    const state = nQubitBasis(2, 0)
    const result = applyGate(GATE_CNOT, [0, 1], 2, state)
    expectStateVec(result, nQubitBasis(2, 0))
  })

  it('CNOT(0,1)|10> = |11>', () => {
    const state = nQubitBasis(2, 2) // |10>
    const result = applyGate(GATE_CNOT, [0, 1], 2, state)
    expectStateVec(result, nQubitBasis(2, 3)) // |11>
  })

  it('CNOT(0,1)|11> = |10>', () => {
    const state = nQubitBasis(2, 3) // |11>
    const result = applyGate(GATE_CNOT, [0, 1], 2, state)
    expectStateVec(result, nQubitBasis(2, 2)) // |10>
  })

  it('CNOT(1,0)|01> = |11>', () => {
    // Reversed CNOT: control=1, target=0
    const state = nQubitBasis(2, 1) // |01>
    const result = applyGate(GATE_CNOT, [1, 0], 2, state)
    expectStateVec(result, nQubitBasis(2, 3)) // |11>
  })
})

describe('Bell pair preparation', () => {
  it('H on q0 then CNOT(0,1) on |00> = Bell Phi+', () => {
    let state = nQubitBasis(2, 0)
    state = applyGate(GATE_H, [0], 2, state)
    state = applyGate(GATE_CNOT, [0, 1], 2, state)
    // Expected: (|00> + |11>) / sqrt(2)
    expect(state.real[0]).toBeCloseTo(SQRT1_2, 10)
    expect(state.real[1]).toBeCloseTo(0, 10)
    expect(state.real[2]).toBeCloseTo(0, 10)
    expect(state.real[3]).toBeCloseTo(SQRT1_2, 10)
  })
})

describe('GHZ state (3 qubits)', () => {
  it('H(0), CNOT(0,1), CNOT(0,2) on |000> = GHZ', () => {
    let state = nQubitBasis(3, 0)
    state = applyGate(GATE_H, [0], 3, state)
    state = applyGate(GATE_CNOT, [0, 1], 3, state)
    state = applyGate(GATE_CNOT, [0, 2], 3, state)
    // Expected: (|000> + |111>) / sqrt(2)
    expect(state.real[0]).toBeCloseTo(SQRT1_2, 10)
    expect(state.real[7]).toBeCloseTo(SQRT1_2, 10)
    for (let i = 1; i < 7; i++) {
      expect(Math.abs(state.real[i]!)).toBeLessThan(1e-10)
      expect(Math.abs(state.imag[i]!)).toBeLessThan(1e-10)
    }
  })
})

describe('non-adjacent CNOT in 3-qubit system', () => {
  it('CNOT(0,2) on |100> = |101>', () => {
    const state = nQubitBasis(3, 4) // |100>
    const result = applyGate(GATE_CNOT, [0, 2], 3, state)
    expectStateVec(result, nQubitBasis(3, 5)) // |101>
  })

  it('CNOT(2,0) on |001> = |101>', () => {
    const state = nQubitBasis(3, 1) // |001>
    const result = applyGate(GATE_CNOT, [2, 0], 3, state)
    expectStateVec(result, nQubitBasis(3, 5)) // |101>
  })
})

describe('Toffoli gate (3-qubit)', () => {
  it('Toffoli(0,1,2)|110> = |111>', () => {
    const state = nQubitBasis(3, 6) // |110> = index 6
    const result = applyGate(GATE_TOFFOLI, [0, 1, 2], 3, state)
    expectStateVec(result, nQubitBasis(3, 7)) // |111>
  })

  it('Toffoli(0,1,2)|100> = |100> (only one control set)', () => {
    const state = nQubitBasis(3, 4)
    const result = applyGate(GATE_TOFFOLI, [0, 1, 2], 3, state)
    expectStateVec(result, nQubitBasis(3, 4))
  })
})

describe('buildFullOperator', () => {
  it('single qubit on 2-qubit system matches kronecker', () => {
    // H on qubit 0 in 2-qubit system = H x I
    const full = buildFullOperator(GATE_H, [0], 2)
    // Just verify it's 4x4 and unitary
    expect(full.rows).toBe(4)
    expect(full.cols).toBe(4)
    const product = matMul(full, buildFullOperator(GATE_H, [0], 2))
    // H^2 = I, so this should be I4
    // Actually full * full for H on q0
    // (H x I)(H x I) = H^2 x I = I x I = I4
    expectMatrix(product, matIdentity(4))
  })
})

describe('Deutsch-Jozsa (n=1)', () => {
  it('constant f(x)=0 -> measure 0 on qubit 0', () => {
    // Circuit: X(1), H(0), H(1), Oracle (identity for f=0), H(0)
    let state = nQubitBasis(2, 0) // |00>
    state = applyGate(PAULI_X, [1], 2, state) // |01>
    state = applyGate(GATE_H, [0], 2, state)
    state = applyGate(GATE_H, [1], 2, state)
    // Oracle for f(x)=0: identity (no gate)
    state = applyGate(GATE_H, [0], 2, state)
    // Qubit 0 should be |0>: amplitudes at indices 0,1 (q0=0) should dominate
    const p0 = state.real[0]! * state.real[0]! + state.imag[0]! * state.imag[0]!
      + state.real[1]! * state.real[1]! + state.imag[1]! * state.imag[1]!
    expect(p0).toBeCloseTo(1, 8)
  })

  it('balanced f(x)=x (CNOT) -> measure 1 on qubit 0', () => {
    let state = nQubitBasis(2, 0)
    state = applyGate(PAULI_X, [1], 2, state)
    state = applyGate(GATE_H, [0], 2, state)
    state = applyGate(GATE_H, [1], 2, state)
    // Oracle for f(x)=x: CNOT(0,1)
    state = applyGate(GATE_CNOT, [0, 1], 2, state)
    state = applyGate(GATE_H, [0], 2, state)
    // Qubit 0 should be |1>: amplitudes at indices 2,3 (q0=1) should dominate
    const p1 = state.real[2]! * state.real[2]! + state.imag[2]! * state.imag[2]!
      + state.real[3]! * state.real[3]! + state.imag[3]! * state.imag[3]!
    expect(p1).toBeCloseTo(1, 8)
  })
})

describe('Deutsch-Jozsa (n=2)', () => {
  it('constant f=0 -> both input qubits measure 0', () => {
    // 3 qubits: q0, q1 are input, q2 is ancilla
    let state = nQubitBasis(3, 0)
    state = applyGate(PAULI_X, [2], 3, state) // Prepare ancilla
    state = applyGate(GATE_H, [0], 3, state)
    state = applyGate(GATE_H, [1], 3, state)
    state = applyGate(GATE_H, [2], 3, state)
    // Oracle: identity (f=0)
    state = applyGate(GATE_H, [0], 3, state)
    state = applyGate(GATE_H, [1], 3, state)
    // P(q0=0, q1=0) = sum |amp|^2 for indices where q0=0 AND q1=0
    let p00 = 0
    for (let i = 0; i < 8; i++) {
      if (((i >> 2) & 1) === 0 && ((i >> 1) & 1) === 0) {
        p00 += state.real[i]! * state.real[i]! + state.imag[i]! * state.imag[i]!
      }
    }
    expect(p00).toBeCloseTo(1, 8)
  })

  it('balanced f(x)=x0 XOR x1 -> at least one input qubit measures 1', () => {
    let state = nQubitBasis(3, 0)
    state = applyGate(PAULI_X, [2], 3, state)
    state = applyGate(GATE_H, [0], 3, state)
    state = applyGate(GATE_H, [1], 3, state)
    state = applyGate(GATE_H, [2], 3, state)
    // Oracle: CNOT(0,2), CNOT(1,2)
    state = applyGate(GATE_CNOT, [0, 2], 3, state)
    state = applyGate(GATE_CNOT, [1, 2], 3, state)
    state = applyGate(GATE_H, [0], 3, state)
    state = applyGate(GATE_H, [1], 3, state)
    // P(q0=0, q1=0) should be 0
    let p00 = 0
    for (let i = 0; i < 8; i++) {
      if (((i >> 2) & 1) === 0 && ((i >> 1) & 1) === 0) {
        p00 += state.real[i]! * state.real[i]! + state.imag[i]! * state.imag[i]!
      }
    }
    expect(p00).toBeCloseTo(0, 8)
  })
})

describe('3-qubit Grover (1 iteration)', () => {
  it('amplifies target |101> (index 5)', () => {
    const n = 3
    let state = nQubitBasis(n, 0)

    // Initial uniform superposition: H^3 |000>
    state = applyGate(GATE_H, [0], n, state)
    state = applyGate(GATE_H, [1], n, state)
    state = applyGate(GATE_H, [2], n, state)

    // Oracle: flip phase of |101>
    // Oracle: negate amplitude at index 5 (|101>)
    const dim = 1 << n
    const afterOracle: StateVector = {
      dim,
      real: new Float64Array(dim),
      imag: new Float64Array(dim),
    }
    for (let i = 0; i < dim; i++) {
      const sign = (i === 5) ? -1 : 1
      afterOracle.real[i] = state.real[i]! * sign
      afterOracle.imag[i] = state.imag[i]! * sign
    }
    state = afterOracle

    // Diffusion operator: H^3, X^3, CZ on all, X^3, H^3
    // Actually: 2|s><s| - I where |s> is uniform superposition
    // Implement as: H^n * (2|0><0| - I) * H^n
    state = applyGate(GATE_H, [0], n, state)
    state = applyGate(GATE_H, [1], n, state)
    state = applyGate(GATE_H, [2], n, state)

    // 2|0><0| - I: flip phase of all states except |000>
    for (let i = 0; i < dim; i++) {
      if (i !== 0) {
        state.real[i] = -(state.real[i]!)
        state.imag[i] = -(state.imag[i]!)
      }
    }
    // Note: state is immutable in our API, so we need to create new arrays
    const diffused: StateVector = {
      dim,
      real: Float64Array.from(state.real),
      imag: Float64Array.from(state.imag),
    }

    state = applyGate(GATE_H, [0], n, diffused)
    state = applyGate(GATE_H, [1], n, state)
    state = applyGate(GATE_H, [2], n, state)

    // Check amplitude of target |101> (index 5)
    const targetAmp = Math.hypot(state.real[5]!, state.imag[5]!)
    expect(targetAmp).toBeCloseTo(0.8839, 3)

    // Check probability
    const targetProb = state.real[5]! * state.real[5]! + state.imag[5]! * state.imag[5]!
    expect(targetProb).toBeCloseTo(0.7813, 3)
  })
})

describe('pre-allocated output', () => {
  it('applyGate with pre-allocated out works correctly', () => {
    const out: StateVector = {
      dim: 2,
      real: new Float64Array(2),
      imag: new Float64Array(2),
    }
    const result = applyGate(PAULI_X, [0], 1, STATE_ZERO, out)
    expect(result).toBe(out)
    expectStateVec(result, STATE_ONE)
  })
})
