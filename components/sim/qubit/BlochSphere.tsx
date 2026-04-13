'use client'

import { useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { BlochVector } from '@/lib/sim/qubit/types'

interface BlochSphereProps {
  blochVector: BlochVector
  qubitIndex: number
  size?: number
  className?: string
}

// Projection: simple oblique projection with slight rotation
const ANGLE = Math.PI / 6 // 30 degree tilt
const COS_A = Math.cos(ANGLE)
const SIN_A = Math.sin(ANGLE)

/** Project 3D point to 2D. */
function project(x: number, y: number, z: number, cx: number, cy: number, scale: number) {
  // Oblique projection: x maps to right, y maps into screen (foreshortened), z maps up
  const px = cx + scale * (x + y * COS_A * 0.4)
  const py = cy - scale * (z + y * SIN_A * 0.4)
  return { px, py }
}

/** Draw the Bloch sphere on a canvas. */
function drawBlochSphere(
  ctx: CanvasRenderingContext2D,
  bv: BlochVector,
  size: number,
  isDark: boolean,
) {
  const cx = size / 2
  const cy = size / 2
  const scale = size * 0.35
  const dpr = window.devicePixelRatio || 1

  ctx.clearRect(0, 0, size * dpr, size * dpr)
  ctx.save()
  ctx.scale(dpr, dpr)

  const wireColor = isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)'
  const axisColor = isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)'
  const labelColor = isDark ? '#94a3b8' : '#64748b'
  const arrowColor = isDark ? '#3b82f6' : '#2563eb'

  // Draw wireframe circles
  ctx.strokeStyle = wireColor
  ctx.lineWidth = 0.5

  // Equator (x-y plane, z=0)
  ctx.beginPath()
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2
    const { px, py } = project(Math.cos(t), Math.sin(t), 0, cx, cy, scale)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Meridian in x-z plane
  ctx.beginPath()
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2
    const { px, py } = project(Math.cos(t), 0, Math.sin(t), cx, cy, scale)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Meridian in y-z plane
  ctx.beginPath()
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2
    const { px, py } = project(0, Math.cos(t), Math.sin(t), cx, cy, scale)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Draw axes
  ctx.strokeStyle = axisColor
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])

  // X axis
  const xNeg = project(-1.2, 0, 0, cx, cy, scale)
  const xPos = project(1.2, 0, 0, cx, cy, scale)
  ctx.beginPath(); ctx.moveTo(xNeg.px, xNeg.py); ctx.lineTo(xPos.px, xPos.py); ctx.stroke()

  // Y axis
  const yNeg = project(0, -1.2, 0, cx, cy, scale)
  const yPos = project(0, 1.2, 0, cx, cy, scale)
  ctx.beginPath(); ctx.moveTo(yNeg.px, yNeg.py); ctx.lineTo(yPos.px, yPos.py); ctx.stroke()

  // Z axis
  const zNeg = project(0, 0, -1.2, cx, cy, scale)
  const zPos = project(0, 0, 1.2, cx, cy, scale)
  ctx.beginPath(); ctx.moveTo(zNeg.px, zNeg.py); ctx.lineTo(zPos.px, zPos.py); ctx.stroke()

  ctx.setLineDash([])

  // Axis labels
  ctx.fillStyle = labelColor
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'

  const xLabel = project(1.4, 0, 0, cx, cy, scale)
  ctx.fillText('|+⟩', xLabel.px, xLabel.py + 3)

  const xNegLabel = project(-1.4, 0, 0, cx, cy, scale)
  ctx.fillText('|−⟩', xNegLabel.px, xNegLabel.py + 3)

  const zLabel = project(0, 0, 1.3, cx, cy, scale)
  ctx.fillText('|0⟩', zLabel.px, zLabel.py - 2)

  const zNegLabel = project(0, 0, -1.3, cx, cy, scale)
  ctx.fillText('|1⟩', zNegLabel.px, zNegLabel.py + 10)

  // Draw Bloch vector arrow
  const vecLen = Math.sqrt(bv.x * bv.x + bv.y * bv.y + bv.z * bv.z)
  if (vecLen > 1e-10) {
    const origin = project(0, 0, 0, cx, cy, scale)
    const tip = project(bv.x, bv.y, bv.z, cx, cy, scale)

    ctx.strokeStyle = arrowColor
    ctx.fillStyle = arrowColor
    ctx.lineWidth = 2
    ctx.globalAlpha = bv.purity < 0.99 ? 0.5 + bv.purity * 0.5 : 1

    // Arrow line
    ctx.beginPath()
    ctx.moveTo(origin.px, origin.py)
    ctx.lineTo(tip.px, tip.py)
    ctx.stroke()

    // Arrow tip
    const dx = tip.px - origin.px
    const dy = tip.py - origin.py
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > 5) {
      const ux = dx / len
      const uy = dy / len
      const headLen = 6

      ctx.beginPath()
      ctx.moveTo(tip.px, tip.py)
      ctx.lineTo(tip.px - headLen * ux + headLen * 0.4 * uy, tip.py - headLen * uy - headLen * 0.4 * ux)
      ctx.lineTo(tip.px - headLen * ux - headLen * 0.4 * uy, tip.py - headLen * uy + headLen * 0.4 * ux)
      ctx.closePath()
      ctx.fill()
    }

    // Dot at tip
    ctx.beginPath()
    ctx.arc(tip.px, tip.py, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1
  }

  ctx.restore()
}

export function BlochSphere({ blochVector, qubitIndex, size = 120, className }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.classList.contains('dark')
    drawBlochSphere(ctx, blochVector, size, isDark)
  }, [blochVector, size])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    draw()
  }, [draw, size])

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <canvas
        ref={canvasRef}
        aria-label={`Bloch sphere for qubit ${qubitIndex}: x=${blochVector.x.toFixed(2)}, y=${blochVector.y.toFixed(2)}, z=${blochVector.z.toFixed(2)}`}
      />
      <div className="text-center">
        <span className="text-xs font-mono text-muted-foreground">q{qubitIndex}</span>
        {blochVector.purity < 0.99 && (
          <span className="ml-1 text-xs text-muted-foreground">
            (purity: {blochVector.purity.toFixed(2)})
          </span>
        )}
      </div>
    </div>
  )
}
