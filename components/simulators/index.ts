import type { ComponentType } from 'react'
import { ArgandPlane } from './ArgandPlane'
import { ComplexMultiplication } from './ComplexMultiplication'
import { TriangleInequality } from './TriangleInequality'
import { RootsOfUnity } from './RootsOfUnity'
import { EulerFormulaCircle } from './EulerFormulaCircle'
import { GlobalRelativePhase } from './GlobalRelativePhase'

export interface SimulatorProps {
  initialState?: Record<string, unknown>
  height?: number
}

export const simulatorRegistry: Record<string, ComponentType<SimulatorProps>> = {
  'argand-plane': ArgandPlane,
  'complex-multiplication': ComplexMultiplication,
  'triangle-inequality': TriangleInequality,
  'roots-of-unity': RootsOfUnity,
  'euler-formula-circle': EulerFormulaCircle,
  'global-relative-phase': GlobalRelativePhase,
}
