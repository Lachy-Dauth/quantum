'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { formatComplex } from '@/lib/sim/core/utils'
import type { CircuitSnapshot } from '@/lib/sim/qubit/types'

interface StateVectorTableProps {
  snapshot: CircuitSnapshot
  numQubits: number
  previousSnapshot?: CircuitSnapshot
  className?: string
}

/** Probability below which rows are collapsed. */
const COLLAPSE_THRESHOLD = 0.001

export function StateVectorTable({
  snapshot,
  numQubits,
  previousSnapshot,
  className,
}: StateVectorTableProps) {
  const [showAll, setShowAll] = useState(false)
  const state = snapshot.state
  const dim = state.dim

  // Build rows
  const rows: {
    index: number
    label: string
    re: number
    im: number
    prob: number
    phase: number
    changed: boolean
  }[] = []

  for (let i = 0; i < dim; i++) {
    const re = state.real[i]!
    const im = state.imag[i]!
    const prob = re * re + im * im
    const phase = Math.atan2(im, re)
    const label = i.toString(2).padStart(numQubits, '0')

    // Check if amplitude changed from previous snapshot
    let changed = false
    if (previousSnapshot) {
      const prevRe = previousSnapshot.state.real[i]!
      const prevIm = previousSnapshot.state.imag[i]!
      changed = Math.abs(re - prevRe) > 1e-10 || Math.abs(im - prevIm) > 1e-10
    }

    rows.push({ index: i, label, re, im, prob, phase, changed })
  }

  // Separate visible and hidden rows
  const visibleRows = showAll ? rows : rows.filter(r => r.prob >= COLLAPSE_THRESHOLD)
  const hiddenCount = rows.length - rows.filter(r => r.prob >= COLLAPSE_THRESHOLD).length

  return (
    <div className={cn('rounded-lg border border-border bg-background', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Basis</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Amplitude</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Probability</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Phase</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(row => (
              <tr
                key={row.index}
                className={cn(
                  'border-b border-border/50 transition-colors',
                  row.changed && 'bg-primary/5',
                )}
              >
                <td className="px-3 py-1.5 font-mono text-xs">
                  |{row.label}⟩
                </td>
                <td className="px-3 py-1.5 font-mono text-xs">
                  {formatComplex({ re: row.re, im: row.im })}
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-200"
                        style={{ width: `${Math.min(row.prob * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {(row.prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    {/* Phase disc */}
                    <svg width={16} height={16} viewBox="0 0 16 16">
                      <circle cx={8} cy={8} r={7} className="fill-muted stroke-border" strokeWidth={0.5} />
                      {row.prob > 1e-10 && (
                        <line
                          x1={8}
                          y1={8}
                          x2={8 + 6 * Math.cos(row.phase)}
                          y2={8 - 6 * Math.sin(row.phase)}
                          className="stroke-primary"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <span className="text-xs text-muted-foreground">
                      {row.prob > 1e-10 ? `${row.phase.toFixed(2)}` : '—'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          Show {hiddenCount} more rows (probability &lt; 0.1%)
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          Hide low-probability rows
        </button>
      )}
    </div>
  )
}
