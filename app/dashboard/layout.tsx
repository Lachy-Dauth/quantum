'use client'

import { useState } from 'react'
import { LayoutDashboard, BarChart3, Bookmark, Settings, Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'

const DASHBOARD_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/progress', label: 'Progress', icon: BarChart3 },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-7xl">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-background p-4 transition-transform md:sticky md:block md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar items={DASHBOARD_NAV} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
