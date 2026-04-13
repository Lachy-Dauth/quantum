import type { Track } from '@/lib/tracks'

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

export const FREE_LESSON_SLUGS = ['a1-complex-numbers', 'a2-vectors', 'a3-matrices'] as const

export const FREE_SIMULATOR_SLUGS = ['qubit', 'bloch-sphere'] as const

export function isFreeLessonSlug(slug: string): boolean {
  return (FREE_LESSON_SLUGS as readonly string[]).includes(slug)
}

// ── Lesson metadata for listing pages ─────────────────────────────────
// This lets the curriculum and track pages render without loading MDX files.

export interface LessonMeta {
  slug: LessonSlug
  title: string
  subtitle?: string
  track: Track
  totalParts: number
  estimatedMinutes: number
  hasContent: boolean // true if MDX files exist
}

export const LESSON_META: Record<LessonSlug, LessonMeta> = {
  'a1-complex-numbers': {
    slug: 'a1-complex-numbers',
    title: "Complex Numbers & Euler's Formula",
    subtitle: 'The number system that makes quantum mechanics possible',
    track: 'math',
    totalParts: 4,
    estimatedMinutes: 170,
    hasContent: true,
  },
  'a2-vectors': {
    slug: 'a2-vectors',
    title: 'Vectors in Cⁿ',
    subtitle: 'Inner products, norms, and orthogonality',
    track: 'math',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'a3-matrices': {
    slug: 'a3-matrices',
    title: 'Matrices & Linear Maps',
    subtitle: 'Unitary and Hermitian matrices, matrix exponentials',
    track: 'math',
    totalParts: 1,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'p1-classical-physics-fails': {
    slug: 'p1-classical-physics-fails',
    title: 'When Classical Physics Fails',
    subtitle: 'Blackbody radiation, photoelectric effect, double-slit experiment',
    track: 'physics',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'p2-postulates': {
    slug: 'p2-postulates',
    title: 'The Postulates of Quantum Mechanics',
    subtitle: 'States, observables, measurement, and time evolution',
    track: 'physics',
    totalParts: 1,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'c1-qubit': {
    slug: 'c1-qubit',
    title: 'The Qubit',
    subtitle: 'Superposition, the Bloch sphere, and quantum state space',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 90,
    hasContent: false,
  },
  'c2-measurement': {
    slug: 'c2-measurement',
    title: 'Measurement',
    subtitle: 'Projective measurement and the Born rule in action',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 90,
    hasContent: false,
  },
  'a4-eigenvalues-spectral-theorem': {
    slug: 'a4-eigenvalues-spectral-theorem',
    title: 'Eigenvalues & the Spectral Theorem',
    subtitle: 'Diagonalisation of Hermitian and unitary matrices',
    track: 'math',
    totalParts: 1,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'p3-schrodinger-equation': {
    slug: 'p3-schrodinger-equation',
    title: 'The Schrödinger Equation',
    subtitle: 'Time-dependent and time-independent forms',
    track: 'physics',
    totalParts: 2,
    estimatedMinutes: 180,
    hasContent: false,
  },
  'p4-spin-pauli': {
    slug: 'p4-spin-pauli',
    title: 'Spin & the Pauli Matrices',
    subtitle: 'Intrinsic angular momentum and the Stern-Gerlach experiment',
    track: 'physics',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'c3-gates-bloch-sphere': {
    slug: 'c3-gates-bloch-sphere',
    title: 'Quantum Gates & the Bloch Sphere',
    subtitle: 'Pauli, Hadamard, phase, and rotation gates',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'a5-tensor-products': {
    slug: 'a5-tensor-products',
    title: 'Tensor Products',
    subtitle: 'Combining quantum systems and entangled states',
    track: 'math',
    totalParts: 1,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'p5-uncertainty': {
    slug: 'p5-uncertainty',
    title: 'The Uncertainty Principle',
    subtitle: 'Commutators, incompatible observables, and fundamental limits',
    track: 'physics',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'p6-bell-chsh': {
    slug: 'p6-bell-chsh',
    title: 'Bell Inequalities & the CHSH Game',
    subtitle: 'Entanglement, nonlocality, and the end of hidden variables',
    track: 'physics',
    totalParts: 2,
    estimatedMinutes: 180,
    hasContent: false,
  },
  'c4-multi-qubit': {
    slug: 'c4-multi-qubit',
    title: 'Multi-Qubit Systems',
    subtitle: 'CNOT, entangling gates, and Bell states',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'a6-probability-born-rule': {
    slug: 'a6-probability-born-rule',
    title: 'Probability & the Born Rule',
    subtitle: 'Probability amplitudes, density matrices, and mixed states',
    track: 'math',
    totalParts: 1,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'c5-universal-gates': {
    slug: 'c5-universal-gates',
    title: 'Universal Gate Sets',
    subtitle: 'Why a handful of gates can approximate any unitary',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'c6-deutsch-jozsa': {
    slug: 'c6-deutsch-jozsa',
    title: 'Deutsch-Jozsa Algorithm',
    subtitle: 'The first quantum speedup — constant vs balanced functions',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 90,
    hasContent: false,
  },
  'c7-teleportation': {
    slug: 'c7-teleportation',
    title: 'Quantum Teleportation',
    subtitle: 'Transmitting quantum states using entanglement and classical bits',
    track: 'computing',
    totalParts: 1,
    estimatedMinutes: 90,
    hasContent: false,
  },
  'p7-decoherence': {
    slug: 'p7-decoherence',
    title: 'Decoherence & Noise',
    subtitle: 'Why quantum systems lose coherence and how to model it',
    track: 'physics',
    totalParts: 1,
    estimatedMinutes: 120,
    hasContent: false,
  },
  'c8-grover': {
    slug: 'c8-grover',
    title: "Grover's Search Algorithm",
    subtitle: 'Quadratic speedup for unstructured search',
    track: 'computing',
    totalParts: 2,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'c9-qft': {
    slug: 'c9-qft',
    title: 'Quantum Fourier Transform',
    subtitle: 'From classical DFT to quantum circuits',
    track: 'computing',
    totalParts: 2,
    estimatedMinutes: 150,
    hasContent: false,
  },
  'c10-shor': {
    slug: 'c10-shor',
    title: "Shor's Factoring Algorithm",
    subtitle: 'Breaking RSA with quantum period-finding',
    track: 'computing',
    totalParts: 3,
    estimatedMinutes: 180,
    hasContent: false,
  },
}

// ── Helper functions ──────────────────────────────────────────────────

/** Get the URL for a lesson's first page */
export function lessonHref(slug: LessonSlug): string {
  const meta = LESSON_META[slug]
  if (meta.totalParts > 1) {
    return `/lessons/${slug}/part-1`
  }
  return `/lessons/${slug}`
}

/** Get all lessons for a given track, in canonical order */
export function lessonsForTrack(track: Track): LessonMeta[] {
  return CANONICAL_ORDER.map((slug) => LESSON_META[slug]).filter((meta) => meta.track === track)
}

/** Get canonical position (1-indexed) */
export function canonicalPosition(slug: LessonSlug): number {
  return CANONICAL_ORDER.indexOf(slug) + 1
}
