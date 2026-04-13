'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SimulatorProps } from './index'
import {
  type CoordSystem,
  mathToSvg,
  fmtNum,
  fmtAngle,
} from './shared'

const RANGE = 1.6
const W = 500
const H = 450
const cs: CoordSystem = { width: W, height: H, range: RANGE }

export function EulerFormulaCircle({ height = 450 }: SimulatorProps) {
  const [theta, setTheta] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time
    const dt = (time - lastTimeRef.current) / 1000
    lastTimeRef.current = time

    setTheta(prev => {
      const next = prev + dt * speed
      return next >= 2 * Math.PI ? next - 2 * Math.PI : next
    })
    rafRef.current = requestAnimationFrame(animate)
  }, [speed])

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = 0
      rafRef.current = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, animate])

  const cosT = Math.cos(theta)
  const sinT = Math.sin(theta)

  const [ox, oy] = mathToSvg(0, 0, cs)
  const [px, py] = mathToSvg(cosT, sinT, cs)
  const [projX, projXY] = mathToSvg(cosT, 0, cs)
  const [, projY] = mathToSvg(0, sinT, cs)
  const unitR = (W / 2) / RANGE

  // Velocity vector: ie^{iθ} = -sinθ + icosθ
  const velScale = 0.3
  const velX = -sinT * velScale
  const velY = cosT * velScale
  const [vx, vy] = mathToSvg(cosT + velX, sinT + velY, cs)

  return (
    <div style={{ minHeight: height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-white dark:bg-slate-900">
        {/* Grid lines at -1 and 1 */}
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
        <circle cx={ox} cy={oy} r={unitR} fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />

        {/* Traced arc (from 0 to theta) */}
        {theta > 0.01 && (
          <path
            d={describeArc(ox, oy, unitR, 0, theta)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
            opacity={0.4}
          />
        )}

        {/* Dashed projection lines */}
        <line x1={px} y1={py} x2={projX} y2={projXY} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
        <line x1={px} y1={py} x2={ox} y2={projY} stroke="#22c55e" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />

        {/* cos θ on x-axis */}
        <line x1={ox} y1={oy} x2={projX} y2={oy} stroke="#ef4444" strokeWidth={2.5} />
        <text x={(ox + projX) / 2} y={oy + 20} fontSize={11} textAnchor="middle" className="fill-red-500 font-mono">
          cos θ
        </text>

        {/* sin θ on y-axis */}
        <line x1={ox} y1={oy} x2={ox} y2={projY} stroke="#22c55e" strokeWidth={2.5} />
        <text x={ox - 12} y={(oy + projY) / 2 + 4} fontSize={11} textAnchor="end" className="fill-green-500 font-mono">
          sin θ
        </text>

        {/* Position vector */}
        <line x1={ox} y1={oy} x2={px} y2={py} stroke="#3b82f6" strokeWidth={2.5} />
        <polygon points={arrowHead(ox, oy, px, py, 8)} fill="#3b82f6" />

        {/* Velocity vector (tangent) */}
        <line x1={px} y1={py} x2={vx} y2={vy} stroke="#f59e0b" strokeWidth={2} strokeDasharray="none" />
        <polygon points={arrowHead(px, py, vx, vy, 6)} fill="#f59e0b" />

        {/* Point on circle */}
        <circle cx={px} cy={py} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />

        {/* Labels */}
        <text x={px + 12} y={py - 12} fontSize={12} fontWeight="bold" className="fill-blue-600 dark:fill-blue-400">
          e<tspan baselineShift="super" fontSize={9}>iθ</tspan>
        </text>
        <text x={vx + 8} y={vy - 6} fontSize={10} className="fill-amber-600 dark:fill-amber-400">
          velocity
        </text>

        {/* Angle arc */}
        {theta > 0.05 && (
          <>
            <path
              d={describeArc(ox, oy, 25, 0, theta)}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={1.5}
            />
            <text
              x={ox + 32 * Math.cos(theta / 2)}
              y={oy - 32 * Math.sin(theta / 2) + 4}
              fontSize={11}
              className="fill-purple-600 dark:fill-purple-400 font-mono"
            >
              θ
            </text>
          </>
        )}

        {/* Formula display */}
        <text x={W / 2} y={H - 12} fontSize={13} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 font-mono">
          e^(i·{fmtAngle(theta)}) = {fmtNum(cosT)} + {fmtNum(sinT)}i
        </text>
      </svg>

      {/* Controls */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => { setPlaying(false); setTheta(0) }}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">Speed</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-8">θ</span>
          <input
            type="range"
            min={0}
            max={6.28}
            step={0.01}
            value={theta}
            onChange={(e) => { setPlaying(false); setTheta(Number(e.target.value)) }}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-16 text-right">{fmtAngle(theta)}</span>
        </div>
      </div>
    </div>
  )
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const x1 = cx + r * Math.cos(-startAngle)
  const y1 = cy + r * Math.sin(-startAngle)
  const x2 = cx + r * Math.cos(-endAngle)
  const y2 = cy + r * Math.sin(-endAngle)
  const sweep = endAngle - startAngle
  const largeArc = sweep > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const a1 = angle + Math.PI * 0.85
  const a2 = angle - Math.PI * 0.85
  return `${x2},${y2} ${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)} ${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)}`
}
