'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'

interface AngleDialProps {
  label: string
  angles: [number, number]
  activeIndex?: 0 | 1
  onChange: (angles: [number, number]) => void
  editable?: boolean
  className?: string
}

/**
 * SVG dial showing two angle settings on a unit circle in the x-z plane.
 * Each angle is displayed as a line from center, with a draggable handle.
 */
export function AngleDial({ label, angles, activeIndex, onChange, editable = true, className }: AngleDialProps) {
  const size = 100
  const cx = size / 2
  const cy = size / 2
  const radius = 36

  const handleClick = useCallback((idx: 0 | 1, e: React.MouseEvent<SVGCircleElement>) => {
    if (!editable) return
    const svg = e.currentTarget.ownerSVGElement
    if (!svg) return

    const rect = svg.getBoundingClientRect()
    const handleDrag = (ev: MouseEvent) => {
      const x = ev.clientX - rect.left - cx
      const y = ev.clientY - rect.top - cy
      const angle = Math.atan2(-y, x) // y is inverted in SVG
      const newAngles: [number, number] = [...angles] as [number, number]
      newAngles[idx] = angle
      onChange(newAngles)
    }
    const handleUp = () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleUp)
    }
    window.addEventListener('mousemove', handleDrag)
    window.addEventListener('mouseup', handleUp)
  }, [angles, onChange, editable])

  const colors = ['hsl(var(--primary))', 'hsl(210, 80%, 60%)']

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
        {/* Circle */}
        <circle cx={cx} cy={cy} r={radius} className="fill-none stroke-border" strokeWidth={1} />

        {/* Axis labels */}
        <text x={cx + radius + 6} y={cy + 3} className="fill-muted-foreground" style={{ fontSize: '8px' }}>X</text>
        <text x={cx - 3} y={cy - radius - 4} className="fill-muted-foreground" style={{ fontSize: '8px' }}>Z</text>

        {/* Angle lines and handles */}
        {angles.map((angle, idx) => {
          const endX = cx + radius * Math.cos(angle)
          const endY = cy - radius * Math.sin(angle) // SVG y is inverted
          const isActive = activeIndex === idx

          return (
            <g key={idx}>
              <line
                x1={cx}
                y1={cy}
                x2={endX}
                y2={endY}
                stroke={colors[idx]}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={idx === 1 ? '4 2' : undefined}
              />
              <circle
                cx={endX}
                cy={endY}
                r={editable ? 5 : 3}
                fill={colors[idx]}
                className={editable ? 'cursor-pointer' : ''}
                opacity={isActive ? 1 : 0.7}
                onMouseDown={editable ? (e) => handleClick(idx as 0 | 1, e) : undefined}
              />
            </g>
          )
        })}
      </svg>
      <div className="flex flex-col text-[10px] font-mono text-muted-foreground">
        <span>a{label === 'Alice' ? '1' : '1'} = {(angles[0] * 180 / Math.PI).toFixed(1)}&deg;</span>
        <span>a{label === 'Alice' ? '2' : '2'} = {(angles[1] * 180 / Math.PI).toFixed(1)}&deg;</span>
      </div>
    </div>
  )
}
