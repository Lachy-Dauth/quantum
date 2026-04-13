interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre className={className}>
      <code>{children}</code>
    </pre>
  )
}
