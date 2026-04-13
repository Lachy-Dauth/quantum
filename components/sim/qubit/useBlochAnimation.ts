'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { BlochVector } from '@/lib/sim/qubit/types'

const ANIMATION_DURATION = 300 // ms

/**
 * SLERP-style interpolation for Bloch vectors.
 * Smoothly transitions between previous and current Bloch vector arrays
 * over ANIMATION_DURATION ms using requestAnimationFrame.
 *
 * If prefers-reduced-motion is enabled, snaps immediately.
 */
export function useBlochAnimation(target: BlochVector[] | undefined): BlochVector[] {
  const [current, setCurrent] = useState<BlochVector[]>(target ?? [])
  const prevRef = useRef<BlochVector[]>(target ?? [])
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const prefersReducedMotion = useRef(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  const animate = useCallback((timestamp: number) => {
    const elapsed = timestamp - startTimeRef.current
    const t = Math.min(elapsed / ANIMATION_DURATION, 1)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)

    const prev = prevRef.current
    const tgt = target ?? []

    const interpolated: BlochVector[] = tgt.map((bv, i) => {
      const p = prev[i]
      if (!p) return bv

      return {
        x: p.x + (bv.x - p.x) * eased,
        y: p.y + (bv.y - p.y) * eased,
        z: p.z + (bv.z - p.z) * eased,
        purity: p.purity + (bv.purity - p.purity) * eased,
      }
    })

    setCurrent(interpolated)

    if (t < 1) {
      animRef.current = requestAnimationFrame(animate)
    } else {
      prevRef.current = tgt
      animRef.current = null
    }
  }, [target])

  useEffect(() => {
    if (!target) return

    // Cancel any in-progress animation
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }

    if (prefersReducedMotion.current) {
      setCurrent(target)
      prevRef.current = target
      return
    }

    startTimeRef.current = performance.now()
    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [target, animate])

  return current
}
