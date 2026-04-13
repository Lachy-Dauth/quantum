'use client'

interface SimulatorEmbedProps {
  simulator: string
  initialState?: Record<string, unknown>
  height?: number
  caption?: string
}

export function SimulatorEmbed({ simulator, height = 400, caption }: SimulatorEmbedProps) {
  return (
    <div className="my-6 rounded-lg border border-dashed border-slate-300 p-4 dark:border-slate-700">
      <span className="text-xs font-mono text-slate-400">SimulatorEmbed: {simulator}</span>
      <div
        className="mt-2 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800"
        style={{ height }}
      >
        <p className="text-sm text-slate-500">Simulator placeholder: {simulator}</p>
      </div>
      {caption && <p className="mt-2 text-center text-sm text-slate-500">{caption}</p>}
    </div>
  )
}
