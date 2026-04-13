'use client'

import katex from 'katex'
import { katexMacros } from '@/lib/katex-macros'

interface MathProps {
  children: string
}

export function Math({ children }: MathProps) {
  const html = katex.renderToString(children, {
    displayMode: true,
    throwOnError: false,
    strict: false,
    macros: katexMacros,
  })

  return <div className="overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: html }} />
}

export function InlineMath({ children }: MathProps) {
  const html = katex.renderToString(children, {
    displayMode: false,
    throwOnError: false,
    strict: false,
    macros: katexMacros,
  })

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
