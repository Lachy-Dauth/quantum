/**
 * OpenQASM 2.0 export/import for quantum circuits.
 *
 * Subset of QASM 2.0 sufficient for the gates supported by this simulator.
 */

import type { Gate, Circuit, GateType } from './types'

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Map GateType to QASM instruction name. */
const GATE_TO_QASM: Partial<Record<GateType, string>> = {
  I: 'id',
  X: 'x',
  Y: 'y',
  Z: 'z',
  H: 'h',
  S: 's',
  T: 't',
  S_DAG: 'sdg',
  T_DAG: 'tdg',
  RX: 'rx',
  RY: 'ry',
  RZ: 'rz',
  PHASE: 'p',
  CNOT: 'cx',
  CZ: 'cz',
  SWAP: 'swap',
  TOFFOLI: 'ccx',
  MEASURE: 'measure',
}

/**
 * Export a circuit as an OpenQASM 2.0 string.
 */
export function toQASM(circuit: Circuit): string {
  const lines: string[] = []

  lines.push('OPENQASM 2.0;')
  lines.push('include "qelib1.inc";')
  lines.push('')
  lines.push(`qreg q[${circuit.numQubits}];`)
  lines.push(`creg c[${circuit.numQubits}];`)
  lines.push('')

  // Sort gates by column, then by first target
  const sorted = [...circuit.gates].sort((a, b) => {
    if (a.column !== b.column) return a.column - b.column
    return (a.targets[0] ?? 0) - (b.targets[0] ?? 0)
  })

  let lastColumn = -1

  for (const g of sorted) {
    if (g.column !== lastColumn && lastColumn !== -1) {
      lines.push('barrier q;')
    }
    lastColumn = g.column

    if (g.type === 'BARRIER') {
      lines.push('barrier q;')
      continue
    }

    const qasmName = GATE_TO_QASM[g.type]
    if (!qasmName) continue

    if (g.type === 'MEASURE') {
      for (const t of g.targets) {
        lines.push(`measure q[${t}] -> c[${t}];`)
      }
      continue
    }

    // Parameterised gates
    if (g.type === 'RX' || g.type === 'RY' || g.type === 'RZ') {
      const theta = g.params?.theta ?? 0
      const qubits = g.targets.map(t => `q[${t}]`).join(', ')
      lines.push(`${qasmName}(${theta}) ${qubits};`)
      continue
    }

    if (g.type === 'PHASE') {
      const phi = g.params?.phi ?? 0
      const qubits = g.targets.map(t => `q[${t}]`).join(', ')
      lines.push(`${qasmName}(${phi}) ${qubits};`)
      continue
    }

    if (g.type === 'U') {
      const theta = g.params?.theta ?? 0
      const phi = g.params?.phi ?? 0
      const lambda = g.params?.lambda ?? 0
      const qubits = g.targets.map(t => `q[${t}]`).join(', ')
      lines.push(`u3(${theta}, ${phi}, ${lambda}) ${qubits};`)
      continue
    }

    // Standard gates
    const qubits = g.targets.map(t => `q[${t}]`).join(', ')
    lines.push(`${qasmName} ${qubits};`)
  }

  return lines.join('\n') + '\n'
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/** Map QASM instruction name to GateType. */
const QASM_TO_GATE: Record<string, GateType> = {
  id: 'I',
  x: 'X',
  y: 'Y',
  z: 'Z',
  h: 'H',
  s: 'S',
  t: 'T',
  sdg: 'S_DAG',
  tdg: 'T_DAG',
  rx: 'RX',
  ry: 'RY',
  rz: 'RZ',
  p: 'PHASE',
  cx: 'CNOT',
  cz: 'CZ',
  swap: 'SWAP',
  ccx: 'TOFFOLI',
  measure: 'MEASURE',
  u3: 'U',
}

/**
 * Parse an OpenQASM 2.0 string into a Circuit.
 * Supports the subset of gates used by this simulator.
 */
export function fromQASM(qasm: string): { numQubits: number; gates: Omit<Gate, 'id'>[] } {
  const lines = qasm.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('/'))
  let numQubits = 2 // default

  const gates: Omit<Gate, 'id'>[] = []
  let currentColumn = 0

  for (const line of lines) {
    // Skip header lines
    if (line.startsWith('OPENQASM') || line.startsWith('include')) continue

    // Parse qreg
    const qregMatch = line.match(/^qreg\s+\w+\[(\d+)\];$/)
    if (qregMatch) {
      numQubits = parseInt(qregMatch[1]!, 10)
      continue
    }

    // Skip creg
    if (line.startsWith('creg')) continue

    // Barrier advances column
    if (line.startsWith('barrier')) {
      currentColumn++
      continue
    }

    // Parse measure
    const measureMatch = line.match(/^measure\s+q\[(\d+)\]\s*->\s*c\[(\d+)\];$/)
    if (measureMatch) {
      const qubit = parseInt(measureMatch[1]!, 10)
      gates.push({ type: 'MEASURE', targets: [qubit], column: currentColumn })
      continue
    }

    // Parse parameterised gate: name(params) qubit_list;
    const paramMatch = line.match(/^(\w+)\(([^)]+)\)\s+(.+);$/)
    if (paramMatch) {
      const name = paramMatch[1]!
      const paramStr = paramMatch[2]!
      const qubitsStr = paramMatch[3]!

      const gateType = QASM_TO_GATE[name]
      if (!gateType) continue

      const params = paramStr.split(',').map(s => parseFloat(s.trim()))
      const targets = parseQubitList(qubitsStr)

      const gateParams: Gate['params'] = {}
      if (gateType === 'RX' || gateType === 'RY' || gateType === 'RZ') {
        gateParams.theta = params[0]
      } else if (gateType === 'PHASE') {
        gateParams.phi = params[0]
      } else if (gateType === 'U') {
        gateParams.theta = params[0]
        gateParams.phi = params[1]
        gateParams.lambda = params[2]
      }

      gates.push({ type: gateType, targets, column: currentColumn, params: gateParams })
      continue
    }

    // Parse non-parameterised gate: name qubit_list;
    const gateMatch = line.match(/^(\w+)\s+(.+);$/)
    if (gateMatch) {
      const name = gateMatch[1]!
      const qubitsStr = gateMatch[2]!

      const gateType = QASM_TO_GATE[name]
      if (!gateType) continue

      const targets = parseQubitList(qubitsStr)
      gates.push({ type: gateType, targets, column: currentColumn })
      continue
    }
  }

  return { numQubits, gates }
}

function parseQubitList(str: string): number[] {
  const parts = str.split(',').map(s => s.trim())
  const targets: number[] = []
  for (const p of parts) {
    const m = p.match(/q\[(\d+)\]/)
    if (m) targets.push(parseInt(m[1]!, 10))
  }
  return targets
}
