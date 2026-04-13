'use client'

import { cn } from '@/lib/utils'
import type { BatchResult } from '@/lib/sim/qubit/types'

interface BatchResultsPanelProps {
  result: BatchResult
  className?: string
}

export function BatchResultsPanel({ result, className }: BatchResultsPanelProps) {
  // Sort by count descending
  const entries = [...result.counts.entries()].sort((a, b) => b[1] - a[1])
  const maxCount = entries.length > 0 ? entries[0]![1] : 1

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-2 text-xs font-medium text-muted-foreground">
        Measurement Results ({result.totalRuns} runs)
      </h3>
      <div className="flex flex-col gap-1">
        {entries.map(([outcome, count]) => {
          const pct = (count / result.totalRuns) * 100
          return (
            <div key={outcome} className="flex items-center gap-2">
              <span className="w-16 text-right font-mono text-xs">|{outcome}⟩</span>
              <div className="h-4 flex-1 rounded bg-muted overflow-hidden">
                <div
                  className="h-full rounded bg-primary/70 transition-all duration-300"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs text-muted-foreground">
                {pct.toFixed(1)}%
              </span>
              <span className="w-12 text-right text-xs text-muted-foreground font-mono">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
