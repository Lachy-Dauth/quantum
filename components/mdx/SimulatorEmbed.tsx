'use client'

import dynamic from 'next/dynamic'
import type { StateVector } from '@/lib/sim/core/types'
import type { Gate } from '@/lib/sim/qubit/types'

const QubitSimulator = dynamic(
  () => import('@/components/sim/qubit').then(mod => ({ default: mod.QubitSimulator })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> },
)

const SternGerlachSimulator = dynamic(
  () => import('@/components/sim/stern-gerlach').then(mod => ({ default: mod.SternGerlachSimulator })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> },
)

const CHSHSimulatorUI = dynamic(
  () => import('@/components/sim/chsh').then(mod => ({ default: mod.CHSHSimulatorUI })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> },
)

const SchrodingerSimulatorUI = dynamic(
  () => import('@/components/sim/schrodinger').then(mod => ({ default: mod.SchrodingerSimulatorUI })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> },
)

interface SimulatorEmbedProps {
  simulator: string
  /** For qubit simulator: number of qubits. */
  qubits?: number
  /** Initial state string ("|00>", "|+0>", "bell_phi_plus"). */
  initialState?: string
  /** Pre-loaded gates. */
  circuit?: Gate[]
  /** If true, user cannot modify the circuit. */
  readOnly?: boolean
  /** Show Bloch sphere. */
  showBlochSphere?: boolean
  /** Show state vector table. */
  showStateVector?: boolean
  /** Show algebra panel by default. */
  showAlgebra?: boolean
  /** Gates to highlight. */
  highlightGates?: number[]
  /** Target state for challenges. */
  targetState?: StateVector
  /** Verification function. */
  verifyCircuit?: (gates: Gate[]) => { correct: boolean; message?: string }
  /** Caption below the simulator. */
  caption?: string
  /** Height hint (not used by real simulator, for backwards compat). */
  height?: number
  /** Pass-through props as a record. */
  initialProps?: Record<string, unknown>
}

export function SimulatorEmbed({
  simulator,
  qubits = 2,
  initialState,
  circuit,
  readOnly,
  showBlochSphere,
  showStateVector,
  showAlgebra,
  highlightGates,
  targetState,
  verifyCircuit,
  caption,
  initialProps,
}: SimulatorEmbedProps) {
  const renderSimulator = () => {
    switch (simulator) {
      case 'qubit':
        return (
          <QubitSimulator
            qubits={qubits}
            initialState={initialState}
            circuit={circuit}
            readOnly={readOnly}
            showBlochSphere={showBlochSphere}
            showStateVector={showStateVector}
            showAlgebra={showAlgebra}
            highlightGates={highlightGates}
            targetState={targetState}
            verifyCircuit={verifyCircuit}
          />
        )
      case 'stern-gerlach':
        return (
          <SternGerlachSimulator
            initialState={initialState}
            editable={!readOnly}
          />
        )
      case 'chsh':
        return (
          <CHSHSimulatorUI
            editable={!readOnly}
          />
        )
      case 'schrodinger':
        return (
          <SchrodingerSimulatorUI
            potential={(initialProps?.potential as string as import('@/lib/sim/schrodinger/types').PotentialType) ?? undefined}
            potentialParams={initialProps?.potentialParams as Record<string, number> | undefined}
            showControls={!readOnly}
          />
        )
      default:
        return (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-8">
            <p className="text-sm text-muted-foreground">Unknown simulator: {simulator}</p>
          </div>
        )
    }
  }

  return (
    <div className="my-6">
      {renderSimulator()}
      {caption && <p className="mt-2 text-center text-sm text-muted-foreground">{caption}</p>}
    </div>
  )
}
