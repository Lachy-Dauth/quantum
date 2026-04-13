interface WorkedExampleProps {
  title: string
  children: React.ReactNode
}

export function WorkedExample({ title, children }: WorkedExampleProps) {
  return (
    <div className="my-6 rounded-lg border border-dashed border-slate-300 p-4 dark:border-slate-700">
      <p className="mb-2 font-semibold">Worked Example: {title}</p>
      <div>{children}</div>
    </div>
  )
}
