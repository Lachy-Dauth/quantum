export const CANONICAL_ORDER = [
  'a1-complex-numbers',
  'a2-vectors',
  'a3-matrices',
  'p1-classical-physics-fails',
  'p2-postulates',
  'c1-qubit',
  'c2-measurement',
  'a4-eigenvalues-spectral-theorem',
  'p3-schrodinger-equation',
  'p4-spin-pauli',
  'c3-gates-bloch-sphere',
  'a5-tensor-products',
  'p5-uncertainty',
  'p6-bell-chsh',
  'c4-multi-qubit',
  'a6-probability-born-rule',
  'c5-universal-gates',
  'c6-deutsch-jozsa',
  'c7-teleportation',
  'p7-decoherence',
  'c8-grover',
  'c9-qft',
  'c10-shor',
] as const

export type LessonSlug = (typeof CANONICAL_ORDER)[number]

export const FREE_LESSON_SLUGS = [
  'a1-complex-numbers',
  'a2-vectors',
  'a3-matrices',
] as const

export const FREE_SIMULATOR_SLUGS = ['qubit', 'bloch-sphere'] as const

export function isFreeLessonSlug(slug: string): boolean {
  return (FREE_LESSON_SLUGS as readonly string[]).includes(slug)
}
