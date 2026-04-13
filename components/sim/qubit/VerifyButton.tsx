'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Gate } from '@/lib/sim/qubit/types'

interface VerifyButtonProps {
  circuit: Gate[]
  verifyCircuit: (circuit: Gate[]) => { correct: boolean; message?: string }
  className?: string
}

/**
 * "Check" button for problem sets.
 * Calls verifyCircuit and displays feedback.
 */
export function VerifyButton({ circuit, verifyCircuit, className }: VerifyButtonProps) {
  const [result, setResult] = useState<{ correct: boolean; message?: string } | null>(null)

  const handleCheck = useCallback(() => {
    const r = verifyCircuit(circuit)
    setResult(r)
  }, [circuit, verifyCircuit])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={handleCheck}
        className={cn(
          'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
          'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        Check Answer
      </button>
      {result && (
        <div className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium',
          result.correct
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        )}>
          {result.correct ? 'Correct!' : (result.message ?? 'Not quite. Try again.')}
        </div>
      )}
    </div>
  )
}
