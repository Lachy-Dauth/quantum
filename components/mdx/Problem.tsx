'use client'

interface ProblemProps {
  id: string
  type: 'multiple-choice' | 'numeric' | 'matrix' | 'free-response'
  options?: string[]
  answer?: string
  tolerance?: number
  children: React.ReactNode
}

export function Problem({ id, type, children }: ProblemProps) {
  return (
    <div
      className="my-6 rounded-lg border border-dashed border-slate-300 p-4 dark:border-slate-700"
      data-problem-id={id}
      data-problem-type={type}
    >
      <span className="text-xs font-mono text-slate-400">Problem ({type})</span>
      <div className="mt-2">{children}</div>
    </div>
  )
}
