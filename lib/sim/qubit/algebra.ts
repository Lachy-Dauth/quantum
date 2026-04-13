/**
 * Algebra generation for the "Show Algebra" panel.
 *
 * Produces LaTeX strings for each circuit step showing:
 * - Gate applied (with tensor product notation for multi-qubit systems)
 * - State before and after in ket notation
 * - Expanded form with full matrix entries
 */

import type { Circuit, CircuitSnapshot, AlgebraStep, Gate } from './types'
import { getGateInfo, resolveGateMatrix } from './gate-registry'
import { formatComplex } from '../core/utils'
import { mget } from '../core/matrix'
import type { DenseMatrix } from '../core/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a complex number for LaTeX. */
function latexComplex(re: number, im: number, precision = 3): string {
  const eps = Math.pow(10, -(precision + 1))

  const reZero = Math.abs(re) < eps
  const imZero = Math.abs(im) < eps

  if (reZero && imZero) return '0'

  if (imZero) {
    if (Math.abs(re - 1) < eps) return '1'
    if (Math.abs(re + 1) < eps) return '-1'
    return re.toFixed(precision).replace(/\.?0+$/, '')
  }

  if (reZero) {
    if (Math.abs(im - 1) < eps) return 'i'
    if (Math.abs(im + 1) < eps) return '-i'
    return `${im.toFixed(precision).replace(/\.?0+$/, '')}i`
  }

  const rePart = re.toFixed(precision).replace(/\.?0+$/, '')
  const imAbs = Math.abs(im)
  const sign = im > 0 ? '+' : '-'
  let imPart: string
  if (Math.abs(imAbs - 1) < eps) {
    imPart = 'i'
  } else {
    imPart = `${imAbs.toFixed(precision).replace(/\.?0+$/, '')}i`
  }
  return `${rePart}${sign}${imPart}`
}

/** Format a state vector in ket notation for LaTeX. */
function latexKet(
  state: { dim: number; real: Float64Array; imag: Float64Array },
  numQubits: number,
  threshold = 1e-6,
): string {
  const terms: string[] = []

  for (let i = 0; i < state.dim; i++) {
    const re = state.real[i]!
    const im = state.imag[i]!
    const amp = Math.hypot(re, im)
    if (amp < threshold) continue

    const label = i.toString(2).padStart(numQubits, '0')
    const coeff = latexComplex(re, im)

    if (coeff === '1') {
      terms.push(`|${label}\\rangle`)
    } else if (coeff === '-1') {
      terms.push(`-|${label}\\rangle`)
    } else {
      terms.push(`${coeff}|${label}\\rangle`)
    }
  }

  if (terms.length === 0) return '0'

  let result = terms[0]!
  for (let i = 1; i < terms.length; i++) {
    const t = terms[i]!
    if (t.startsWith('-')) {
      result += ` - ${t.slice(1)}`
    } else {
      result += ` + ${t}`
    }
  }

  return result
}

/** Get the LaTeX name for a gate. */
function gateLatexName(gate: Gate): string {
  const info = getGateInfo(gate.type)

  switch (gate.type) {
    case 'RX': return `R_x(${(gate.params?.theta ?? 0).toFixed(2)})`
    case 'RY': return `R_y(${(gate.params?.theta ?? 0).toFixed(2)})`
    case 'RZ': return `R_z(${(gate.params?.theta ?? 0).toFixed(2)})`
    case 'PHASE': return `P(${(gate.params?.phi ?? 0).toFixed(2)})`
    case 'U': {
      const t = (gate.params?.theta ?? 0).toFixed(2)
      const p = (gate.params?.phi ?? 0).toFixed(2)
      const l = (gate.params?.lambda ?? 0).toFixed(2)
      return `U(${t},${p},${l})`
    }
    case 'CNOT': return '\\text{CNOT}'
    case 'CZ': return '\\text{CZ}'
    case 'SWAP': return '\\text{SWAP}'
    case 'TOFFOLI': return '\\text{Toffoli}'
    case 'S_DAG': return 'S^\\dagger'
    case 'T_DAG': return 'T^\\dagger'
    default: return info.label
  }
}

/** Format a matrix as a LaTeX pmatrix. */
function latexMatrix(m: DenseMatrix): string {
  const rows: string[] = []
  for (let r = 0; r < m.rows; r++) {
    const entries: string[] = []
    for (let c = 0; c < m.cols; c++) {
      const v = mget(m, r, c)
      entries.push(latexComplex(v.re, v.im))
    }
    rows.push(entries.join(' & '))
  }
  return `\\begin{pmatrix}${rows.join(' \\\\ ')}\\end{pmatrix}`
}

/** Build the operator description for a column of gates. */
function columnOperatorLatex(gates: Gate[], numQubits: number): string {
  if (gates.length === 0) return 'I'
  if (gates.length === 1) {
    const g = gates[0]!
    if (g.type === 'MEASURE') return `M_{q${g.targets[0]}}`
    if (g.type === 'BARRIER') return '|'

    const name = gateLatexName(g)

    if (numQubits === 1) return name

    // Show tensor product notation
    if (g.targets.length === 1) {
      const parts: string[] = []
      for (let q = 0; q < numQubits; q++) {
        parts.push(q === g.targets[0] ? name : 'I')
      }
      return parts.join(' \\otimes ')
    }

    // Multi-qubit: use subscript notation
    const targetStr = g.targets.map(t => `q${t}`).join(',')
    return `${name}_{${targetStr}}`
  }

  // Multiple gates in same column
  const parts = gates.map(g => {
    if (g.type === 'MEASURE') return `M_{q${g.targets[0]}}`
    const name = gateLatexName(g)
    if (g.targets.length > 1) {
      const targetStr = g.targets.map(t => `q${t}`).join(',')
      return `${name}_{${targetStr}}`
    }
    return `${name}_{q${g.targets[0]}}`
  })
  return parts.join(' \\cdot ')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate algebra steps from a circuit and its simulation snapshots.
 */
export function generateAlgebra(
  circuit: Circuit,
  snapshots: CircuitSnapshot[],
): AlgebraStep[] {
  const steps: AlgebraStep[] = []
  const numQubits = circuit.numQubits

  // Group gates by column
  const gatesByColumn = new Map<number, Gate[]>()
  for (const g of circuit.gates) {
    let list = gatesByColumn.get(g.column)
    if (!list) {
      list = []
      gatesByColumn.set(g.column, list)
    }
    list.push(g)
  }

  for (let col = 0; col < circuit.numColumns; col++) {
    const gates = gatesByColumn.get(col) ?? []
    if (gates.length === 0) continue

    const stateBefore = snapshots[col]!.state
    const stateAfter = snapshots[col + 1]!.state

    const operator = columnOperatorLatex(gates, numQubits)
    const ketBefore = latexKet(stateBefore, numQubits)
    const ketAfter = latexKet(stateAfter, numQubits)

    const latex = `${operator} ${ketBefore} = ${ketAfter}`

    // Expanded form: show the matrix
    let latexExpanded = latex
    if (gates.length === 1 && gates[0]!.type !== 'MEASURE' && gates[0]!.type !== 'BARRIER') {
      const matrix = resolveGateMatrix(gates[0]!)
      if (matrix) {
        const matStr = latexMatrix(matrix)
        latexExpanded = `${operator} ${ketBefore} = ${matStr} ${ketBefore} = ${ketAfter}`
      }
    }

    steps.push({ column: col, latex, latexExpanded })
  }

  return steps
}
