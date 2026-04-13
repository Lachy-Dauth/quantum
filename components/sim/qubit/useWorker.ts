'use client'

import { useRef, useCallback, useEffect } from 'react'
import type { Gate, BatchResult } from '@/lib/sim/qubit/types'

interface WorkerMessage {
  type: 'BATCH_RESULT' | 'BATCH_ERROR'
  counts?: [string, number][]
  totalRuns?: number
  message?: string
}

/**
 * Hook managing a Web Worker for batch simulation runs.
 * Falls back to main-thread execution if Workers are unavailable.
 */
export function useWorker() {
  const workerRef = useRef<Worker | null>(null)
  const callbackRef = useRef<{
    resolve: (result: BatchResult) => void
    reject: (error: Error) => void
  } | null>(null)

  // Initialize worker lazily on first use
  const getWorker = useCallback((): Worker | null => {
    if (workerRef.current) return workerRef.current

    if (typeof window === 'undefined' || typeof Worker === 'undefined') return null

    try {
      const worker = new Worker(
        new URL('@/lib/sim/qubit/worker.ts', import.meta.url),
      )

      worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
        const { type, counts, totalRuns, message } = event.data
        const cb = callbackRef.current
        if (!cb) return
        callbackRef.current = null

        if (type === 'BATCH_RESULT' && counts && totalRuns !== undefined) {
          cb.resolve({
            counts: new Map(counts),
            totalRuns,
          })
        } else if (type === 'BATCH_ERROR') {
          cb.reject(new Error(message ?? 'Worker error'))
        }
      })

      worker.addEventListener('error', (event) => {
        const cb = callbackRef.current
        if (cb) {
          callbackRef.current = null
          cb.reject(new Error(event.message || 'Worker error'))
        }
      })

      workerRef.current = worker
      return worker
    } catch {
      // Worker creation failed (e.g., CSP restrictions)
      return null
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  /**
   * Run a batch simulation in the Web Worker.
   * Returns a promise that resolves with the BatchResult.
   */
  const runBatchInWorker = useCallback((
    numQubits: number,
    gates: Gate[],
    runs: number,
    initialState?: string,
    seed?: number,
  ): Promise<BatchResult> => {
    return new Promise((resolve, reject) => {
      const worker = getWorker()

      if (!worker) {
        // Fallback: run on main thread
        reject(new Error('Worker unavailable'))
        return
      }

      // Cancel any pending request
      if (callbackRef.current) {
        callbackRef.current.reject(new Error('Cancelled'))
      }

      callbackRef.current = { resolve, reject }

      worker.postMessage({
        type: 'BATCH_RUN',
        numQubits,
        gates,
        initialState,
        runs,
        seed,
      })
    })
  }, [getWorker])

  return { runBatchInWorker }
}
