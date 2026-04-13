'use client'

import { cn } from '@/lib/utils'
import { formatComplex } from '@/lib/sim/core/utils'
import type { SGSingleResult } from '@/lib/sim/stern-gerlach/types'
import type { StateVector } from '@/lib/sim/core/types'

interface SGStateDisplayProps {
  initialState: StateVector
  lastResult?: SGSingleResult | null
  className?: string
}

function formatState(state: StateVector): string {
  const a0 = formatComplex({ re: state.real[0]!, im: state.imag[0]! })
  const a1 = formatComplex({ re: state.real[1]!, im: state.imag[1]! })
  return `(${a0})|0⟩ + (${a1})|1⟩`
}

/**
 * Displays the quantum state at each stage of the SG experiment.
 */
export function SGStateDisplay({ initialState, lastResult, className }: SGStateDisplayProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-2 text-xs font-medium text-muted-foreground">State at Each Stage</h3>
      <div className="flex flex-col gap-1 overflow-x-auto">
        {/* Initial state */}
        <div className="rounded px-2 py-1 text-sm font-mono">
          <span className="text-muted-foreground mr-2">Source:</span>
          |ψ⟩ = {formatState(initialState)}
        </div>

        {/* After each apparatus */}
        {lastResult?.outcomes.map((outcome, i) => (
          <div
            key={i}
            className={cn(
              'rounded px-2 py-1 text-sm font-mono',
              outcome.output === 'up' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-orange-50 dark:bg-orange-900/10',
            )}
          >
            <span className="text-muted-foreground mr-2">
              After {outcome.apparatusId} ({outcome.output === 'up' ? '+' : '−'}, P={outcome.probability.toFixed(3)}):
            </span>
            |ψ⟩ = {formatState(outcome.stateAfter)}
          </div>
        ))}

        {lastResult?.blocked && (
          <div className="rounded px-2 py-1 text-sm text-red-600 dark:text-red-400 font-mono">
            Particle blocked at {lastResult.blockedAt}
          </div>
        )}
      </div>
    </div>
  )
}
