/**
 * Qubit Circuit Simulator — Public API
 *
 * Provides the simulation engine, types, gate registry, algebra generation,
 * and QASM import/export. No DOM or React dependencies.
 */

export * from './types'
export { CircuitSimulator } from './circuit-simulator'
export { getGateInfo, resolveGateMatrix, getGatesByCategory } from './gate-registry'
export { parseInitialState } from './initial-state'
export { generateAlgebra } from './algebra'
export { toQASM, fromQASM } from './qasm'
