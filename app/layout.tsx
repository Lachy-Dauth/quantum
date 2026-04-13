import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import 'katex/dist/katex.min.css'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Quantum from First Principles',
    template: '%s | Quantum from First Principles',
  },
  description:
    "Learn quantum computing and physics from first principles. From 2x2 matrices to Shor's algorithm.",
  keywords: [
    'quantum computing',
    'quantum physics',
    'quantum mechanics',
    'linear algebra',
    'qubits',
    "Shor's algorithm",
    'Grover',
    'Bell inequality',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
