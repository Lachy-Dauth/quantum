'use client'

import { useEffect, useRef } from 'react'
import { getGateInfo } from '@/lib/sim/qubit/gate-registry'
import type { Gate } from '@/lib/sim/qubit/types'

interface GateContextMenuProps {
  gate: Gate
  position: { x: number; y: number }
  onDelete: () => void
  onEditParams: () => void
  onClose: () => void
}

export function GateContextMenu({
  gate,
  position,
  onDelete,
  onEditParams,
  onClose,
}: GateContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const info = getGateInfo(gate.type)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[120px] rounded-lg border border-border bg-background shadow-lg"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">
        {info.label}
        {gate.targets.length === 1
          ? ` on q${gate.targets[0]}`
          : ` on q${gate.targets.join(', q')}`
        }
      </div>
      {info.parameterized && (
        <button
          onClick={() => { onEditParams(); onClose() }}
          className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted transition-colors"
        >
          Edit Parameters
        </button>
      )}
      <button
        onClick={() => { onDelete(); onClose() }}
        className="w-full px-3 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-muted transition-colors"
      >
        Delete
      </button>
    </div>
  )
}
