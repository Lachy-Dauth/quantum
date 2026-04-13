/**
 * Pure layout math for the Stern-Gerlach schematic.
 * All values in SVG user units (pixels at 1x).
 */

export const SOURCE_WIDTH = 60
export const SOURCE_HEIGHT = 40
export const MAGNET_WIDTH = 80
export const MAGNET_HEIGHT = 60
export const DETECTOR_WIDTH = 50
export const DETECTOR_HEIGHT = 36
export const BEAM_LENGTH = 60
export const VERTICAL_SPLIT = 40
export const STAGE_SPACING = MAGNET_WIDTH + BEAM_LENGTH * 2
export const PADDING_X = 20
export const PADDING_Y = 20

/** Y center for the source. */
export function sourceY(numApparatuses: number): number {
  // Center the diagram vertically. Max depth = numApparatuses apparatuses => tree depth branches
  const totalHeight = MAGNET_HEIGHT + VERTICAL_SPLIT * 2 * numApparatuses
  return PADDING_Y + totalHeight / 2
}

/** X position of the nth stage (0-indexed). */
export function stageX(stageIndex: number): number {
  return PADDING_X + SOURCE_WIDTH + BEAM_LENGTH + stageIndex * STAGE_SPACING
}

/** SVG viewport width for the given number of stages. */
export function svgWidth(numStages: number): number {
  return PADDING_X * 2 + SOURCE_WIDTH + numStages * STAGE_SPACING + DETECTOR_WIDTH + BEAM_LENGTH
}

/** SVG viewport height — generous for branching beams. */
export function svgHeight(numApparatuses: number): number {
  const totalHeight = Math.max(200, MAGNET_HEIGHT + VERTICAL_SPLIT * 4 * numApparatuses)
  return PADDING_Y * 2 + totalHeight
}
