'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SchrodingerSimulator } from '@/lib/sim/schrodinger'
import { WavefunctionPlot } from './WavefunctionPlot'
import { ObservablesBar } from './ObservablesBar'
import { EigenstatePanel } from './EigenstatePanel'
import { SuperpositionBuilder } from './SuperpositionBuilder'
import { PotentialSelector } from './PotentialSelector'
import type {
  PotentialType,
  Observables,
  Wavefunction,
  Eigenstate,
  SchrodingerSimulatorProps,
  SuperpositionCoeff,
} from '@/lib/sim/schrodinger/types'

type BottomTab = 'eigenstates' | 'superposition'

/**
 * 1D Schrödinger Simulator UI.
 * Full interactive environment: wavefunction visualization, potential selection,
 * eigenstate computation, superposition builder, play/pause animation.
 */
export function SchrodingerSimulatorUI({
  gridPoints = 512,
  domain = [-10, 10],
  potential: initialPotential = 'infinite_well',
  potentialParams: initialPotentialParams,
  initialState,
  numEigenstates = 5,
  showProbabilityDensity = true,
  showRealPart = false,
  showImagPart = false,
  showPotential = true,
  showEigenstates = true,
  showExpectationValues = true,
  editablePotential = false,
  showControls = true,
  onFrame,
  className,
}: SchrodingerSimulatorProps) {
  // Simulator ref
  const simRef = useRef<SchrodingerSimulator>(
    new SchrodingerSimulator(gridPoints, domain, initialPotential, initialPotentialParams),
  )

  // Display toggles
  const [showProb, setShowProb] = useState(showProbabilityDensity)
  const [showRe, setShowRe] = useState(showRealPart)
  const [showIm, setShowIm] = useState(showImagPart)
  const [showV, setShowV] = useState(showPotential)

  // State
  const [potentialType, setPotentialType] = useState<PotentialType>(initialPotential)
  const [potentialParams, setPotentialParams] = useState<Record<string, number>>(
    initialPotentialParams ?? simRef.current.potential.params,
  )
  const [wavefunction, setWavefunction] = useState<Wavefunction>(() => simRef.current.getWavefunction())
  const [observables, setObservables] = useState<Observables>(() => simRef.current.getObservables())
  const [eigenstates, setEigenstates] = useState<Eigenstate[]>([])
  const [selectedEigenstate, setSelectedEigenstate] = useState<number | undefined>()
  const [playing, setPlaying] = useState(false)
  const [stepsPerFrame, setStepsPerFrame] = useState(10)
  const [bottomTab, setBottomTab] = useState<BottomTab>('eigenstates')

  // Animation
  const playingRef = useRef(false)
  const animFrameRef = useRef<number>(0)

  const syncState = useCallback(() => {
    const sim = simRef.current
    const wf = sim.getWavefunction()
    const obs = sim.getObservables()
    setWavefunction(wf)
    setObservables(obs)
    onFrame?.(wf, obs)
  }, [onFrame])

  const animate = useCallback(() => {
    if (!playingRef.current) return
    const sim = simRef.current
    sim.step(stepsPerFrame)
    syncState()
    animFrameRef.current = requestAnimationFrame(animate)
  }, [stepsPerFrame, syncState])

  const handlePlay = useCallback(() => {
    playingRef.current = true
    setPlaying(true)
    animFrameRef.current = requestAnimationFrame(animate)
  }, [animate])

  const handlePause = useCallback(() => {
    playingRef.current = false
    setPlaying(false)
    cancelAnimationFrame(animFrameRef.current)
  }, [])

  const handleStep = useCallback(() => {
    if (playing) handlePause()
    simRef.current.step(1)
    syncState()
  }, [playing, handlePause, syncState])

  const handleReset = useCallback(() => {
    handlePause()
    const sim = simRef.current
    sim.reset(initialState ?? { type: 'ground' })
    setSelectedEigenstate(initialState?.type === 'eigenstate' ? initialState.n : undefined)
    syncState()
  }, [handlePause, initialState, syncState])

  // Potential change
  const handlePotentialChange = useCallback((type: PotentialType, params: Record<string, number>) => {
    handlePause()
    const sim = simRef.current
    sim.setPotential(type, params)
    setPotentialType(type)
    setPotentialParams(params)
    setEigenstates([])
    setSelectedEigenstate(undefined)
    sim.setInitialState({ type: 'ground' })
    syncState()
  }, [handlePause, syncState])

  // Compute eigenstates
  const handleComputeEigenstates = useCallback(() => {
    const sim = simRef.current
    sim.computeEigenstates(numEigenstates)
    setEigenstates([...sim.eigenstates])
  }, [numEigenstates])

  // Select eigenstate
  const handleSelectEigenstate = useCallback((index: number) => {
    handlePause()
    const sim = simRef.current
    sim.setInitialState({ type: 'eigenstate', n: index })
    setSelectedEigenstate(index)
    syncState()
  }, [handlePause, syncState])

  // Apply superposition
  const handleApplySuperposition = useCallback((coefficients: SuperpositionCoeff[]) => {
    handlePause()
    const sim = simRef.current
    sim.setInitialState({ type: 'superposition', coefficients })
    setSelectedEigenstate(undefined)
    syncState()
  }, [handlePause, syncState])

  // Initial setup
  useEffect(() => {
    const sim = simRef.current
    sim.computeEigenstates(numEigenstates)
    setEigenstates([...sim.eigenstates])

    if (initialState) {
      sim.setInitialState(initialState)
    } else {
      sim.setInitialState({ type: 'ground' })
    }
    syncState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar */}
      {showControls && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Play / Pause / Step / Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={playing ? handlePause : handlePlay}
              className="rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleStep}
              className="rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              aria-label="Step"
            >
              Step
            </button>
            <button
              onClick={handleReset}
              className="rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              aria-label="Reset"
            >
              Reset
            </button>
          </div>

          {/* Speed */}
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            Speed:
            <input
              type="range"
              min={1}
              max={50}
              value={stepsPerFrame}
              onChange={e => setStepsPerFrame(parseInt(e.target.value))}
              className="h-1 w-20"
            />
            <span className="w-6 font-mono text-[10px]">{stepsPerFrame}</span>
          </label>

          {/* Display toggles */}
          <div className="flex items-center gap-1 text-xs">
            <label className="flex cursor-pointer items-center gap-0.5">
              <input type="checkbox" checked={showProb} onChange={e => setShowProb(e.target.checked)} className="h-3 w-3" />
              <span className="text-blue-500">|ψ|²</span>
            </label>
            <label className="flex cursor-pointer items-center gap-0.5">
              <input type="checkbox" checked={showRe} onChange={e => setShowRe(e.target.checked)} className="h-3 w-3" />
              <span className="text-red-500">Re</span>
            </label>
            <label className="flex cursor-pointer items-center gap-0.5">
              <input type="checkbox" checked={showIm} onChange={e => setShowIm(e.target.checked)} className="h-3 w-3" />
              <span className="text-green-500">Im</span>
            </label>
            <label className="flex cursor-pointer items-center gap-0.5">
              <input type="checkbox" checked={showV} onChange={e => setShowV(e.target.checked)} className="h-3 w-3" />
              <span className="text-muted-foreground">V(x)</span>
            </label>
          </div>
        </div>
      )}

      {/* Potential selector */}
      {showControls && (
        <div className="flex flex-wrap items-center gap-2">
          <PotentialSelector
            currentType={potentialType}
            currentParams={potentialParams}
            onChange={handlePotentialChange}
          />
          {eigenstates.length === 0 && (
            <button
              onClick={handleComputeEigenstates}
              className="rounded border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Compute Eigenstates
            </button>
          )}
        </div>
      )}

      {/* Main plot */}
      <WavefunctionPlot
        wavefunction={wavefunction}
        potential={simRef.current.potential}
        eigenstateEnergies={showEigenstates ? eigenstates.map(e => e.energy) : undefined}
        expectationX={showExpectationValues ? observables.expectationX : undefined}
        showProbDensity={showProb}
        showRealPart={showRe}
        showImagPart={showIm}
        showPotential={showV}
        editablePotential={editablePotential}
      />

      {/* Observables */}
      {showExpectationValues && <ObservablesBar observables={observables} />}

      {/* Bottom panels */}
      {showControls && eigenstates.length > 0 && (
        <div>
          {/* Tab buttons */}
          <div className="flex gap-1 border-b border-border">
            <button
              onClick={() => setBottomTab('eigenstates')}
              className={cn(
                'border-b-2 px-3 py-1.5 text-xs font-medium transition-colors',
                bottomTab === 'eigenstates'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Eigenstates
            </button>
            <button
              onClick={() => setBottomTab('superposition')}
              className={cn(
                'border-b-2 px-3 py-1.5 text-xs font-medium transition-colors',
                bottomTab === 'superposition'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Superposition
            </button>
          </div>

          {/* Tab content */}
          {bottomTab === 'eigenstates' && (
            <EigenstatePanel
              eigenstates={eigenstates}
              selectedIndex={selectedEigenstate}
              onSelect={handleSelectEigenstate}
            />
          )}
          {bottomTab === 'superposition' && (
            <SuperpositionBuilder
              eigenstates={eigenstates}
              onApply={handleApplySuperposition}
            />
          )}
        </div>
      )}
    </div>
  )
}
