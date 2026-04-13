'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ConvergencePlotProps {
  /** Running |S| values over time (sampled every N trials). */
  sValues: number[]
  theoreticalS: number
  className?: string
}

/**
 * Canvas plot showing |S| convergence over number of trials.
 */
export function ConvergencePlot({ sValues, theoreticalS, className }: ConvergencePlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = 300
    const h = 150
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#94a3b8' : '#64748b'
    const gridColor = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.15)'
    const lineColor = isDark ? '#3b82f6' : '#2563eb'

    const padding = { top: 10, right: 10, bottom: 25, left: 30 }
    const plotW = w - padding.left - padding.right
    const plotH = h - padding.top - padding.bottom

    // Y axis: 0 to 3
    const yMax = 3
    const yScale = (v: number) => padding.top + plotH * (1 - v / yMax)

    // Grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5
    for (const y of [1, 2, 2 * Math.SQRT2, 3]) {
      const py = yScale(y)
      ctx.beginPath()
      ctx.moveTo(padding.left, py)
      ctx.lineTo(w - padding.right, py)
      ctx.stroke()
    }

    // Classical bound dashed line
    ctx.strokeStyle = isDark ? 'rgba(248,113,113,0.5)' : 'rgba(239,68,68,0.5)'
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(padding.left, yScale(2))
    ctx.lineTo(w - padding.right, yScale(2))
    ctx.stroke()
    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = textColor
    ctx.font = '9px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('2', padding.left - 4, yScale(2) + 3)
    ctx.fillText('2√2', padding.left - 4, yScale(2 * Math.SQRT2) + 3)
    ctx.fillText('|S|', padding.left - 4, padding.top + 3)

    ctx.textAlign = 'center'
    ctx.fillText('trials', w / 2, h - 2)

    // Plot data
    if (sValues.length > 1) {
      const xStep = plotW / (sValues.length - 1)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < sValues.length; i++) {
        const x = padding.left + i * xStep
        const y = yScale(Math.abs(sValues[i]!))
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Theoretical line
    ctx.strokeStyle = isDark ? 'rgba(74,222,128,0.5)' : 'rgba(34,197,94,0.5)'
    ctx.setLineDash([2, 2])
    ctx.beginPath()
    ctx.moveTo(padding.left, yScale(Math.abs(theoreticalS)))
    ctx.lineTo(w - padding.right, yScale(Math.abs(theoreticalS)))
    ctx.stroke()
    ctx.setLineDash([])
  }, [sValues, theoreticalS])

  return (
    <div className={cn('rounded-lg border border-border bg-background p-3', className)}>
      <h3 className="mb-1 text-xs font-medium text-muted-foreground">S Convergence</h3>
      <canvas ref={canvasRef} />
    </div>
  )
}
