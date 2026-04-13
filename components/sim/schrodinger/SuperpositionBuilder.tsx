'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Eigenstate, SuperpositionCoeff } from '@/lib/sim/schrodinger/types'

interface SuperpositionBuilderProps {
  eigenstates: Eigenstate[]
  onApply: (coefficients: SuperpositionCoeff[]) => void
  className?: string
}

interface CoeffState {
  magnitude: number
  phase: number // in radians
}

/**
 * Superposition builder: adjust amplitude and phase for each eigenstate.
 */
export function SuperpositionBuilder({ eigenstates, onApply, className }: SuperpositionBuilderProps) {
  const [coeffs, setCoeffs] = useState<CoeffState[]>(() =>
    eigenstates.map((_, i) => ({
      magnitude: i === 0 ? 1 : 0,
      phase: 0,
    })),
  )

  // Normalize magnitudes
  const totalMagSq = coeffs.reduce((sum, c) => sum + c.magnitude * c.magnitude, 0)
  const normFactor = totalMagSq > 0 ? Math.sqrt(totalMagSq) : 1

  const updateCoeff = useCallback((index: number, field: 'magnitude' | 'phase', value: number) => {
    setCoeffs(prev => {
      const next = [...prev]
      // Grow array if needed
      while (next.length <= index) next.push({ magnitude: 0, phase: 0 })
      next[index] = { ...next[index]!, [field]: value }
      return next
    })
  }, [])

  const handleApply = useCallback(() => {
    const superCoeffs: SuperpositionCoeff[] = []
    for (let i = 0; i < coeffs.length; i++) {
      const c = coeffs[i]!
      if (c.magnitude > 0.001) {
        const normMag = c.magnitude / normFactor
        superCoeffs.push({
          eigenstateIndex: i,
          amplitude: {
            re: normMag * Math.cos(c.phase),
            im: normMag * Math.sin(c.phase),
          },
        })
      }
    }
    if (superCoeffs.length > 0) {
      onApply(superCoeffs)
    }
  }, [coeffs, normFactor, onApply])

  // Build display string
  const terms: string[] = []
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i]!
    if (c.magnitude > 0.001) {
      const normMag = c.magnitude / normFactor
      const phaseStr = c.phase === 0 ? '' : c.phase === Math.PI / 2 ? 'i' : `e^{i${(c.phase / Math.PI).toFixed(2)}π}`
      terms.push(`${normMag.toFixed(3)}${phaseStr}|${i}⟩`)
    }
  }
  const ketStr = terms.length > 0 ? `|ψ⟩ = ${terms.join(' + ')}` : '|ψ⟩ = 0'

  if (eigenstates.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-background p-4 text-center text-sm text-muted-foreground', className)}>
        Compute eigenstates first.
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border bg-background', className)}>
      <h3 className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        Superposition Builder
      </h3>
      <div className="max-h-[220px] space-y-2 overflow-y-auto p-3">
        {eigenstates.map((es, i) => {
          const c = coeffs[i] ?? { magnitude: 0, phase: 0 }
          return (
            <div key={es.index} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-muted-foreground">{es.label.split(' ')[0]}</span>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <span className="w-5 text-[10px] text-muted-foreground">|c|</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={c.magnitude}
                    onChange={e => updateCoeff(i, 'magnitude', parseFloat(e.target.value))}
                    className="h-1 flex-1"
                  />
                  <span className="w-8 text-right font-mono text-[10px]">{c.magnitude.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-5 text-[10px] text-muted-foreground">φ</span>
                  <input
                    type="range"
                    min={0}
                    max={6.283}
                    step={0.01}
                    value={c.phase}
                    onChange={e => updateCoeff(i, 'phase', parseFloat(e.target.value))}
                    className="h-1 flex-1"
                  />
                  <span className="w-8 text-right font-mono text-[10px]">{(c.phase / Math.PI).toFixed(2)}π</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-t border-border px-3 py-2">
        <div className="mb-2 truncate font-mono text-[10px] text-muted-foreground">{ketStr}</div>
        <button
          onClick={handleApply}
          className="w-full rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Apply Superposition
        </button>
      </div>
    </div>
  )
}
