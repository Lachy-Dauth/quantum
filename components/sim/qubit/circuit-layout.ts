/**
 * Pure layout functions for computing circuit diagram positions.
 * No React dependency — used by SVG circuit components.
 */

import type { Gate, Circuit } from '@/lib/sim/qubit/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const WIRE_SPACING = 48       // Vertical spacing between qubit wires
export const COLUMN_WIDTH = 60       // Horizontal width per column
export const GATE_SIZE = 40          // Width/height of gate boxes
export const LABEL_WIDTH = 40        // Width reserved for qubit labels
export const PADDING_TOP = 20        // Top padding
export const PADDING_RIGHT = 40      // Right padding for extra space

// ---------------------------------------------------------------------------
// Layout calculations
// ---------------------------------------------------------------------------

/** Y coordinate for the center of a qubit wire. */
export function wireY(qubitIndex: number): number {
  return PADDING_TOP + qubitIndex * WIRE_SPACING + WIRE_SPACING / 2
}

/** X coordinate for the center of a column. */
export function columnX(column: number): number {
  return LABEL_WIDTH + column * COLUMN_WIDTH + COLUMN_WIDTH / 2
}

/** Total SVG width for a circuit. */
export function svgWidth(numColumns: number): number {
  return LABEL_WIDTH + Math.max(numColumns + 1, 3) * COLUMN_WIDTH + PADDING_RIGHT
}

/** Total SVG height for a circuit. */
export function svgHeight(numQubits: number): number {
  return PADDING_TOP + numQubits * WIRE_SPACING + 20
}

/** Position of a gate box (top-left corner). */
export function gatePosition(column: number, qubitIndex: number): { x: number; y: number } {
  return {
    x: columnX(column) - GATE_SIZE / 2,
    y: wireY(qubitIndex) - GATE_SIZE / 2,
  }
}

/** Position of a drop zone. */
export function dropZoneRect(column: number, qubitIndex: number): {
  x: number
  y: number
  width: number
  height: number
} {
  return {
    x: columnX(column) - COLUMN_WIDTH / 2,
    y: wireY(qubitIndex) - WIRE_SPACING / 2,
    width: COLUMN_WIDTH,
    height: WIRE_SPACING,
  }
}
