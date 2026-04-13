import { forwardRef } from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  href?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    if (href) {
      return (
        <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
          {children}
        </Link>
      )
    }

    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
