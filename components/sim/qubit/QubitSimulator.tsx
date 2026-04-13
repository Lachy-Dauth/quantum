'use client'

import { useState, useCallback, useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { useCircuitReducer } from './useCircuitReducer'
import { useBlochAnimation } from './useBlochAnimation'
import { Toolbar } from './Toolbar'
import { GatePalette } from './GatePalette'
import { CircuitArea } from './CircuitArea'
import { StateVectorTable } from './StateVectorTable'
import { BlochSphere } from './BlochSphere'
import { AlgebraPanel } from './AlgebraPanel'
import { BatchResultsPanel } from './BatchResultsPanel'
import { GateContextMenu } from './GateContextMenu'
import { ParamEditor } from './ParamEditor'
import { MatrixPopup } from './MatrixPopup'
import { FidelityMeter } from './FidelityMeter'
import { VerifyButton } from './VerifyButton'
import { getGateInfo } from '@/lib/sim/qubit/gate-registry'
import type { QubitSimulatorProps, Gate, GateType } from '@/lib/sim/qubit/types'

export function QubitSimulator({
  qubits,
  initialState,
  circuit: preloadedCircuit,
  readOnly = false,
  showBlochSphere,
  showStateVector = true,
  showMatrixView = true,
  showAlgebra: initialShowAlgebra = false,
  highlightGates,
  onStateChange,
  maxSteps = 20,
  targetState,
  verifyCircuit,
  displayBasis: initialBasis = 'computational',
  showStatistics = true,
  batchRuns = 1000,
  className,
}: QubitSimulatorProps) {
  const defaultShowBloch = showBlochSphere ?? qubits <= 2

  const {
    state,
    dispatch,
    runBatch,
    currentSnapshot,
    previousSnapshot,
  } = useCircuitReducer(qubits, initialState, preloadedCircuit)

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    gate: Gate
    position: { x: number; y: number }
  } | null>(null)

  // Param editor state
  const [paramEditor, setParamEditor] = useState<{
    gateType: GateType
    gateId?: string
    params?: Gate['params']
  } | null>(null)

  // Matrix popup state
  const [matrixPopup, setMatrixPopup] = useState<{
    gate: Gate
    position: { x: number; y: number }
  } | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bloch animation
  const animatedBloch = useBlochAnimation(currentSnapshot?.blochVectors)

  // Next column for adding gates
  const nextColumn = state.circuit.numColumns

  const maxStep = state.simulationResult
    ? state.simulationResult.snapshots.length - 1
    : 0

  // Handle DnD drop
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const gateType = active.data.current?.gateType as GateType | undefined
    if (!gateType) return

    // Parse drop zone id: "drop-{column}-{qubitIndex}"
    const match = String(over.id).match(/^drop-(\d+)-(\d+)$/)
    if (!match) return

    const column = parseInt(match[1]!, 10)
    const qubitIndex = parseInt(match[2]!, 10)

    const info = getGateInfo(gateType)

    // For parameterised gates, open editor first
    if (info.parameterized) {
      setParamEditor({
        gateType,
        params: { theta: Math.PI / 2 },
      })
      // Store pending drop info
      pendingDropRef.current = { column, qubitIndex, gateType }
      return
    }

    addGateAt(gateType, column, qubitIndex)
  }, [])

  // Pending drop reference for param editor flow
  const pendingDropRef = { current: null as { column: number; qubitIndex: number; gateType: GateType } | null }

  const addGateAt = useCallback((gateType: GateType, column: number, qubitIndex: number, params?: Gate['params']) => {
    const info = getGateInfo(gateType)
    let targets: number[]

    if (info.numQubits === 1) {
      targets = [qubitIndex]
    } else if (info.numQubits === 2) {
      // Default: target on qubit below control, or qubit above if at bottom
      const target2 = qubitIndex < qubits - 1 ? qubitIndex + 1 : qubitIndex - 1
      targets = [qubitIndex, target2]
    } else if (info.numQubits === 3) {
      const t2 = Math.min(qubitIndex + 1, qubits - 1)
      const t3 = Math.min(qubitIndex + 2, qubits - 1)
      targets = [qubitIndex, t2, t3]
    } else {
      targets = [qubitIndex]
    }

    dispatch({
      type: 'ADD_GATE',
      gate: { type: gateType, targets, column, params },
    })
  }, [dispatch, qubits])

  // Handle clicking a gate in the palette (non-DnD fallback)
  const handlePaletteGateSelect = useCallback((gateType: GateType) => {
    const info = getGateInfo(gateType)
    if (info.parameterized) {
      setParamEditor({ gateType, params: { theta: Math.PI / 2 } })
      pendingDropRef.current = { column: nextColumn, qubitIndex: 0, gateType }
      return
    }
    addGateAt(gateType, nextColumn, 0)
  }, [addGateAt, nextColumn])

  // Gate click handler: show matrix popup
  const handleGateClick = useCallback((gate: Gate) => {
    // Toggle matrix popup for the clicked gate
    setMatrixPopup(prev => {
      if (prev && prev.gate.id === gate.id) return null
      // Position near center of viewport as a fallback
      return { gate, position: { x: window.innerWidth / 2 - 100, y: 100 } }
    })
  }, [])

  const handleGateContextMenu = useCallback((gate: Gate, e: React.MouseEvent) => {
    setContextMenu({
      gate,
      position: { x: e.clientX, y: e.clientY },
    })
  }, [])

  const handleDeleteGate = useCallback(() => {
    if (contextMenu) {
      dispatch({ type: 'REMOVE_GATE', id: contextMenu.gate.id })
    }
  }, [contextMenu, dispatch])

  const handleEditParams = useCallback(() => {
    if (contextMenu) {
      setParamEditor({
        gateType: contextMenu.gate.type,
        gateId: contextMenu.gate.id,
        params: contextMenu.gate.params,
      })
    }
  }, [contextMenu])

  const handleParamSave = useCallback((params: Gate['params']) => {
    if (paramEditor?.gateId) {
      // Editing existing gate
      dispatch({ type: 'UPDATE_GATE_PARAMS', id: paramEditor.gateId, params })
    } else if (pendingDropRef.current) {
      // Adding new gate from pending drop
      const { column, qubitIndex, gateType } = pendingDropRef.current
      addGateAt(gateType, column, qubitIndex, params)
      pendingDropRef.current = null
    }
  }, [paramEditor, dispatch, addGateAt])

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={cn('flex flex-col gap-3', className)}>
        {/* Toolbar */}
        <Toolbar
          currentStep={state.currentStep}
          maxStep={maxStep}
          speed={state.speed}
          displayBasis={state.displayBasis}
          showAlgebra={state.showAlgebra}
          batchRunning={state.batchRunning}
          readOnly={readOnly}
          numQubits={qubits}
          batchRuns={batchRuns}
          onStepBack={() => dispatch({ type: 'STEP_BACK' })}
          onStepForward={() => dispatch({ type: 'STEP_FORWARD' })}
          onRunAll={() => dispatch({ type: 'RUN_ALL' })}
          onReset={() => dispatch({ type: 'RESET' })}
          onSpeedChange={speed => dispatch({ type: 'SET_SPEED', speed })}
          onBasisChange={basis => dispatch({ type: 'SET_DISPLAY_BASIS', basis })}
          onToggleAlgebra={() => dispatch({ type: 'TOGGLE_ALGEBRA' })}
          onBatchRun={runBatch}
        />

        {/* Main content area */}
        <div className="flex gap-3">
          {/* Gate palette (desktop sidebar) */}
          {!readOnly && (
            <div className="hidden lg:block w-[160px] shrink-0 rounded-lg border border-border bg-background overflow-y-auto max-h-[500px]">
              <GatePalette onGateSelect={handlePaletteGateSelect} />
            </div>
          )}

          {/* Circuit + state panels */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Mobile/tablet palette */}
            {!readOnly && (
              <div className="lg:hidden overflow-x-auto">
                <GatePalette
                  onGateSelect={handlePaletteGateSelect}
                  className="flex-row flex-wrap"
                />
              </div>
            )}

            {/* Circuit area */}
            <CircuitArea
              circuit={state.circuit}
              currentStep={state.currentStep}
              highlightGates={highlightGates}
              readOnly={readOnly}
              onGateClick={handleGateClick}
              onGateContextMenu={handleGateContextMenu}
            />

            {/* State vector table */}
            {showStateVector && currentSnapshot && (
              <StateVectorTable
                snapshot={currentSnapshot}
                numQubits={qubits}
                previousSnapshot={previousSnapshot ?? undefined}
              />
            )}

            {/* Bloch spheres (animated) */}
            {defaultShowBloch && currentSnapshot && (
              <div className="flex flex-wrap gap-3">
                {animatedBloch.map((bv, i) => (
                  <BlochSphere
                    key={i}
                    blochVector={bv}
                    qubitIndex={i}
                  />
                ))}
              </div>
            )}

            {/* Fidelity meter */}
            {targetState && currentSnapshot && (
              <FidelityMeter
                currentState={currentSnapshot.state}
                targetState={targetState}
              />
            )}

            {/* Verify button */}
            {verifyCircuit && (
              <VerifyButton
                circuit={state.circuit.gates}
                verifyCircuit={verifyCircuit}
              />
            )}

            {/* Batch results */}
            {state.batchResult && showStatistics && (
              <BatchResultsPanel result={state.batchResult} />
            )}
          </div>
        </div>

        {/* Algebra panel */}
        {state.showAlgebra && state.algebraSteps && (
          <AlgebraPanel
            steps={state.algebraSteps}
            currentStep={state.currentStep}
          />
        )}

        {/* Error display */}
        {state.error && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-3 py-2 text-xs text-red-700 dark:text-red-300">
            {state.error}
          </div>
        )}

        {/* Context menu */}
        {contextMenu && (
          <GateContextMenu
            gate={contextMenu.gate}
            position={contextMenu.position}
            onDelete={handleDeleteGate}
            onEditParams={handleEditParams}
            onClose={() => setContextMenu(null)}
          />
        )}

        {/* Param editor */}
        {paramEditor && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
            <ParamEditor
              gateType={paramEditor.gateType}
              currentParams={paramEditor.params}
              onSave={handleParamSave}
              onClose={() => { setParamEditor(null); pendingDropRef.current = null }}
            />
          </div>
        )}

        {/* Matrix popup */}
        {matrixPopup && (
          <MatrixPopup
            gate={matrixPopup.gate}
            position={matrixPopup.position}
          />
        )}
      </div>
    </DndContext>
  )
}
