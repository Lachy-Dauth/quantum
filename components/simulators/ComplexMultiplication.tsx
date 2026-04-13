'use client'

import { useState, useCallback, useRef } from 'react'
import type { SimulatorProps } from './index'
import {
  type Complex,
  type CoordSystem,
  cMul,
  cAbs,
  cArg,
  mathToSvg,
  svgToMath,
  fmtNum,
  fmtComplex,
  fmtAngle,
  arcPath,
} from './shared'

const RANGE = 3.5
const W = 600
const H = 450
const cs: CoordSystem = { width: W, height: H, range: RANGE }

export function ComplexMultiplication({ height = 450 }: SimulatorProps) {
  const [z, setZ] = useState<Complex>([1.5, 1])
  const [w, setW] = useState<Complex>([0.5, 1.2])
  const [dragTarget, setDragTarget] = useState<'z' | 'w' | null>(null)
  const [constrainW, setConstrainW] = useState(false)
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
    if (dragTarget === 'z') {
      setZ(pt)
    } else {
      if (constrainW) {
        const angle = Math.atan2(pt[1], pt[0])
        setW([Math.cos(angle), Math.sin(angle)])
      } else {
        setW(pt)
      }
    }
  }, [dragTarget, constrainW, getSvgPoint])

  const handlePointerUp = useCallback(() => {
    setDragTarget(null)
  }, [])

  const product = cMul(z, w)
  const [ox, oy] = mathToSvg(0, 0, cs)
  const [zx, zy] = mathToSvg(z[0], z[1], cs)
  const [wx, wy] = mathToSvg(w[0], w[1], cs)
  const [px, py] = mathToSvg(product[0], product[1], cs)

  const argZ = cArg(z)
  const argW = cArg(w)
  const argP = cArg(product)
  const modZ = cAbs(z)
  const modW = cAbs(w)
  const modP = cAbs(product)

  const arcR = 25

  return (
    <div className="flex flex-col lg:flex-row" style={{ minHeight: height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="flex-1 cursor-crosshair bg-white dark:bg-slate-900 touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Grid */}
        {Array.from({ length: 7 }, (_, i) => {
          const v = i - 3
          if (v === 0) return null
          const [sx] = mathToSvg(v, 0, cs)
          const [, sy] = mathToSvg(0, v, cs)
          return (
            <g key={`g-${v}`}>
              <line x1={sx} y1={0} x2={sx} y2={H} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
              <line x1={0} y1={sy} x2={W} y2={sy} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
            </g>
          )
        })}

        {/* Axes */}
        <line x1={0} y1={oy} x2={W} y2={oy} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />
        <line x1={ox} y1={0} x2={ox} y2={H} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />
        <text x={W - 16} y={oy - 8} fontSize={12} className="fill-slate-500 dark:fill-slate-400" textAnchor="end">Re</text>
        <text x={ox + 8} y={16} fontSize={12} className="fill-slate-500 dark:fill-slate-400">Im</text>

        {/* Unit circle */}
        <circle cx={ox} cy={oy} r={(W / 2) / RANGE} fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} strokeDasharray="4 3" />

        {/* Argument arcs */}
        {modZ > 0.2 && <path d={arcPath(ox, oy, arcR, 0, argZ)} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.6} />}
        {modW > 0.2 && <path d={arcPath(ox, oy, arcR + 8, 0, argW)} fill="none" stroke="#22c55e" strokeWidth={1.5} opacity={0.6} />}
        {modP > 0.2 && <path d={arcPath(ox, oy, arcR + 16, 0, argP)} fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.6} />}

        {/* Vector z */}
        <line x1={ox} y1={oy} x2={zx} y2={zy} stroke="#3b82f6" strokeWidth={2} />
        <polygon points={arrowHead(ox, oy, zx, zy, 7)} fill="#3b82f6" />

        {/* Vector w */}
        <line x1={ox} y1={oy} x2={wx} y2={wy} stroke="#22c55e" strokeWidth={2} />
        <polygon points={arrowHead(ox, oy, wx, wy, 7)} fill="#22c55e" />

        {/* Vector product */}
        <line x1={ox} y1={oy} x2={px} y2={py} stroke="#ef4444" strokeWidth={2.5} />
        <polygon points={arrowHead(ox, oy, px, py, 8)} fill="#ef4444" />

        {/* Draggable points */}
        <circle cx={zx} cy={zy} r={7} fill="#3b82f6" stroke="white" strokeWidth={2} className="cursor-grab" onPointerDown={handlePointerDown('z')} />
        <circle cx={wx} cy={wy} r={7} fill="#22c55e" stroke="white" strokeWidth={2} className="cursor-grab" onPointerDown={handlePointerDown('w')} />
        <circle cx={px} cy={py} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />

        {/* Labels */}
        <text x={zx + 10} y={zy - 10} fontSize={13} fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">z</text>
        <text x={wx + 10} y={wy - 10} fontSize={13} fontWeight="bold" className="fill-green-600 dark:fill-green-400">w</text>
        <text x={px + 10} y={py - 10} fontSize={13} fontWeight="bold" className="fill-red-600 dark:fill-red-400">zw</text>
      </svg>

      {/* Info panel */}
      <div className="w-full lg:w-56 p-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span className="text-xs font-semibold text-slate-500 uppercase">z</span>
          </div>
          <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{fmtComplex(z)}</div>
          <div className="text-xs text-slate-500">|z| = {fmtNum(modZ)}, arg = {fmtAngle(argZ)}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-xs font-semibold text-slate-500 uppercase">w</span>
          </div>
          <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{fmtComplex(w)}</div>
          <div className="text-xs text-slate-500">|w| = {fmtNum(modW)}, arg = {fmtAngle(argW)}</div>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-xs font-semibold text-slate-500 uppercase">z &times; w</span>
          </div>
          <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{fmtComplex(product)}</div>
          <div className="text-xs text-slate-500">|zw| = {fmtNum(modP)}</div>
          <div className="text-xs text-slate-500">arg(zw) = {fmtAngle(argP)}</div>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
          <div>|z|&middot;|w| = {fmtNum(modZ)}&middot;{fmtNum(modW)} = {fmtNum(modZ * modW)}</div>
          <div>arg(z)+arg(w) = {fmtAngle(argZ + argW)}</div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={constrainW} onChange={(e) => {
            setConstrainW(e.target.checked)
            if (e.target.checked) {
              const a = cArg(w)
              setW([Math.cos(a), Math.sin(a)])
            }
          }} className="rounded" />
          <span className="text-slate-600 dark:text-slate-300 text-xs">Constrain w to unit circle</span>
        </label>
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
