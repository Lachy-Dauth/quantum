/**
 * CircuitSimulator — the core simulation engine for the qubit circuit simulator.
 *
 * Pure class with no DOM or React dependencies. Importable in Web Workers.
 * Processes a quantum circuit column-by-column, producing snapshots at each step.
 */

import type { DenseMatrix, StateVector } from '../core/types'
import { basisState } from '../core/vector'
import { applyGate, buildFullOperator } from '../core/gate-apply'
import { matMul, matIdentity, kronecker } from '../core/matrix'
import { measureQubit } from '../core/measurement'
import { reducedBlochVector, createRng } from '../core/utils'
import { resolveGateMatrix } from './gate-registry'
import { parseInitialState } from './initial-state'
import type {
  Gate,
  Circuit,
  CircuitSnapshot,
  SimulationResult,
  BatchResult,
  BlochVector,
} from './types'

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

let nextId = 1

function generateId(): string {
  return `gate_${nextId++}`
}

// ---------------------------------------------------------------------------
// CircuitSimulator
// ---------------------------------------------------------------------------

export class CircuitSimulator {
  private _circuit: Circuit
  private _initialState: StateVector
  private _snapshots: CircuitSnapshot[] = []
  private _rng: () => number

  constructor(numQubits: number, seed?: number) {
    if (numQubits < 1 || numQubits > 6) {
      throw new Error(`numQubits must be 1-6, got ${numQubits}`)
    }
    this._circuit = { numQubits, gates: [], numColumns: 0 }
    this._initialState = basisState(1 << numQubits, 0) // |0...0>
    this._rng = seed !== undefined ? createRng(seed) : Math.random
  }

  get circuit(): Circuit {
    return this._circuit
  }

  get numQubits(): number {
    return this._circuit.numQubits
  }

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  setInitialState(state: StateVector | string): void {
    this._initialState = parseInitialState(state, this._circuit.numQubits)
  }

  getInitialState(): StateVector {
    return this._initialState
  }

  // -------------------------------------------------------------------------
  // Circuit manipulation
  // -------------------------------------------------------------------------

  addGate(gate: Omit<Gate, 'id'>): string {
    const id = generateId()
    const fullGate: Gate = { ...gate, id }
    this._circuit.gates.push(fullGate)
    this._updateNumColumns()
    return id
  }

  removeGate(id: string): void {
    this._circuit.gates = this._circuit.gates.filter(g => g.id !== id)
    this._updateNumColumns()
  }

  moveGate(id: string, newColumn: number, newTargets: number[]): void {
    const gate = this._circuit.gates.find(g => g.id === id)
    if (!gate) throw new Error(`Gate not found: ${id}`)
    gate.column = newColumn
    gate.targets = newTargets
    this._updateNumColumns()
  }

  updateGateParams(id: string, params: Gate['params']): void {
    const gate = this._circuit.gates.find(g => g.id === id)
    if (!gate) throw new Error(`Gate not found: ${id}`)
    gate.params = params
  }

  clearCircuit(): void {
    this._circuit.gates = []
    this._circuit.numColumns = 0
  }

  /** Set the full circuit at once (e.g. from props or QASM import). */
  setCircuit(gates: Gate[]): void {
    this._circuit.gates = [...gates]
    this._updateNumColumns()
  }

  private _updateNumColumns(): void {
    let max = 0
    for (const g of this._circuit.gates) {
      if (g.column + 1 > max) max = g.column + 1
    }
    this._circuit.numColumns = max
  }

  // -------------------------------------------------------------------------
  // Simulation
  // -------------------------------------------------------------------------

  /**
   * Simulate the full circuit from initial state.
   * Processes column by column. Stores a CircuitSnapshot after each column.
   */
  simulate(): SimulationResult {
    const n = this._circuit.numQubits
    let state = this._initialState

    // Snapshot at column 0 (initial state)
    const snapshots: CircuitSnapshot[] = [this._makeSnapshot(0, state)]

    // Group gates by column
    const gatesByColumn = this._groupByColumn()

    for (let col = 0; col < this._circuit.numColumns; col++) {
      const gates = gatesByColumn.get(col) ?? []
      let measurementOutcomes: Map<number, number> | undefined

      for (const gate of gates) {
        if (gate.type === 'MEASURE') {
          // Measurement collapses the state
          const result = measureQubit(state, n, gate.targets[0]!, this._rng)
          state = result.postState
          if (!measurementOutcomes) measurementOutcomes = new Map()
          measurementOutcomes.set(gate.targets[0]!, result.outcome)
        } else if (gate.type === 'BARRIER') {
          // Barriers do nothing computationally
          continue
        } else {
          const matrix = resolveGateMatrix(gate)
          if (matrix) {
            state = applyGate(matrix, gate.targets, n, state)
          }
        }
      }

      const snapshot = this._makeSnapshot(col + 1, state, measurementOutcomes)
      snapshots.push(snapshot)
    }

    this._snapshots = snapshots
    return { snapshots, finalState: state }
  }

  /**
   * Get the state at a specific column (step).
   * Must call simulate() first.
   */
  getStateAtStep(column: number): CircuitSnapshot {
    if (column < 0 || column >= this._snapshots.length) {
      throw new Error(`Step ${column} out of range [0, ${this._snapshots.length - 1}]`)
    }
    return this._snapshots[column]!
  }

  /**
   * Run the circuit n times with measurement, collecting statistics.
   * Uses the seeded RNG for reproducible results.
   */
  batchRun(n: number): BatchResult {
    const counts = new Map<string, number>()
    const numQ = this._circuit.numQubits

    for (let run = 0; run < n; run++) {
      // Re-simulate from initial state
      let state = this._initialState

      const gatesByColumn = this._groupByColumn()
      const outcomes = new Map<number, number>()

      for (let col = 0; col < this._circuit.numColumns; col++) {
        const gates = gatesByColumn.get(col) ?? []
        for (const gate of gates) {
          if (gate.type === 'MEASURE') {
            const result = measureQubit(state, numQ, gate.targets[0]!, this._rng)
            state = result.postState
            outcomes.set(gate.targets[0]!, result.outcome)
          } else if (gate.type === 'BARRIER') {
            continue
          } else {
            const matrix = resolveGateMatrix(gate)
            if (matrix) {
              state = applyGate(matrix, gate.targets, numQ, state)
            }
          }
        }
      }

      // If no MEASURE gates, measure all qubits at the end
      if (outcomes.size === 0) {
        for (let q = 0; q < numQ; q++) {
          const result = measureQubit(state, numQ, q, this._rng)
          state = result.postState
          outcomes.set(q, result.outcome)
        }
      }

      // Build outcome string
      const bits: string[] = []
      for (let q = 0; q < numQ; q++) {
        bits.push(String(outcomes.get(q) ?? 0))
      }
      const key = bits.join('')
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }

    return { counts, totalRuns: n }
  }

  /**
   * Get the unitary matrix representation of the full circuit.
   * Builds the product of per-column unitaries.
   */
  getCircuitUnitary(): DenseMatrix {
    const n = this._circuit.numQubits
    const dim = 1 << n
    let U = matIdentity(dim)

    const gatesByColumn = this._groupByColumn()

    for (let col = 0; col < this._circuit.numColumns; col++) {
      const gates = gatesByColumn.get(col) ?? []
      for (const gate of gates) {
        if (gate.type === 'MEASURE' || gate.type === 'BARRIER') continue
        const matrix = resolveGateMatrix(gate)
        if (matrix) {
          const fullOp = buildFullOperator(matrix, gate.targets, n)
          U = matMul(fullOp, U)
        }
      }
    }

    return U
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private _groupByColumn(): Map<number, Gate[]> {
    const map = new Map<number, Gate[]>()
    for (const gate of this._circuit.gates) {
      let list = map.get(gate.column)
      if (!list) {
        list = []
        map.set(gate.column, list)
      }
      list.push(gate)
    }
    return map
  }

  private _makeSnapshot(
    column: number,
    state: StateVector,
    measurementOutcomes?: Map<number, number>,
  ): CircuitSnapshot {
    const n = this._circuit.numQubits
    const blochVectors: BlochVector[] = []

    for (let q = 0; q < n; q++) {
      const bv = reducedBlochVector(state, n, q)
      blochVectors.push(bv)
    }

    return {
      column,
      state,
      blochVectors,
      measurementOutcomes,
    }
  }
}
