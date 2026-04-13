'use client'

import { cn } from '@/lib/utils'
import { getGateInfo } from '@/lib/sim/qubit/gate-registry'
import type { GateType } from '@/lib/sim/qubit/types'
import { useDraggable } from '@dnd-kit/core'

interface GateTileProps {
  gateType: GateType
  onSelect?: (gateType: GateType) => void
}

export function GateTile({ gateType, onSelect }: GateTileProps) {
  const info = getGateInfo(gateType)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${gateType}`,
    data: { gateType },
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-md border border-border',
        'bg-background text-xs font-mono transition-colors',
        'hover:bg-muted hover:border-primary/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isDragging && 'opacity-50',
      )}
      title={info.label}
      onClick={() => onSelect?.(gateType)}
      aria-label={`${info.label} gate`}
    >
      {info.symbol}
    </button>
  )
}
