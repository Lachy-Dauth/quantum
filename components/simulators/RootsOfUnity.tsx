'use client'

import { useState } from 'react'
import type { SimulatorProps } from './index'
import {
  type CoordSystem,
  cFromPolar,
  mathToSvg,
  fmtComplex,
} from './shared'

const RANGE = 1.6
const W = 500
const H = 400
const cs: CoordSystem = { width: W, height: H, range: RANGE }

export function RootsOfUnity({ height = 400 }: SimulatorProps) {
  const [n, setN] = useState(5)
  const [hoveredRoot, setHoveredRoot] = useState<number | null>(null)

  const [ox, oy] = mathToSvg(0, 0, cs)
  const unitR = (W / 2) / RANGE // pixel radius of unit circle

  const roots = Array.from({ length: n }, (_, k) => {
    const theta = (2 * Math.PI * k) / n
    const z = cFromPolar(1, theta)
    const [sx, sy] = mathToSvg(z[0], z[1], cs)
    return { k, theta, z, sx, sy }
  })

  // Polygon path
  const polyPoints = roots.map(r => `${r.sx},${r.sy}`).join(' ')

  return (
    <div style={{ minHeight: height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-white dark:bg-slate-900">
        {/* Grid */}
        {[-1, 1].map(v => {
          const [sx] = mathToSvg(v, 0, cs)
          const [, sy] = mathToSvg(0, v, cs)
          return (
            <g key={v}>
              <line x1={sx} y1={0} x2={sx} y2={H} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
              <line x1={0} y1={sy} x2={W} y2={sy} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
            </g>
          )
        })}

        {/* Axes */}
        <line x1={0} y1={oy} x2={W} y2={oy} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />
        <line x1={ox} y1={0} x2={ox} y2={H} stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1} />
        <text x={W - 16} y={oy - 8} fontSize={12} className="fill-slate-500">Re</text>
        <text x={ox + 8} y={16} fontSize={12} className="fill-slate-500">Im</text>

        {/* Tick labels */}
        {[-1, 1].map(v => {
          const [sx] = mathToSvg(v, 0, cs)
          const [, sy] = mathToSvg(0, v, cs)
          return (
            <g key={`t-${v}`}>
              <text x={sx} y={oy + 16} fontSize={10} textAnchor="middle" className="fill-slate-400">{v}</text>
              <text x={ox - 8} y={sy + 4} fontSize={10} textAnchor="end" className="fill-slate-400">{v}i</text>
            </g>
          )
        })}

        {/* Unit circle */}
        <circle cx={ox} cy={oy} r={unitR} fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} />

        {/* Polygon connecting roots */}
        <polygon
          points={polyPoints}
          fill="#3b82f615"
          stroke="#3b82f6"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Lines from origin to each root */}
        {roots.map(r => (
          <line
            key={`line-${r.k}`}
            x1={ox} y1={oy}
            x2={r.sx} y2={r.sy}
            stroke="#3b82f6"
            strokeWidth={hoveredRoot === r.k ? 2 : 1}
            opacity={hoveredRoot === r.k ? 1 : 0.4}
          />
        ))}

        {/* Root points */}
        {roots.map(r => (
          <g key={`root-${r.k}`}>
            <circle
              cx={r.sx} cy={r.sy} r={hoveredRoot === r.k ? 8 : 6}
              fill={r.k === 0 ? '#f59e0b' : '#3b82f6'}
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredRoot(r.k)}
              onMouseLeave={() => setHoveredRoot(null)}
            />
            {/* Small k label */}
            <text
              x={r.sx + (r.z[0] >= 0 ? 12 : -12)}
              y={r.sy + (r.z[1] >= 0 ? -10 : 14)}
              fontSize={11}
              textAnchor={r.z[0] >= 0 ? 'start' : 'end'}
              className="fill-slate-600 dark:fill-slate-400 font-mono"
            >
              {hoveredRoot === r.k ? fmtComplex(r.z) : `ω${subscript(r.k)}`}
            </text>
          </g>
        ))}

        {/* Centroid marker (at origin) */}
        <circle cx={ox} cy={oy} r={3} fill="#ef4444" />
        <text x={ox + 8} y={oy + 16} fontSize={10} className="fill-red-500 font-mono">sum = 0</text>
      </svg>

      {/* Controls */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
            n = {n}
          </label>
          <input
            type="range"
            min={2}
            max={12}
            value={n}
            onChange={(e) => { setN(Number(e.target.value)); setHoveredRoot(null) }}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {n}-gon &middot; {n} roots
          </span>
        </div>
      </div>
    </div>
  )
}

function subscript(k: number): string {
  const subs = '₀₁₂₃₄₅₆₇₈₉'
  if (k < 10) return subs[k] ?? String(k)
  return String(k).split('').map(d => subs[Number(d)] ?? d).join('')
}
