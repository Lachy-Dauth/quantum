import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { SimulatorLoader } from './SimulatorLoader'

const VALID_SIMULATORS = ['qubit', 'stern-gerlach', 'chsh', 'schrodinger'] as const

interface Props {
  params: Promise<{ simulator: string }>
}

export default async function SimulatorPage({ params }: Props) {
  const { simulator } = await params

  if (!VALID_SIMULATORS.includes(simulator as typeof VALID_SIMULATORS[number])) {
    notFound()
  }

  const titles: Record<string, string> = {
    qubit: 'Qubit Circuit Simulator',
    'stern-gerlach': 'Stern-Gerlach Simulator',
    chsh: 'CHSH Inequality Simulator',
    schrodinger: '1D Schr\u00f6dinger Simulator',
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{titles[simulator] ?? simulator}</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <SimulatorLoader simulator={simulator} />
      </Suspense>
    </div>
  )
}
