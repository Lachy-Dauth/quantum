// Database TypeScript types — aligned with schema in db/migrations/001_initial-schema.sql

export type Track = 'math' | 'physics' | 'computing'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing'
  | 'unpaid'
  | 'paused'
export type BookmarkTarget = 'lesson' | 'section'

export interface User {
  id: string
  authId: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  status: SubscriptionStatus
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  canceledAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface LessonMetadata {
  id: string
  slug: string
  title: string
  description: string
  track: Track
  trackPosition: number
  canonicalOrder: number
  prerequisites: string[]
  estimatedMinutes: number
  wordCount: number
  isFree: boolean
  numberOfParts: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  lessonSlug: string
  status: ProgressStatus
  currentPart: number
  timeSpentSec: number
  lastAccessed: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ProblemAttempt {
  id: string
  userId: string
  lessonSlug: string
  problemId: string
  attemptNumber: number
  answer: Record<string, unknown>
  isCorrect: boolean
  timeToAnswer: number | null
  createdAt: Date
}

export interface Bookmark {
  id: string
  userId: string
  lessonSlug: string
  targetType: BookmarkTarget
  sectionId: string | null
  label: string | null
  createdAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  mathFontSize: 'small' | 'medium' | 'large'
  simulatorShowLabels: boolean
  simulatorAutoPlay: boolean
  emailProgressDigest: boolean
  createdAt: Date
  updatedAt: Date
}
