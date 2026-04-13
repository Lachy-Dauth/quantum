'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  href: string
  label: string
  icon?: LucideIcon
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
