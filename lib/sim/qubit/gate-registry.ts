/**
 * Gate registry: maps GateType to its matrix, display metadata, and category.
 * Parameterised gates are resolved on-demand with their parameters.
 */

import type { DenseMatrix } from '../core/types'
import {
  PAULI_I,
  PAULI_X,
  PAULI_Y,
  PAULI_Z,
  GATE_H,
  GATE_S,
  GATE_T,
  GATE_S_DAG,
  GATE_T_DAG,
  GATE_CNOT,
  GATE_CZ,
  GATE_SWAP,
  GATE_TOFFOLI,
  gateRx,
  gateRy,
  gateRz,
  gateU,
  gatePhase,
} from '../core/gates'
import type { GateType, GateInfo, Gate } from './types'

// ---------------------------------------------------------------------------
// Static gate info (non-parameterised)
// ---------------------------------------------------------------------------

const GATE_REGISTRY: Record<string, GateInfo> = {
  I: { matrix: PAULI_I, label: 'I', symbol: 'I', numQubits: 1, parameterized: false, category: 'single' },
  X: { matrix: PAULI_X, label: 'X', symbol: 'X', numQubits: 1, parameterized: false, category: 'single' },
  Y: { matrix: PAULI_Y, label: 'Y', symbol: 'Y', numQubits: 1, parameterized: false, category: 'single' },
  Z: { matrix: PAULI_Z, label: 'Z', symbol: 'Z', numQubits: 1, parameterized: false, category: 'single' },
  H: { matrix: GATE_H, label: 'H', symbol: 'H', numQubits: 1, parameterized: false, category: 'single' },
  S: { matrix: GATE_S, label: 'S', symbol: 'S', numQubits: 1, parameterized: false, category: 'single' },
  T: { matrix: GATE_T, label: 'T', symbol: 'T', numQubits: 1, parameterized: false, category: 'single' },
  S_DAG: { matrix: GATE_S_DAG, label: 'S†', symbol: 'S†', numQubits: 1, parameterized: false, category: 'single' },
  T_DAG: { matrix: GATE_T_DAG, label: 'T†', symbol: 'T†', numQubits: 1, parameterized: false, category: 'single' },
  RX: { matrix: null, label: 'Rx', symbol: 'Rx', numQubits: 1, parameterized: true, category: 'parameterized' },
  RY: { matrix: null, label: 'Ry', symbol: 'Ry', numQubits: 1, parameterized: true, category: 'parameterized' },
  RZ: { matrix: null, label: 'Rz', symbol: 'Rz', numQubits: 1, parameterized: true, category: 'parameterized' },
  PHASE: { matrix: null, label: 'P', symbol: 'P', numQubits: 1, parameterized: true, category: 'parameterized' },
  U: { matrix: null, label: 'U', symbol: 'U', numQubits: 1, parameterized: true, category: 'parameterized' },
  CNOT: { matrix: GATE_CNOT, label: 'CNOT', symbol: '⊕', numQubits: 2, parameterized: false, category: 'multi' },
  CZ: { matrix: GATE_CZ, label: 'CZ', symbol: 'CZ', numQubits: 2, parameterized: false, category: 'multi' },
  SWAP: { matrix: GATE_SWAP, label: 'SWAP', symbol: '×', numQubits: 2, parameterized: false, category: 'multi' },
  TOFFOLI: { matrix: GATE_TOFFOLI, label: 'Toffoli', symbol: '⊕', numQubits: 3, parameterized: false, category: 'multi' },
  MEASURE: { matrix: null, label: 'M', symbol: 'M', numQubits: 1, parameterized: false, category: 'measurement' },
  BARRIER: { matrix: null, label: '│', symbol: '│', numQubits: 0, parameterized: false, category: 'utility' },
  CUSTOM: { matrix: null, label: '?', symbol: '?', numQubits: 1, parameterized: false, category: 'utility' },
}

/**
 * Get static gate info for a gate type.
 */
export function getGateInfo(type: GateType): GateInfo {
  const info = GATE_REGISTRY[type]
  if (!info) throw new Error(`Unknown gate type: ${type}`)
  return info
}

/**
 * Resolve the unitary matrix for a gate, including parameterised gates.
 * Returns null for non-unitary gate types (MEASURE, BARRIER).
 */
export function resolveGateMatrix(gate: Gate): DenseMatrix | null {
  const info = getGateInfo(gate.type)

  if (!info.parameterized) {
    if (gate.type === 'CUSTOM') return gate.customMatrix ?? null
    return info.matrix
  }

  // Parameterised gates: resolve from params
  const theta = gate.params?.theta ?? 0
  const phi = gate.params?.phi ?? 0
  const lambda = gate.params?.lambda ?? 0

  switch (gate.type) {
    case 'RX': return gateRx(theta)
    case 'RY': return gateRy(theta)
    case 'RZ': return gateRz(theta)
    case 'PHASE': return gatePhase(phi)
    case 'U': return gateU(theta, phi, lambda)
    default: return null
  }
}

/**
 * Get all gate types grouped by category, for the gate palette.
 */
export function getGatesByCategory(): Record<string, GateType[]> {
  return {
    single: ['I', 'X', 'Y', 'Z', 'H', 'S', 'T', 'S_DAG', 'T_DAG'],
    parameterized: ['RX', 'RY', 'RZ', 'PHASE', 'U'],
    multi: ['CNOT', 'CZ', 'SWAP', 'TOFFOLI'],
    measurement: ['MEASURE'],
  }
}
