'use client'

import { cn } from '@/lib/utils'
import { GateTile } from './GateTile'
import { getGatesByCategory } from '@/lib/sim/qubit/gate-registry'
import type { GateType } from '@/lib/sim/qubit/types'

interface GatePaletteProps {
  onGateSelect?: (gateType: GateType) => void
  className?: string
}

const SECTION_LABELS: Record<string, string> = {
  single: 'Single-Qubit',
  parameterized: 'Parameterised',
  multi: 'Multi-Qubit',
  measurement: 'Measurement',
}

export function GatePalette({ onGateSelect, className }: GatePaletteProps) {
  const categories = getGatesByCategory()

  return (
    <div className={cn('flex flex-col gap-3 p-2', className)}>
      {Object.entries(categories).map(([category, gates]) => (
        <div key={category}>
          <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {SECTION_LABELS[category] ?? category}
          </h3>
          <div className="flex flex-wrap gap-1">
            {gates.map((gateType) => (
              <GateTile
                key={gateType}
                gateType={gateType}
                onSelect={onGateSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
