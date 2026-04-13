'use client'

import dynamic from 'next/dynamic'

const QubitSimulator = dynamic(
  () => import('@/components/sim/qubit').then(mod => ({ default: mod.QubitSimulator })),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" /> },
)

const SternGerlachSimulator = dynamic(
  () => import('@/components/sim/stern-gerlach').then(mod => ({ default: mod.SternGerlachSimulator })),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" /> },
)

const CHSHSimulatorUI = dynamic(
  () => import('@/components/sim/chsh').then(mod => ({ default: mod.CHSHSimulatorUI })),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" /> },
)

const SchrodingerSimulatorUI = dynamic(
  () => import('@/components/sim/schrodinger').then(mod => ({ default: mod.SchrodingerSimulatorUI })),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" /> },
)

interface SimulatorLoaderProps {
  simulator: string
}

/**
 * Client component that dynamically loads the appropriate simulator.
 * Uses next/dynamic to avoid SSR for canvas/dnd-kit components.
 */
export function SimulatorLoader({ simulator }: SimulatorLoaderProps) {
  switch (simulator) {
    case 'qubit':
      return <QubitSimulator qubits={2} showBlochSphere showStateVector />
    case 'stern-gerlach':
      return <SternGerlachSimulator />
    case 'chsh':
      return <CHSHSimulatorUI />
    case 'schrodinger':
      return <SchrodingerSimulatorUI />
    default:
      return null
  }
}
