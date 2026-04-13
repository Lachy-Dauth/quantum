import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      track: {
        math: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        physics: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
        computing: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      },
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, track, children, ...props }: BadgeProps) {
  const label = track
    ? { math: 'Math', physics: 'Physics', computing: 'Computing' }[track]
    : undefined

  return (
    <span className={cn(badgeVariants({ track }), className)} {...props}>
      {children ?? label}
    </span>
  )
}

export { badgeVariants }
