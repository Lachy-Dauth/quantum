import { describe, it, expect } from 'vitest'
import {
  measurementProbability, projectiveMeasurement,
  measureQubit, measureQubits,
} from '../measurement'
import { matFromArray } from '../matrix'
import {
  STATE_ZERO, STATE_ONE, STATE_PLUS, BELL_PHI_PLUS,
  basisState, vecFromArray,
} from '../vector'
import { complex } from '../complex'
import { applyGate } from '../gate-apply'
import { GATE_H, GATE_CNOT } from '../gates'
import { expectStateVec } from './helpers'

// Projectors for single-qubit computational basis
const P0 = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(0)],
])
const P1 = matFromArray(2, 2, [
  [complex(0), complex(0)],
  [complex(0), complex(1)],
])

describe('measurementProbability', () => {
  it('P(0) for |0> = 1', () => {
    expect(measurementProbability(STATE_ZERO, P0)).toBeCloseTo(1, 12)
  })

  it('P(1) for |0> = 0', () => {
    expect(measurementProbability(STATE_ZERO, P1)).toBeCloseTo(0, 12)
  })

  it('P(0) for |1> = 0', () => {
    expect(measurementProbability(STATE_ONE, P0)).toBeCloseTo(0, 12)
  })

  it('P(1) for |1> = 1', () => {
    expect(measurementProbability(STATE_ONE, P1)).toBeCloseTo(1, 12)
  })

  it('P(0) for |+> = 0.5', () => {
    expect(measurementProbability(STATE_PLUS, P0)).toBeCloseTo(0.5, 12)
  })

  it('P(1) for |+> = 0.5', () => {
    expect(measurementProbability(STATE_PLUS, P1)).toBeCloseTo(0.5, 12)
  })
})

describe('projectiveMeasurement', () => {
  it('measuring |0> always gives outcome 0', () => {
    const result = projectiveMeasurement(STATE_ZERO, [P0, P1], () => 0.3)
    expect(result.outcome).toBe(0)
    expect(result.probability).toBeCloseTo(1, 10)
    expectStateVec(result.postState, STATE_ZERO)
  })

  it('measuring |1> always gives outcome 1', () => {
    const result = projectiveMeasurement(STATE_ONE, [P0, P1], () => 0.3)
    expect(result.outcome).toBe(1)
    expect(result.probability).toBeCloseTo(1, 10)
    expectStateVec(result.postState, STATE_ONE)
  })

  it('measuring |+> with rng=0.3 gives outcome 0', () => {
    const result = projectiveMeasurement(STATE_PLUS, [P0, P1], () => 0.3)
    expect(result.outcome).toBe(0)
    expect(result.probability).toBeCloseTo(0.5, 10)
    expectStateVec(result.postState, STATE_ZERO)
  })

  it('measuring |+> with rng=0.7 gives outcome 1', () => {
    const result = projectiveMeasurement(STATE_PLUS, [P0, P1], () => 0.7)
    expect(result.outcome).toBe(1)
    expect(result.probability).toBeCloseTo(0.5, 10)
    expectStateVec(result.postState, STATE_ONE)
  })
})

describe('measureQubit', () => {
  it('|0> always measures 0', () => {
    const result = measureQubit(STATE_ZERO, 1, 0, () => 0.5)
    expect(result.outcome).toBe(0)
    expect(result.probability).toBeCloseTo(1, 10)
  })

  it('|1> always measures 1', () => {
    const result = measureQubit(STATE_ONE, 1, 0, () => 0.5)
    expect(result.outcome).toBe(1)
    expect(result.probability).toBeCloseTo(1, 10)
  })

  it('|+> gives outcome 0 with rng < 0.5', () => {
    const result = measureQubit(STATE_PLUS, 1, 0, () => 0.3)
    expect(result.outcome).toBe(0)
    expect(result.probability).toBeCloseTo(0.5, 10)
    expectStateVec(result.postState, STATE_ZERO)
  })

  it('|+> gives outcome 1 with rng >= 0.5', () => {
    const result = measureQubit(STATE_PLUS, 1, 0, () => 0.7)
    expect(result.outcome).toBe(1)
    expect(result.probability).toBeCloseTo(0.5, 10)
    expectStateVec(result.postState, STATE_ONE)
  })

  it('Bell Phi+ measuring q0=0 collapses to |00>', () => {
    const result = measureQubit(BELL_PHI_PLUS, 2, 0, () => 0.3)
    expect(result.outcome).toBe(0)
    expect(result.probability).toBeCloseTo(0.5, 10)
    // Post state should be |00>
    expectStateVec(result.postState, basisState(4, 0))
  })

  it('Bell Phi+ measuring q0=1 collapses to |11>', () => {
    const result = measureQubit(BELL_PHI_PLUS, 2, 0, () => 0.7)
    expect(result.outcome).toBe(1)
    expect(result.probability).toBeCloseTo(0.5, 10)
    expectStateVec(result.postState, basisState(4, 3))
  })

  it('Bell Phi+ measuring q1 after q0=0 always gives 0', () => {
    const r0 = measureQubit(BELL_PHI_PLUS, 2, 0, () => 0.3)
    expect(r0.outcome).toBe(0)
    const r1 = measureQubit(r0.postState, 2, 1, () => 0.99)
    expect(r1.outcome).toBe(0)
  })
})

describe('measureQubits', () => {
  it('measures multiple qubits sequentially', () => {
    // |00> should always give [0, 0]
    const state = basisState(4, 0)
    const result = measureQubits(state, 2, [0, 1], () => 0.5)
    expect(result.outcomes).toEqual([0, 0])
    expect(result.probability).toBeCloseTo(1, 10)
  })

  it('Bell state gives correlated outcomes', () => {
    // Measure both qubits of Bell Phi+
    // With rng=0.3 -> q0=0, then q1 must be 0
    const result = measureQubits(BELL_PHI_PLUS, 2, [0, 1], () => 0.3)
    expect(result.outcomes[0]).toBe(0)
    expect(result.outcomes[1]).toBe(0)
  })
})

describe('teleportation verification', () => {
  it('teleportation works for all 4 correction branches', () => {
    const testStates = [
      STATE_ZERO,
      STATE_ONE,
      STATE_PLUS,
      vecFromArray([complex(Math.SQRT1_2), complex(0, Math.SQRT1_2)]),
    ]

    for (const psi of testStates) {
      // 3-qubit system: q0 = Alice's qubit, q1,q2 = Bell pair
      // Create Bell pair on q1,q2
      let state = basisState(8, 0) // |000>

      // Set q0 to psi: apply appropriate gates
      // Instead, construct initial state = psi x |00>
      const initial = {
        dim: 8,
        real: new Float64Array(8),
        imag: new Float64Array(8),
      }
      // psi[0]|000> + psi[1]|100>
      initial.real[0] = psi.real[0]!
      initial.imag[0] = psi.imag[0]!
      initial.real[4] = psi.real[1]!
      initial.imag[4] = psi.imag[1]!
      state = initial

      // Bell pair on q1,q2
      state = applyGate(GATE_H, [1], 3, state)
      state = applyGate(GATE_CNOT, [1, 2], 3, state)

      // Bell measurement on q0,q1
      state = applyGate(GATE_CNOT, [0, 1], 3, state)
      state = applyGate(GATE_H, [0], 3, state)

      // For each of the 4 measurement outcomes, check corrections
      for (let m0 = 0; m0 < 2; m0++) {
        for (let m1 = 0; m1 < 2; m1++) {
          // Collapse to this measurement outcome
          const collapsed = {
            dim: 8,
            real: new Float64Array(8),
            imag: new Float64Array(8),
          }
          // Extract amplitudes where q0=m0, q1=m1
          let norm2 = 0
          for (let i = 0; i < 8; i++) {
            const q0bit = (i >> 2) & 1
            const q1bit = (i >> 1) & 1
            if (q0bit === m0 && q1bit === m1) {
              collapsed.real[i] = state.real[i]!
              collapsed.imag[i] = state.imag[i]!
              norm2 += state.real[i]! * state.real[i]! + state.imag[i]! * state.imag[i]!
            }
          }
          const norm = Math.sqrt(norm2)
          if (norm < 1e-10) continue
          for (let i = 0; i < 8; i++) {
            collapsed.real[i] = collapsed.real[i]! / norm
            collapsed.imag[i] = collapsed.imag[i]! / norm
          }

          // Apply corrections on q2
          let corrected: typeof collapsed = collapsed
          if (m1 === 1) {
            corrected = applyGate(
              matFromArray(2, 2, [[complex(0), complex(1)], [complex(1), complex(0)]]),
              [2], 3, corrected
            ) as typeof collapsed
          }
          if (m0 === 1) {
            corrected = applyGate(
              matFromArray(2, 2, [[complex(1), complex(0)], [complex(0), complex(-1)]]),
              [2], 3, corrected
            ) as typeof collapsed
          }

          // Extract q2 state: amplitudes where q0=m0, q1=m1
          const q2state = vecFromArray([
            complex(corrected.real[m0 * 4 + m1 * 2 + 0]!, corrected.imag[m0 * 4 + m1 * 2 + 0]!),
            complex(corrected.real[m0 * 4 + m1 * 2 + 1]!, corrected.imag[m0 * 4 + m1 * 2 + 1]!),
          ])

          // q2 should match psi (up to global phase)
          // Check |<q2|psi>|^2 ≈ 1
          let ipRe = 0, ipIm = 0
          for (let k = 0; k < 2; k++) {
            const ar = q2state.real[k]!, ai = q2state.imag[k]!
            const br = psi.real[k]!, bi = psi.imag[k]!
            ipRe += ar * br + ai * bi
            ipIm += ar * bi - ai * br
          }
          const fidelity = ipRe * ipRe + ipIm * ipIm
          expect(fidelity).toBeCloseTo(1, 6)
        }
      }
    }
  })
})
