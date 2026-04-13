export const TRACK_META = {
  math: {
    label: 'Mathematics',
    shortLabel: 'Math',
    color: 'blue',
    href: '/tracks/math',
  },
  physics: {
    label: 'Physics',
    shortLabel: 'Physics',
    color: 'amber',
    href: '/tracks/physics',
  },
  computing: {
    label: 'Computing',
    shortLabel: 'Computing',
    color: 'green',
    href: '/tracks/computing',
  },
} as const

export type Track = keyof typeof TRACK_META

export const TRACK_COLORS = {
  math: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-300 dark:border-blue-700',
    accent: 'bg-blue-600 dark:bg-blue-500',
  },
  physics: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-700',
    accent: 'bg-amber-600 dark:bg-amber-500',
  },
  computing: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-300 dark:border-green-700',
    accent: 'bg-green-600 dark:bg-green-500',
  },
} as const
