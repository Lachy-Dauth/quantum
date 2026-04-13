import { cn } from '@/lib/utils'
import type { Track } from '@/lib/tracks'
import { TRACK_COLORS } from '@/lib/tracks'

interface ProgressBarProps {
  value: number
  track?: Track
  className?: string
}

export function ProgressBar({ value, track, className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const fillColor = track ? TRACK_COLORS[track].accent : 'bg-primary'

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-300', fillColor)}
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
