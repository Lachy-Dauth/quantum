'use client'

import { cn } from '@/lib/utils'

interface SGHistogramProps {
  detectorCounts: Map<string, number>
  totalEmitted: number
  totalBlocked: number
  theoreticalProbs?: Map<string, number>
  className?: string
}

/**
 * Histogram of detector counts for the Stern-Gerlach experiment.
 */
export function SGHistogram({
  detectorCounts,
  totalEmitted,
  totalBlocked,
  theoreticalProbs,
  className,
}: SGHistogramProps) {
  const entries = [...detectorCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const maxCount = entries.reduce((max, [, c]) => Math.max(max, c), 1)
  const totalDetected = totalEmitted - totalBlocked

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-2 text-xs font-medium text-muted-foreground">
        Measurement Statistics
        <span className="ml-2 text-muted-foreground/70">
          ({totalDetected} detected, {totalBlocked} blocked, {totalEmitted} total)
        </span>
      </h3>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">No particles detected yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {entries.map(([detector, count]) => {
            const pct = totalDetected > 0 ? (count / totalDetected) * 100 : 0
            const theory = theoreticalProbs?.get(detector)

            return (
              <div key={detector} className="flex items-center gap-2">
                <span className="w-20 text-right font-mono text-xs text-muted-foreground truncate">
                  {formatDetectorLabel(detector)}
                </span>
                <div className="h-4 flex-1 rounded bg-muted overflow-hidden">
                  <div
                    className="h-full rounded bg-primary/70 transition-all duration-300"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-muted-foreground">
                  {pct.toFixed(1)}%
                </span>
                {theory !== undefined && (
                  <span className="w-14 text-right text-[10px] text-muted-foreground/70">
                    ({(theory * 100).toFixed(1)}%)
                  </span>
                )}
                <span className="w-10 text-right text-xs text-muted-foreground font-mono">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatDetectorLabel(key: string): string {
  // "m1:up" -> "M1 +"
  const [id, beam] = key.split(':')
  const label = id!.replace('m', 'M')
  const sign = beam === 'up' ? '+' : '-'
  return `${label} ${sign}`
}
