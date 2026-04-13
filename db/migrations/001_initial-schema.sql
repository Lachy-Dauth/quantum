-- Up Migration
-- Core application tables for the quantum learning platform.

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES
-- ============================================================

CREATE TYPE track AS ENUM ('math', 'physics', 'computing');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'trialing',
  'unpaid',
  'paused'
);
CREATE TYPE bookmark_target AS ENUM ('lesson', 'section');

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
-- Defined before tables so triggers can reference it.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USERS
-- ============================================================
-- Synced from Supabase Auth. The auth_id column matches the
-- Supabase Auth user UUID. A row is created here when the user
-- first signs in (via a post-signup API call or webhook).

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_auth_id ON users (auth_id);
CREATE INDEX idx_users_email ON users (email);

COMMENT ON COLUMN users.auth_id IS
  'UUID from Supabase Auth. Used to correlate auth sessions with app data.';

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
-- Tracks Stripe subscription state. One active subscription per
-- user at a time. Historical records are kept (canceled subs
-- remain with status = canceled).

CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id    TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id       TEXT,
  status                subscription_status NOT NULL DEFAULT 'incomplete',
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN NOT NULL DEFAULT false,
  canceled_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions (stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_subscriptions_active ON subscriptions (user_id)
  WHERE status = 'active';

COMMENT ON COLUMN subscriptions.stripe_subscription_id IS
  'Null when using one-time-payment (lifetime) model instead of recurring.';
COMMENT ON COLUMN subscriptions.current_period_end IS
  'Null means lifetime access (never expires).';

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- LESSON METADATA
-- ============================================================
-- Static metadata for all 23 lessons. Populated by seed migration.
-- This table is read-only at runtime; changes come from migrations.

CREATE TABLE lesson_metadata (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL DEFAULT '',
  track             track NOT NULL,
  track_position    SMALLINT NOT NULL,
  canonical_order   SMALLINT NOT NULL UNIQUE,
  prerequisites     TEXT[] NOT NULL DEFAULT '{}',
  estimated_minutes SMALLINT NOT NULL DEFAULT 30,
  word_count        INTEGER NOT NULL DEFAULT 0,
  is_free           BOOLEAN NOT NULL DEFAULT false,
  number_of_parts   SMALLINT NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lesson_metadata_slug ON lesson_metadata (slug);
CREATE INDEX idx_lesson_metadata_track ON lesson_metadata (track, track_position);
CREATE INDEX idx_lesson_metadata_canonical ON lesson_metadata (canonical_order);

COMMENT ON COLUMN lesson_metadata.prerequisites IS
  'Array of lesson slugs. Enforced at application level, not DB level.';
COMMENT ON COLUMN lesson_metadata.number_of_parts IS
  '1 for single-page lessons. >1 for multi-part lessons (e.g., Shor = 3).';

-- ============================================================
-- USER PROGRESS
-- ============================================================
-- One row per user per lesson. Created on first access.
-- Updated as the user progresses through the lesson.

CREATE TABLE user_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug     TEXT NOT NULL REFERENCES lesson_metadata(slug) ON DELETE CASCADE,
  status          progress_status NOT NULL DEFAULT 'not_started',
  current_part    SMALLINT NOT NULL DEFAULT 1,
  time_spent_sec  INTEGER NOT NULL DEFAULT 0,
  last_accessed   TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, lesson_slug)
);

CREATE INDEX idx_user_progress_user ON user_progress (user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress (lesson_slug);
CREATE INDEX idx_user_progress_in_progress ON user_progress (user_id)
  WHERE status = 'in_progress';

COMMENT ON COLUMN user_progress.time_spent_sec IS
  'Accumulated from client-side heartbeats. Approximate, not precise.';

CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- PROBLEM ATTEMPTS
-- ============================================================
-- Records every attempt a user makes on an in-lesson problem.
-- Used for analytics, retry UX, and spaced repetition (future).

CREATE TABLE problem_attempts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug     TEXT NOT NULL REFERENCES lesson_metadata(slug) ON DELETE CASCADE,
  problem_id      TEXT NOT NULL,
  attempt_number  SMALLINT NOT NULL DEFAULT 1,
  answer          JSONB NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  time_to_answer  INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_problem_attempts_user ON problem_attempts (user_id, lesson_slug);
CREATE INDEX idx_problem_attempts_problem ON problem_attempts (lesson_slug, problem_id);
CREATE INDEX idx_problem_attempts_incorrect ON problem_attempts (user_id, lesson_slug, problem_id)
  WHERE is_correct = false;

COMMENT ON COLUMN problem_attempts.answer IS
  'JSONB to support multiple answer formats (choice, numeric, matrix, expression).';

-- ============================================================
-- BOOKMARKS
-- ============================================================
-- Users can bookmark a lesson or a specific section within a lesson.

CREATE TABLE bookmarks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug     TEXT NOT NULL REFERENCES lesson_metadata(slug) ON DELETE CASCADE,
  target_type     bookmark_target NOT NULL DEFAULT 'lesson',
  section_id      TEXT,
  label           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, lesson_slug, section_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks (user_id);

COMMENT ON COLUMN bookmarks.section_id IS
  'Heading anchor ID from the MDX content. Null for lesson-level bookmarks.';

-- ============================================================
-- USER SETTINGS
-- ============================================================
-- One row per user. Created with defaults on first sign-in.

CREATE TABLE user_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme                 TEXT NOT NULL DEFAULT 'system'
    CHECK (theme IN ('light', 'dark', 'system')),
  math_font_size        TEXT NOT NULL DEFAULT 'medium'
    CHECK (math_font_size IN ('small', 'medium', 'large')),
  simulator_show_labels BOOLEAN NOT NULL DEFAULT true,
  simulator_auto_play   BOOLEAN NOT NULL DEFAULT false,
  email_progress_digest BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN user_settings.theme IS
  'UI color scheme. "system" follows OS preference.';

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Down Migration

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON user_settings;
DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at();
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS problem_attempts;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS lesson_metadata;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS bookmark_target;
DROP TYPE IF EXISTS subscription_status;
DROP TYPE IF EXISTS progress_status;
DROP TYPE IF EXISTS track;
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "uuid-ossp";
