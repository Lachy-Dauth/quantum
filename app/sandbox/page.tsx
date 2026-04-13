import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SimulatorCard } from './SimulatorCard'

const SIMULATORS = [
  {
    slug: 'qubit',
    title: 'Qubit Circuit Simulator',
    subtitle: 'Build quantum circuits',
    description:
      'Drag-and-drop gates onto up to 6 qubits. Watch state vectors evolve step-by-step, visualise Bloch spheres, and verify your circuits against target states.',
    features: ['Drag-and-drop gates', 'Bloch sphere', 'Step-by-step algebra', 'Batch measurement'],
    color: 'blue' as const,
    icon: 'circuit',
    lessons: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'A4'],
  },
  {
    slug: 'stern-gerlach',
    title: 'Stern-Gerlach Simulator',
    subtitle: 'Measure quantum spin',
    description:
      'Send particles through configurable magnetic field orientations. Chain up to 4 apparatuses, block beams, and watch quantum measurement in action.',
    features: ['Configurable axes', 'Chained apparatuses', 'Beam blocking', 'Statistics'],
    color: 'amber' as const,
    icon: 'magnet',
    lessons: ['P1', 'P2', 'P3', 'P4'],
  },
  {
    slug: 'chsh',
    title: 'CHSH Inequality Simulator',
    subtitle: 'Test Bell\'s theorem',
    description:
      'Run thousands of entangled-pair experiments. Choose measurement angles for Alice and Bob, and watch the S-value break the classical bound of 2.',
    features: ['Angle dials', 'Live S convergence', 'Bell state selection', 'Correlation table'],
    color: 'green' as const,
    icon: 'bell',
    lessons: ['P6', 'P7'],
  },
  {
    slug: 'schrodinger',
    title: '1D Schr\u00f6dinger Simulator',
    subtitle: 'Evolve wavefunctions',
    description:
      'Watch quantum wavefunctions evolve in real time under different potentials. Explore eigenstates, build superpositions, and see probability flow.',
    features: ['7 potential types', 'Real-time evolution', 'Eigenstate viewer', 'Superposition builder'],
    color: 'purple' as const,
    icon: 'wave',
    lessons: ['P3', 'P5'],
  },
] as const

export default function SandboxPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.3]" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -left-32 top-64 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        <div className="absolute -right-32 top-96 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 pb-8 pt-16 text-center sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          4 interactive simulators &middot; no signup required
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Quantum Sandbox
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Experiment with quantum mechanics hands-on. Build circuits, measure spins,
          break classical bounds, and watch wavefunctions evolve &mdash; all in your browser.
        </p>

        {/* Decorative quantum state notation */}
        <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3 font-mono text-sm text-muted-foreground/60">
          <span className="rounded border border-border/50 bg-muted/30 px-2 py-0.5">|&psi;&rang; = &alpha;|0&rang; + &beta;|1&rang;</span>
          <span className="rounded border border-border/50 bg-muted/30 px-2 py-0.5">H|0&rang; = |+&rang;</span>
          <span className="rounded border border-border/50 bg-muted/30 px-2 py-0.5">S &le; 2&radic;2</span>
          <span className="rounded border border-border/50 bg-muted/30 px-2 py-0.5">i&hbar;&part;/&part;t &psi; = H&psi;</span>
        </div>
      </section>

      {/* Simulator grid */}
      <section className="relative mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {SIMULATORS.map((sim) => (
            <SimulatorCard key={sim.slug} {...sim} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            These simulators are used throughout the curriculum. For the full guided experience:
          </p>
          <Button href="/curriculum" variant="secondary" size="lg">
            Browse the Curriculum
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
