import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'confusion' | 'foreshadow'

interface CalloutProps {
  type: CalloutType
  title?: string
  children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { border: string; bg: string; icon: string }> = {
  info: {
    border: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950',
    icon: 'ℹ',
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    icon: '⚠',
  },
  confusion: {
    border: 'border-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    icon: '🤔',
  },
  foreshadow: {
    border: 'border-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
    icon: '🔮',
  },
}

export function Callout({ type, title, children }: CalloutProps) {
  const styles = calloutStyles[type]

  return (
    <div className={cn('my-6 rounded-lg border-l-4 p-4', styles.border, styles.bg)}>
      {title && (
        <p className="mb-2 font-semibold">
          <span className="mr-2">{styles.icon}</span>
          {title}
        </p>
      )}
      <div className="text-sm">{children}</div>
    </div>
  )
}
