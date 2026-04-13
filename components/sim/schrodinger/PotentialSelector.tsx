'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { POTENTIAL_CONFIGS } from '@/lib/sim/schrodinger/potentials'
import type { PotentialType } from '@/lib/sim/schrodinger/types'

interface PotentialSelectorProps {
  currentType: PotentialType
  currentParams: Record<string, number>
  onChange: (type: PotentialType, params: Record<string, number>) => void
  className?: string
}

const POTENTIAL_OPTIONS: { value: PotentialType; label: string }[] = [
  { value: 'infinite_well', label: 'Infinite Square Well' },
  { value: 'finite_well', label: 'Finite Square Well' },
  { value: 'harmonic', label: 'Harmonic Oscillator' },
  { value: 'step', label: 'Step Potential' },
  { value: 'barrier', label: 'Potential Barrier' },
  { value: 'double_well', label: 'Double Well' },
]

const PARAM_LABELS: Record<string, string> = {
  L: 'Well width (L)',
  V0: 'Potential height (V₀)',
  omega: 'Frequency (ω)',
  width: 'Barrier width',
  a: 'Coefficient (a)',
  b: 'Separation (b)',
}

/**
 * Dropdown and parameter controls for selecting and configuring the potential.
 */
export function PotentialSelector({ currentType, currentParams, onChange, className }: PotentialSelectorProps) {
  const [localParams, setLocalParams] = useState<Record<string, number>>(currentParams)

  const handleTypeChange = useCallback((type: PotentialType) => {
    const defaults = POTENTIAL_CONFIGS[type].defaultParams
    setLocalParams(defaults)
    onChange(type, defaults)
  }, [onChange])

  const handleParamChange = useCallback((key: string, value: number) => {
    const next = { ...localParams, [key]: value }
    setLocalParams(next)
    onChange(currentType, next)
  }, [currentType, localParams, onChange])

  const paramKeys = Object.keys(POTENTIAL_CONFIGS[currentType].defaultParams)

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <select
        value={currentType}
        onChange={e => handleTypeChange(e.target.value as PotentialType)}
        className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
      >
        {POTENTIAL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {paramKeys.map(key => (
        <label key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
          {PARAM_LABELS[key] ?? key}:
          <input
            type="number"
            value={localParams[key] ?? POTENTIAL_CONFIGS[currentType].defaultParams[key] ?? 0}
            onChange={e => handleParamChange(key, parseFloat(e.target.value) || 0)}
            step={0.1}
            className="w-16 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground"
          />
        </label>
      ))}
    </div>
  )
}
