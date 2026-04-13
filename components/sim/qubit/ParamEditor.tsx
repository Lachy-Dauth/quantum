'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Gate, GateType } from '@/lib/sim/qubit/types'

interface ParamEditorProps {
  gateType: GateType
  currentParams?: Gate['params']
  onSave: (params: Gate['params']) => void
  onClose: () => void
}

export function ParamEditor({ gateType, currentParams, onSave, onClose }: ParamEditorProps) {
  const [theta, setTheta] = useState(currentParams?.theta ?? Math.PI / 2)
  const [phi, setPhi] = useState(currentParams?.phi ?? 0)
  const [lambda, setLambda] = useState(currentParams?.lambda ?? 0)

  const showTheta = ['RX', 'RY', 'RZ', 'U'].includes(gateType)
  const showPhi = ['PHASE', 'U'].includes(gateType)
  const showLambda = gateType === 'U'

  const handleSave = () => {
    const params: Gate['params'] = {}
    if (showTheta) params.theta = theta
    if (showPhi) params.phi = phi
    if (showLambda) params.lambda = lambda
    onSave(params)
    onClose()
  }

  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
      <h4 className="mb-2 text-xs font-medium text-foreground">{gateType} Parameters</h4>
      <div className="flex flex-col gap-2">
        {showTheta && (
          <ParamSlider label="θ" value={theta} onChange={setTheta} />
        )}
        {showPhi && (
          <ParamSlider label="φ" value={phi} onChange={setPhi} />
        )}
        {showLambda && (
          <ParamSlider label="λ" value={lambda} onChange={setLambda} />
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSave}
          className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
        >
          Apply
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function ParamSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="w-4 text-muted-foreground font-mono">{label}</span>
      <input
        type="range"
        min={0}
        max={2 * Math.PI}
        step={0.01}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-primary"
      />
      <input
        type="number"
        min={0}
        max={6.283185}
        step={0.01}
        value={value.toFixed(2)}
        onChange={e => onChange(Number(e.target.value))}
        className="w-16 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-right font-mono"
      />
    </label>
  )
}
