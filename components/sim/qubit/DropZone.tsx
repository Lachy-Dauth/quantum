'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  column: number
  qubitIndex: number
  style: React.CSSProperties
}

/**
 * Drop zone rendered as a positioned HTML div overlaying the SVG circuit.
 * @dnd-kit requires HTML elements for droppable refs.
 */
export function DropZone({ column, qubitIndex, style }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${column}-${qubitIndex}`,
    data: { column, qubitIndex },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'absolute rounded transition-all duration-150',
        isOver ? 'bg-primary/20 ring-1 ring-primary' : 'bg-transparent',
      )}
      style={style}
    />
  )
}
