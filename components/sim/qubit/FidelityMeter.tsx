'use client'

import { cn } from '@/lib/utils'
import { innerProduct } from '@/lib/sim/core/vector'
import type { StateVector } from '@/lib/sim/core/types'

interface FidelityMeterProps {
  currentState: StateVector
  targetState: StateVector
  className?: string
}

const SUCCESS_THRESHOLD = 0.999

/**
 * Displays |<target|current>|^2 as a progress bar.
 * Shows green checkmark when fidelity >= SUCCESS_THRESHOLD.
 */
export function FidelityMeter({ currentState, targetState, className }: FidelityMeterProps) {
  const overlap = innerProduct(targetState, currentState)
  const fidelity = overlap.re * overlap.re + overlap.im * overlap.im
  const isSuccess = fidelity >= SUCCESS_THRESHOLD
  const pct = Math.round(fidelity * 100 * 10) / 10 // 1 decimal

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-xs font-medium text-muted-foreground">
          Fidelity with target state
        </h3>
        <span className={cn(
          'text-xs font-mono font-medium',
          isSuccess ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
        )}>
          {isSuccess ? 'Match!' : `${pct.toFixed(1)}%`}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isSuccess ? 'bg-green-500' : 'bg-primary/70',
          )}
          style={{ width: `${Math.min(fidelity * 100, 100)}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground font-mono text-right">
        |&langle;target|current&rangle;|&sup2; = {fidelity.toFixed(4)}
      </div>
    </div>
  )
}
