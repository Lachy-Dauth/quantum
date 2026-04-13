'use client'

import { useReducer, useRef, useCallback, useEffect } from 'react'
import { CircuitSimulator } from '@/lib/sim/qubit/circuit-simulator'
import { generateAlgebra } from '@/lib/sim/qubit/algebra'
import type {
  Gate,
  Circuit,
  CircuitSnapshot,
  SimulationResult,
  BatchResult,
  AlgebraStep,
} from '@/lib/sim/qubit/types'
import type { StateVector } from '@/lib/sim/core/types'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface CircuitState {
  circuit: Circuit
  simulationResult: SimulationResult | null
  currentStep: number
  batchResult: BatchResult | null
  batchRunning: boolean
  displayBasis: 'computational' | 'hadamard' | 'bell'
  showAlgebra: boolean
  algebraSteps: AlgebraStep[] | null
  speed: number
  error: string | null
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type CircuitAction =
  | { type: 'ADD_GATE'; gate: Omit<Gate, 'id'> }
  | { type: 'REMOVE_GATE'; id: string }
  | { type: 'MOVE_GATE'; id: string; newColumn: number; newTargets: number[] }
  | { type: 'UPDATE_GATE_PARAMS'; id: string; params: Gate['params'] }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACK' }
  | { type: 'RUN_ALL' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_BATCH_RESULT'; result: BatchResult }
  | { type: 'SET_BATCH_RUNNING'; running: boolean }
  | { type: 'SET_DISPLAY_BASIS'; basis: 'computational' | 'hadamard' | 'bell' }
  | { type: 'TOGGLE_ALGEBRA' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_INITIAL_STATE'; state: StateVector | string }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESIMULATE'; result: SimulationResult; circuit: Circuit; algebraSteps: AlgebraStep[] | null }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function circuitReducer(state: CircuitState, action: CircuitAction): CircuitState {
  switch (action.type) {
    case 'RESIMULATE':
      return {
        ...state,
        circuit: action.circuit,
        simulationResult: action.result,
        currentStep: Math.min(state.currentStep, action.result.snapshots.length - 1),
        algebraSteps: action.algebraSteps,
        error: null,
      }

    case 'STEP_FORWARD': {
      const max = state.simulationResult ? state.simulationResult.snapshots.length - 1 : 0
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, max),
      }
    }

    case 'STEP_BACK':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      }

    case 'RUN_ALL': {
      const max = state.simulationResult ? state.simulationResult.snapshots.length - 1 : 0
      return { ...state, currentStep: max }
    }

    case 'RESET':
      return { ...state, currentStep: 0, batchResult: null }

    case 'SET_STEP': {
      const max = state.simulationResult ? state.simulationResult.snapshots.length - 1 : 0
      return { ...state, currentStep: Math.max(0, Math.min(action.step, max)) }
    }

    case 'SET_BATCH_RESULT':
      return { ...state, batchResult: action.result, batchRunning: false }

    case 'SET_BATCH_RUNNING':
      return { ...state, batchRunning: action.running }

    case 'SET_DISPLAY_BASIS':
      return { ...state, displayBasis: action.basis }

    case 'TOGGLE_ALGEBRA':
      return { ...state, showAlgebra: !state.showAlgebra }

    case 'SET_SPEED':
      return { ...state, speed: action.speed }

    case 'SET_ERROR':
      return { ...state, error: action.error }

    // These actions are handled in the hook via resimulate:
    case 'ADD_GATE':
    case 'REMOVE_GATE':
    case 'MOVE_GATE':
    case 'UPDATE_GATE_PARAMS':
    case 'SET_INITIAL_STATE':
      return state // handled by the wrapper dispatch
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCircuitReducer(
  numQubits: number,
  initialState?: string | StateVector,
  preloadedGates?: Gate[],
  seed?: number,
) {
  const simRef = useRef<CircuitSimulator>(new CircuitSimulator(numQubits, seed))

  const initialSimResult = (() => {
    const sim = simRef.current
    if (initialState) sim.setInitialState(initialState)
    if (preloadedGates) sim.setCircuit(preloadedGates)
    return sim.simulate()
  })()

  const [state, rawDispatch] = useReducer(circuitReducer, {
    circuit: simRef.current.circuit,
    simulationResult: initialSimResult,
    currentStep: 0,
    batchResult: null,
    batchRunning: false,
    displayBasis: 'computational',
    showAlgebra: false,
    algebraSteps: null,
    speed: 500,
    error: null,
  })

  /** Re-simulate and dispatch result. */
  const resimulate = useCallback(() => {
    const sim = simRef.current
    try {
      const result = sim.simulate()
      const algebraSteps = state.showAlgebra
        ? generateAlgebra(sim.circuit, result.snapshots)
        : null
      rawDispatch({
        type: 'RESIMULATE',
        result,
        circuit: { ...sim.circuit, gates: [...sim.circuit.gates] },
        algebraSteps,
      })
    } catch (e) {
      rawDispatch({ type: 'SET_ERROR', error: (e as Error).message })
    }
  }, [state.showAlgebra])

  /** Wrapped dispatch that handles sim-modifying actions. */
  const dispatch = useCallback((action: CircuitAction) => {
    const sim = simRef.current
    switch (action.type) {
      case 'ADD_GATE':
        sim.addGate(action.gate)
        resimulate()
        break
      case 'REMOVE_GATE':
        sim.removeGate(action.id)
        resimulate()
        break
      case 'MOVE_GATE':
        sim.moveGate(action.id, action.newColumn, action.newTargets)
        resimulate()
        break
      case 'UPDATE_GATE_PARAMS':
        sim.updateGateParams(action.id, action.params)
        resimulate()
        break
      case 'SET_INITIAL_STATE':
        try {
          sim.setInitialState(action.state)
          resimulate()
        } catch (e) {
          rawDispatch({ type: 'SET_ERROR', error: (e as Error).message })
        }
        break
      case 'TOGGLE_ALGEBRA': {
        rawDispatch(action)
        // If turning on, generate algebra
        if (!state.showAlgebra && state.simulationResult) {
          const steps = generateAlgebra(sim.circuit, state.simulationResult.snapshots)
          rawDispatch({
            type: 'RESIMULATE',
            result: state.simulationResult,
            circuit: state.circuit,
            algebraSteps: steps,
          })
        }
        break
      }
      default:
        rawDispatch(action)
    }
  }, [resimulate, state.showAlgebra, state.simulationResult, state.circuit])

  /** Run batch simulation. */
  const runBatch = useCallback((n: number) => {
    rawDispatch({ type: 'SET_BATCH_RUNNING', running: true })
    // Run synchronously for now (< 500ms for 1000 runs at 4 qubits)
    try {
      const result = simRef.current.batchRun(n)
      rawDispatch({ type: 'SET_BATCH_RESULT', result })
    } catch (e) {
      rawDispatch({ type: 'SET_ERROR', error: (e as Error).message })
      rawDispatch({ type: 'SET_BATCH_RUNNING', running: false })
    }
  }, [])

  /** Get the current snapshot. */
  const currentSnapshot = state.simulationResult?.snapshots[state.currentStep] ?? null

  /** Get previous snapshot for highlighting changes. */
  const previousSnapshot = state.currentStep > 0
    ? state.simulationResult?.snapshots[state.currentStep - 1] ?? null
    : null

  return {
    state,
    dispatch,
    runBatch,
    currentSnapshot,
    previousSnapshot,
    simulator: simRef.current,
  }
}
