'use client'

import { cn } from '@/lib/utils'
import type { Observables } from '@/lib/sim/schrodinger/types'

interface ObservablesBarProps {
  observables: Observables
  className?: string
}

/**
 * Displays current simulation observables: time, <x>, <p>, <E>, norm.
 */
export function ObservablesBar({ observables, className }: ObservablesBarProps) {
  const { time, expectationX, expectationP, expectationE, norm } = observables
  const normOk = Math.abs(norm - 1) < 0.01

  return (
    <div className={cn(
      'flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs',
      className,
    )}>
      <span className="text-muted-foreground">
        t = <span className="text-foreground">{time.toFixed(4)}</span>
      </span>
      <span className="text-muted-foreground">
        ⟨x⟩ = <span className="text-foreground">{expectationX.toFixed(4)}</span>
      </span>
      <span className="text-muted-foreground">
        ⟨p⟩ = <span className="text-foreground">{expectationP.toFixed(4)}</span>
      </span>
      <span className="text-muted-foreground">
        ⟨E⟩ = <span className="text-foreground">{expectationE.toFixed(4)}</span>
      </span>
      <span className="text-muted-foreground">
        norm ={' '}
        <span className={normOk ? 'text-foreground' : 'text-red-500 font-semibold'}>
          {norm.toFixed(6)}
        </span>
      </span>
    </div>
  )
}
