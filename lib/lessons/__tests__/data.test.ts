import { describe, it, expect } from 'vitest'
import { CANONICAL_ORDER, FREE_LESSON_SLUGS, isFreeLessonSlug } from '../data'

describe('CANONICAL_ORDER', () => {
  it('contains 23 lessons', () => {
    expect(CANONICAL_ORDER).toHaveLength(23)
  })

  it('starts with a1-complex-numbers', () => {
    expect(CANONICAL_ORDER[0]).toBe('a1-complex-numbers')
  })

  it('ends with c10-shor', () => {
    expect(CANONICAL_ORDER[CANONICAL_ORDER.length - 1]).toBe('c10-shor')
  })

  it('has no duplicates', () => {
    const unique = new Set(CANONICAL_ORDER)
    expect(unique.size).toBe(CANONICAL_ORDER.length)
  })
})

describe('isFreeLessonSlug', () => {
  it('returns true for free lessons', () => {
    for (const slug of FREE_LESSON_SLUGS) {
      expect(isFreeLessonSlug(slug)).toBe(true)
    }
  })

  it('returns false for paid lessons', () => {
    expect(isFreeLessonSlug('c1-qubit')).toBe(false)
    expect(isFreeLessonSlug('p1-classical-physics-fails')).toBe(false)
  })

  it('returns false for unknown slugs', () => {
    expect(isFreeLessonSlug('nonexistent')).toBe(false)
  })
})
