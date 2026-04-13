'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimulatorCardProps {
  slug: string
  title: string
  subtitle: string
  description: string
  features: readonly string[]
  color: 'blue' | 'amber' | 'green' | 'purple'
  icon: 'circuit' | 'magnet' | 'bell' | 'wave'
  lessons: readonly string[]
}

const COLOR_MAP = {
  blue: {
    border: 'group-hover:border-blue-400/50 dark:group-hover:border-blue-500/30',
    glow: 'group-hover:shadow-blue-500/10',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconText: 'text-blue-600 dark:text-blue-400',
    featureDot: 'bg-blue-400 dark:bg-blue-500',
    pill: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    accentLine: 'from-blue-500/0 via-blue-500/40 to-blue-500/0',
  },
  amber: {
    border: 'group-hover:border-amber-400/50 dark:group-hover:border-amber-500/30',
    glow: 'group-hover:shadow-amber-500/10',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconText: 'text-amber-600 dark:text-amber-400',
    featureDot: 'bg-amber-400 dark:bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    accentLine: 'from-amber-500/0 via-amber-500/40 to-amber-500/0',
  },
  green: {
    border: 'group-hover:border-green-400/50 dark:group-hover:border-green-500/30',
    glow: 'group-hover:shadow-green-500/10',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconText: 'text-green-600 dark:text-green-400',
    featureDot: 'bg-green-400 dark:bg-green-500',
    pill: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    accentLine: 'from-green-500/0 via-green-500/40 to-green-500/0',
  },
  purple: {
    border: 'group-hover:border-purple-400/50 dark:group-hover:border-purple-500/30',
    glow: 'group-hover:shadow-purple-500/10',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-400',
    featureDot: 'bg-purple-400 dark:bg-purple-500',
    pill: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    accentLine: 'from-purple-500/0 via-purple-500/40 to-purple-500/0',
  },
}

/** Inline SVG icons — small, themed, no external dependency. */
function SimulatorIcon({ type, className }: { type: SimulatorCardProps['icon']; className?: string }) {
  const size = 28
  switch (type) {
    case 'circuit':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
          {/* Two horizontal wires */}
          <line x1="2" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="1.5" />
          {/* H gate box */}
          <rect x="7" y="5" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <text x="10" y="12" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="600">H</text>
          {/* CNOT control dot + target */}
          <circle cx="19" cy="10" r="2.5" fill="currentColor" />
          <line x1="19" y1="12.5" x2="19" y2="15.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="19" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="16" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="1.2" />
          <line x1="19" y1="15" x2="19" y2="21" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'magnet':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
          {/* Magnet shape */}
          <path d="M8 6v10a6 6 0 0012 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="5" y="3" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="17" y="3" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <text x="8" y="7" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700">N</text>
          <text x="20" y="7" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700">S</text>
          {/* Beam splitting arrows */}
          <line x1="14" y1="20" x2="10" y2="25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <line x1="14" y1="20" x2="18" y2="25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
          {/* Entangled pair — two linked circles */}
          <circle cx="10" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="18" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Correlation arrows */}
          <line x1="3" y1="8" x2="7" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="25" y1="8" x2="21" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {/* Labels */}
          <text x="7" y="15.5" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="600">A</text>
          <text x="21" y="15.5" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="600">B</text>
        </svg>
      )
    case 'wave':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
          {/* Wave packet */}
          <path
            d="M2 18 Q5 18 7 14 Q9 10 11 14 Q13 18 14 14 Q15 10 17 14 Q19 18 21 14 Q23 10 26 18"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Probability envelope */}
          <path
            d="M4 18 Q8 4 14 4 Q20 4 24 18"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="none"
            opacity="0.5"
          />
          {/* |psi|^2 fill hint */}
          <path
            d="M7 17 Q10 12 14 12 Q18 12 21 17"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
      )
  }
}

export function SimulatorCard({ slug, title, subtitle, description, features, color, icon, lessons }: SimulatorCardProps) {
  const c = COLOR_MAP[color]

  return (
    <Link href={`/sandbox/${slug}`} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300',
          'hover:shadow-lg',
          c.border,
          c.glow,
        )}
      >
        {/* Accent line at top */}
        <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100', c.accentLine)} />

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.iconBg)}>
              <SimulatorIcon type={icon} className={c.iconText} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all duration-300 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {/* Features */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span key={f} className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground">
              <span className={cn('h-1 w-1 rounded-full', c.featureDot)} />
              {f}
            </span>
          ))}
        </div>

        {/* Used in lessons */}
        <div className="flex items-center gap-2 border-t border-border/50 pt-3">
          <span className="text-xs text-muted-foreground/70">Used in:</span>
          <div className="flex flex-wrap gap-1">
            {lessons.map((l) => (
              <span
                key={l}
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium',
                  c.pill,
                )}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
