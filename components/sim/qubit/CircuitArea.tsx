'use client'

import { cn } from '@/lib/utils'
import { CircuitWire } from './CircuitWire'
import { PlacedGate } from './PlacedGate'
import { DropZone } from './DropZone'
import {
  svgWidth,
  svgHeight,
  columnX,
  wireY,
  PADDING_TOP,
  WIRE_SPACING,
  COLUMN_WIDTH,
} from './circuit-layout'
import type { Circuit, Gate } from '@/lib/sim/qubit/types'

interface CircuitAreaProps {
  circuit: Circuit
  currentStep: number
  highlightGates?: number[]
  readOnly?: boolean
  showDropZones?: boolean
  onGateClick?: (gate: Gate) => void
  onGateContextMenu?: (gate: Gate, e: React.MouseEvent) => void
  className?: string
}

export function CircuitArea({
  circuit,
  currentStep,
  highlightGates,
  readOnly,
  showDropZones = true,
  onGateClick,
  onGateContextMenu,
  className,
}: CircuitAreaProps) {
  const width = svgWidth(circuit.numColumns)
  const height = svgHeight(circuit.numQubits)

  const highlightSet = new Set(highlightGates ?? [])

  // Drop zone columns: existing columns + 1 extra for new gates
  const dropColumns = circuit.numColumns + 1

  return (
    <div className={cn('relative overflow-x-auto rounded-lg border border-border bg-background', className)}>
      {/* SVG circuit diagram */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="select-none"
        role="img"
        aria-label={`Quantum circuit with ${circuit.numQubits} qubits and ${circuit.numColumns} steps`}
      >
        {/* Qubit wires */}
        {Array.from({ length: circuit.numQubits }, (_, i) => (
          <CircuitWire
            key={`wire-${i}`}
            qubitIndex={i}
            numColumns={Math.max(circuit.numColumns, 2)}
          />
        ))}

        {/* Playhead line at current step */}
        {currentStep > 0 && currentStep <= circuit.numColumns && (
          <line
            x1={columnX(currentStep - 1) + COLUMN_WIDTH / 2}
            y1={PADDING_TOP}
            x2={columnX(currentStep - 1) + COLUMN_WIDTH / 2}
            y2={PADDING_TOP + circuit.numQubits * WIRE_SPACING}
            className="stroke-primary"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.6}
          />
        )}

        {/* Gates */}
        {circuit.gates.map((gate, idx) => (
          <PlacedGate
            key={gate.id}
            gate={gate}
            numQubits={circuit.numQubits}
            highlighted={highlightSet.has(idx)}
            isCurrentStep={gate.column === currentStep - 1}
            onClick={readOnly ? undefined : onGateClick}
            onContextMenu={readOnly ? undefined : onGateContextMenu}
          />
        ))}
      </svg>

      {/* HTML drop zones overlaying the SVG */}
      {!readOnly && showDropZones && Array.from({ length: dropColumns }, (_, col) =>
        Array.from({ length: circuit.numQubits }, (_, q) => (
          <DropZone
            key={`drop-${col}-${q}`}
            column={col}
            qubitIndex={q}
            style={{
              left: columnX(col) - COLUMN_WIDTH / 2,
              top: wireY(q) - WIRE_SPACING / 2,
              width: COLUMN_WIDTH,
              height: WIRE_SPACING,
            }}
          />
        ))
      )}
    </div>
  )
}
