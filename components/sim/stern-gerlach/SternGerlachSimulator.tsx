'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { SGSimulator, parseSGInitialState } from '@/lib/sim/stern-gerlach'
import { STATE_ZERO } from '@/lib/sim/core/vector'
import { SGSchematic } from './SGSchematic'
import { SGHistogram } from './SGHistogram'
import { SGStateDisplay } from './SGStateDisplay'
import { AxisPicker } from './AxisPicker'
import type { SGApparatus, SGSingleResult, SGBatchResult, SternGerlachProps } from '@/lib/sim/stern-gerlach/types'

let nextId = 1
function genId(): string {
  return `m${nextId++}`
}

const INITIAL_STATE_OPTIONS = [
  { label: '|+z⟩', value: '|+z>' },
  { label: '|-z⟩', value: '|-z>' },
  { label: '|+x⟩', value: '|+x>' },
  { label: '|-x⟩', value: '|-x>' },
  { label: '|+y⟩', value: '|+y>' },
  { label: '|-y⟩', value: '|-y>' },
]

export function SternGerlachSimulator({
  initialState: initialStateProp,
  apparatuses: initialApparatuses,
  maxApparatuses = 4,
  editable = true,
  showStateDisplay = true,
  showMath = false,
  showStatistics = true,
  showPresetAxes = true,
  onParticleDetected,
  onBatchComplete,
  className,
}: SternGerlachProps) {
  const simRef = useRef<SGSimulator>(new SGSimulator())

  // Parse initial state
  const defaultState = initialStateProp
    ? parseSGInitialState(initialStateProp)
    : STATE_ZERO
  const [initialStateStr, setInitialStateStr] = useState(
    typeof initialStateProp === 'string' ? initialStateProp : '|+z>',
  )

  // Apparatuses state
  const [apparatuses, setApparatuses] = useState<SGApparatus[]>(
    initialApparatuses ?? [{ id: genId(), axis: { theta: 0, phi: 0 }, input: 'source', blocked: null }],
  )

  // Results
  const [lastResult, setLastResult] = useState<SGSingleResult | null>(null)
  const [detectorCounts, setDetectorCounts] = useState<Map<string, number>>(new Map())
  const [totalEmitted, setTotalEmitted] = useState(0)
  const [totalBlocked, setTotalBlocked] = useState(0)
  const [theoreticalProbs, setTheoreticalProbs] = useState<Map<string, number>>(new Map())

  // Axis picker state
  const [editingApparatus, setEditingApparatus] = useState<string | null>(null)

  const updateSimulator = useCallback(() => {
    const state = parseSGInitialState(initialStateStr)
    simRef.current.setExperiment({ initialState: state, apparatuses })

    // Update theoretical probabilities
    const probs = simRef.current.computeTheoreticalProbabilities()
    setTheoreticalProbs(probs)
  }, [apparatuses, initialStateStr])

  const sendParticle = useCallback((n: number) => {
    updateSimulator()
    const sim = simRef.current

    if (n === 1) {
      const result = sim.runSingle()
      setLastResult(result)
      onParticleDetected?.(result)

      setTotalEmitted(prev => prev + 1)
      if (result.blocked) {
        setTotalBlocked(prev => prev + 1)
      } else if (result.finalDetector) {
        setDetectorCounts(prev => {
          const next = new Map(prev)
          next.set(result.finalDetector!, (next.get(result.finalDetector!) ?? 0) + 1)
          return next
        })
      }
    } else {
      const batch = sim.runBatch(n)
      onBatchComplete?.(batch)

      setTotalEmitted(prev => prev + batch.totalEmitted)
      setTotalBlocked(prev => prev + batch.totalBlocked)
      setDetectorCounts(prev => {
        const next = new Map(prev)
        for (const [key, count] of batch.detectorCounts) {
          next.set(key, (next.get(key) ?? 0) + count)
        }
        return next
      })
      setLastResult(null)
    }
  }, [updateSimulator, onParticleDetected, onBatchComplete])

  const resetStats = useCallback(() => {
    setDetectorCounts(new Map())
    setTotalEmitted(0)
    setTotalBlocked(0)
    setLastResult(null)
  }, [])

  const handleAxisChange = useCallback((id: string, theta: number, phi: number) => {
    setApparatuses(prev =>
      prev.map(a => a.id === id ? { ...a, axis: { theta, phi } } : a),
    )
    resetStats()
  }, [resetStats])

  const handleBlockToggle = useCallback((id: string, beam: 'up' | 'down') => {
    setApparatuses(prev =>
      prev.map(a => {
        if (a.id !== id) return a
        return { ...a, blocked: a.blocked === beam ? null : beam }
      }),
    )
    resetStats()
  }, [resetStats])

  const addApparatus = useCallback((parentId: string, output: 'up' | 'down') => {
    if (apparatuses.length >= maxApparatuses) return
    const newApp: SGApparatus = {
      id: genId(),
      axis: { theta: 0, phi: 0 },
      input: { apparatusId: parentId, output },
      blocked: null,
    }
    setApparatuses(prev => [...prev, newApp])
    resetStats()
  }, [apparatuses.length, maxApparatuses, resetStats])

  const removeApparatus = useCallback((id: string) => {
    setApparatuses(prev => {
      // Remove this apparatus and any that depend on it
      const toRemove = new Set<string>([id])
      let changed = true
      while (changed) {
        changed = false
        for (const a of prev) {
          if (toRemove.has(a.id)) continue
          if (typeof a.input === 'object' && toRemove.has(a.input.apparatusId)) {
            toRemove.add(a.id)
            changed = true
          }
        }
      }
      return prev.filter(a => !toRemove.has(a.id))
    })
    resetStats()
  }, [resetStats])

  const handleInitialStateChange = useCallback((value: string) => {
    setInitialStateStr(value)
    resetStats()
  }, [resetStats])

  const editApp = apparatuses.find(a => a.id === editingApparatus)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background p-2">
        <button
          onClick={() => sendParticle(1)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Send 1
        </button>
        <button
          onClick={() => sendParticle(100)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary/70 transition-colors"
        >
          Send 100
        </button>
        <button
          onClick={() => sendParticle(1000)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary/70 transition-colors"
        >
          Send 1000
        </button>
        <button
          onClick={() => sendParticle(10000)}
          className="rounded-md px-3 py-1 text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary/70 transition-colors"
        >
          Send 10000
        </button>
        <button
          onClick={resetStats}
          className="rounded-md px-3 py-1 text-xs font-medium border border-border hover:bg-muted transition-colors"
        >
          Reset Stats
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Initial state:</label>
          <select
            value={initialStateStr}
            onChange={e => handleInitialStateChange(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            disabled={!editable}
          >
            {INITIAL_STATE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schematic */}
      <SGSchematic
        apparatuses={apparatuses}
        lastResult={lastResult}
        detectorCounts={detectorCounts}
        onApparatusClick={editable ? (id) => setEditingApparatus(prev => prev === id ? null : id) : undefined}
        onBlockToggle={editable ? handleBlockToggle : undefined}
      />

      {/* Add apparatus hint */}
      {editable && apparatuses.length < maxApparatuses && (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Add apparatus after:</span>
          {apparatuses.map(app => (
            <span key={app.id} className="flex gap-1">
              <button
                onClick={() => addApparatus(app.id, 'up')}
                className="rounded border border-border px-1.5 py-0.5 hover:bg-muted transition-colors"
              >
                {app.id} +
              </button>
              <button
                onClick={() => addApparatus(app.id, 'down')}
                className="rounded border border-border px-1.5 py-0.5 hover:bg-muted transition-colors"
              >
                {app.id} &minus;
              </button>
            </span>
          ))}
          {apparatuses.length > 1 && (
            <>
              <span className="text-muted-foreground/50">|</span>
              <span>Remove:</span>
              {apparatuses.filter(a => a.input !== 'source').map(app => (
                <button
                  key={app.id}
                  onClick={() => removeApparatus(app.id)}
                  className="rounded border border-red-300 dark:border-red-800 px-1.5 py-0.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  x {app.id}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Axis picker for selected apparatus */}
      {editApp && editable && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">
            Configure {editApp.id} axis
          </h4>
          <AxisPicker
            theta={editApp.axis.theta}
            phi={editApp.axis.phi}
            onChange={(theta, phi) => handleAxisChange(editApp.id, theta, phi)}
            showPresets={showPresetAxes}
            className="max-w-xs"
          />
        </div>
      )}

      {/* State display */}
      {showStateDisplay && (
        <SGStateDisplay
          initialState={parseSGInitialState(initialStateStr)}
          lastResult={lastResult}
        />
      )}

      {/* Statistics histogram */}
      {showStatistics && (
        <SGHistogram
          detectorCounts={detectorCounts}
          totalEmitted={totalEmitted}
          totalBlocked={totalBlocked}
          theoreticalProbs={theoreticalProbs}
        />
      )}
    </div>
  )
}
