'use client'

import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  BarChart3,
} from 'lucide-react'

interface ToolbarProps {
  currentStep: number
  maxStep: number
  speed: number
  displayBasis: 'computational' | 'hadamard' | 'bell'
  showAlgebra: boolean
  batchRunning: boolean
  readOnly?: boolean
  numQubits: number
  batchRuns: number
  onStepBack: () => void
  onStepForward: () => void
  onRunAll: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  onBasisChange: (basis: 'computational' | 'hadamard' | 'bell') => void
  onToggleAlgebra: () => void
  onBatchRun: (n: number) => void
  className?: string
}

export function Toolbar({
  currentStep,
  maxStep,
  speed,
  displayBasis,
  showAlgebra,
  batchRunning,
  readOnly,
  numQubits,
  batchRuns,
  onStepBack,
  onStepForward,
  onRunAll,
  onReset,
  onSpeedChange,
  onBasisChange,
  onToggleAlgebra,
  onBatchRun,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2',
        className,
      )}
    >
      {/* Step controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onStepBack}
          disabled={currentStep <= 0}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
          aria-label="Step back"
          title="Step back"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onStepForward}
          disabled={currentStep >= maxStep}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
          aria-label="Step forward"
          title="Step forward"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={onRunAll}
          disabled={currentStep >= maxStep}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
          aria-label="Run all"
          title="Run all steps"
        >
          <Play className="h-4 w-4" />
        </button>
        <button
          onClick={onReset}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
          aria-label="Reset"
          title="Reset to initial state"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Step indicator */}
      <span className="text-xs text-muted-foreground font-mono">
        Step {currentStep}/{maxStep}
      </span>

      <div className="h-4 w-px bg-border" />

      {/* Speed slider */}
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        Speed
        <input
          type="range"
          min={100}
          max={2000}
          step={100}
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="h-1 w-16 accent-primary"
        />
      </label>

      <div className="h-4 w-px bg-border" />

      {/* Basis dropdown */}
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        Basis
        <select
          value={displayBasis}
          onChange={e => onBasisChange(e.target.value as any)}
          className="h-7 rounded border border-border bg-background px-1.5 text-xs text-foreground"
        >
          <option value="computational">Computational</option>
          <option value="hadamard">Hadamard</option>
          {numQubits === 2 && <option value="bell">Bell</option>}
        </select>
      </label>

      <div className="h-4 w-px bg-border" />

      {/* Algebra toggle */}
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={showAlgebra}
          onChange={onToggleAlgebra}
          className="h-3.5 w-3.5 rounded accent-primary"
        />
        Algebra
      </label>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Batch run */}
      <button
        onClick={() => onBatchRun(batchRuns)}
        disabled={batchRunning}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs hover:bg-muted disabled:opacity-50 transition-colors"
      >
        <BarChart3 className="h-3.5 w-3.5" />
        {batchRunning ? 'Running...' : `Batch (${batchRuns})`}
      </button>
    </div>
  )
}
