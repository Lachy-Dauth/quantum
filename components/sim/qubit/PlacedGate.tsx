'use client'

import { cn } from '@/lib/utils'
import { gatePosition, wireY, columnX, GATE_SIZE } from './circuit-layout'
import { getGateInfo } from '@/lib/sim/qubit/gate-registry'
import type { Gate } from '@/lib/sim/qubit/types'

interface PlacedGateProps {
  gate: Gate
  numQubits: number
  highlighted?: boolean
  isCurrentStep?: boolean
  onClick?: (gate: Gate) => void
  onContextMenu?: (gate: Gate, e: React.MouseEvent) => void
}

export function PlacedGate({
  gate,
  numQubits,
  highlighted,
  isCurrentStep,
  onClick,
  onContextMenu,
}: PlacedGateProps) {
  const info = getGateInfo(gate.type)

  // Multi-qubit gates: draw connector line between targets
  if (gate.targets.length >= 2) {
    return (
      <MultiQubitGate
        gate={gate}
        info={info}
        highlighted={highlighted}
        onClick={onClick}
        onContextMenu={onContextMenu}
      />
    )
  }

  // Single-qubit gate
  const pos = gatePosition(gate.column, gate.targets[0]!)
  const label = gate.label ?? info.symbol

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick?.(gate)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
      role="button"
      tabIndex={0}
      aria-label={`${info.label} gate on qubit ${gate.targets[0]}`}
    >
      <rect
        x={pos.x}
        y={pos.y}
        width={GATE_SIZE}
        height={GATE_SIZE}
        rx={4}
        className={cn(
          'fill-background stroke-foreground transition-colors',
          highlighted && 'stroke-primary stroke-2',
          isCurrentStep && 'fill-primary/10',
          gate.type === 'MEASURE' && 'fill-muted',
        )}
        strokeWidth={highlighted ? 2 : 1}
      />
      <text
        x={pos.x + GATE_SIZE / 2}
        y={pos.y + GATE_SIZE / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-xs font-mono select-none pointer-events-none"
      >
        {label}
      </text>
      {/* Parameter indicator */}
      {info.parameterized && gate.params?.theta !== undefined && (
        <text
          x={pos.x + GATE_SIZE / 2}
          y={pos.y + GATE_SIZE - 2}
          textAnchor="middle"
          className="fill-muted-foreground select-none pointer-events-none"
          style={{ fontSize: '7px' }}
        >
          {gate.params.theta.toFixed(1)}
        </text>
      )}
    </g>
  )
}

// ---------------------------------------------------------------------------
// Multi-qubit gate rendering
// ---------------------------------------------------------------------------

function MultiQubitGate({
  gate,
  info,
  highlighted,
  onClick,
  onContextMenu,
}: {
  gate: Gate
  info: ReturnType<typeof getGateInfo>
  highlighted?: boolean
  onClick?: (gate: Gate) => void
  onContextMenu?: (gate: Gate, e: React.MouseEvent) => void
}) {
  const cx = columnX(gate.column)
  const targets = gate.targets
  const minQ = Math.min(...targets)
  const maxQ = Math.max(...targets)
  const y1 = wireY(minQ)
  const y2 = wireY(maxQ)

  if (gate.type === 'CNOT') {
    // Control dot + target circle-plus
    const controlQ = targets[0]!
    const targetQ = targets[1]!
    const controlY = wireY(controlQ)
    const targetY = wireY(targetQ)

    return (
      <g
        className="cursor-pointer"
        onClick={() => onClick?.(gate)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
        role="button"
        tabIndex={0}
        aria-label={`CNOT gate, control q${controlQ}, target q${targetQ}`}
      >
        {/* Vertical connector */}
        <line x1={cx} y1={controlY} x2={cx} y2={targetY}
          className={cn('stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        {/* Control dot */}
        <circle cx={cx} cy={controlY} r={4}
          className={cn('fill-foreground', highlighted && 'fill-primary')} />
        {/* Target circle-plus */}
        <circle cx={cx} cy={targetY} r={10}
          className={cn('fill-background stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        <line x1={cx - 7} y1={targetY} x2={cx + 7} y2={targetY}
          className="stroke-foreground" strokeWidth={1} />
        <line x1={cx} y1={targetY - 7} x2={cx} y2={targetY + 7}
          className="stroke-foreground" strokeWidth={1} />
      </g>
    )
  }

  if (gate.type === 'SWAP') {
    const q0Y = wireY(targets[0]!)
    const q1Y = wireY(targets[1]!)
    const s = 6 // half-size of X mark

    return (
      <g
        className="cursor-pointer"
        onClick={() => onClick?.(gate)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
        role="button"
        tabIndex={0}
        aria-label={`SWAP gate on q${targets[0]} and q${targets[1]}`}
      >
        <line x1={cx} y1={q0Y} x2={cx} y2={q1Y}
          className={cn('stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        {/* X marks */}
        <line x1={cx - s} y1={q0Y - s} x2={cx + s} y2={q0Y + s} className="stroke-foreground" strokeWidth={1.5} />
        <line x1={cx + s} y1={q0Y - s} x2={cx - s} y2={q0Y + s} className="stroke-foreground" strokeWidth={1.5} />
        <line x1={cx - s} y1={q1Y - s} x2={cx + s} y2={q1Y + s} className="stroke-foreground" strokeWidth={1.5} />
        <line x1={cx + s} y1={q1Y - s} x2={cx - s} y2={q1Y + s} className="stroke-foreground" strokeWidth={1.5} />
      </g>
    )
  }

  if (gate.type === 'TOFFOLI') {
    const c1Y = wireY(targets[0]!)
    const c2Y = wireY(targets[1]!)
    const tY = wireY(targets[2]!)

    return (
      <g
        className="cursor-pointer"
        onClick={() => onClick?.(gate)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
        role="button"
        tabIndex={0}
        aria-label={`Toffoli gate, controls q${targets[0]} q${targets[1]}, target q${targets[2]}`}
      >
        <line x1={cx} y1={y1} x2={cx} y2={y2}
          className={cn('stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        <circle cx={cx} cy={c1Y} r={4}
          className={cn('fill-foreground', highlighted && 'fill-primary')} />
        <circle cx={cx} cy={c2Y} r={4}
          className={cn('fill-foreground', highlighted && 'fill-primary')} />
        <circle cx={cx} cy={tY} r={10}
          className={cn('fill-background stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        <line x1={cx - 7} y1={tY} x2={cx + 7} y2={tY} className="stroke-foreground" strokeWidth={1} />
        <line x1={cx} y1={tY - 7} x2={cx} y2={tY + 7} className="stroke-foreground" strokeWidth={1} />
      </g>
    )
  }

  // CZ: two dots connected by a line
  if (gate.type === 'CZ') {
    const q0Y = wireY(targets[0]!)
    const q1Y = wireY(targets[1]!)

    return (
      <g
        className="cursor-pointer"
        onClick={() => onClick?.(gate)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
        role="button"
        tabIndex={0}
        aria-label={`CZ gate on q${targets[0]} and q${targets[1]}`}
      >
        <line x1={cx} y1={q0Y} x2={cx} y2={q1Y}
          className={cn('stroke-foreground', highlighted && 'stroke-primary')}
          strokeWidth={highlighted ? 2 : 1} />
        <circle cx={cx} cy={q0Y} r={4} className={cn('fill-foreground', highlighted && 'fill-primary')} />
        <circle cx={cx} cy={q1Y} r={4} className={cn('fill-foreground', highlighted && 'fill-primary')} />
      </g>
    )
  }

  // Fallback: generic box spanning all targets
  const pos = gatePosition(gate.column, minQ)
  const height = (maxQ - minQ) * 48 + GATE_SIZE

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick?.(gate)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(gate, e) }}
      role="button"
      tabIndex={0}
    >
      <rect
        x={pos.x}
        y={pos.y}
        width={GATE_SIZE}
        height={height}
        rx={4}
        className={cn('fill-background stroke-foreground', highlighted && 'stroke-primary stroke-2')}
        strokeWidth={highlighted ? 2 : 1}
      />
      <text
        x={pos.x + GATE_SIZE / 2}
        y={pos.y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-xs font-mono select-none pointer-events-none"
      >
        {info.symbol}
      </text>
    </g>
  )
}
