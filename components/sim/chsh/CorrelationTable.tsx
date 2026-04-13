'use client'

import { cn } from '@/lib/utils'
import type { CHSHExperimentState } from '@/lib/sim/chsh/types'

interface CorrelationTableProps {
  state: CHSHExperimentState
  className?: string
}

function fmt(n: number): string {
  return n >= 0 ? `+${n.toFixed(3)}` : n.toFixed(3)
}

function fmtAngle(a: number): string {
  return `${(a * 180 / Math.PI).toFixed(1)}°`
}

/**
 * 2x2 correlation table + CHSH S value display.
 */
export function CorrelationTable({ state, className }: CorrelationTableProps) {
  const [p00, p01, p10, p11] = state.pairStats
  const classicalBound = 2
  const quantumBound = 2 * Math.SQRT2
  const absS = Math.abs(state.empiricalS)
  const absSTheory = Math.abs(state.theoreticalS)

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-2 text-xs font-medium text-muted-foreground">Correlation Table</h3>

      {/* 2x2 grid */}
      <div className="overflow-x-auto">
        <table className="text-xs font-mono w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-muted-foreground"></th>
              <th className="px-2 py-1 text-center text-muted-foreground">
                b1 ({fmtAngle(state.bobAngles[0])})
              </th>
              <th className="px-2 py-1 text-center text-muted-foreground">
                b2 ({fmtAngle(state.bobAngles[1])})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-muted-foreground">a1 ({fmtAngle(state.aliceAngles[0])})</td>
              <td className="px-2 py-1 text-center">
                E = {fmt(p00!.correlation)}
                <br />
                <span className="text-muted-foreground/70">({p00!.trials})</span>
              </td>
              <td className="px-2 py-1 text-center">
                E = {fmt(p01!.correlation)}
                <br />
                <span className="text-muted-foreground/70">({p01!.trials})</span>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1 text-muted-foreground">a2 ({fmtAngle(state.aliceAngles[1])})</td>
              <td className="px-2 py-1 text-center">
                E = {fmt(p10!.correlation)}
                <br />
                <span className="text-muted-foreground/70">({p10!.trials})</span>
              </td>
              <td className="px-2 py-1 text-center">
                E = {fmt(p11!.correlation)}
                <br />
                <span className="text-muted-foreground/70">({p11!.trials})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* S value */}
      <div className="mt-3 pt-2 border-t border-border">
        <div className="text-xs font-mono mb-1">
          S = E(a1,b1) + E(a1,b2) + E(a2,b1) &minus; E(a2,b2) = <span className="font-bold">{fmt(state.empiricalS)}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          |S| = {absS.toFixed(3)} &nbsp;
          (theory: {absSTheory.toFixed(3)})
        </div>

        {/* Progress bar */}
        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
          {/* Classical bound marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-foreground/50"
            style={{ left: `${(classicalBound / 3) * 100}%` }}
          />
          {/* Quantum bound marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary/50"
            style={{ left: `${(quantumBound / 3) * 100}%` }}
          />
          {/* Empirical bar */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              absS > classicalBound ? 'bg-primary' : 'bg-muted-foreground/40',
            )}
            style={{ width: `${Math.min((absS / 3) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
          <span>0</span>
          <span>Classical: 2</span>
          <span>Quantum: 2.83</span>
        </div>
      </div>
    </div>
  )
}
