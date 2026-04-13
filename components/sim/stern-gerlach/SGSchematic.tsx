'use client'

import { cn } from '@/lib/utils'
import type { SGApparatus, SGSingleResult } from '@/lib/sim/stern-gerlach/types'

interface SGSchematicProps {
  apparatuses: SGApparatus[]
  lastResult?: SGSingleResult | null
  detectorCounts: Map<string, number>
  onApparatusClick?: (id: string) => void
  onBlockToggle?: (id: string, beam: 'up' | 'down') => void
  className?: string
}

/**
 * SVG schematic of the Stern-Gerlach apparatus chain.
 * Shows source, magnets, beam paths, blocked beams, and detector counts.
 */
export function SGSchematic({
  apparatuses,
  lastResult,
  detectorCounts,
  onApparatusClick,
  onBlockToggle,
  className,
}: SGSchematicProps) {
  const numStages = apparatuses.length
  const stageWidth = 160
  const sourceWidth = 70
  const beamLen = 50
  const magnetWidth = 70
  const magnetHeight = 50
  const splitY = 35
  const padding = 16
  const width = padding * 2 + sourceWidth + beamLen + numStages * stageWidth + 80
  const centerY = 120
  const height = 240

  // Build layout: track the Y position of each apparatus
  const appPositions = new Map<string, { x: number; y: number }>()

  // For a simple chain, lay out linearly with branching offsets
  let currentX = padding + sourceWidth + beamLen
  for (let i = 0; i < apparatuses.length; i++) {
    const app = apparatuses[i]!
    let y = centerY

    // If input comes from another apparatus's up/down, offset Y
    if (typeof app.input === 'object') {
      const parentPos = appPositions.get(app.input.apparatusId)
      if (parentPos) {
        y = parentPos.y + (app.input.output === 'up' ? -splitY : splitY)
      }
    }

    appPositions.set(app.id, { x: currentX, y })
    currentX += stageWidth
  }

  function axisLabel(app: SGApparatus): string {
    const t = app.axis.theta
    const p = app.axis.phi
    if (Math.abs(t) < 0.01) return 'Z'
    if (Math.abs(t - Math.PI) < 0.01) return '-Z'
    if (Math.abs(t - Math.PI / 2) < 0.01) {
      if (Math.abs(p) < 0.01 || Math.abs(p - 2 * Math.PI) < 0.01) return 'X'
      if (Math.abs(p - Math.PI / 2) < 0.01) return 'Y'
      if (Math.abs(p - Math.PI) < 0.01) return '-X'
      if (Math.abs(p - 3 * Math.PI / 2) < 0.01) return '-Y'
    }
    return `${(t * 180 / Math.PI).toFixed(0)}°`
  }

  // Find the last outcome for highlighting the beam path
  const outcomeMap = new Map<string, 'up' | 'down'>()
  if (lastResult) {
    for (const o of lastResult.outcomes) {
      outcomeMap.set(o.apparatusId, o.output)
    }
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-background', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="select-none"
        role="img"
        aria-label={`Stern-Gerlach experiment with ${numStages} apparatus${numStages > 1 ? 'es' : ''}`}
      >
        {/* Source */}
        <rect
          x={padding}
          y={centerY - 18}
          width={sourceWidth}
          height={36}
          rx={4}
          className="fill-muted stroke-foreground"
          strokeWidth={1}
        />
        <text
          x={padding + sourceWidth / 2}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-xs font-mono select-none"
        >
          Source
        </text>

        {/* Beam from source to first magnet */}
        {apparatuses.length > 0 && (
          <line
            x1={padding + sourceWidth}
            y1={centerY}
            x2={appPositions.get(apparatuses[0]!.id)!.x}
            y2={appPositions.get(apparatuses[0]!.id)!.y}
            className="stroke-foreground"
            strokeWidth={1.5}
          />
        )}

        {/* Apparatuses */}
        {apparatuses.map(app => {
          const pos = appPositions.get(app.id)!
          const outcome = outcomeMap.get(app.id)

          return (
            <g key={app.id}>
              {/* Magnet body */}
              <rect
                x={pos.x}
                y={pos.y - magnetHeight / 2}
                width={magnetWidth}
                height={magnetHeight}
                rx={6}
                className={cn(
                  'fill-background stroke-foreground cursor-pointer transition-colors',
                  outcome && 'stroke-primary stroke-2',
                )}
                strokeWidth={1}
                onClick={() => onApparatusClick?.(app.id)}
              />

              {/* N/S labels */}
              <text
                x={pos.x + magnetWidth / 2}
                y={pos.y - magnetHeight / 2 + 10}
                textAnchor="middle"
                className="fill-muted-foreground select-none"
                style={{ fontSize: '8px' }}
              >
                N
              </text>
              <text
                x={pos.x + magnetWidth / 2}
                y={pos.y + magnetHeight / 2 - 4}
                textAnchor="middle"
                className="fill-muted-foreground select-none"
                style={{ fontSize: '8px' }}
              >
                S
              </text>

              {/* Axis label */}
              <text
                x={pos.x + magnetWidth / 2}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-xs font-mono font-bold select-none pointer-events-none"
              >
                {axisLabel(app)}
              </text>

              {/* Up beam */}
              <line
                x1={pos.x + magnetWidth}
                y1={pos.y}
                x2={pos.x + magnetWidth + beamLen}
                y2={pos.y - splitY}
                className={cn(
                  'stroke-foreground',
                  outcome === 'up' && 'stroke-primary stroke-2',
                  app.blocked === 'up' && 'stroke-red-400',
                )}
                strokeWidth={1.5}
              />
              {/* Up label */}
              <text
                x={pos.x + magnetWidth + beamLen / 2 - 6}
                y={pos.y - splitY / 2 - 6}
                className="fill-muted-foreground select-none"
                style={{ fontSize: '9px' }}
              >
                +
              </text>

              {/* Blocked indicator for up */}
              {app.blocked === 'up' && (
                <g>
                  <line x1={pos.x + magnetWidth + beamLen - 8} y1={pos.y - splitY - 5}
                    x2={pos.x + magnetWidth + beamLen + 2} y2={pos.y - splitY + 5}
                    className="stroke-red-500" strokeWidth={2} />
                  <line x1={pos.x + magnetWidth + beamLen + 2} y1={pos.y - splitY - 5}
                    x2={pos.x + magnetWidth + beamLen - 8} y2={pos.y - splitY + 5}
                    className="stroke-red-500" strokeWidth={2} />
                </g>
              )}

              {/* Down beam */}
              <line
                x1={pos.x + magnetWidth}
                y1={pos.y}
                x2={pos.x + magnetWidth + beamLen}
                y2={pos.y + splitY}
                className={cn(
                  'stroke-foreground',
                  outcome === 'down' && 'stroke-primary stroke-2',
                  app.blocked === 'down' && 'stroke-red-400',
                )}
                strokeWidth={1.5}
              />
              {/* Down label */}
              <text
                x={pos.x + magnetWidth + beamLen / 2 - 6}
                y={pos.y + splitY / 2 + 12}
                className="fill-muted-foreground select-none"
                style={{ fontSize: '9px' }}
              >
                &minus;
              </text>

              {/* Blocked indicator for down */}
              {app.blocked === 'down' && (
                <g>
                  <line x1={pos.x + magnetWidth + beamLen - 8} y1={pos.y + splitY - 5}
                    x2={pos.x + magnetWidth + beamLen + 2} y2={pos.y + splitY + 5}
                    className="stroke-red-500" strokeWidth={2} />
                  <line x1={pos.x + magnetWidth + beamLen + 2} y1={pos.y + splitY - 5}
                    x2={pos.x + magnetWidth + beamLen - 8} y2={pos.y + splitY + 5}
                    className="stroke-red-500" strokeWidth={2} />
                </g>
              )}

              {/* Block toggle buttons */}
              {onBlockToggle && (
                <>
                  <rect
                    x={pos.x + magnetWidth + beamLen + 4}
                    y={pos.y - splitY - 8}
                    width={16}
                    height={16}
                    rx={3}
                    className={cn(
                      'cursor-pointer transition-colors',
                      app.blocked === 'up' ? 'fill-red-100 stroke-red-400 dark:fill-red-900/30' : 'fill-transparent stroke-muted-foreground/30',
                    )}
                    strokeWidth={0.5}
                    onClick={() => onBlockToggle(app.id, 'up')}
                  />
                  <rect
                    x={pos.x + magnetWidth + beamLen + 4}
                    y={pos.y + splitY - 8}
                    width={16}
                    height={16}
                    rx={3}
                    className={cn(
                      'cursor-pointer transition-colors',
                      app.blocked === 'down' ? 'fill-red-100 stroke-red-400 dark:fill-red-900/30' : 'fill-transparent stroke-muted-foreground/30',
                    )}
                    strokeWidth={0.5}
                    onClick={() => onBlockToggle(app.id, 'down')}
                  />
                </>
              )}

              {/* Detector counts at beam ends (if no further apparatus) */}
              {['up', 'down'].map(beam => {
                const detectorKey = `${app.id}:${beam}`
                const count = detectorCounts.get(detectorKey)
                if (count === undefined && !detectorCounts.has(detectorKey)) {
                  // Check if there's a downstream apparatus
                  const hasDownstream = apparatuses.some(a =>
                    typeof a.input === 'object' &&
                    a.input.apparatusId === app.id &&
                    a.input.output === beam,
                  )
                  if (hasDownstream) return null
                }

                const endY = beam === 'up' ? pos.y - splitY : pos.y + splitY
                const hasDownstream = apparatuses.some(a =>
                  typeof a.input === 'object' &&
                  a.input.apparatusId === app.id &&
                  a.input.output === beam,
                )
                if (hasDownstream) return null

                return (
                  <text
                    key={beam}
                    x={pos.x + magnetWidth + beamLen + 24}
                    y={endY + 4}
                    className="fill-muted-foreground select-none"
                    style={{ fontSize: '10px' }}
                  >
                    {count ?? 0}
                  </text>
                )
              })}

              {/* Connection beam to downstream apparatus */}
              {apparatuses.filter(a =>
                typeof a.input === 'object' && a.input.apparatusId === app.id,
              ).map(downstream => {
                const downstreamPos = appPositions.get(downstream.id)
                if (!downstreamPos) return null
                const beamOutput = (downstream.input as { output: 'up' | 'down' }).output
                const startY = beamOutput === 'up' ? pos.y - splitY : pos.y + splitY

                return (
                  <line
                    key={downstream.id}
                    x1={pos.x + magnetWidth + beamLen}
                    y1={startY}
                    x2={downstreamPos.x}
                    y2={downstreamPos.y}
                    className="stroke-foreground"
                    strokeWidth={1.5}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
