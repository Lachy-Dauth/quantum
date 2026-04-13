'use client'

import { useState, useCallback, useRef } from 'react'
import type { SimulatorProps } from './index'
import {
  type Complex,
  type CoordSystem,
  cAdd,
  cAbs,
  mathToSvg,
  svgToMath,
  fmtNum,
} from './shared'

const RANGE = 3.5
const W = 600
const H = 350
const cs: CoordSystem = { width: W, height: H, range: RANGE }

export function TriangleInequality({ height = 350 }: SimulatorProps) {
  const [z, setZ] = useState<Complex>([2, 1])
  const [w, setW] = useState<Complex>([-0.5, 1.5])
  const [dragTarget, setDragTarget] = useState<'z' | 'w' | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const getSvgPoint = useCallback((e: React.PointerEvent): Complex | null => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * W
    const sy = ((e.clientY - rect.top) / rect.height) * H
    return svgToMath(sx, sy, cs)
  }, [])

  const handlePointerDown = useCallback((target: 'z' | 'w') => (e: React.PointerEvent) => {
    e.stopPropagation()
    setDragTarget(target)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragTarget) return
    const pt = getSvgPoint(e)
    if (!pt) return
    if (dragTarget === 'z') setZ(pt)
    else setW(pt)
  }, [dragTarget, getSvgPoint])

  const handlePointerUp = useCallback(() => setDragTarget(null), [])

  const sum = cAdd(z, w)
  const modZ = cAbs(z)
  const modW = cAbs(w)
  const modSum = cAbs(sum)

  const [ox, oy] = mathToSvg(0, 0, cs)
  const [zx, zy] = mathToSvg(z[0], z[1], cs)
  const [sx, sy] = mathToSvg(sum[0], sum[1], cs)

  const gap = modZ + modW - modSum
  const isEquality = gap < 0.05

  return (
    <div style={{ minHeight: height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full bg-white dark:bg-slate-900 touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Subtle grid */}
        {Array.from({ length: 7 }, (_, i) => {
          const v = i - 3
          if (v === 0) return null
          const [gx] = mathToSvg(v, 0, cs)
          const [, gy] = mathToSvg(0, v, cs)
          return (
            <g key={v}>
              <line x1={gx} y1={0} x2={gx} y2={H} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
              <line x1={0} y1={gy} x2={W} y2={gy} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
            </g>
          )
        })}

        {/* Axes */}
        <line x1={0} y1={oy} x2={W} y2={oy} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />
        <line x1={ox} y1={0} x2={ox} y2={H} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />

        {/* Triangle fill */}
        <polygon
          points={`${ox},${oy} ${zx},${zy} ${sx},${sy}`}
          fill={isEquality ? '#3b82f620' : '#f59e0b15'}
          stroke="none"
        />

        {/* z vector (blue): origin → z */}
        <line x1={ox} y1={oy} x2={zx} y2={zy} stroke="#3b82f6" strokeWidth={2.5} />
        <polygon points={arrowHead(ox, oy, zx, zy, 7)} fill="#3b82f6" />

        {/* w vector (green): z → z+w */}
        <line x1={zx} y1={zy} x2={sx} y2={sy} stroke="#22c55e" strokeWidth={2.5} />
        <polygon points={arrowHead(zx, zy, sx, sy, 7)} fill="#22c55e" />

        {/* z+w vector (red): origin → z+w */}
        <line x1={ox} y1={oy} x2={sx} y2={sy} stroke="#ef4444" strokeWidth={2.5} />
        <polygon points={arrowHead(ox, oy, sx, sy, 7)} fill="#ef4444" />

        {/* Length labels along vectors */}
        {modZ > 0.3 && (
          <text
            x={(ox + zx) / 2 + 8}
            y={(oy + zy) / 2 - 8}
            fontSize={11}
            className="fill-blue-600 dark:fill-blue-400 font-mono"
          >
            |z| = {fmtNum(modZ)}
          </text>
        )}
        {modW > 0.3 && (
          <text
            x={(zx + sx) / 2 + 8}
            y={(zy + sy) / 2 - 8}
            fontSize={11}
            className="fill-green-600 dark:fill-green-400 font-mono"
          >
            |w| = {fmtNum(modW)}
          </text>
        )}
        {modSum > 0.3 && (
          <text
            x={(ox + sx) / 2 - 12}
            y={(oy + sy) / 2 + 18}
            fontSize={11}
            className="fill-red-600 dark:fill-red-400 font-mono"
          >
            |z+w| = {fmtNum(modSum)}
          </text>
        )}

        {/* Draggable handles */}
        <circle cx={zx} cy={zy} r={7} fill="#3b82f6" stroke="white" strokeWidth={2} className="cursor-grab" onPointerDown={handlePointerDown('z')} />
        <circle cx={sx} cy={sy} r={7} fill="#22c55e" stroke="white" strokeWidth={2} className="cursor-grab" onPointerDown={handlePointerDown('w')} />

        {/* Labels */}
        <text x={zx + 10} y={zy - 10} fontSize={13} fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">z</text>
        <text x={sx + 10} y={sy - 10} fontSize={13} fontWeight="bold" className="fill-green-600 dark:fill-green-400">z+w</text>
      </svg>

      {/* Inequality display */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center">
        <div className="font-mono text-sm">
          <span className="text-red-600 dark:text-red-400">|z+w| = {fmtNum(modSum)}</span>
          {' '}{isEquality ? '=' : '≤'}{' '}
          <span className="text-blue-600 dark:text-blue-400">|z|</span>
          {' + '}
          <span className="text-green-600 dark:text-green-400">|w|</span>
          {' = '}
          <span>{fmtNum(modZ + modW)}</span>
        </div>
        {isEquality && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Equality! z and w point in the same direction.
          </div>
        )}
      </div>
    </div>
  )
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const a1 = angle + Math.PI * 0.85
  const a2 = angle - Math.PI * 0.85
  return `${x2},${y2} ${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)} ${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)}`
}
