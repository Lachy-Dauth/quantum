'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Atom, Menu, X, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { TRACK_META } from '@/lib/tracks'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Sandbox', href: '/sandbox' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tracksOpen, setTracksOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Atom className="h-5 w-5 text-primary" />
          <span>Quantum</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Tracks dropdown */}
          <div className="relative">
            <button
              onClick={() => setTracksOpen(!tracksOpen)}
              onBlur={() => setTimeout(() => setTracksOpen(false), 150)}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Tracks
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform', tracksOpen && 'rotate-180')}
              />
            </button>
            {tracksOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md border border-border bg-background py-1 shadow-lg">
                {Object.entries(TRACK_META).map(([key, track]) => (
                  <Link
                    key={key}
                    href={track.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setTracksOpen(false)}
                  >
                    {track.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors md:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="hidden rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 transition-colors md:inline-flex"
          >
            Sign Up
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {Object.entries(TRACK_META).map(([key, track]) => (
              <Link
                key={key}
                href={track.href}
                className="rounded-md px-3 py-2 pl-6 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {track.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
