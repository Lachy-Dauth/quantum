'use client'

import { wireY, LABEL_WIDTH, svgWidth } from './circuit-layout'

interface CircuitWireProps {
  qubitIndex: number
  numColumns: number
}

export function CircuitWire({ qubitIndex, numColumns }: CircuitWireProps) {
  const y = wireY(qubitIndex)
  const endX = svgWidth(numColumns) - 20

  return (
    <g>
      {/* Qubit label */}
      <text
        x={8}
        y={y}
        dominantBaseline="central"
        className="fill-foreground text-xs font-mono select-none"
      >
        q{qubitIndex}
      </text>
      {/* Wire line */}
      <line
        x1={LABEL_WIDTH}
        y1={y}
        x2={endX}
        y2={y}
        className="stroke-border"
        strokeWidth={1}
      />
    </g>
  )
}
