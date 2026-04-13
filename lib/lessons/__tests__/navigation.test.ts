import { describe, it, expect } from 'vitest'
import { getPrevNextLessons } from '../navigation'

describe('getPrevNextLessons', () => {
  it('returns null prev for first lesson', () => {
    const { prev, next } = getPrevNextLessons('a1-complex-numbers')
    expect(prev).toBeNull()
    expect(next).toBe('a2-vectors')
  })

  it('returns null next for last lesson', () => {
    const { prev, next } = getPrevNextLessons('c10-shor')
    expect(prev).toBe('c9-qft')
    expect(next).toBeNull()
  })

  it('returns both for a middle lesson', () => {
    const { prev, next } = getPrevNextLessons('c1-qubit')
    expect(prev).toBe('p2-postulates')
    expect(next).toBe('c2-measurement')
  })

  it('returns both null for unknown slug', () => {
    const { prev, next } = getPrevNextLessons('nonexistent')
    expect(prev).toBeNull()
    expect(next).toBeNull()
  })
})
