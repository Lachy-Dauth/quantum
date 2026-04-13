'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AxisPickerProps {
  theta: number
  phi: number
  onChange: (theta: number, phi: number) => void
  showPresets?: boolean
  className?: string
}

const PRESETS = [
  { label: 'Z', theta: 0, phi: 0 },
  { label: 'X', theta: Math.PI / 2, phi: 0 },
  { label: 'Y', theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: '-Z', theta: Math.PI, phi: 0 },
  { label: '-X', theta: Math.PI / 2, phi: Math.PI },
  { label: '-Y', theta: Math.PI / 2, phi: 3 * Math.PI / 2 },
]

/**
 * Axis picker for Stern-Gerlach apparatus.
 * Two sliders (theta, phi) + preset buttons.
 */
export function AxisPicker({ theta, phi, onChange, showPresets = true, className }: AxisPickerProps) {
  const nx = Math.sin(theta) * Math.cos(phi)
  const ny = Math.sin(theta) * Math.sin(phi)
  const nz = Math.cos(theta)

  return (
    <div className={cn('flex flex-col gap-2 p-2 rounded-lg border border-border bg-background', className)}>
      {/* Preset buttons */}
      {showPresets && (
        <div className="flex flex-wrap gap-1">
          {PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => onChange(preset.theta, preset.phi)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-mono transition-colors',
                'border border-border hover:bg-muted',
                Math.abs(theta - preset.theta) < 0.01 && Math.abs(phi - preset.phi) < 0.01
                  && 'bg-primary/10 border-primary text-primary',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Theta slider */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-6 shrink-0">&theta;</label>
        <input
          type="range"
          min={0}
          max={Math.PI}
          step={0.01}
          value={theta}
          onChange={e => onChange(parseFloat(e.target.value), phi)}
          className="flex-1 h-1.5 accent-primary"
        />
        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
          {(theta * 180 / Math.PI).toFixed(0)}&deg;
        </span>
      </div>

      {/* Phi slider */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-6 shrink-0">&phi;</label>
        <input
          type="range"
          min={0}
          max={2 * Math.PI}
          step={0.01}
          value={phi}
          onChange={e => onChange(theta, parseFloat(e.target.value))}
          className="flex-1 h-1.5 accent-primary"
        />
        <span className="text-xs font-mono text-muted-foreground w-10 text-right">
          {(phi * 180 / Math.PI).toFixed(0)}&deg;
        </span>
      </div>

      {/* Unit vector display */}
      <div className="text-[10px] font-mono text-muted-foreground text-center">
        n = ({nx.toFixed(2)}, {ny.toFixed(2)}, {nz.toFixed(2)})
      </div>
    </div>
  )
}
