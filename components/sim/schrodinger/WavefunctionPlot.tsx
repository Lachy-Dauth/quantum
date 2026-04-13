'use client'

import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Wavefunction, Potential } from '@/lib/sim/schrodinger/types'

interface WavefunctionPlotProps {
  wavefunction: Wavefunction
  potential: Potential
  eigenstateEnergies?: number[]
  expectationX?: number
  showProbDensity?: boolean
  showRealPart?: boolean
  showImagPart?: boolean
  showPotential?: boolean
  editablePotential?: boolean
  onPotentialEdit?: (values: Float64Array) => void
  className?: string
}

/**
 * Canvas 2D plot of the wavefunction, probability density, and potential.
 */
export function WavefunctionPlot({
  wavefunction,
  potential,
  eigenstateEnergies,
  expectationX,
  showProbDensity = true,
  showRealPart = false,
  showImagPart = false,
  showPotential = true,
  editablePotential = false,
  onPotentialEdit,
  className,
}: WavefunctionPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const potentialEditRef = useRef<Float64Array | null>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#94a3b8' : '#64748b'
    const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.1)'

    const padding = { top: 15, right: 15, bottom: 30, left: 45 }
    const plotW = w - padding.left - padding.right
    const plotH = h - padding.top - padding.bottom

    const { N, xMin, xMax, psiRe, psiIm } = wavefunction
    const V = potential.values

    // Compute probability density
    const prob = new Float64Array(N)
    let maxProb = 0
    for (let j = 0; j < N; j++) {
      prob[j] = psiRe[j]! ** 2 + psiIm[j]! ** 2
      if (prob[j]! > maxProb) maxProb = prob[j]!
    }

    // Find max values for scaling
    let maxPsi = 0
    for (let j = 0; j < N; j++) {
      const absRe = Math.abs(psiRe[j]!)
      const absIm = Math.abs(psiIm[j]!)
      if (absRe > maxPsi) maxPsi = absRe
      if (absIm > maxPsi) maxPsi = absIm
    }

    // Potential range (for scaling)
    let minV = Infinity, maxV = -Infinity
    for (let j = 0; j < N; j++) {
      if (V[j]! < minV) minV = V[j]!
      if (V[j]! > maxV) maxV = V[j]!
    }
    // Clamp potential display range
    const vRange = Math.max(maxV - minV, 1)

    // Y scale: top = max amplitude, bottom = 0 (for prob) or -max (for Re/Im)
    const yMaxVal = Math.max(maxProb, maxPsi) * 1.2 || 1
    const yMinVal = (showRealPart || showImagPart) ? -yMaxVal : 0

    const xToPixel = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotW
    const yToPixel = (y: number) => padding.top + plotH * (1 - (y - yMinVal) / (yMaxVal - yMinVal))

    // Grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5
    // Horizontal grid lines
    const ySteps = 4
    for (let i = 0; i <= ySteps; i++) {
      const yVal = yMinVal + (i / ySteps) * (yMaxVal - yMinVal)
      const py = yToPixel(yVal)
      ctx.beginPath()
      ctx.moveTo(padding.left, py)
      ctx.lineTo(w - padding.right, py)
      ctx.stroke()
    }
    // Zero line
    if (yMinVal < 0) {
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.25)'
      ctx.lineWidth = 1
      const py0 = yToPixel(0)
      ctx.beginPath()
      ctx.moveTo(padding.left, py0)
      ctx.lineTo(w - padding.right, py0)
      ctx.stroke()
    }

    // Potential (faint filled region)
    if (showPotential && vRange > 0) {
      const vScale = (yMaxVal - yMinVal) * 0.6 / vRange
      ctx.fillStyle = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(100,116,139,0.08)'
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      const baseline = yToPixel(yMinVal)
      ctx.moveTo(xToPixel(xMin), baseline)
      for (let j = 0; j < N; j++) {
        const xp = xToPixel(wavefunction.x[j]!)
        const vNorm = (V[j]! - minV) * vScale + yMinVal
        ctx.lineTo(xp, yToPixel(vNorm))
      }
      ctx.lineTo(xToPixel(xMax), baseline)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      for (let j = 0; j < N; j++) {
        const xp = xToPixel(wavefunction.x[j]!)
        const vNorm = (V[j]! - minV) * vScale + yMinVal
        if (j === 0) ctx.moveTo(xp, yToPixel(vNorm))
        else ctx.lineTo(xp, yToPixel(vNorm))
      }
      ctx.stroke()
    }

    // Eigenstate energy levels
    if (eigenstateEnergies && eigenstateEnergies.length > 0 && showPotential) {
      const vScale = (yMaxVal - yMinVal) * 0.6 / vRange
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 0.5
      for (let k = 0; k < eigenstateEnergies.length; k++) {
        const E = eigenstateEnergies[k]!
        const eNorm = (E - minV) * vScale + yMinVal
        const py = yToPixel(eNorm)
        if (py > padding.top && py < h - padding.bottom) {
          ctx.strokeStyle = isDark ? `rgba(168,85,247,0.4)` : `rgba(147,51,234,0.4)`
          ctx.beginPath()
          ctx.moveTo(padding.left, py)
          ctx.lineTo(w - padding.right, py)
          ctx.stroke()
          ctx.fillStyle = isDark ? 'rgba(168,85,247,0.6)' : 'rgba(147,51,234,0.6)'
          ctx.font = '9px monospace'
          ctx.textAlign = 'left'
          ctx.fillText(`E${k}`, w - padding.right + 2, py + 3)
        }
      }
      ctx.setLineDash([])
    }

    // Probability density (blue filled)
    if (showProbDensity && maxProb > 0) {
      ctx.fillStyle = isDark ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.25)'
      ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(xToPixel(xMin), yToPixel(0))
      for (let j = 0; j < N; j++) {
        ctx.lineTo(xToPixel(wavefunction.x[j]!), yToPixel(prob[j]!))
      }
      ctx.lineTo(xToPixel(xMax), yToPixel(0))
      ctx.closePath()
      ctx.fill()
      // Outline
      ctx.beginPath()
      for (let j = 0; j < N; j++) {
        const xp = xToPixel(wavefunction.x[j]!)
        if (j === 0) ctx.moveTo(xp, yToPixel(prob[j]!))
        else ctx.lineTo(xp, yToPixel(prob[j]!))
      }
      ctx.stroke()
    }

    // Real part (red line)
    if (showRealPart) {
      ctx.strokeStyle = isDark ? '#f87171' : '#dc2626'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let j = 0; j < N; j++) {
        const xp = xToPixel(wavefunction.x[j]!)
        if (j === 0) ctx.moveTo(xp, yToPixel(psiRe[j]!))
        else ctx.lineTo(xp, yToPixel(psiRe[j]!))
      }
      ctx.stroke()
    }

    // Imaginary part (green line)
    if (showImagPart) {
      ctx.strokeStyle = isDark ? '#4ade80' : '#16a34a'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let j = 0; j < N; j++) {
        const xp = xToPixel(wavefunction.x[j]!)
        if (j === 0) ctx.moveTo(xp, yToPixel(psiIm[j]!))
        else ctx.lineTo(xp, yToPixel(psiIm[j]!))
      }
      ctx.stroke()
    }

    // Expectation value <x> vertical dashed line
    if (expectationX !== undefined) {
      const xp = xToPixel(expectationX)
      if (xp > padding.left && xp < w - padding.right) {
        ctx.strokeStyle = isDark ? 'rgba(251,191,36,0.6)' : 'rgba(217,119,6,0.6)'
        ctx.setLineDash([4, 3])
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(xp, padding.top)
        ctx.lineTo(xp, h - padding.bottom)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = isDark ? '#fbbf24' : '#d97706'
        ctx.font = '9px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('⟨x⟩', xp, padding.top - 3)
      }
    }

    // Axis labels
    ctx.fillStyle = textColor
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'

    // X axis ticks
    const xTicks = 5
    for (let i = 0; i <= xTicks; i++) {
      const xVal = xMin + (i / xTicks) * (xMax - xMin)
      const xp = xToPixel(xVal)
      ctx.fillText(xVal.toFixed(1), xp, h - padding.bottom + 15)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(xp, h - padding.bottom)
      ctx.lineTo(xp, h - padding.bottom + 4)
      ctx.stroke()
    }

    // Y axis ticks
    ctx.textAlign = 'right'
    for (let i = 0; i <= ySteps; i++) {
      const yVal = yMinVal + (i / ySteps) * (yMaxVal - yMinVal)
      const py = yToPixel(yVal)
      ctx.fillText(yVal.toFixed(2), padding.left - 4, py + 3)
    }

    // Axis label
    ctx.textAlign = 'center'
    ctx.fillText('x', w / 2, h - 2)
  }, [wavefunction, potential, eigenstateEnergies, expectationX, showProbDensity, showRealPart, showImagPart, showPotential])

  useEffect(() => {
    render()
  }, [render])

  // Handle potential editing
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!editablePotential || !onPotentialEdit) return
    drawingRef.current = true
    potentialEditRef.current = new Float64Array(potential.values)
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    handlePointerMove(e)
  }, [editablePotential, onPotentialEdit, potential.values])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !potentialEditRef.current || !onPotentialEdit) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const padding = { top: 15, right: 15, bottom: 30, left: 45 }
    const plotW = rect.width - padding.left - padding.right
    const plotH = rect.height - padding.top - padding.bottom

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Map to domain
    const { N, xMin, xMax } = wavefunction
    const xFrac = (mouseX - padding.left) / plotW
    const x = xMin + xFrac * (xMax - xMin)
    const yFrac = 1 - (mouseY - padding.top) / plotH
    const vMax = 20 // reasonable max potential value
    const v = yFrac * vMax

    // Set potential in a brush radius
    const dx = wavefunction.dx
    const brushRadius = 3 * dx
    for (let j = 0; j < N; j++) {
      const xj = wavefunction.x[j]!
      if (Math.abs(xj - x) < brushRadius) {
        const weight = 1 - Math.abs(xj - x) / brushRadius
        potentialEditRef.current[j] = potentialEditRef.current[j]! * (1 - weight) + v * weight
      }
    }

    onPotentialEdit(potentialEditRef.current)
  }, [wavefunction, onPotentialEdit])

  const handlePointerUp = useCallback(() => {
    drawingRef.current = false
  }, [])

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          'h-[300px] w-full rounded-lg border border-border bg-background',
          editablePotential && 'cursor-crosshair',
        )}
        onPointerDown={editablePotential ? handlePointerDown : undefined}
        onPointerMove={editablePotential ? handlePointerMove : undefined}
        onPointerUp={editablePotential ? handlePointerUp : undefined}
      />
    </div>
  )
}
