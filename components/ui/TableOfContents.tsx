'use client'

import { useEffect, useState } from 'react'
import { List, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TocEntry } from '@/lib/lessons/toc'

interface TableOfContentsProps {
  headings: TocEntry[]
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const tocList = (
    <ul className="space-y-1 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'block rounded px-2 py-1 transition-colors hover:text-foreground',
              heading.level === 3 && 'pl-5',
              activeId === heading.id ? 'font-medium text-primary' : 'text-muted-foreground'
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className={cn('hidden lg:block', className)}>
        <div className="sticky top-20">
          <h4 className="mb-3 text-sm font-semibold text-foreground">On this page</h4>
          {tocList}
        </div>
      </div>

      {/* Mobile: collapsible panel */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <List className="h-4 w-4" />
          On this page
          <ChevronDown
            className={cn('ml-auto h-3.5 w-3.5 transition-transform', mobileOpen && 'rotate-180')}
          />
        </button>
        {mobileOpen && <div className="mt-2 rounded-md border border-border p-3">{tocList}</div>}
      </div>
    </>
  )
}
