interface TheoremProps {
  name: string
  children: React.ReactNode
}

export function Theorem({ name, children }: TheoremProps) {
  return (
    <div className="my-6 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
      <p className="mb-2 font-bold">Theorem: {name}</p>
      <div>{children}</div>
    </div>
  )
}

interface DefinitionProps {
  term: string
  children: React.ReactNode
}

export function Definition({ term, children }: DefinitionProps) {
  return (
    <div className="my-6 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
      <p className="mb-2 font-bold">Definition: {term}</p>
      <div>{children}</div>
    </div>
  )
}

interface ProofProps {
  children: React.ReactNode
}

export function Proof({ children }: ProofProps) {
  return (
    <details className="my-6 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
      <summary className="cursor-pointer font-semibold">Proof</summary>
      <div className="mt-2">{children}</div>
    </details>
  )
}
