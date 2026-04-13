// Database TypeScript types — queries implemented in INFRA_DB

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  has_paid: boolean
  stripe_customer_id: string | null
  created_at: Date
  updated_at: Date
}

export interface LessonMetadata {
  id: number
  slug: string
  title: string
  subtitle: string | null
  track: 'math' | 'physics' | 'computing'
  track_position: number
  canonical_order: number
  total_parts: number
  estimated_minutes: number
  is_free: boolean
}

export interface UserProgress {
  id: number
  user_id: string
  lesson_slug: string
  status: 'not_started' | 'in_progress' | 'completed'
  current_part: number | null
  time_spent_seconds: number
  completed_at: Date | null
  updated_at: Date
}

export interface ProblemAttempt {
  id: number
  user_id: string
  lesson_slug: string
  problem_id: string
  answer: string
  correct: boolean
  created_at: Date
}

export interface Bookmark {
  id: number
  user_id: string
  lesson_slug: string
  section_id: string | null
  label: string | null
  created_at: Date
}

export interface UserSettings {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  font_size: 'small' | 'medium' | 'large'
  updated_at: Date
}
