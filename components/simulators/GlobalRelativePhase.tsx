'use client'

import { useState, useMemo } from 'react'
import type { SimulatorProps } from './index'
import { type Complex, cMul, cAbs, cArg, cFromPolar, fmtNum, fmtAngle } from './shared'

const MINI_SIZE = 140
const MINI_R = MINI_SIZE / 2 - 20

export function GlobalRelativePhase({ height = 450 }: SimulatorProps) {
  const [globalPhase, setGlobalPhase] = useState(0)
  const [relativePhase, setRelativePhase] = useState(0)

  // State |ψ⟩ = (1/√2)|0⟩ + (e^{iθ}/√2)|1⟩, then apply global phase e^{iφ}
  const alpha: Complex = useMemo(() => {
    const base: Complex = [1 / Math.sqrt(2), 0]
    return cMul(cFromPolar(1, globalPhase), base)
  }, [globalPhase])

  const beta: Complex = useMemo(() => {
    const base = cFromPolar(1 / Math.sqrt(2), relativePhase)
    return cMul(cFromPolar(1, globalPhase), base)
  }, [globalPhase, relativePhase])

  const probZero = cAbs(alpha) ** 2
  const probOne = cAbs(beta) ** 2

  // Hadamard basis probabilities
  // P(+) = |⟨+|ψ⟩|² = |(α + β)/√2|²
  const plusAmp: Complex = [
    (alpha[0] + beta[0]) / Math.sqrt(2),
    (alpha[1] + beta[1]) / Math.sqrt(2),
  ]
  const minusAmp: Complex = [
    (alpha[0] - beta[0]) / Math.sqrt(2),
    (alpha[1] - beta[1]) / Math.sqrt(2),
  ]
  const probPlus = cAbs(plusAmp) ** 2
  const probMinus = cAbs(minusAmp) ** 2

  const presets = [
    { label: '|0⟩', global: 0, relative: 0, desc: 'α=1/√2, β=1/√2' },
    { label: '|+⟩', global: 0, relative: 0, desc: 'Equal superposition' },
    { label: '|−⟩', global: 0, relative: Math.PI, desc: 'Opposite phase' },
    { label: '|i⟩', global: 0, relative: Math.PI / 2, desc: '90° relative' },
  ]

  return (
    <div className="flex flex-col" style={{ minHeight: height }}>
      <div className="flex-1 flex flex-col md:flex-row bg-white dark:bg-slate-900 p-4 gap-4">
        {/* Left: amplitude vectors */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Amplitudes
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <AmplitudeCircle label="|0⟩ amplitude" z={alpha} color="#3b82f6" />
            <AmplitudeCircle label="|1⟩ amplitude" z={beta} color="#22c55e" />
          </div>
        </div>

        {/* Right: probability bars */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
            Measurement Probabilities
          </div>
          {/* Computational basis */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium">
              Computational basis {'{|0⟩, |1⟩}'}
            </div>
            <ProbBar label="|0⟩" value={probZero} color="#3b82f6" />
            <ProbBar label="|1⟩" value={probOne} color="#22c55e" />
          </div>
          {/* Hadamard basis */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium">Hadamard basis {'{|+⟩, |−⟩}'}</div>
            <ProbBar label="|+⟩" value={probPlus} color="#f59e0b" />
            <ProbBar label="|−⟩" value={probMinus} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 w-24 sm:w-28 flex-shrink-0">
            Global phase φ
          </label>
          <input
            type="range"
            min={0}
            max={6.28}
            step={0.01}
            value={globalPhase}
            onChange={(e) => setGlobalPhase(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-20 text-right whitespace-nowrap flex-shrink-0">
            {fmtAngle(globalPhase)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 w-24 sm:w-28 flex-shrink-0">
            Relative phase θ
          </label>
          <input
            type="range"
            min={0}
            max={6.28}
            step={0.01}
            value={relativePhase}
            onChange={(e) => setRelativePhase(Number(e.target.value))}
            className="flex-1 accent-green-500"
          />
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-20 text-right whitespace-nowrap flex-shrink-0">
            {fmtAngle(relativePhase)}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setGlobalPhase(p.global)
                setRelativePhase(p.relative)
              }}
              className="px-2.5 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AmplitudeCircle({ label, z, color }: { label: string; z: Complex; color: string }) {
  const cx = MINI_SIZE / 2
  const cy = MINI_SIZE / 2
  const mag = cAbs(z)
  const ang = cArg(z)
  const vx = cx + (MINI_R * z[0]) / (1 / Math.sqrt(2) + 0.01)
  const vy = cy - (MINI_R * z[1]) / (1 / Math.sqrt(2) + 0.01)

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <svg
        viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}
        width={MINI_SIZE}
        height={MINI_SIZE}
        className="bg-slate-50 dark:bg-slate-800 rounded-lg"
      >
        {/* Circle border */}
        <circle
          cx={cx}
          cy={cy}
          r={MINI_R}
          fill="none"
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-600"
          strokeWidth={1}
        />

        {/* Crosshair */}
        <line
          x1={cx - MINI_R}
          y1={cy}
          x2={cx + MINI_R}
          y2={cy}
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={0.5}
        />
        <line
          x1={cx}
          y1={cy - MINI_R}
          x2={cx}
          y2={cy + MINI_R}
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={0.5}
        />

        {/* Vector */}
        <line x1={cx} y1={cy} x2={vx} y2={vy} stroke={color} strokeWidth={2.5} />
        <circle cx={vx} cy={vy} r={4} fill={color} />
      </svg>
      <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
        {fmtNum(mag, 2)} &ang; {fmtAngle(ang)}
      </div>
    </div>
  )
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono w-8 text-slate-600 dark:text-slate-400">{label}</span>
      <div className="flex-1 h-5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden relative">
        <div
          className="h-full rounded transition-all duration-150"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium text-slate-800 dark:text-slate-200 mix-blend-difference">
          {fmtNum(value, 2)}
        </span>
      </div>
    </div>
  )
}
