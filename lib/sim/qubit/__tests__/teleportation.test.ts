/**
 * Quantum teleportation circuit test from spec section 7.2.2.
 *
 * Circuit: 3 qubits. q0 = state to teleport, q1 = Alice's Bell half, q2 = Bob's Bell half.
 * 1. Prepare Bell pair on q1, q2: H(q1), CNOT(q1, q2)
 * 2. Alice's operations: CNOT(q0, q1), H(q0)
 * 3. Alice measures q0, q1
 * 4. Bob corrects: if q1=1 → X(q2), if q0=1 → Z(q2)
 *
 * We test all 4 test input states with multiple seeds to cover measurement branches.
 */

import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../circuit-simulator'
import type { StateVector } from '../../core/types'
import { STATE_ZERO, STATE_ONE, STATE_PLUS, tensorProduct, basisState, vecFromArray } from '../../core/vector'
import { complex } from '../../core/complex'
import { applyGate } from '../../core/gate-apply'
import { PAULI_X, PAULI_Z } from '../../core/gates'

/** Run teleportation and verify q2 matches the input state (up to global phase). */
function runTeleportation(inputState: StateVector, seed: number) {
  const sim = new CircuitSimulator(3, seed)

  // Set the 3-qubit initial state: inputState ⊗ |00>
  const twoQubitZero = basisState(4, 0)
  const fullInitial = tensorProduct(inputState, twoQubitZero)
  sim.setInitialState(fullInitial)

  // Step 0: Prepare Bell pair on q1, q2
  sim.addGate({ type: 'H', targets: [1], column: 0 })
  sim.addGate({ type: 'CNOT', targets: [1, 2], column: 1 })

  // Step 1: Alice's operations
  sim.addGate({ type: 'CNOT', targets: [0, 1], column: 2 })
  sim.addGate({ type: 'H', targets: [0], column: 3 })

  // Step 2: Alice measures q0, q1
  sim.addGate({ type: 'MEASURE', targets: [0], column: 4 })
  sim.addGate({ type: 'MEASURE', targets: [1], column: 4 })

  const result = sim.simulate()

  // Get measurement outcomes
  const finalSnapshot = result.snapshots[result.snapshots.length - 1]!
  const m0 = finalSnapshot.measurementOutcomes?.get(0) ?? 0
  const m1 = finalSnapshot.measurementOutcomes?.get(1) ?? 0

  // Step 3: Bob's corrections
  let state = result.finalState
  if (m1 === 1) {
    state = applyGate(PAULI_X, [2], 3, state)
  }
  if (m0 === 1) {
    state = applyGate(PAULI_Z, [2], 3, state)
  }

  return { finalState: state, m0, m1 }
}

describe('teleportation', () => {
  // Custom state: (|0> + i|1>)/sqrt(2)
  const customState = vecFromArray([
    complex(Math.SQRT1_2, 0),
    complex(0, Math.SQRT1_2),
  ])

  const testStates: [string, StateVector][] = [
    ['|0>', STATE_ZERO],
    ['|1>', STATE_ONE],
    ['|+>', STATE_PLUS],
    ['(|0>+i|1>)/sqrt(2)', customState],
  ]

  for (const [label, inputState] of testStates) {
    it(`teleports ${label} correctly`, () => {
      // Try multiple seeds to cover different measurement outcomes
      for (let seed = 42; seed < 52; seed++) {
        const { finalState } = runTeleportation(inputState, seed)

        // Extract q2's reduced state from the 3-qubit system.
        // After measurement + correction, q0 and q1 are collapsed.
        // Find the non-zero amplitudes and extract q2's state.
        let q2_re0 = 0, q2_im0 = 0, q2_re1 = 0, q2_im1 = 0
        let norm = 0

        for (let i = 0; i < 8; i++) {
          const amp2 = finalState.real[i]! * finalState.real[i]! + finalState.imag[i]! * finalState.imag[i]!
          if (amp2 > 1e-20) {
            const q2bit = i & 1
            if (q2bit === 0) {
              q2_re0 = finalState.real[i]!
              q2_im0 = finalState.imag[i]!
            } else {
              q2_re1 = finalState.real[i]!
              q2_im1 = finalState.imag[i]!
            }
            norm += amp2
          }
        }

        // Normalize
        const n = Math.sqrt(norm)
        q2_re0 /= n; q2_im0 /= n
        q2_re1 /= n; q2_im1 /= n

        // Compare to input state up to global phase
        const inRe0 = inputState.real[0]!, inIm0 = inputState.imag[0]!
        const inRe1 = inputState.real[1]!, inIm1 = inputState.imag[1]!
        const inAbs0 = Math.hypot(inRe0, inIm0)

        if (inAbs0 > 0.1) {
          // Use first component to find global phase
          const denom = inRe0 * inRe0 + inIm0 * inIm0
          const phaseRe = (q2_re0 * inRe0 + q2_im0 * inIm0) / denom
          const phaseIm = (q2_im0 * inRe0 - q2_re0 * inIm0) / denom

          // Apply phase to input[1] and compare
          const expectedRe1 = phaseRe * inRe1 - phaseIm * inIm1
          const expectedIm1 = phaseRe * inIm1 + phaseIm * inRe1
          expect(q2_re1).toBeCloseTo(expectedRe1, 6)
          expect(q2_im1).toBeCloseTo(expectedIm1, 6)
        } else {
          // input[0] ~ 0, so q2[0] should also be ~ 0
          expect(Math.hypot(q2_re0, q2_im0)).toBeLessThan(0.01)
          const inAbs1 = Math.hypot(inRe1, inIm1)
          expect(Math.hypot(q2_re1, q2_im1)).toBeCloseTo(inAbs1, 2)
        }
      }
    })
  }
})
