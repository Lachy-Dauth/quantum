export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r p-4 md:block">
        <nav className="space-y-2">
          <a href="/dashboard" className="block text-sm hover:underline">
            Dashboard
          </a>
          <a href="/dashboard/progress" className="block text-sm hover:underline">
            Progress
          </a>
          <a href="/dashboard/bookmarks" className="block text-sm hover:underline">
            Bookmarks
          </a>
          <a href="/settings" className="block text-sm hover:underline">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
