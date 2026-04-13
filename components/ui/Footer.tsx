import Link from 'next/link'

const FOOTER_LINKS = [
  {
    heading: 'Learn',
    links: [
      { label: 'Curriculum', href: '/curriculum' },
      { label: 'Mathematics', href: '/tracks/math' },
      { label: 'Physics', href: '/tracks/physics' },
      { label: 'Computing', href: '/tracks/computing' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Sandbox', href: '/sandbox' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-semibold text-foreground">Quantum</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Learn quantum computing and physics from first principles.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-foreground">{group.heading}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Quantum from First Principles. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
