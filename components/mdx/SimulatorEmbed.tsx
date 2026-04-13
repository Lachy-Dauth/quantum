'use client'

import { simulatorRegistry } from '@/components/simulators'

interface SimulatorEmbedProps {
  simulator: string
  initialState?: Record<string, unknown>
  height?: number
  caption?: string
}

export function SimulatorEmbed({ simulator, initialState, height = 400, caption }: SimulatorEmbedProps) {
  const Component = simulatorRegistry[simulator]

  return (
    <div className="my-6 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {Component ? (
        <Component initialState={initialState} height={height} />
      ) : (
        <div
          className="flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 border-dashed border border-slate-300 dark:border-slate-600"
          style={{ height }}
        >
          <p className="text-sm text-slate-500">Simulator not yet implemented: {simulator}</p>
        </div>
      )}
      {caption && (
        <p className="px-4 py-3 text-center text-sm text-muted-foreground border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {caption}
        </p>
      )}
    </div>
  )
}
