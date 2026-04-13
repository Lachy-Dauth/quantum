'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useKaTeXCache } from './useKaTeXCache'
import { getGateInfo, resolveGateMatrix } from '@/lib/sim/qubit/gate-registry'
import { mget } from '@/lib/sim/core/matrix'
import type { Gate } from '@/lib/sim/qubit/types'
import type { DenseMatrix } from '@/lib/sim/core/types'

interface MatrixPopupProps {
  gate: Gate
  /** Position in viewport coordinates. */
  position: { x: number; y: number }
  className?: string
}

/** Format a complex number for LaTeX. */
function latexEntry(re: number, im: number): string {
  const eps = 1e-6
  const reZero = Math.abs(re) < eps
  const imZero = Math.abs(im) < eps

  if (reZero && imZero) return '0'

  if (imZero) {
    if (Math.abs(re - 1) < eps) return '1'
    if (Math.abs(re + 1) < eps) return '-1'
    // Common fractions
    if (Math.abs(Math.abs(re) - Math.SQRT1_2) < eps) return re > 0 ? '\\frac{1}{\\sqrt{2}}' : '-\\frac{1}{\\sqrt{2}}'
    if (Math.abs(Math.abs(re) - 0.5) < eps) return re > 0 ? '\\frac{1}{2}' : '-\\frac{1}{2}'
    return re.toFixed(3).replace(/\.?0+$/, '')
  }

  if (reZero) {
    if (Math.abs(im - 1) < eps) return 'i'
    if (Math.abs(im + 1) < eps) return '-i'
    if (Math.abs(Math.abs(im) - Math.SQRT1_2) < eps) return im > 0 ? '\\frac{i}{\\sqrt{2}}' : '-\\frac{i}{\\sqrt{2}}'
    return `${im.toFixed(3).replace(/\.?0+$/, '')}i`
  }

  const rePart = re.toFixed(3).replace(/\.?0+$/, '')
  const sign = im > 0 ? '+' : '-'
  const imAbs = Math.abs(im)
  const imPart = Math.abs(imAbs - 1) < eps ? 'i' : `${imAbs.toFixed(3).replace(/\.?0+$/, '')}i`
  return `${rePart}${sign}${imPart}`
}

/** Convert a DenseMatrix to LaTeX pmatrix. */
function matrixToLatex(m: DenseMatrix): string {
  const rows: string[] = []
  for (let r = 0; r < m.rows; r++) {
    const entries: string[] = []
    for (let c = 0; c < m.cols; c++) {
      const v = mget(m, r, c)
      entries.push(latexEntry(v.re, v.im))
    }
    rows.push(entries.join(' & '))
  }
  return `\\begin{pmatrix}${rows.join(' \\\\ ')}\\end{pmatrix}`
}

/**
 * Popup showing the gate's unitary matrix in KaTeX notation.
 * Appears on gate hover or click.
 */
export function MatrixPopup({ gate, position, className }: MatrixPopupProps) {
  const { renderLatex } = useKaTeXCache()
  const popupRef = useRef<HTMLDivElement>(null)

  const info = getGateInfo(gate.type)
  const matrix = resolveGateMatrix(gate)

  // Adjust position to stay in viewport
  useEffect(() => {
    const el = popupRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      el.style.left = `${position.x - rect.width - 8}px`
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = `${position.y - rect.height - 8}px`
    }
  }, [position])

  if (!matrix) {
    return (
      <div
        ref={popupRef}
        className={cn(
          'fixed z-50 rounded-lg border border-border bg-popover px-3 py-2 shadow-md',
          className,
        )}
        style={{ left: position.x + 8, top: position.y + 8 }}
      >
        <div className="text-xs text-muted-foreground">
          {info.label} — non-unitary (no matrix)
        </div>
      </div>
    )
  }

  const latex = `${info.label} = ${matrixToLatex(matrix)}`
  const html = renderLatex(latex, true)

  return (
    <div
      ref={popupRef}
      className={cn(
        'fixed z-50 rounded-lg border border-border bg-popover px-3 py-2 shadow-md',
        className,
      )}
      style={{ left: position.x + 8, top: position.y + 8 }}
    >
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
