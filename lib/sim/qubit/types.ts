/**
 * Type definitions for the Qubit Circuit Simulator.
 * Defines gate types, circuit structure, simulation results, and component props.
 */

import type { DenseMatrix, StateVector } from '../core/types'

// ---------------------------------------------------------------------------
// Gate types
// ---------------------------------------------------------------------------

export type GateType =
  | 'I'
  | 'X'
  | 'Y'
  | 'Z'
  | 'H'
  | 'S'
  | 'T'
  | 'S_DAG'
  | 'T_DAG'
  | 'RX'
  | 'RY'
  | 'RZ'
  | 'PHASE'
  | 'U'
  | 'CNOT'
  | 'CZ'
  | 'SWAP'
  | 'TOFFOLI'
  | 'MEASURE'
  | 'BARRIER'
  | 'CUSTOM'

/** A gate instance placed on the circuit. */
export interface Gate {
  /** Unique id for this gate placement (used for drag-and-drop). */
  id: string
  type: GateType
  /** Qubit wire indices this gate acts on.
   *  Length 1 for single-qubit, 2 for two-qubit, 3 for Toffoli.
   *  For CNOT: [control, target]. For Toffoli: [control1, control2, target]. */
  targets: number[]
  /** Parameters for parameterised gates. */
  params?: {
    theta?: number
    phi?: number
    lambda?: number
  }
  /** Column (time step) in the circuit. */
  column: number
  /** Display label override. */
  label?: string
  /** For CUSTOM gate: the unitary matrix. */
  customMatrix?: DenseMatrix
}

// ---------------------------------------------------------------------------
// Circuit
// ---------------------------------------------------------------------------

/** The full circuit definition. */
export interface Circuit {
  numQubits: number
  gates: Gate[]
  /** Number of columns (time steps). Derived from gates but cached. */
  numColumns: number
}

// ---------------------------------------------------------------------------
// Simulation results
// ---------------------------------------------------------------------------

/** A snapshot of the quantum state at a particular point in the circuit. */
export interface CircuitSnapshot {
  /** Column index (0 = initial state, 1 = after first column, etc.) */
  column: number
  /** The full state vector. */
  state: StateVector
  /** Bloch vectors for each qubit's reduced state. */
  blochVectors: BlochVector[]
  /** If a measurement occurred, the outcome for each measured qubit. */
  measurementOutcomes?: Map<number, number>
}

/** Bloch sphere vector representation. */
export interface BlochVector {
  x: number
  y: number
  z: number
  /** How pure the qubit's reduced state is. 1 = pure, 0.5 = maximally mixed. */
  purity: number
}

/** Result of simulating the full circuit. */
export interface SimulationResult {
  snapshots: CircuitSnapshot[]
  finalState: StateVector
}

/** Result of batch simulation (many runs). */
export interface BatchResult {
  /** Map from measurement outcome (as binary string, e.g. "011") to count. */
  counts: Map<string, number>
  totalRuns: number
}

// ---------------------------------------------------------------------------
// Algebra
// ---------------------------------------------------------------------------

export interface AlgebraStep {
  column: number
  /** Full rendered equation in LaTeX. */
  latex: string
  /** With matrix entries written out. */
  latexExpanded: string
}

// ---------------------------------------------------------------------------
// Gate registry info
// ---------------------------------------------------------------------------

export interface GateInfo {
  /** The SIM_CORE matrix, or a factory for parameterised gates. */
  matrix: DenseMatrix | null
  /** Display label (e.g. "H", "Rx", "CNOT"). */
  label: string
  /** Short symbol for circuit rendering. */
  symbol: string
  /** Number of qubits this gate acts on. */
  numQubits: number
  /** Whether this gate has adjustable parameters. */
  parameterized: boolean
  /** Category for palette grouping. */
  category: 'single' | 'parameterized' | 'multi' | 'measurement' | 'utility'
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface QubitSimulatorProps {
  /** Number of qubit wires (1-6). */
  qubits: number
  /** Initial state: ket string ("|00>"), named ("bell_phi_plus"), or StateVector. */
  initialState?: string | StateVector
  /** Pre-loaded gates placed on mount. */
  circuit?: Gate[]
  /** If true, user cannot add/remove/move gates. */
  readOnly?: boolean
  /** Show Bloch sphere panel (default true for 1-2 qubits). */
  showBlochSphere?: boolean
  /** Show state vector table (default true). */
  showStateVector?: boolean
  /** Show matrix popup on gate hover (default true). */
  showMatrixView?: boolean
  /** Initial state of "show me the algebra" toggle (default false). */
  showAlgebra?: boolean
  /** Highlight specific gate indices with a coloured outline. */
  highlightGates?: number[]
  /** Callback fired on state changes. */
  onStateChange?: (state: StateVector, circuit: Gate[]) => void
  /** Maximum number of time steps allowed. Default 20. */
  maxSteps?: number
  /** Target state for "match this state" challenges. */
  targetState?: StateVector
  /** Custom verification function for problem sets. */
  verifyCircuit?: (circuit: Gate[]) => { correct: boolean; message?: string }
  /** Display basis: "computational" (default), "hadamard", or "bell" (2-qubit only). */
  displayBasis?: 'computational' | 'hadamard' | 'bell'
  /** Show measurement statistics panel (default true when circuit has MEASURE gates). */
  showStatistics?: boolean
  /** Number of runs for batch measurement mode. Default 1000. */
  batchRuns?: number
  /** CSS class name for the outer container. */
  className?: string
}
