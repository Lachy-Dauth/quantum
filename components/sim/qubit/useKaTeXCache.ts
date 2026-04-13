'use client'

import { useRef, useCallback } from 'react'
import katex from 'katex'
import { katexMacros } from '@/lib/katex-macros'

const MAX_CACHE_SIZE = 100

/**
 * Hook that provides a cached KaTeX renderToString function.
 * Avoids re-rendering the same LaTeX strings (~10ms each).
 * Cache is bounded to MAX_CACHE_SIZE entries with LRU-like eviction.
 */
export function useKaTeXCache() {
  const cacheRef = useRef(new Map<string, string>())

  const renderLatex = useCallback((latex: string, displayMode = false): string => {
    const key = `${displayMode ? 'D' : 'I'}:${latex}`
    const cached = cacheRef.current.get(key)
    if (cached !== undefined) return cached

    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      macros: katexMacros,
    })

    // Evict oldest entries if over limit
    if (cacheRef.current.size >= MAX_CACHE_SIZE) {
      const firstKey = cacheRef.current.keys().next().value as string
      cacheRef.current.delete(firstKey)
    }

    cacheRef.current.set(key, html)
    return html
  }, [])

  return { renderLatex }
}
