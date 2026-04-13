/**
 * Web Worker for running batch simulations off the main thread.
 * Uses CircuitSimulator.batchRun() which can take >100ms for 1000+ runs.
 *
 * Message protocol:
 * - Incoming: { type: 'BATCH_RUN', numQubits, gates, initialState?, runs, seed? }
 * - Outgoing: { type: 'BATCH_RESULT', counts: [string, number][], totalRuns }
 *           | { type: 'BATCH_ERROR', message }
 */

import { CircuitSimulator } from './circuit-simulator'
import type { Gate } from './types'

interface BatchRunMessage {
  type: 'BATCH_RUN'
  numQubits: number
  gates: Gate[]
  initialState?: string
  runs: number
  seed?: number
}

const ctx = self as unknown as Worker

ctx.addEventListener('message', (event: MessageEvent<BatchRunMessage>) => {
  const { type, numQubits, gates, initialState, runs, seed } = event.data

  if (type !== 'BATCH_RUN') return

  try {
    const sim = new CircuitSimulator(numQubits, seed)
    if (initialState) sim.setInitialState(initialState)
    sim.setCircuit(gates)

    const result = sim.batchRun(runs)

    // Convert Map to array for structured cloning
    const counts = Array.from(result.counts.entries())

    ctx.postMessage({
      type: 'BATCH_RESULT',
      counts,
      totalRuns: result.totalRuns,
    })
  } catch (e) {
    ctx.postMessage({
      type: 'BATCH_ERROR',
      message: (e as Error).message,
    })
  }
})
