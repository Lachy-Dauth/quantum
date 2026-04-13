/**
 * Parse initial state specifications into StateVector.
 *
 * Supports:
 * - Ket strings: "|00>", "|+0>", "|01>", "|+->", "|+i-i>"
 * - Named states: "bell_phi_plus", "bell_phi_minus", "bell_psi_plus", "bell_psi_minus", "ghz_3", "ghz_4", etc.
 * - Raw StateVector objects passed through directly.
 */

import type { StateVector } from '../core/types'
import {
  STATE_ZERO,
  STATE_ONE,
  STATE_PLUS,
  STATE_MINUS,
  STATE_PLUS_I,
  STATE_MINUS_I,
  BELL_PHI_PLUS,
  BELL_PHI_MINUS,
  BELL_PSI_PLUS,
  BELL_PSI_MINUS,
  tensorProduct,
  basisState,
} from '../core/vector'
import { applyGate } from '../core/gate-apply'
import { GATE_H, GATE_CNOT } from '../core/gates'

// ---------------------------------------------------------------------------
// Single-qubit state lookup
// ---------------------------------------------------------------------------

const SINGLE_QUBIT_STATES: Record<string, StateVector> = {
  '0': STATE_ZERO,
  '1': STATE_ONE,
  '+': STATE_PLUS,
  '-': STATE_MINUS,
}

// ---------------------------------------------------------------------------
// Named state builders
// ---------------------------------------------------------------------------

function buildGHZ(n: number): StateVector {
  if (n < 2) throw new Error(`GHZ state requires at least 2 qubits, got ${n}`)

  // Start with |0...0>
  let state = basisState(1 << n, 0)

  // Apply H to qubit 0
  state = applyGate(GATE_H, [0], n, state)

  // Apply CNOT(0, k) for k = 1..n-1
  for (let k = 1; k < n; k++) {
    state = applyGate(GATE_CNOT, [0, k], n, state)
  }

  return state
}

const NAMED_STATES: Record<string, () => StateVector> = {
  bell_phi_plus: () => BELL_PHI_PLUS,
  bell_phi_minus: () => BELL_PHI_MINUS,
  bell_psi_plus: () => BELL_PSI_PLUS,
  bell_psi_minus: () => BELL_PSI_MINUS,
}

// ---------------------------------------------------------------------------
// Ket string parser
// ---------------------------------------------------------------------------

/**
 * Parse a per-qubit character from a ket string into a single-qubit state.
 * Handles: 0, 1, +, -
 * For +i and -i, the caller handles the two-character sequence.
 */
function parseSingleQubitChar(c: string): StateVector {
  const state = SINGLE_QUBIT_STATES[c]
  if (!state) throw new Error(`Unknown qubit state character: "${c}"`)
  return state
}

/**
 * Parse a ket string like "|00>", "|+0>", "|+i-i>" into a StateVector
 * by tensoring individual qubit states.
 */
function parseKetString(ket: string): StateVector {
  // Strip | and >
  let inner = ket.trim()
  if (inner.startsWith('|')) inner = inner.slice(1)
  if (inner.endsWith('>')) inner = inner.slice(0, -1)

  if (inner.length === 0) throw new Error('Empty ket string')

  // Parse character by character, handling +i and -i as two-char tokens
  const qubitStates: StateVector[] = []
  let i = 0
  while (i < inner.length) {
    const c = inner[i]!
    // Check for +i or -i (the imaginary basis states)
    if ((c === '+' || c === '-') && i + 1 < inner.length && inner[i + 1] === 'i') {
      qubitStates.push(c === '+' ? STATE_PLUS_I : STATE_MINUS_I)
      i += 2
    } else {
      qubitStates.push(parseSingleQubitChar(c))
      i++
    }
  }

  // Tensor all qubit states together
  let result = qubitStates[0]!
  for (let k = 1; k < qubitStates.length; k++) {
    result = tensorProduct(result, qubitStates[k]!)
  }

  return result
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse an initial state specification into a StateVector.
 *
 * @param input - Ket string, named state, or raw StateVector
 * @param numQubits - Expected number of qubits (for validation)
 * @returns The corresponding StateVector
 */
export function parseInitialState(input: string | StateVector, numQubits: number): StateVector {
  // Raw StateVector pass-through
  if (typeof input !== 'string') {
    const expectedDim = 1 << numQubits
    if (input.dim !== expectedDim) {
      throw new Error(
        `StateVector dimension ${input.dim} does not match ${numQubits} qubits (expected ${expectedDim})`
      )
    }
    return input
  }

  // Named states
  const lower = input.toLowerCase().trim()

  // Check named states
  const namedFactory = NAMED_STATES[lower]
  if (namedFactory) {
    const state = namedFactory()
    const expectedDim = 1 << numQubits
    if (state.dim !== expectedDim) {
      throw new Error(
        `Named state "${input}" has dimension ${state.dim}, but ${numQubits} qubits expected (dim ${expectedDim})`
      )
    }
    return state
  }

  // Check GHZ pattern: ghz_N
  const ghzMatch = lower.match(/^ghz_(\d+)$/)
  if (ghzMatch) {
    const n = parseInt(ghzMatch[1]!, 10)
    if (n !== numQubits) {
      throw new Error(`GHZ state for ${n} qubits does not match numQubits=${numQubits}`)
    }
    return buildGHZ(n)
  }

  // Ket string
  if (input.includes('|') || input.includes('>')) {
    const state = parseKetString(input)
    const expectedDim = 1 << numQubits
    if (state.dim !== expectedDim) {
      throw new Error(
        `Ket string "${input}" produces ${Math.log2(state.dim)}-qubit state, but ${numQubits} qubits expected`
      )
    }
    return state
  }

  throw new Error(`Cannot parse initial state: "${input}"`)
}
