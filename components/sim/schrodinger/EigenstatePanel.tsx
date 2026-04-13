'use client'

import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Eigenstate } from '@/lib/sim/schrodinger/types'

interface EigenstatePanelProps {
  eigenstates: Eigenstate[]
  selectedIndex?: number
  onSelect: (index: number) => void
  className?: string
}

/** Small sparkline of an eigenstate wavefunction. */
function EigenstateSparkline({ eigenstate, width = 160, height = 36 }: {
  eigenstate: Eigenstate
  width?: number
  height?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const isDark = document.documentElement.classList.contains('dark')
    const psi = eigenstate.wavefunction
    const N = psi.length

    // Find max for scaling
    let maxVal = 0
    for (let j = 0; j < N; j++) {
      const abs = Math.abs(psi[j]!)
      if (abs > maxVal) maxVal = abs
    }
    if (maxVal === 0) return

    const midY = height / 2

    // Zero line
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(100,116,139,0.15)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, midY)
    ctx.lineTo(width, midY)
    ctx.stroke()

    // Wavefunction
    ctx.strokeStyle = isDark ? '#a78bfa' : '#7c3aed'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let j = 0; j < N; j++) {
      const x = (j / (N - 1)) * width
      const y = midY - (psi[j]! / maxVal) * (midY - 2)
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }, [eigenstate, width, height])

  return <canvas ref={canvasRef} style={{ width, height }} />
}

/**
 * Panel showing energy eigenstates with sparklines. Click to select as initial state.
 */
export function EigenstatePanel({ eigenstates, selectedIndex, onSelect, className }: EigenstatePanelProps) {
  if (eigenstates.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-background p-4 text-center text-sm text-muted-foreground', className)}>
        No eigenstates computed. Click &quot;Compute&quot; to find eigenstates.
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border bg-background', className)}>
      <h3 className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        Eigenstates
      </h3>
      <div className="max-h-[240px] overflow-y-auto">
        {eigenstates.map((es) => (
          <button
            key={es.index}
            onClick={() => onSelect(es.index)}
            className={cn(
              'flex w-full items-center gap-2 border-b border-border px-3 py-1.5 text-left transition-colors hover:bg-muted/50',
              selectedIndex === es.index && 'bg-primary/10',
            )}
          >
            <div className="min-w-0 flex-shrink-0">
              <div className="text-xs font-medium">{es.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                E = {es.energy.toFixed(4)}
              </div>
            </div>
            <EigenstateSparkline eigenstate={es} />
          </button>
        ))}
      </div>
    </div>
  )
}
