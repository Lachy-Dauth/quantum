import Link from 'next/link'
import { ArrowRight, Atom, BookOpen, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const TRACKS = [
  {
    track: 'math' as const,
    title: 'Mathematics',
    description:
      'Complex numbers, vectors, matrices, eigenvalues, tensor products, and probability theory.',
    lessons: 6,
    icon: Atom,
  },
  {
    track: 'physics' as const,
    title: 'Physics',
    description:
      "Quantum postulates, Schrodinger equation, spin, uncertainty, Bell's theorem, and decoherence.",
    lessons: 7,
    icon: BookOpen,
  },
  {
    track: 'computing' as const,
    title: 'Computing',
    description:
      "Qubits, gates, teleportation, Grover's search, QFT, and Shor's factoring algorithm.",
    lessons: 10,
    icon: Cpu,
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Quantum from First Principles
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          From 2&times;2 matrices to Shor&apos;s algorithm. 23 lessons across mathematics, physics,
          and computing &mdash; derived from scratch, with interactive simulators.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button href="/curriculum" size="lg">
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button href="/pricing" variant="secondary" size="lg">
            View Pricing
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          First 3 lessons are free. No account required.
        </p>
      </section>

      {/* Tracks preview */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          Three Interleaved Tracks
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {TRACKS.map(({ track, title, description, lessons, icon: Icon }) => (
            <Link key={track} href={`/tracks/${track}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge track={track} />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="mt-2">{description}</CardDescription>
                  <p className="mt-3 text-sm text-muted-foreground">{lessons} lessons</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
