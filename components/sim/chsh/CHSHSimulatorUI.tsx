'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CHSHSimulator } from '@/lib/sim/chsh'
import { AngleDial } from './AngleDial'
import { CorrelationTable } from './CorrelationTable'
import { ConvergencePlot } from './ConvergencePlot'
import type { CHSHSimulatorProps, CHSHExperimentState, EntangledState, CHSHPreset } from '@/lib/sim/chsh/types'

const DEFAULT_PRESETS: CHSHPreset[] = [
  {
    name: 'Maximal violation',
    aliceAngles: [0, Math.PI / 2],
    bobAngles: [Math.PI / 4, -Math.PI / 4],
    description: 'Standard angles for S = 2√2 with |Φ+⟩',
  },
  {
    name: 'Classical limit',
    aliceAngles: [0, Math.PI / 2],
    bobAngles: [0, Math.PI / 2],
    description: 'Aligned/orthogonal axes, S = 2',
  },
  {
    name: 'All same axis',
    aliceAngles: [0, 0],
    bobAngles: [0, 0],
    description: 'Both measure along Z. S = 2.',
  },
]

const ENTANGLED_STATE_OPTIONS: { label: string; value: EntangledState }[] = [
  { label: '|Φ+⟩', value: 'phi_plus' },
  { label: '|Φ-⟩', value: 'phi_minus' },
  { label: '|Ψ+⟩', value: 'psi_plus' },
  { label: '|Ψ-⟩', value: 'psi_minus' },
  { label: '|00⟩ (product)', value: 'product' },
]

export function CHSHSimulatorUI({
  entangledState: initialEntState = 'phi_plus',
  aliceAngles: initAlice,
  bobAngles: initBob,
  presets = DEFAULT_PRESETS,
  editable = true,
  showTrialTable = true,
  showConvergencePlot = true,
  maxTrials = 10000,
  onTrial,
  onSValueChange,
  className,
}: CHSHSimulatorProps) {
  const simRef = useRef(new CHSHSimulator(undefined, maxTrials))
  const [expState, setExpState] = useState<CHSHExperimentState>(() => simRef.current.getState())
  const [entState, setEntState] = useState<EntangledState>(initialEntState)
  const [aliceAngles, setAliceAngles] = useState<[number, number]>(initAlice ?? [0, Math.PI / 2])
  const [bobAngles, setBobAngles] = useState<[number, number]>(initBob ?? [Math.PI / 4, -Math.PI / 4])
  const [autoRunning, setAutoRunning] = useState(false)
  const autoRunRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [sHistory, setSHistory] = useState<number[]>([])
  const [selectedPreset, setSelectedPreset] = useState(0)

  // Sync simulator
  useEffect(() => {
    simRef.current.setEntangledState(entState)
    simRef.current.setAngles(aliceAngles, bobAngles)
    setExpState(simRef.current.getState())
    setSHistory([])
  }, [entState, aliceAngles, bobAngles])

  const runTrials = useCallback((n: number) => {
    simRef.current.runBatch(n)
    const state = simRef.current.getState()
    setExpState(state)
    setSHistory(prev => [...prev, state.empiricalS])
    onSValueChange?.(state.empiricalS, state.theoreticalS)
  }, [onSValueChange])

  const handleReset = useCallback(() => {
    simRef.current.reset()
    setExpState(simRef.current.getState())
    setSHistory([])
    if (autoRunRef.current) {
      clearInterval(autoRunRef.current)
      autoRunRef.current = null
      setAutoRunning(false)
    }
  }, [])

  const toggleAutoRun = useCallback(() => {
    if (autoRunning) {
      if (autoRunRef.current) clearInterval(autoRunRef.current)
      autoRunRef.current = null
      setAutoRunning(false)
    } else {
      setAutoRunning(true)
      autoRunRef.current = setInterval(() => {
        runTrials(10)
      }, 100)
    }
  }, [autoRunning, runTrials])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRunRef.current) clearInterval(autoRunRef.current)
    }
  }, [])

  const handlePresetChange = useCallback((idx: number) => {
    setSelectedPreset(idx)
    const preset = presets[idx]
    if (preset) {
      setAliceAngles(preset.aliceAngles)
      setBobAngles(preset.bobAngles)
      handleReset()
    }
  }, [presets, handleReset])

  const lastTrials = expState.trials.slice(-20)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background p-2">
        <button
          onClick={() => runTrials(1)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          1 Trial
        </button>
        <button
          onClick={() => runTrials(100)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary/70 transition-colors"
        >
          100
        </button>
        <button
          onClick={() => runTrials(1000)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary/70 transition-colors"
        >
          1000
        </button>
        <button
          onClick={toggleAutoRun}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            autoRunning
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'border border-border hover:bg-muted',
          )}
        >
          {autoRunning ? 'Stop' : 'Auto-run'}
        </button>
        <button
          onClick={handleReset}
          className="rounded-md px-3 py-1 text-xs font-medium border border-border hover:bg-muted transition-colors"
        >
          Reset
        </button>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {/* Preset selector */}
          {editable && (
            <select
              value={selectedPreset}
              onChange={e => handlePresetChange(parseInt(e.target.value))}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            >
              {presets.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
          )}

          {/* Entangled state */}
          <select
            value={entState}
            onChange={e => { setEntState(e.target.value as EntangledState); handleReset() }}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            disabled={!editable}
          >
            {ENTANGLED_STATE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Experiment schematic: Alice dials — source — Bob dials */}
      <div className="flex items-center justify-center gap-6 rounded-lg border border-border bg-background p-3">
        <AngleDial
          label="Alice"
          angles={aliceAngles}
          onChange={a => { setAliceAngles(a); handleReset() }}
          editable={editable}
        />

        <div className="flex flex-col items-center gap-1">
          <div className="rounded-md border border-border px-3 py-2 text-xs font-mono text-center">
            <div className="text-muted-foreground mb-0.5">Source</div>
            <div className="font-medium">
              {ENTANGLED_STATE_OPTIONS.find(o => o.value === entState)?.label}
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {expState.totalTrials} trials
          </div>
        </div>

        <AngleDial
          label="Bob"
          angles={bobAngles}
          onChange={b => { setBobAngles(b); handleReset() }}
          editable={editable}
        />
      </div>

      {/* Correlation table + S value */}
      <CorrelationTable state={expState} />

      {/* Convergence plot */}
      {showConvergencePlot && sHistory.length > 0 && (
        <ConvergencePlot
          sValues={sHistory}
          theoreticalS={expState.theoreticalS}
        />
      )}

      {/* Trial table */}
      {showTrialTable && lastTrials.length > 0 && (
        <div className="rounded-lg border border-border bg-background p-3">
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">
            Recent Trials (last {lastTrials.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="text-xs font-mono w-full">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="px-1 py-0.5 text-left">#</th>
                  <th className="px-1 py-0.5">Alice</th>
                  <th className="px-1 py-0.5">A out</th>
                  <th className="px-1 py-0.5">Bob</th>
                  <th className="px-1 py-0.5">B out</th>
                  <th className="px-1 py-0.5">A*B</th>
                </tr>
              </thead>
              <tbody>
                {lastTrials.map((t, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="px-1 py-0.5 text-muted-foreground">{expState.totalTrials - lastTrials.length + i + 1}</td>
                    <td className="px-1 py-0.5 text-center">a{t.aliceSetting + 1}</td>
                    <td className="px-1 py-0.5 text-center">{t.aliceOutcome > 0 ? '+1' : '-1'}</td>
                    <td className="px-1 py-0.5 text-center">b{t.bobSetting + 1}</td>
                    <td className="px-1 py-0.5 text-center">{t.bobOutcome > 0 ? '+1' : '-1'}</td>
                    <td className={cn(
                      'px-1 py-0.5 text-center font-bold',
                      t.product > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                    )}>
                      {t.product > 0 ? '+1' : '-1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
