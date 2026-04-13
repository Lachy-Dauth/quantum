'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useKaTeXCache } from './useKaTeXCache'
import type { AlgebraStep } from '@/lib/sim/qubit/types'

interface AlgebraPanelProps {
  steps: AlgebraStep[]
  currentStep: number
  className?: string
}

/**
 * Collapsible panel showing step-by-step algebra with KaTeX rendering.
 * Each step can be expanded to show the full matrix multiplication.
 */
export function AlgebraPanel({ steps, currentStep, className }: AlgebraPanelProps) {
  const { renderLatex } = useKaTeXCache()
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (col: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(col)) {
        next.delete(col)
      } else {
        next.add(col)
      }
      return next
    })
  }

  if (steps.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
        <h3 className="text-xs font-medium text-muted-foreground">Step-by-step Algebra</h3>
        <p className="mt-1 text-xs text-muted-foreground">Add gates to see the algebra.</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-2 text-xs font-medium text-muted-foreground">Step-by-step Algebra</h3>
      <div className="flex flex-col gap-1 overflow-x-auto">
        {steps.map((step) => {
          const isActive = step.column === currentStep - 1
          const isExpanded = expandedSteps.has(step.column)
          const latex = isExpanded ? step.latexExpanded : step.latex
          const html = renderLatex(latex, false)

          return (
            <div
              key={step.column}
              className={cn(
                'group rounded px-2 py-1.5 transition-colors',
                isActive && 'bg-primary/10',
              )}
            >
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-xs font-mono text-muted-foreground mt-0.5">
                  {step.column + 1}.
                </span>
                <div
                  className="min-w-0 overflow-x-auto text-sm"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                {step.latexExpanded !== step.latex && (
                  <button
                    onClick={() => toggleStep(step.column)}
                    className={cn(
                      'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                      'text-muted-foreground hover:text-foreground hover:bg-muted',
                      isExpanded && 'bg-muted text-foreground',
                    )}
                    aria-label={isExpanded ? 'Collapse step' : 'Expand step to show matrix'}
                  >
                    {isExpanded ? 'hide' : 'matrix'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
