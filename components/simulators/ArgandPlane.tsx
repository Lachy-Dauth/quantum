'use client'

import { useState, useCallback, useRef } from 'react'
import type { SimulatorProps } from './index'
import {
  type Complex,
  type CoordSystem,
  cAbs,
  cArg,
  mathToSvg,
  svgToMath,
  fmtNum,
  fmtComplex,
  fmtAngle,
  arcPath,
} from './shared'

const RANGE = 3
const W = 600
const H = 450
const cs: CoordSystem = { width: W, height: H, range: RANGE }

export function ArgandPlane({ height = 450 }: SimulatorProps) {
  const [z, setZ] = useState<Complex>([1.5, 1])
  const [dragging, setDragging] = useState(false)
  const [showUnitCircle, setShowUnitCircle] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  const getSvgPoint = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * W
    const sy = ((e.clientY - rect.top) / rect.height) * H
    return svgToMath(sx, sy, cs)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pt = getSvgPoint(e)
      if (!pt) return
      setZ(pt)
      setDragging(true)
      ;(e.target as Element).setPointerCapture(e.pointerId)
    },
    [getSvgPoint]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const pt = getSvgPoint(e)
      if (pt) setZ(pt)
    },
    [dragging, getSvgPoint]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const [zx, zy] = mathToSvg(z[0], z[1], cs)
  const [ox, oy] = mathToSvg(0, 0, cs)
  const mod = cAbs(z)
  const arg = cArg(z)

  return (
    <div className="flex flex-col lg:flex-row" style={{ minHeight: height }}>
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="flex-1 cursor-crosshair bg-white dark:bg-slate-900 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Grid */}
        {Array.from({ length: Math.floor(RANGE * 2) + 1 }, (_, i) => {
          const v = i - RANGE
          if (v === 0) return null
          const [sx] = mathToSvg(v, 0, cs)
          const [, sy] = mathToSvg(0, v, cs)
          return (
            <g key={`grid-${v}`}>
              <line
                x1={sx}
                y1={0}
                x2={sx}
                y2={H}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth={0.5}
              />
              <line
                x1={0}
                y1={sy}
                x2={W}
                y2={sy}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth={0.5}
              />
            </g>
          )
        })}

        {/* Axes */}
        <line
          x1={0}
          y1={oy}
          x2={W}
          y2={oy}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-500"
          strokeWidth={1}
        />
        <line
          x1={ox}
          y1={0}
          x2={ox}
          y2={H}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-500"
          strokeWidth={1}
        />

        {/* Axis labels */}
        <text
          x={W - 16}
          y={oy - 8}
          fontSize={13}
          className="fill-slate-500 dark:fill-slate-400"
          textAnchor="end"
        >
          Re
        </text>
        <text x={ox + 8} y={16} fontSize={13} className="fill-slate-500 dark:fill-slate-400">
          Im
        </text>

        {/* Tick labels */}
        {Array.from({ length: Math.floor(RANGE * 2) + 1 }, (_, i) => {
          const v = i - RANGE
          if (v === 0) return null
          const [sx] = mathToSvg(v, 0, cs)
          const [, sy] = mathToSvg(0, v, cs)
          return (
            <g key={`tick-${v}`}>
              <text
                x={sx}
                y={oy + 16}
                fontSize={10}
                textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
              >
                {v}
              </text>
              <text
                x={ox - 8}
                y={sy + 4}
                fontSize={10}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500"
              >
                {v}i
              </text>
            </g>
          )
        })}

        {/* Unit circle */}
        {showUnitCircle && (
          <circle
            cx={ox}
            cy={oy}
            r={W / 2 / RANGE}
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-600"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}

        {/* Dashed lines to axes (projections) */}
        <line
          x1={zx}
          y1={zy}
          x2={zx}
          y2={oy}
          stroke="#3b82f6"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.5}
        />
        <line
          x1={zx}
          y1={zy}
          x2={ox}
          y2={zy}
          stroke="#3b82f6"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.5}
        />

        {/* Argument arc */}
        {mod > 0.15 && (
          <path
            d={arcPath(ox, oy, Math.min(30, (mod / RANGE) * (W / 2) * 0.3), 0, arg)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
        )}

        {/* Vector from origin to z */}
        <line x1={ox} y1={oy} x2={zx} y2={zy} stroke="#3b82f6" strokeWidth={2} />

        {/* Arrowhead */}
        {mod > 0.1 && <polygon points={arrowHead(ox, oy, zx, zy, 8)} fill="#3b82f6" />}

        {/* Point z */}
        <circle
          cx={zx}
          cy={zy}
          r={6}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={2}
          className="cursor-grab"
        />

        {/* Label */}
        <text
          x={zx + 10}
          y={zy - 10}
          fontSize={13}
          fontWeight="bold"
          className="fill-blue-600 dark:fill-blue-400"
        >
          z
        </text>
      </svg>

      {/* Info panel */}
      <div className="w-full lg:w-52 p-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm space-y-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Rectangular
          </div>
          <div className="font-mono text-slate-800 dark:text-slate-200">{fmtComplex(z)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Polar
          </div>
          <div className="font-mono text-slate-800 dark:text-slate-200">
            {fmtNum(mod)}(cos {fmtAngle(arg)} + i sin {fmtAngle(arg)})
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Exponential
          </div>
          <div className="font-mono text-slate-800 dark:text-slate-200">
            {fmtNum(mod)}e<sup>i{fmtAngle(arg)}</sup>
          </div>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">|z|</span>
            <span className="font-mono">{fmtNum(mod, 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">arg(z)</span>
            <span className="font-mono">{fmtAngle(arg)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Re(z)</span>
            <span className="font-mono">{fmtNum(z[0], 3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Im(z)</span>
            <span className="font-mono">{fmtNum(z[1], 3)}</span>
          </div>
        </div>
        <hr className="border-slate-200 dark:border-slate-700" />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnitCircle}
            onChange={(e) => setShowUnitCircle(e.target.checked)}
            className="rounded"
          />
          <span className="text-slate-600 dark:text-slate-300 text-xs">Unit circle</span>
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
