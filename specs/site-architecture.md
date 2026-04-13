# Quantum Computing & Physics Learning Platform -- Site Architecture Specification

**Version:** 1.0
**Date:** 2026-04-13
**Status:** Draft

---

## Table of Contents

1. [Page-by-Page Sitemap with Route Table](#1-page-by-page-sitemap-with-route-table)
2. [Database Schema](#2-database-schema)
3. [Auth Flow](#3-auth-flow)
4. [Railway Deployment Topology](#4-railway-deployment-topology)
5. [CI/CD via GitHub Actions](#5-cicd-via-github-actions)
6. [MDX Content Pipeline](#6-mdx-content-pipeline)
7. [State Management and Data Flow](#7-state-management-and-data-flow)

---

## 1. Page-by-Page Sitemap with Route Table

### 1.1 Conventions

All routes use the Next.js App Router (`/app` directory). Pages are **Server Components** by default unless explicitly marked as Client Components. "Auth requirement" levels:

- **public** -- no authentication needed
- **authenticated** -- user must be signed in
- **paid** -- user must be signed in AND have an active subscription (or be accessing a free lesson)

### 1.2 Complete Route Table

#### Marketing & Static Pages

| Path       | Page Component         | Auth   | Rendering       | Description                                                                    |
| ---------- | ---------------------- | ------ | --------------- | ------------------------------------------------------------------------------ |
| `/`        | `app/page.tsx`         | public | Server (static) | Landing page. Hero, value prop, curriculum preview, pricing CTA, testimonials. |
| `/about`   | `app/about/page.tsx`   | public | Server (static) | About the project, authors, methodology.                                       |
| `/faq`     | `app/faq/page.tsx`     | public | Server (static) | Frequently asked questions. Accordion layout.                                  |
| `/pricing` | `app/pricing/page.tsx` | public | Server (static) | Pricing details, feature comparison free vs paid, Stripe checkout CTA.         |
| `/privacy` | `app/privacy/page.tsx` | public | Server (static) | Privacy policy.                                                                |
| `/terms`   | `app/terms/page.tsx`   | public | Server (static) | Terms of service.                                                              |

#### Authentication Pages

| Path                      | Page Component                        | Auth   | Rendering | Description                                                                  |
| ------------------------- | ------------------------------------- | ------ | --------- | ---------------------------------------------------------------------------- |
| `/sign-in`                | `app/sign-in/page.tsx`                | public | Client    | Sign-in form (email/password + OAuth). Redirects to `/dashboard` on success. |
| `/sign-up`                | `app/sign-up/page.tsx`                | public | Client    | Registration form. Triggers email verification.                              |
| `/verify-email`           | `app/verify-email/page.tsx`           | public | Client    | Email verification landing page. Handles token from email link.              |
| `/reset-password`         | `app/reset-password/page.tsx`         | public | Client    | Password reset request form (enter email).                                   |
| `/reset-password/confirm` | `app/reset-password/confirm/page.tsx` | public | Client    | New password entry form. Token from email link.                              |

#### Curriculum & Track Pages

| Path                | Page Component                  | Auth   | Rendering       | Description                                                                                                                    |
| ------------------- | ------------------------------- | ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `/curriculum`       | `app/curriculum/page.tsx`       | public | Server (static) | Full curriculum overview in canonical order. Shows all 23 lessons with track badges, prereqs, and lock icons for paid content. |
| `/curriculum/map`   | `app/curriculum/map/page.tsx`   | public | Client          | Interactive dependency graph (DAG visualization). Nodes are lessons, edges are prerequisites. Uses Canvas or SVG.              |
| `/tracks`           | `app/tracks/page.tsx`           | public | Server (static) | Overview of all three tracks with descriptions.                                                                                |
| `/tracks/math`      | `app/tracks/math/page.tsx`      | public | Server (static) | Track A listing: all 6 math lessons in track order.                                                                            |
| `/tracks/physics`   | `app/tracks/physics/page.tsx`   | public | Server (static) | Track P listing: all 7 physics lessons.                                                                                        |
| `/tracks/computing` | `app/tracks/computing/page.tsx` | public | Server (static) | Track C listing: all 10 computing lessons.                                                                                     |

#### Lesson Pages

| Path                     | Page Component                       | Auth   | Rendering        | Description                                                                  |
| ------------------------ | ------------------------------------ | ------ | ---------------- | ---------------------------------------------------------------------------- |
| `/lessons`               | `app/lessons/page.tsx`               | public | Server (static)  | Redirects to `/curriculum`.                                                  |
| `/lessons/[slug]`        | `app/lessons/[slug]/page.tsx`        | paid\* | Server (dynamic) | Single-part lesson page. Renders MDX content, embedded simulators, problems. |
| `/lessons/[slug]/[part]` | `app/lessons/[slug]/[part]/page.tsx` | paid\* | Server (dynamic) | Multi-part lesson page. `part` is `part-1`, `part-2`, etc.                   |

\*Free lessons (A1, A2, A3) are accessible without payment. Paid lessons show a preview (title, objectives, first paragraph) to unauthenticated/unpaid users, with a paywall CTA.

**Multi-part lesson slugs and structure:**

| Lesson                  | Slug                      | Parts | Rationale                                       |
| ----------------------- | ------------------------- | ----- | ----------------------------------------------- |
| P3 Schrodinger equation | `p3-schrodinger-equation` | 2     | TDSE + TISE are conceptually distinct sections  |
| P6 Bell/CHSH            | `p6-bell-chsh`            | 2     | Bell's theorem + CHSH inequality & experiments  |
| C8 Grover               | `c8-grover`               | 2     | Oracle construction + amplitude amplification   |
| C9 QFT                  | `c9-qft`                  | 2     | Classical DFT motivation + quantum circuit      |
| C10 Shor                | `c10-shor`                | 3     | Number theory + QPE subroutine + full algorithm |

All other lessons are single-part and served at `/lessons/[slug]` directly. When a single-part lesson is accessed with `/part-1`, it redirects to the base slug.

**Complete lesson slug table:**

| #   | Lesson                          | Slug                              | Track     | Free? |
| --- | ------------------------------- | --------------------------------- | --------- | ----- |
| 1   | A1 Complex numbers              | `a1-complex-numbers`              | math      | Yes   |
| 2   | A2 Vectors                      | `a2-vectors`                      | math      | Yes   |
| 3   | A3 Matrices                     | `a3-matrices`                     | math      | Yes   |
| 4   | P1 Classical physics fails      | `p1-classical-physics-fails`      | physics   | No    |
| 5   | P2 Postulates                   | `p2-postulates`                   | physics   | No    |
| 6   | C1 Qubit                        | `c1-qubit`                        | computing | No    |
| 7   | C2 Measurement                  | `c2-measurement`                  | computing | No    |
| 8   | A4 Eigenvalues/spectral theorem | `a4-eigenvalues-spectral-theorem` | math      | No    |
| 9   | P3 Schrodinger equation         | `p3-schrodinger-equation`         | physics   | No    |
| 10  | P4 Spin/Pauli                   | `p4-spin-pauli`                   | physics   | No    |
| 11  | C3 Gates/Bloch sphere           | `c3-gates-bloch-sphere`           | computing | No    |
| 12  | A5 Tensor products              | `a5-tensor-products`              | math      | No    |
| 13  | P5 Uncertainty                  | `p5-uncertainty`                  | physics   | No    |
| 14  | P6 Bell/CHSH                    | `p6-bell-chsh`                    | physics   | No    |
| 15  | C4 Multi-qubit                  | `c4-multi-qubit`                  | computing | No    |
| 16  | A6 Probability/Born rule        | `a6-probability-born-rule`        | math      | No    |
| 17  | C5 Universal gates              | `c5-universal-gates`              | computing | No    |
| 18  | C6 Deutsch-Jozsa                | `c6-deutsch-jozsa`                | computing | No    |
| 19  | C7 Teleportation                | `c7-teleportation`                | computing | No    |
| 20  | P7 Decoherence                  | `p7-decoherence`                  | physics   | No    |
| 21  | C8 Grover                       | `c8-grover`                       | computing | No    |
| 22  | C9 QFT                          | `c9-qft`                          | computing | No    |
| 23  | C10 Shor                        | `c10-shor`                        | computing | No    |

#### User Dashboard & Settings

| Path                     | Page Component                       | Auth          | Rendering        | Description                                                                                                     |
| ------------------------ | ------------------------------------ | ------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `/dashboard`             | `app/dashboard/page.tsx`             | authenticated | Server (dynamic) | User home. Progress overview (lessons completed / total), recent activity, bookmarks, next recommended lesson.  |
| `/dashboard/progress`    | `app/dashboard/progress/page.tsx`    | authenticated | Server (dynamic) | Detailed progress: per-track completion bars, per-lesson status, time spent.                                    |
| `/dashboard/bookmarks`   | `app/dashboard/bookmarks/page.tsx`   | authenticated | Server (dynamic) | All bookmarked lessons/sections.                                                                                |
| `/settings`              | `app/settings/page.tsx`              | authenticated | Client           | Profile editing, theme toggle (light/dark), math font size, simulator defaults.                                 |
| `/settings/subscription` | `app/settings/subscription/page.tsx` | authenticated | Client           | Subscription management. Links to Stripe Customer Portal. Shows plan status, renewal date, cancellation option. |

#### Simulator Sandbox

| Path                   | Page Component                     | Auth          | Rendering | Description                                             |
| ---------------------- | ---------------------------------- | ------------- | --------- | ------------------------------------------------------- |
| `/sandbox`             | `app/sandbox/page.tsx`             | authenticated | Client    | Simulator playground index. Lists available simulators. |
| `/sandbox/[simulator]` | `app/sandbox/[simulator]/page.tsx` | paid\*        | Client    | Standalone simulator. Full-page interactive tool.       |

Available simulator slugs: `qubit`, `stern-gerlach`, `bloch-sphere`, `circuit-builder`, `chsh`, `grover-oracle`, `qft-visualizer`.

\*The `qubit` and `bloch-sphere` simulators are free (they support the free lessons). All others require payment.

#### API Routes

| Path                           | Method | Auth          | Description                                                                                          |
| ------------------------------ | ------ | ------------- | ---------------------------------------------------------------------------------------------------- |
| `/api/health`                  | GET    | public        | Healthcheck endpoint. Returns `{ status: "ok", timestamp }`. Used by Railway.                        |
| `/api/auth/callback`           | GET    | public        | OAuth callback handler (Supabase Auth redirects here).                                               |
| `/api/progress`                | GET    | authenticated | Get current user's progress for all lessons.                                                         |
| `/api/progress`                | POST   | authenticated | Update progress for a specific lesson. Body: `{ lessonSlug, status, partIndex?, timeSpentSeconds }`. |
| `/api/problems/attempt`        | POST   | authenticated | Record a problem attempt. Body: `{ lessonSlug, problemId, answer, correct }`.                        |
| `/api/bookmarks`               | GET    | authenticated | Get user's bookmarks.                                                                                |
| `/api/bookmarks`               | POST   | authenticated | Add bookmark. Body: `{ lessonSlug, sectionId?, label? }`.                                            |
| `/api/bookmarks/[id]`          | DELETE | authenticated | Remove bookmark.                                                                                     |
| `/api/settings`                | GET    | authenticated | Get user settings.                                                                                   |
| `/api/settings`                | PUT    | authenticated | Update user settings. Body: partial `UserSettings` object.                                           |
| `/api/stripe/create-checkout`  | POST   | authenticated | Create Stripe Checkout Session. Returns `{ url }` for redirect.                                      |
| `/api/stripe/create-portal`    | POST   | authenticated | Create Stripe Customer Portal session. Returns `{ url }`.                                            |
| `/api/stripe/webhook`          | POST   | public\*      | Stripe webhook handler. Verifies signature, processes events.                                        |
| `/api/cron/sync-subscriptions` | POST   | internal\*\*  | Sync subscription statuses from Stripe. Called by Railway cron.                                      |

\*Stripe webhooks are authenticated via webhook signature verification, not user auth.
\*\*Internal routes are protected by a shared secret in the `Authorization` header, not user auth.

### 1.3 App Router File Structure

```
app/
  layout.tsx                    # Root layout: html, body, Providers, Navbar, Footer
  page.tsx                      # Landing page
  about/page.tsx
  faq/page.tsx
  pricing/page.tsx
  privacy/page.tsx
  terms/page.tsx
  sign-in/page.tsx
  sign-up/page.tsx
  verify-email/page.tsx
  reset-password/
    page.tsx
    confirm/page.tsx
  curriculum/
    page.tsx
    map/page.tsx
  tracks/
    page.tsx
    math/page.tsx
    physics/page.tsx
    computing/page.tsx
  lessons/
    page.tsx
    [slug]/
      page.tsx                  # Single-part lesson or multi-part index (redirects to part-1)
      [part]/page.tsx           # Multi-part lesson part
  dashboard/
    layout.tsx                  # Dashboard layout with sidebar nav
    page.tsx
    progress/page.tsx
    bookmarks/page.tsx
  settings/
    page.tsx
    subscription/page.tsx
  sandbox/
    page.tsx
    [simulator]/page.tsx
  api/
    health/route.ts
    auth/callback/route.ts
    progress/route.ts
    problems/attempt/route.ts
    bookmarks/
      route.ts
      [id]/route.ts
    settings/route.ts
    stripe/
      create-checkout/route.ts
      create-portal/route.ts
      webhook/route.ts
    cron/
      sync-subscriptions/route.ts
```

### 1.4 Middleware

A single `middleware.ts` at the project root handles route protection:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/faq',
  '/pricing',
  '/privacy',
  '/terms',
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/reset-password',
  '/curriculum',
  '/curriculum/map',
  '/tracks',
  '/tracks/math',
  '/tracks/physics',
  '/tracks/computing',
  '/lessons', // listing page is public
]

const FREE_LESSON_SLUGS = ['a1-complex-numbers', 'a2-vectors', 'a3-matrices']

const FREE_SIMULATOR_SLUGS = ['qubit', 'bloch-sphere']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Public routes: always accessible
  if (PUBLIC_ROUTES.includes(path) || path.startsWith('/api/')) {
    return res
  }

  // Lesson routes: check if free
  if (path.startsWith('/lessons/')) {
    const slug = path.split('/')[2]
    if (FREE_LESSON_SLUGS.includes(slug)) {
      return res // Free lessons are public
    }
    // Paid lesson: if not authenticated, show preview (handled in page component)
    // Middleware allows through but page component checks payment status
    if (!session) {
      // Allow through -- the page component renders the paywall preview
      return res
    }
  }

  // Sandbox simulators: check if free
  if (path.startsWith('/sandbox/')) {
    const simulator = path.split('/')[2]
    if (simulator && FREE_SIMULATOR_SLUGS.includes(simulator)) {
      return res
    }
  }

  // All other routes require authentication
  if (!session) {
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

Paywall enforcement happens at the **page component level**, not middleware. Middleware handles authentication redirects only. This allows unauthenticated users to see lesson previews (title, objectives, first paragraph) with a paywall CTA, which is better for conversion than a hard redirect.

---

## 2. Database Schema

### 2.1 Technology Choice: Supabase Hosted PostgreSQL on Railway

**Decision:** Use Supabase Auth + a **Railway-managed PostgreSQL** instance for the database.

**Justification for Supabase Auth over Clerk:**

- Supabase Auth is open source and self-hostable, reducing vendor lock-in.
- The free tier is generous (50,000 monthly active users) which exceeds any realistic early-stage need.
- It integrates natively with PostgreSQL Row-Level Security (RLS), which we use for data access control.
- Clerk is excellent but costs $0.02/MAU after 10K users, and its auth model is opaque (hosted, not self-hostable).
- Supabase Auth supports email/password, Google OAuth, and GitHub OAuth out of the box.

**Justification for Railway PostgreSQL over Neon or Supabase hosted DB:**

- Since the Next.js app already runs on Railway, co-locating the database on Railway minimizes network latency (same private network).
- Railway Postgres is a managed plugin with automated backups, one-click provisioning, and automatic `DATABASE_URL` injection into linked services.
- Neon's serverless scaling model is useful for Vercel's edge functions but is unnecessary when we have a persistent Railway service. We would pay for branching features we don't need.
- Supabase's hosted DB is excellent but adds another vendor and introduces cross-network latency to Railway.
- Railway Postgres supports PgBouncer connection pooling as a separate plugin.

**Note:** We use Supabase Auth as a **hosted auth service** (supabase.com project) while running our own PostgreSQL on Railway. Supabase Auth stores auth data in its own hosted DB; our Railway PostgreSQL stores application data. The `users` table in our DB is synced from Supabase Auth via webhook/trigger.

### 2.2 Migration Strategy

Migrations live in `/db/migrations/` and follow the naming convention:

```
db/
  migrations/
    001_initial_schema.sql
    002_seed_lesson_metadata.sql
    003_add_user_settings.sql
    ...
  seed/
    lesson_metadata.sql
```

Migrations are run using `node-pg-migrate` (lightweight, SQL-first migration runner) as part of the Railway deploy process. The migration tool is configured in `package.json`:

```json
{
  "scripts": {
    "db:migrate": "node-pg-migrate up --migrations-dir db/migrations",
    "db:migrate:create": "node-pg-migrate create --migrations-dir db/migrations"
  }
}
```

### 2.3 Schema Definition

#### Migration 001: Initial Schema

```sql
-- 001_initial_schema.sql
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
-- USERS
-- ============================================================
-- Synced from Supabase Auth. The auth_id column matches the
-- Supabase Auth user UUID. A row is created here when the user
-- first signs in (via a post-signup API call or webhook).

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID NOT NULL UNIQUE,
    -- Supabase Auth user ID. Unique and indexed for fast lookup.
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
    -- Stripe customer ID (cus_xxx). Stored so we can create
    -- portal sessions without hitting Stripe to look it up.
  stripe_subscription_id TEXT UNIQUE,
    -- Null for one-time payment (lifetime access) model.
    -- Populated for recurring subscriptions.
  stripe_price_id       TEXT,
    -- The Stripe Price ID for the plan.
  status                subscription_status NOT NULL DEFAULT 'incomplete',
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
    -- For lifetime access, current_period_end is NULL (never expires).
  cancel_at_period_end  BOOLEAN NOT NULL DEFAULT false,
  canceled_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions (stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
-- Partial index: find the active subscription for a user quickly.
CREATE INDEX idx_subscriptions_active ON subscriptions (user_id)
  WHERE status = 'active';

COMMENT ON COLUMN subscriptions.stripe_subscription_id IS
  'Null when using one-time-payment (lifetime) model instead of recurring.';
COMMENT ON COLUMN subscriptions.current_period_end IS
  'Null means lifetime access (never expires).';

-- ============================================================
-- LESSON METADATA
-- ============================================================
-- Static metadata for all 23 lessons. Populated by seed migration.
-- This table is read-only at runtime; changes come from migrations.

CREATE TABLE lesson_metadata (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
    -- URL slug, e.g. 'a1-complex-numbers'.
  title             TEXT NOT NULL,
  description       TEXT NOT NULL DEFAULT '',
  track             track NOT NULL,
  track_position    SMALLINT NOT NULL,
    -- Position within its own track (A1=1, A2=2, ... C10=10).
  canonical_order   SMALLINT NOT NULL UNIQUE,
    -- Position in the interleaved canonical sequence (1-23).
  prerequisites     TEXT[] NOT NULL DEFAULT '{}',
    -- Array of slugs of prerequisite lessons.
  estimated_minutes SMALLINT NOT NULL DEFAULT 30,
  word_count        INTEGER NOT NULL DEFAULT 0,
    -- Updated by a build-time script that counts words in MDX.
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
    -- Which part the user is currently on (for multi-part lessons).
  time_spent_sec  INTEGER NOT NULL DEFAULT 0,
    -- Cumulative time spent on this lesson in seconds.
  last_accessed   TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, lesson_slug)
);

CREATE INDEX idx_user_progress_user ON user_progress (user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress (lesson_slug);
-- Partial index: quickly find in-progress lessons for a user's dashboard.
CREATE INDEX idx_user_progress_in_progress ON user_progress (user_id)
  WHERE status = 'in_progress';

COMMENT ON COLUMN user_progress.time_spent_sec IS
  'Accumulated from client-side heartbeats. Approximate, not precise.';

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
    -- Identifier scoped to the lesson, e.g. 'q1', 'q2', 'ex-3'.
    -- Matches the id attribute in the MDX <Problem> component.
  attempt_number  SMALLINT NOT NULL DEFAULT 1,
    -- Monotonically increasing per (user, lesson, problem).
  answer          JSONB NOT NULL,
    -- The user's answer. Structure depends on problem type
    -- (multiple choice: {"choice": "b"}, numeric: {"value": 3.14},
    --  matrix: {"matrix": [[1,0],[0,1]]}).
  is_correct      BOOLEAN NOT NULL,
  time_to_answer  INTEGER,
    -- Seconds from problem display to submission. Nullable.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_problem_attempts_user ON problem_attempts (user_id, lesson_slug);
CREATE INDEX idx_problem_attempts_problem ON problem_attempts (lesson_slug, problem_id);
-- Partial index: find incorrect attempts for retry prompting.
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
    -- Nullable. If target_type = 'section', this is the heading anchor
    -- (e.g., 'the-born-rule'). Null for lesson-level bookmarks.
  label           TEXT,
    -- Optional user-provided label for the bookmark.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate bookmarks for the same target.
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
    -- Whether simulators show state labels by default.
  simulator_auto_play   BOOLEAN NOT NULL DEFAULT false,
    -- Whether simulators auto-run animations.
  email_progress_digest BOOLEAN NOT NULL DEFAULT true,
    -- Weekly email with progress summary.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN user_settings.theme IS
  'UI color scheme. "system" follows OS preference.';

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
-- Automatically update the updated_at column on row modification.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### Migration 002: Seed Lesson Metadata

```sql
-- 002_seed_lesson_metadata.sql
-- Seed all 23 lessons with correct tracks, canonical order, and prerequisites.

INSERT INTO lesson_metadata
  (slug, title, description, track, track_position, canonical_order, prerequisites, estimated_minutes, is_free, number_of_parts)
VALUES
  ('a1-complex-numbers',
   'Complex Numbers',
   'The number system underpinning quantum mechanics: imaginary unit, polar form, Euler''s formula, and the complex plane.',
   'math', 1, 1,
   '{}',
   25, true, 1),

  ('a2-vectors',
   'Vectors and Inner Products',
   'Column vectors, bra-ket notation, inner products, norms, and orthogonality in complex vector spaces.',
   'math', 2, 2,
   '{a1-complex-numbers}',
   30, true, 1),

  ('a3-matrices',
   'Matrices and Linear Transformations',
   'Matrix multiplication, Hermitian and unitary matrices, and their role as quantum operators.',
   'math', 3, 3,
   '{a2-vectors}',
   35, true, 1),

  ('p1-classical-physics-fails',
   'When Classical Physics Fails',
   'Blackbody radiation, photoelectric effect, and double-slit experiment: the experimental crises that demanded quantum theory.',
   'physics', 1, 4,
   '{a3-matrices}',
   30, false, 1),

  ('p2-postulates',
   'The Postulates of Quantum Mechanics',
   'State vectors, observables, measurement, and time evolution: the axiomatic foundation.',
   'physics', 2, 5,
   '{p1-classical-physics-fails}',
   35, false, 1),

  ('c1-qubit',
   'The Qubit',
   'From classical bits to quantum bits: superposition, state vectors, and the Bloch sphere.',
   'computing', 1, 6,
   '{p2-postulates}',
   25, false, 1),

  ('c2-measurement',
   'Measurement',
   'Projective measurement, Born rule in action, measurement bases, and the collapse postulate applied to qubits.',
   'computing', 2, 7,
   '{c1-qubit}',
   30, false, 1),

  ('a4-eigenvalues-spectral-theorem',
   'Eigenvalues and the Spectral Theorem',
   'Eigenvalue equations, diagonalization, spectral decomposition of Hermitian operators, and physical observables.',
   'math', 4, 8,
   '{a3-matrices, c2-measurement}',
   40, false, 1),

  ('p3-schrodinger-equation',
   'The Schrodinger Equation',
   'Time-dependent and time-independent forms, stationary states, and the infinite square well.',
   'physics', 3, 9,
   '{a4-eigenvalues-spectral-theorem}',
   45, false, 2),

  ('p4-spin-pauli',
   'Spin and Pauli Matrices',
   'Intrinsic angular momentum, spin-1/2 systems, Stern-Gerlach experiment, and the Pauli matrices.',
   'physics', 4, 10,
   '{p3-schrodinger-equation}',
   35, false, 1),

  ('c3-gates-bloch-sphere',
   'Quantum Gates and the Bloch Sphere',
   'Single-qubit gates (X, Y, Z, H, S, T), rotation operators, and visualization on the Bloch sphere.',
   'computing', 3, 11,
   '{p4-spin-pauli}',
   35, false, 1),

  ('a5-tensor-products',
   'Tensor Products',
   'Combining quantum systems: tensor product spaces, product states, and entangled states.',
   'math', 5, 12,
   '{a4-eigenvalues-spectral-theorem, c3-gates-bloch-sphere}',
   35, false, 1),

  ('p5-uncertainty',
   'The Uncertainty Principle',
   'Heisenberg uncertainty, commutators, Robertson relation, and the energy-time uncertainty.',
   'physics', 5, 13,
   '{a5-tensor-products}',
   30, false, 1),

  ('p6-bell-chsh',
   'Bell''s Theorem and the CHSH Inequality',
   'Local hidden variables, Bell''s theorem, CHSH inequality, and experimental violations.',
   'physics', 6, 14,
   '{p5-uncertainty}',
   40, false, 2),

  ('c4-multi-qubit',
   'Multi-Qubit Systems',
   'Two-qubit states, CNOT gate, entanglement creation, and the computational basis for n qubits.',
   'computing', 4, 15,
   '{p6-bell-chsh}',
   35, false, 1),

  ('a6-probability-born-rule',
   'Probability and the Born Rule',
   'Probability amplitudes, density matrices, mixed states, and the measurement statistics formalism.',
   'math', 6, 16,
   '{a5-tensor-products, c4-multi-qubit}',
   35, false, 1),

  ('c5-universal-gates',
   'Universal Gate Sets',
   'Universality, the Solovay-Kitaev theorem (intuition), Toffoli and Fredkin gates, and circuit complexity.',
   'computing', 5, 17,
   '{a6-probability-born-rule}',
   30, false, 1),

  ('c6-deutsch-jozsa',
   'The Deutsch-Jozsa Algorithm',
   'The first quantum speedup: problem definition, oracle construction, and the quantum algorithm.',
   'computing', 6, 18,
   '{c5-universal-gates}',
   30, false, 1),

  ('c7-teleportation',
   'Quantum Teleportation',
   'The teleportation protocol, classical communication requirement, and no-cloning theorem.',
   'computing', 7, 19,
   '{c6-deutsch-jozsa}',
   30, false, 1),

  ('p7-decoherence',
   'Decoherence and Noise',
   'Open quantum systems, decoherence mechanisms, noise models, and the threshold theorem.',
   'physics', 7, 20,
   '{c7-teleportation}',
   35, false, 1),

  ('c8-grover',
   'Grover''s Search Algorithm',
   'Unstructured search, oracle construction, amplitude amplification, and optimality.',
   'computing', 8, 21,
   '{p7-decoherence}',
   40, false, 2),

  ('c9-qft',
   'Quantum Fourier Transform',
   'Classical DFT review, the QFT circuit, phase kickback, and applications.',
   'computing', 9, 22,
   '{c8-grover}',
   40, false, 2),

  ('c10-shor',
   'Shor''s Factoring Algorithm',
   'Period finding, quantum phase estimation, continued fractions, and RSA implications.',
   'computing', 10, 23,
   '{c9-qft}',
   50, false, 3);
```

### 2.4 Access Control Strategy

Since the database runs on Railway (not Supabase's hosted DB), we do not use Supabase RLS. Instead, access control is enforced at the **application layer**:

1. **API route handlers** extract the authenticated user from the Supabase Auth session (via `getSession()` in Server Components or the auth middleware).
2. Every database query that touches user-specific data includes a `WHERE user_id = $1` clause, parameterized with the authenticated user's ID.
3. A thin data-access layer (`/lib/db/`) encapsulates all queries and enforces this pattern:

```typescript
// lib/db/progress.ts
import { db } from './client'

export async function getUserProgress(userId: string) {
  return db.query(
    `SELECT up.*, lm.title, lm.track, lm.canonical_order
     FROM user_progress up
     JOIN lesson_metadata lm ON up.lesson_slug = lm.slug
     WHERE up.user_id = $1
     ORDER BY lm.canonical_order`,
    [userId]
  )
}

export async function upsertProgress(
  userId: string,
  lessonSlug: string,
  status: ProgressStatus,
  timeSpentDelta: number
) {
  return db.query(
    `INSERT INTO user_progress (user_id, lesson_slug, status, time_spent_sec, last_accessed)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (user_id, lesson_slug) DO UPDATE SET
       status = EXCLUDED.status,
       time_spent_sec = user_progress.time_spent_sec + $4,
       last_accessed = now(),
       completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN now() ELSE user_progress.completed_at END`,
    [userId, lessonSlug, status, timeSpentDelta]
  )
}
```

4. **Admin queries** (e.g., analytics aggregations) run in a separate context with a different DB role, never exposed through user-facing API routes.

### 2.5 Database Client

We use `@neondatabase/serverless` (which is Postgres-wire-compatible and works with any PostgreSQL, not just Neon) or, more straightforwardly, **`pg`** (node-postgres) with a connection pool:

```typescript
// lib/db/client.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  getClient: () => pool.connect(),
}
```

### 2.6 TypeScript Interfaces for DB Rows

```typescript
// lib/db/types.ts

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
```

---

## 3. Auth Flow

### 3.1 Technology: Supabase Auth (Hosted)

We use Supabase's **hosted Auth service** (not self-hosted). This gives us a battle-tested auth backend without running our own auth server on Railway. The Supabase project is used exclusively for Auth -- the database is on Railway.

### 3.2 Auth Methods

| Method           | Provider      | Details                                          |
| ---------------- | ------------- | ------------------------------------------------ |
| Email + password | Supabase Auth | Standard email/password with email verification. |
| Google OAuth     | Supabase Auth | "Sign in with Google" via Supabase's OAuth flow. |
| GitHub OAuth     | Supabase Auth | "Sign in with GitHub" via Supabase's OAuth flow. |

### 3.3 Detailed Flows

#### Sign Up

1. User fills out the sign-up form (email, password, optional display name).
2. Client calls `supabase.auth.signUp({ email, password })`.
3. Supabase Auth creates the user and sends a verification email.
4. User is redirected to `/verify-email` with a message to check their inbox.
5. User clicks the verification link, which hits `/api/auth/callback` with the token.
6. The callback handler calls `supabase.auth.verifyOtp()` to confirm the email.
7. On success, the handler:
   a. Creates a row in our `users` table with the Supabase Auth UUID.
   b. Creates a default `user_settings` row.
   c. Redirects to `/dashboard`.

#### Sign In

1. User enters email and password on `/sign-in`.
2. Client calls `supabase.auth.signInWithPassword({ email, password })`.
3. On success, Supabase sets an HTTP-only cookie with the session JWT.
4. Client redirects to the `redirect` query parameter (if present) or `/dashboard`.

#### OAuth Sign In

1. User clicks "Sign in with Google" or "Sign in with GitHub".
2. Client calls `supabase.auth.signInWithOAuth({ provider: 'google' })`.
3. User is redirected to the OAuth provider's consent screen.
4. On approval, the provider redirects back to `/api/auth/callback`.
5. The callback exchanges the code for a session and creates/updates the `users` row.
6. Redirect to `/dashboard`.

#### Password Reset

1. User requests a reset on `/reset-password` by entering their email.
2. Client calls `supabase.auth.resetPasswordForEmail(email)`.
3. Supabase sends a password reset email with a link to `/reset-password/confirm?token=...`.
4. User enters a new password, client calls `supabase.auth.updateUser({ password })`.
5. Redirect to `/sign-in` with a success message.

### 3.4 Session Management

Supabase Auth uses **JWTs** stored in **HTTP-only cookies** (set by `@supabase/auth-helpers-nextjs`). The cookie contains:

- **Access token** (JWT, 1-hour expiry): Contains the user's UUID, email, and role. Used for every authenticated request.
- **Refresh token** (opaque, 7-day expiry): Stored in a separate HTTP-only cookie. Used to obtain new access tokens.

Token refresh is handled automatically by `@supabase/auth-helpers-nextjs` middleware. The middleware checks the access token expiry on every request and refreshes it transparently if needed.

### 3.5 Accessing Auth State

#### In Server Components

```typescript
// In any Server Component or Route Handler
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/sign-in')
  }

  const user = session.user
  // ... fetch user data from our DB using user.id as auth_id
}
```

#### In Client Components

```typescript
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export function UserAvatar() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // ...
}
```

### 3.6 Paywall Enforcement

#### Pricing Model Recommendation: Lifetime Access (One-Time Payment)

**Recommendation:** A single one-time payment of ~$49 USD for lifetime access to all content.

**Justification:**

- The curriculum is finite (23 lessons). Unlike a continuously updated SaaS tool, users expect to "finish" the course. A subscription model creates pressure to rush through content or cancel -- bad for learning.
- One-time payment eliminates churn management complexity (failed payments, dunning, win-back emails).
- Lower cognitive burden for the buyer: "pay once, learn forever" is simpler than monthly billing.
- For the business: higher conversion rate on a one-time payment vs. a recurring subscription for educational content. Users are more willing to pay $49 once than $9/month.
- Stripe Checkout handles one-time payments cleanly. No subscription lifecycle to manage.
- If recurring revenue is needed later, add an "advanced topics" expansion pack or cohort-based live sessions as a separate subscription.

#### Stripe Integration

**Checkout Flow:**

1. User clicks "Unlock All Lessons" (on `/pricing` or a paywall CTA).
2. If not authenticated, redirect to `/sign-in?redirect=/pricing`.
3. Client POSTs to `/api/stripe/create-checkout`.
4. Server creates a Stripe Checkout Session:

```typescript
// app/api/stripe/create-checkout/route.ts
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserByAuthId, getActiveSubscription } from '@/lib/db/users'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getUserByAuthId(session.user.id)
  const existing = await getActiveSubscription(user.id)

  if (existing) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment', // One-time payment, not 'subscription'
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!, // Pre-created Price in Stripe
        quantity: 1,
      },
    ],
    customer_email: session.user.email,
    metadata: {
      user_id: user.id,
      auth_id: session.user.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=canceled`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

5. Client redirects to the Stripe Checkout URL.
6. On successful payment, Stripe sends a `checkout.session.completed` webhook.

**Webhook Handler:**

```typescript
// app/api/stripe/webhook/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSubscription } from '@/lib/db/subscriptions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (!userId) break

      await createSubscription({
        userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: null, // One-time payment, no subscription ID
        stripePriceId: process.env.STRIPE_PRICE_ID!,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: null, // Lifetime: never expires
      })
      break
    }
    // Handle refunds
    case 'charge.refunded': {
      // Mark subscription as canceled
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

**Paywall Page Rendering:**

When an unauthenticated or unpaid user accesses a paid lesson, the page component renders a **preview** rather than redirecting:

```typescript
// app/lessons/[slug]/page.tsx (simplified)
import { getLesson, getLessonPreview } from '@/lib/lessons'
import { getUserPaymentStatus } from '@/lib/auth'
import { PaywallCTA } from '@/components/PaywallCTA'

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await getLesson(params.slug)

  if (!lesson) notFound()

  // Free lessons are always fully rendered
  if (lesson.metadata.isFree) {
    return <LessonContent lesson={lesson} />
  }

  const { isAuthenticated, hasPaid } = await getUserPaymentStatus()

  if (hasPaid) {
    return <LessonContent lesson={lesson} />
  }

  // Show preview for non-paying users
  const preview = await getLessonPreview(params.slug)
  return (
    <div>
      <LessonHeader lesson={lesson.metadata} />
      <LessonObjectives objectives={lesson.metadata.objectives} />
      <div className="prose max-w-none">
        {/* First ~300 words of content */}
        <preview.PreviewContent />
      </div>
      <PaywallCTA isAuthenticated={isAuthenticated} />
    </div>
  )
}
```

The `PaywallCTA` component renders differently based on auth state:

- **Not authenticated:** "Sign up free to preview, or unlock all lessons for $49." with Sign Up and Purchase buttons.
- **Authenticated but unpaid:** "Unlock all 23 lessons for $49. One-time payment, lifetime access." with a Purchase button.

#### Payment State in the Session

Payment status is **not** stored in the JWT (to avoid stale tokens after payment). Instead, it is checked at query time:

```typescript
// lib/auth.ts
export async function getUserPaymentStatus(): Promise<{
  isAuthenticated: boolean
  hasPaid: boolean
  user: User | null
}> {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { isAuthenticated: false, hasPaid: false, user: null }
  }

  const user = await getUserByAuthId(session.user.id)
  if (!user) {
    return { isAuthenticated: true, hasPaid: false, user: null }
  }

  const subscription = await getActiveSubscription(user.id)
  return {
    isAuthenticated: true,
    hasPaid: subscription?.status === 'active',
    user,
  }
}
```

This query is fast (indexed lookup on `user_id` with partial index on `status = 'active'`) and is cached per-request via React's `cache()` function to avoid redundant DB hits within a single render.

---

## 4. Railway Deployment Topology

### 4.1 Project Structure

A single Railway **project** with the following **services**:

```
Railway Project: "quantum-learn"
  |
  +-- Service: "web" (Next.js application)
  |     Source: GitHub repo, main branch
  |     Builder: Nixpacks (auto-detects Node.js)
  |
  +-- Service: "postgres" (Railway PostgreSQL plugin)
  |     Auto-provisioned, linked to "web"
  |
  +-- Service: "pgbouncer" (Railway PgBouncer plugin)
        Linked to "postgres", connection pool for "web"
```

No separate worker services are needed for MVP. Background tasks (Stripe webhook processing, progress saves) are handled within the Next.js API routes, which are fast enough for the expected load. If a background job queue becomes necessary (e.g., for email sending, analytics aggregation), add a separate Railway service running a BullMQ worker with a Redis plugin.

### 4.2 Next.js Service Configuration

**Build command:**

```bash
npm run db:migrate && npm run build
```

This runs database migrations before building. Migrations are idempotent (the migration runner tracks applied migrations in a `pgmigrations` table).

**Start command:**

```bash
npm start
```

Which is defined in `package.json` as `next start -p $PORT`. Railway injects the `PORT` environment variable.

**Port:** Railway dynamically assigns a port via the `PORT` environment variable. Next.js is configured to listen on it:

```json
{
  "scripts": {
    "start": "next start -p ${PORT:-3000}"
  }
}
```

**Healthcheck:**

```typescript
// app/api/health/route.ts
import { db } from '@/lib/db/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await db.query('SELECT 1')
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    )
  }
}
```

Configure Railway healthcheck: **Path:** `/api/health`, **Interval:** 30s, **Timeout:** 10s.

**Instance sizing recommendation:**

- **Starter/MVP:** 1 vCPU, 1 GB RAM. Sufficient for up to ~1000 concurrent users. Railway charges by usage (~$5/GB RAM/month).
- **Growth:** 2 vCPU, 2 GB RAM. Enable Railway's horizontal scaling (multiple instances) when response latency exceeds 200ms p95.

### 4.3 PostgreSQL Configuration

**Railway PostgreSQL plugin** (not an external service):

- Provisioned with one click in the Railway dashboard.
- Automatic `DATABASE_URL` injection into linked services via Railway's variable references: `${{postgres.DATABASE_URL}}`.
- Automated daily backups with 7-day retention (Railway's default).
- No egress charges for communication between the web service and DB (same Railway private network).

**PgBouncer:**

- Railway offers a PgBouncer plugin that fronts the PostgreSQL instance.
- Configuration: `pool_mode=transaction`, `default_pool_size=25`.
- The web service connects to PgBouncer's URL instead of the raw PostgreSQL URL.
- Environment variable: `DATABASE_URL` points to PgBouncer, `DATABASE_URL_DIRECT` points to raw PostgreSQL (used for migrations, which need direct connections for DDL).

**Backup strategy:**

- Railway's built-in daily automated backups (7-day retention).
- Weekly manual backup via `pg_dump` run as a Railway cron job, stored in an S3-compatible bucket (e.g., Railway volume or external S3).
- For disaster recovery: restore from Railway backup UI or from the manual dump.

### 4.4 Cron Jobs

Railway supports cron jobs as a service attribute. Configure the following:

| Cron              | Schedule                        | Endpoint                            | Description                                                                |
| ----------------- | ------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| Subscription sync | `0 4 * * *` (daily at 4 AM UTC) | `POST /api/cron/sync-subscriptions` | Reconcile subscription statuses with Stripe. Catches any webhook failures. |

The cron endpoint is protected by a shared secret:

```typescript
// app/api/cron/sync-subscriptions/route.ts
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... sync logic: list all active subscriptions, check Stripe status
}
```

Railway cron jobs are configured to include the `Authorization: Bearer <CRON_SECRET>` header.

### 4.5 Custom Domain

1. In Railway dashboard: **Settings > Domains > Custom Domain**.
2. Enter the domain (e.g., `quantumlearn.dev`).
3. Railway provides a CNAME target (e.g., `web-production-xxxx.up.railway.app`).
4. Add a CNAME record in your DNS provider pointing to this target.
5. SSL/TLS is automatically provisioned via Let's Encrypt. No manual certificate management.

### 4.6 Migration on Deploy

Migrations run as part of the build step (before `next build`). This ensures the database schema is up-to-date before the new application version starts serving traffic.

```bash
# Build command in Railway
npm run db:migrate && npm run build
```

The migration runner uses `DATABASE_URL_DIRECT` (bypassing PgBouncer) because DDL statements require direct connections:

```json
{
  "scripts": {
    "db:migrate": "DATABASE_URL=$DATABASE_URL_DIRECT node-pg-migrate up --migrations-dir db/migrations"
  }
}
```

**Rollback strategy:** If a migration fails, the build fails, and Railway does not deploy the new version. The previous version continues running. Fix the migration and push again.

### 4.7 Complete Environment Variables

#### Web Service

| Variable                             | Source                    | Example                    | Description                                              |
| ------------------------------------ | ------------------------- | -------------------------- | -------------------------------------------------------- |
| `PORT`                               | Railway (auto)            | `3000`                     | Port for Next.js to listen on.                           |
| `DATABASE_URL`                       | Railway (auto, PgBouncer) | `postgresql://...`         | PgBouncer connection string.                             |
| `DATABASE_URL_DIRECT`                | Railway (auto, Postgres)  | `postgresql://...`         | Direct Postgres connection (for migrations).             |
| `NEXT_PUBLIC_APP_URL`                | Manual                    | `https://quantumlearn.dev` | Public URL of the app. Used in emails, Stripe redirects. |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase dashboard        | `https://xxx.supabase.co`  | Supabase project URL.                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase dashboard        | `eyJ...`                   | Supabase public anon key. Safe to expose to client.      |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase dashboard        | `eyJ...`                   | Supabase service role key. Server-side only.             |
| `STRIPE_SECRET_KEY`                  | Stripe dashboard          | `sk_live_...`              | Stripe secret key. Server-side only.                     |
| `STRIPE_PUBLISHABLE_KEY`             | Stripe dashboard          | `pk_live_...`              | Stripe publishable key. Can be exposed to client.        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard          | `pk_live_...`              | Alias for client-side access.                            |
| `STRIPE_WEBHOOK_SECRET`              | Stripe dashboard          | `whsec_...`                | Stripe webhook endpoint secret.                          |
| `STRIPE_PRICE_ID`                    | Stripe dashboard          | `price_...`                | Price ID for the lifetime access product.                |
| `CRON_SECRET`                        | Manual (generate)         | `cron_abc123...`           | Shared secret for cron job authentication.               |
| `NODE_ENV`                           | Railway (auto)            | `production`               | Node environment.                                        |

### 4.8 Scaling Considerations

- **Vertical scaling:** Increase RAM/CPU in Railway service settings. Suitable up to ~5000 concurrent users.
- **Horizontal scaling:** Railway supports multiple instances with automatic load balancing. Enable when single-instance performance is insufficient. Requires stateless application design (already the case: no in-memory sessions, auth via cookies/JWTs, DB for state).
- **Database scaling:** Railway PostgreSQL supports vertical scaling (increase RAM/storage). For read-heavy workloads, consider adding a read replica (Railway supports this). For the expected scale of a learning platform, a single PostgreSQL instance is sufficient for years.
- **CDN/Static assets:** Railway does not include a CDN. For static assets (images, fonts), use a CDN (e.g., Cloudflare in front of the domain, or serve static assets from an S3 bucket behind CloudFront). Next.js's built-in image optimization runs on the Railway instance.

---

## 5. CI/CD via GitHub Actions

### 5.1 Workflow Strategy

- **Trigger on push to `main`:** Full build + deploy to production.
- **Trigger on PR to `main`:** Full build + tests (no deploy). Railway's GitHub integration creates PR preview environments automatically.
- **Branch protection:** `main` requires passing CI checks and at least 1 approval.

### 5.2 Railway GitHub Integration

Railway's native GitHub integration is used for deploys (not the Railway CLI in GitHub Actions). The integration:

1. Watches the `main` branch of the connected GitHub repo.
2. On push to `main`, Railway triggers a build and deploy automatically.
3. On PR open/update, Railway creates a **preview environment** (isolated service with its own URL and database).

This means the GitHub Actions workflow handles **quality gates** (lint, typecheck, test, build verification), and Railway handles **deployment**. There is no need to invoke the Railway CLI from GitHub Actions.

### 5.3 PR Preview Environments

Railway's PR preview environments are configured in the Railway dashboard:

1. **Settings > Environments > Enable PR Environments.**
2. Each PR gets an isolated environment with its own service instances.
3. The preview environment uses a separate PostgreSQL instance (seeded with migrations on first deploy).
4. Preview URL is posted as a comment on the PR by Railway's GitHub bot.
5. Preview environments are torn down when the PR is closed or merged.

### 5.4 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript type checking
        run: npx tsc --noEmit

      - name: ESLint
        run: npx eslint . --max-warnings 0

      - name: Prettier check
        run: npx prettier --check .

  test:
    name: Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npx vitest run --coverage

      - name: Upload coverage
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [quality, test]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npx next build
        env:
          # Provide dummy env vars for build-time validation.
          # Real values are set in Railway.
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder
          NEXT_PUBLIC_APP_URL: https://placeholder.com
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_placeholder

      - name: Verify build output
        run: |
          test -d .next
          echo "Build completed successfully"
```

### 5.5 Branch Protection Rules

Configure in GitHub repository settings:

- **Require status checks to pass before merging:** Enable for `quality`, `test`, and `build` jobs.
- **Require pull request reviews:** At least 1 approval.
- **Require branches to be up to date:** Ensures PR is rebased on latest `main`.
- **Do not allow bypassing the above settings:** Even for admins.

### 5.6 Caching Strategy

The `actions/setup-node@v4` with `cache: 'npm'` caches `~/.npm` (the npm download cache) across runs. This speeds up `npm ci` significantly.

Next.js build cache (`.next/cache`) is not cached in CI because:

1. Railway builds the app independently (CI build is only for validation).
2. Railway caches build layers via Nixpacks.
3. Caching `.next/cache` in CI would add complexity (upload/download artifact) with minimal benefit since CI builds are validation-only.

---

## 6. MDX Content Pipeline

### 6.1 Technology Choice: `next-mdx-remote`

**Decision:** Use `next-mdx-remote` (the `next-mdx-remote/rsc` variant for Server Components).

**Justification over `@next/mdx`:**

- `@next/mdx` compiles MDX at build time as part of the Webpack/Turbopack pipeline. This requires lesson content to live inside the `app/` directory as `.mdx` pages, which couples content structure to route structure.
- `next-mdx-remote` loads MDX from **any source** (filesystem, CMS, database) and compiles it at render time. This gives us flexibility to:
  - Store lessons in a dedicated `/content/lessons/` directory, separate from application code.
  - Potentially move to a headless CMS later without changing the rendering pipeline.
  - Process multi-part lessons by loading individual MDX files per part.
- `next-mdx-remote/rsc` supports React Server Components natively, enabling streaming and zero client-side JS for lesson content.

### 6.2 File Structure

```
content/
  lessons/
    a1-complex-numbers/
      index.mdx              # Single-part lesson content
      assets/
        complex-plane.svg
        euler-formula.png
    a2-vectors/
      index.mdx
    ...
    p3-schrodinger-equation/
      part-1.mdx             # Multi-part: Part 1 (TDSE)
      part-2.mdx             # Multi-part: Part 2 (TISE)
      assets/
        infinite-well.svg
    ...
    c10-shor/
      part-1.mdx             # Number theory foundations
      part-2.mdx             # QPE subroutine
      part-3.mdx             # Full algorithm
      assets/
        shor-circuit.svg
```

Convention:

- Single-part lessons have `index.mdx`.
- Multi-part lessons have `part-1.mdx`, `part-2.mdx`, etc. No `index.mdx`.
- Lesson-specific assets (images, SVGs) live in `assets/` within the lesson directory.
- Shared assets (diagrams used across lessons) live in `content/shared/`.

### 6.3 Frontmatter Schema

Every MDX file includes YAML frontmatter:

```yaml
---
title: 'Complex Numbers'
subtitle: 'The number system of quantum mechanics'
track: math
trackPosition: 1
canonicalOrder: 1
slug: a1-complex-numbers
part: 1 # For multi-part lessons; omit for single-part
totalParts: 1 # Total parts in this lesson
prerequisites: []
estimatedMinutes: 25
objectives:
  - 'Define the imaginary unit and perform arithmetic with complex numbers'
  - "Represent complex numbers in polar form using Euler's formula"
  - 'Compute modulus, conjugate, and argument'
  - 'Understand why quantum mechanics requires complex numbers'
keywords:
  - complex numbers
  - imaginary unit
  - Euler's formula
  - polar form
---
```

Frontmatter is parsed and validated at build time using `gray-matter` and a Zod schema:

```typescript
// lib/lessons/schema.ts
import { z } from 'zod'

export const lessonFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  track: z.enum(['math', 'physics', 'computing']),
  trackPosition: z.number().int().positive(),
  canonicalOrder: z.number().int().positive(),
  slug: z.string(),
  part: z.number().int().positive().optional(),
  totalParts: z.number().int().positive().default(1),
  prerequisites: z.array(z.string()).default([]),
  estimatedMinutes: z.number().int().positive(),
  objectives: z.array(z.string()),
  keywords: z.array(z.string()).optional(),
})

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>
```

### 6.4 MDX Rendering Pipeline

```typescript
// lib/lessons/render.ts
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from '@/components/mdx'
import { lessonFrontmatterSchema } from './schema'

export async function renderLesson(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
    components: mdxComponents,
  })

  const validatedFrontmatter = lessonFrontmatterSchema.parse(frontmatter)

  return { content, frontmatter: validatedFrontmatter }
}
```

### 6.5 Custom MDX Components

All custom components are registered in a single map:

```typescript
// components/mdx/index.tsx
import { Math, InlineMath } from './Math'
import { Callout } from './Callout'
import { Theorem, Definition, Proof } from './TheoremBlocks'
import { WorkedExample } from './WorkedExample'
import { Problem } from './Problem'
import { SimulatorEmbed } from './SimulatorEmbed'
import { Figure } from './Figure'
import { CodeBlock } from './CodeBlock'
import { LessonNav } from './LessonNav'

export const mdxComponents = {
  // Math (KaTeX)
  Math, // Block math: <Math>E = mc^2</Math>
  InlineMath, // Inline math: <InlineMath>\\psi</InlineMath>
  // Note: remark-math + rehype-katex also handles $...$ and $$...$$ syntax

  // Callouts
  Callout,
  // Usage: <Callout type="info|warning|confusion|foreshadow" title="...">...</Callout>

  // Theorem-style blocks
  Theorem, // <Theorem name="Spectral Theorem">...</Theorem>
  Definition, // <Definition term="Hermitian Matrix">...</Definition>
  Proof, // <Proof>...</Proof> (collapsible)

  // Worked examples
  WorkedExample, // <WorkedExample title="Finding eigenvalues of a 2x2 matrix">...</WorkedExample>

  // Problems with hidden solutions
  Problem,
  // <Problem id="q1" type="multiple-choice" options={["a","b","c","d"]} answer="b">
  //   Question text here.
  //   <Solution>Explanation here.</Solution>
  // </Problem>

  // Simulator embeds
  SimulatorEmbed,
  // <SimulatorEmbed
  //   simulator="bloch-sphere"
  //   initialState={{ theta: 0, phi: 0 }}
  //   height={400}
  //   caption="Drag to rotate the qubit state on the Bloch sphere."
  // />

  // Figures
  Figure,
  // <Figure src="/content/lessons/a1-complex-numbers/assets/complex-plane.svg"
  //         alt="The complex plane" caption="Figure 1: The complex plane with..." />

  // Code blocks (enhanced syntax highlighting for matrix math)
  CodeBlock,
  pre: CodeBlock, // Override default <pre> rendering

  // Navigation
  LessonNav,
}
```

#### Component Specifications

**Math / InlineMath:**

```typescript
// components/mdx/Math.tsx
// Block math is already handled by rehype-katex transforming $$...$$ to KaTeX HTML.
// These components exist for explicit JSX usage and for cases where
// dollar-sign syntax is inconvenient (e.g., content with literal dollar signs).

'use client'

import katex from 'katex'

export function Math({ children }: { children: string }) {
  const html = katex.renderToString(children, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  })
  return <div className="overflow-x-auto py-4" dangerouslySetInnerHTML={{ __html: html }} />
}

export function InlineMath({ children }: { children: string }) {
  const html = katex.renderToString(children, {
    displayMode: false,
    throwOnError: false,
  })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Callout:**

```typescript
// components/mdx/Callout.tsx
type CalloutType = 'info' | 'warning' | 'confusion' | 'foreshadow'

interface CalloutProps {
  type: CalloutType
  title?: string
  children: React.ReactNode
}

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; icon: string; defaultTitle: string }> = {
  info:       { bg: 'bg-blue-50 dark:bg-blue-950',    border: 'border-blue-400', icon: 'info',    defaultTitle: 'Note' },
  warning:    { bg: 'bg-amber-50 dark:bg-amber-950',   border: 'border-amber-400', icon: 'alert',   defaultTitle: 'Warning' },
  confusion:  { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-400', icon: 'help',    defaultTitle: 'Common Confusion' },
  foreshadow: { bg: 'bg-green-50 dark:bg-green-950',   border: 'border-green-400', icon: 'forward', defaultTitle: 'Where This Is Going' },
}

export function Callout({ type, title, children }: CalloutProps) {
  const style = CALLOUT_STYLES[type]
  return (
    <aside className={`${style.bg} ${style.border} border-l-4 rounded-r-lg p-4 my-6`}>
      <p className="font-semibold text-sm mb-1">{title ?? style.defaultTitle}</p>
      <div className="text-sm">{children}</div>
    </aside>
  )
}
```

**Problem:**

```typescript
// components/mdx/Problem.tsx
'use client'

import { useState } from 'react'

interface ProblemProps {
  id: string
  type: 'multiple-choice' | 'numeric' | 'matrix' | 'free-response'
  options?: string[]     // For multiple-choice
  answer: string | number | number[][]  // Correct answer for validation
  tolerance?: number     // For numeric: acceptable error margin
  children: React.ReactNode
}

export function Problem({ id, type, options, answer, tolerance, children }: ProblemProps) {
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const handleSubmit = async () => {
    const correct = validateAnswer(type, userAnswer, answer, tolerance)
    setIsCorrect(correct)
    setSubmitted(true)

    // Record attempt via API (fire and forget)
    fetch('/api/problems/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonSlug: window.location.pathname.split('/')[2],
        problemId: id,
        answer: userAnswer,
        correct,
      }),
    })
  }

  return (
    <div className="my-8 border rounded-lg p-6 bg-slate-50 dark:bg-slate-900">
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
      {/* Input rendering depends on type */}
      {type === 'multiple-choice' && options && (
        <MultipleChoiceInput options={options} value={userAnswer} onChange={setUserAnswer} disabled={submitted && isCorrect} />
      )}
      {/* ... other input types ... */}
      <div className="mt-4 flex gap-3">
        <button onClick={handleSubmit} disabled={submitted && isCorrect} className="btn-primary">
          {submitted ? (isCorrect ? 'Correct!' : 'Try Again') : 'Check Answer'}
        </button>
        <button onClick={() => setShowSolution(s => !s)} className="btn-secondary">
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>
      {submitted && !isCorrect && (
        <p className="mt-2 text-red-600 dark:text-red-400 text-sm">Not quite. Try again or view the solution.</p>
      )}
    </div>
  )
}
```

**SimulatorEmbed:**

```typescript
// components/mdx/SimulatorEmbed.tsx
'use client'

import dynamic from 'next/dynamic'

const SIMULATORS = {
  'qubit':          dynamic(() => import('@/simulators/QubitSimulator')),
  'bloch-sphere':   dynamic(() => import('@/simulators/BlochSphere')),
  'stern-gerlach':  dynamic(() => import('@/simulators/SternGerlach')),
  'circuit-builder':dynamic(() => import('@/simulators/CircuitBuilder')),
  'chsh':           dynamic(() => import('@/simulators/CHSH')),
  'grover-oracle':  dynamic(() => import('@/simulators/GroverOracle')),
  'qft-visualizer': dynamic(() => import('@/simulators/QFTVisualizer')),
} as const

type SimulatorName = keyof typeof SIMULATORS

interface SimulatorEmbedProps {
  simulator: SimulatorName
  initialState?: Record<string, unknown>
  height?: number
  caption?: string
}

export function SimulatorEmbed({ simulator, initialState, height = 400, caption }: SimulatorEmbedProps) {
  const SimComponent = SIMULATORS[simulator]

  return (
    <figure className="my-8">
      <div
        className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900"
        style={{ height }}
      >
        <SimComponent initialState={initialState} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

### 6.6 Table of Contents Generation

A table of contents is generated per-lesson by extracting headings from the MDX AST:

```typescript
// lib/lessons/toc.ts
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import type { Heading, Text } from 'mdast'

export interface TocEntry {
  depth: number // 2 = h2, 3 = h3 (h1 is the lesson title)
  text: string
  slug: string // Generated anchor slug
}

export function extractToc(mdxSource: string): TocEntry[] {
  const entries: TocEntry[] = []
  const tree = remark().parse(mdxSource)

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth >= 2 && node.depth <= 3) {
      const text = node.children
        .filter((c): c is Text => c.type === 'text')
        .map((c) => c.value)
        .join('')
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      entries.push({ depth: node.depth, text, slug })
    }
  })

  return entries
}
```

The TOC is rendered as a sticky sidebar on desktop and a collapsible panel on mobile.

### 6.7 Lesson Navigation

**Canonical order navigation** (previous/next):

```typescript
// lib/lessons/navigation.ts
import { allLessonSlugs } from './data' // Slugs in canonical order

export function getLessonNavigation(currentSlug: string) {
  const index = allLessonSlugs.indexOf(currentSlug)
  return {
    previous: index > 0 ? allLessonSlugs[index - 1] : null,
    next: index < allLessonSlugs.length - 1 ? allLessonSlugs[index + 1] : null,
  }
}
```

**Part navigation** (for multi-part lessons):

```typescript
export function getPartNavigation(slug: string, currentPart: number, totalParts: number) {
  return {
    previousPart: currentPart > 1 ? currentPart - 1 : null,
    nextPart: currentPart < totalParts ? currentPart + 1 : null,
  }
}
```

**Breadcrumbs** show track context:

```
Home > Math Track > A4: Eigenvalues and the Spectral Theorem
Home > Computing Track > C10: Shor's Factoring Algorithm > Part 2
```

### 6.8 KaTeX Configuration

KaTeX CSS is loaded in the root layout:

```typescript
// app/layout.tsx
import 'katex/dist/katex.min.css'
```

Custom macros are defined globally for consistency across lessons:

```typescript
// lib/katex-macros.ts
export const katexMacros = {
  '\\ket': '\\left|#1\\right\\rangle',
  '\\bra': '\\left\\langle#1\\right|',
  '\\braket': '\\left\\langle#1|#2\\right\\rangle',
  '\\inner': '\\left\\langle#1,#2\\right\\rangle',
  '\\norm': '\\left\\|#1\\right\\|',
  '\\abs': '\\left|#1\\right|',
  '\\tr': '\\operatorname{tr}',
  '\\Tr': '\\operatorname{Tr}',
  '\\CNOT': '\\operatorname{CNOT}',
  '\\Prob': '\\operatorname{Pr}',
  '\\E': '\\mathbb{E}',
  '\\C': '\\mathbb{C}',
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\I': '\\mathbb{I}', // Identity operator
  '\\H': '\\mathcal{H}', // Hilbert space
  '\\tensor': '\\otimes',
  '\\dagger': '\\dagger',
}
```

These macros are passed to both `rehype-katex` (for `$$...$$` syntax) and the `Math`/`InlineMath` components.

---

## 7. State Management and Data Flow

### 7.1 Rendering Strategy by Page Type

| Page Type                           | Rendering                                                                                          | Rationale                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Landing, About, FAQ, Privacy, Terms | Static Generation (`generateStaticParams` not needed; just Server Components with no dynamic data) | Pure content, no user-specific data. Build once, serve forever.                                                                  |
| Pricing                             | Static Generation                                                                                  | Content is fixed. Stripe price is hardcoded.                                                                                     |
| Track overview pages                | Static Generation                                                                                  | Lesson metadata is static (from seed data).                                                                                      |
| Curriculum page                     | Static Generation                                                                                  | Lesson list is static.                                                                                                           |
| Curriculum map                      | Client Component                                                                                   | Interactive DAG visualization requires client-side rendering. Lesson data is embedded as a static JSON payload.                  |
| Lesson pages                        | Server Component (dynamic)                                                                         | Must check auth/payment status per request. MDX content is compiled server-side. Lesson HTML is cached aggressively (see below). |
| Dashboard pages                     | Server Component (dynamic)                                                                         | User-specific data fetched from DB per request.                                                                                  |
| Settings                            | Client Component                                                                                   | Interactive forms with optimistic updates.                                                                                       |
| Sandbox simulators                  | Client Component                                                                                   | Entirely client-side interactive tools.                                                                                          |
| Auth pages                          | Client Component                                                                                   | Form interactions, OAuth redirects.                                                                                              |

### 7.2 Lesson Content Loading Strategy

Lesson MDX content is **loaded from the filesystem and compiled on each request**, but with **aggressive caching** to avoid redundant compilation.

```typescript
// lib/lessons/loader.ts
import { cache } from 'react'
import fs from 'fs/promises'
import path from 'path'
import { renderLesson } from './render'
import { extractToc } from './toc'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'lessons')

// React cache() deduplicates within a single request.
// Next.js Data Cache persists across requests (revalidated on deploy).
export const getLesson = cache(async (slug: string, part?: number) => {
  const lessonDir = path.join(CONTENT_DIR, slug)

  let filePath: string
  if (part) {
    filePath = path.join(lessonDir, `part-${part}.mdx`)
  } else {
    filePath = path.join(lessonDir, 'index.mdx')
    // If index.mdx doesn't exist, try part-1.mdx (multi-part lesson accessed without part)
    try {
      await fs.access(filePath)
    } catch {
      filePath = path.join(lessonDir, 'part-1.mdx')
    }
  }

  const source = await fs.readFile(filePath, 'utf-8')
  const { content, frontmatter } = await renderLesson(source)
  const toc = extractToc(source)

  return { content, frontmatter, toc }
})
```

**Caching behavior on Railway:**

- Next.js on Railway runs as a standard Node.js server (not edge).
- The filesystem is persistent within a deploy (lessons are part of the built image).
- React's `cache()` deduplicates within a request. For cross-request caching, we rely on Next.js's built-in full route cache for static portions and `unstable_cache` for data fetching.
- Since lesson content only changes on deploy, the compiled MDX is effectively immutable within a deploy. We use `unstable_cache` with no revalidation (revalidate on redeploy):

```typescript
import { unstable_cache } from 'next/cache'

export const getCachedLesson = unstable_cache(
  async (slug: string, part?: number) => {
    return getLesson(slug, part)
  },
  ['lesson-content'],
  { revalidate: false } // Only revalidate on new deploy
)
```

### 7.3 Simulator State Management

Simulators are entirely client-side. No server persistence for simulator state.

```typescript
// Architecture pattern for simulators:

// Each simulator is a self-contained Client Component with its own React state.
// State is managed via useReducer for complex simulators (e.g., CircuitBuilder)
// or useState for simple ones (e.g., BlochSphere).

// Example: BlochSphere simulator state
interface BlochSphereState {
  theta: number // Polar angle [0, pi]
  phi: number // Azimuthal angle [0, 2*pi]
  showAxes: boolean
  showLabels: boolean
  animating: boolean
  gateHistory: GateOp[] // Stack of applied gates for undo
}

type BlochSphereAction =
  | { type: 'SET_ANGLES'; theta: number; phi: number }
  | { type: 'APPLY_GATE'; gate: 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_LABELS' }
  | { type: 'TOGGLE_AXES' }
```

When a simulator is embedded in a lesson via `<SimulatorEmbed>`, the `initialState` prop sets the starting configuration. The simulator can be reset to this initial state.

### 7.4 User Progress Tracking

Progress is tracked with **optimistic updates** and **background saves**.

**Client-side tracking:**

```typescript
// hooks/useProgressTracker.ts
'use client'

import { useEffect, useRef, useCallback } from 'react'

export function useProgressTracker(lessonSlug: string) {
  const startTime = useRef(Date.now())
  const lastSave = useRef(Date.now())

  // Save progress on an interval (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastSave.current) / 1000)
      if (elapsed >= 30) {
        saveProgress(lessonSlug, 'in_progress', elapsed)
        lastSave.current = Date.now()
      }
    }, 30_000)

    return () => {
      // On unmount (navigating away), save final progress
      const elapsed = Math.floor((Date.now() - lastSave.current) / 1000)
      if (elapsed > 5) {
        // Use sendBeacon for reliable delivery on page unload
        navigator.sendBeacon(
          '/api/progress',
          JSON.stringify({ lessonSlug, status: 'in_progress', timeSpentSeconds: elapsed })
        )
      }
      clearInterval(interval)
    }
  }, [lessonSlug])

  const markCompleted = useCallback(() => {
    const elapsed = Math.floor((Date.now() - lastSave.current) / 1000)
    saveProgress(lessonSlug, 'completed', elapsed)
    lastSave.current = Date.now()
  }, [lessonSlug])

  return { markCompleted }
}

async function saveProgress(lessonSlug: string, status: string, timeSpentSeconds: number) {
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonSlug, status, timeSpentSeconds }),
    })
  } catch {
    // Silently fail. Progress tracking is best-effort.
    // Data will be approximate regardless (user might leave tab open, etc.)
  }
}
```

**Server-side handler:**

```typescript
// app/api/progress/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { upsertProgress, getUserProgress } from '@/lib/db/progress'
import { getUserByAuthId } from '@/lib/db/users'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUserByAuthId(session.user.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const progress = await getUserProgress(user.id)
  return NextResponse.json(progress)
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUserByAuthId(session.user.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { lessonSlug, status, timeSpentSeconds } = body

  await upsertProgress(user.id, lessonSlug, status, timeSpentSeconds ?? 0)
  return NextResponse.json({ success: true })
}
```

### 7.5 Problem Attempt Recording

Problem attempts are recorded **fire-and-forget** from the client. The `Problem` component sends a POST to `/api/problems/attempt` after each submission. The server records it in the `problem_attempts` table.

This data enables:

- **Dashboard analytics:** "You've attempted 45 problems, 38 correct (84%)."
- **Retry UX:** When revisiting a lesson, the problem shows "You previously answered this correctly" or "You've attempted this 3 times -- try again?"
- **Future:** Spaced repetition recommendations.

### 7.6 Data Flow Summary

```
+-------------------+     +-------------------+     +-------------------+
|   Browser/Client  |     |   Next.js Server  |     |   PostgreSQL DB   |
|                   |     |   (Railway)       |     |   (Railway)       |
+-------------------+     +-------------------+     +-------------------+
         |                         |                         |
         |  GET /lessons/a1-...    |                         |
         |------------------------>|                         |
         |                         |  Check auth (cookie)    |
         |                         |  Check payment status   |
         |                         |------------------------>|
         |                         |<------------------------|
         |                         |                         |
         |                         |  Load MDX from disk     |
         |                         |  Compile with KaTeX     |
         |                         |  Render Server Component|
         |                         |                         |
         |  HTML + hydration data  |                         |
         |<------------------------|                         |
         |                         |                         |
         |  (Client Components     |                         |
         |   hydrate: simulators,  |                         |
         |   problems, progress    |                         |
         |   tracker)              |                         |
         |                         |                         |
         |  POST /api/progress     |                         |
         |  (every 30s, beacon     |                         |
         |   on unload)            |                         |
         |------------------------>|                         |
         |                         |  UPSERT user_progress   |
         |                         |------------------------>|
         |                         |<------------------------|
         |  { success: true }      |                         |
         |<------------------------|                         |
         |                         |                         |
         |  POST /api/problems/    |                         |
         |  attempt                |                         |
         |  (on answer submit)     |                         |
         |------------------------>|                         |
         |                         |  INSERT problem_attempt |
         |                         |------------------------>|
         |                         |<------------------------|
         |  { success: true }      |                         |
         |<------------------------|                         |
```

### 7.7 Caching Strategy Summary

| Content Type                        | Cache Layer                                    | TTL                       | Invalidation                   |
| ----------------------------------- | ---------------------------------------------- | ------------------------- | ------------------------------ |
| Static pages (landing, about, etc.) | Next.js Full Route Cache (build-time)          | Infinite (until redeploy) | Redeploy                       |
| Lesson MDX content                  | `unstable_cache` + filesystem read             | Infinite (until redeploy) | Redeploy                       |
| Lesson metadata (DB)                | React `cache()` per-request + `unstable_cache` | 1 hour                    | Redeploy / manual revalidation |
| User progress                       | No cache (always fresh from DB)                | --                        | --                             |
| Subscription status                 | React `cache()` per-request (dedup)            | Per-request only          | Stripe webhook updates DB      |
| Simulator state                     | Client React state (ephemeral)                 | --                        | --                             |

### 7.8 Error Handling Strategy

- **Lesson not found:** `notFound()` returns a 404 page with a suggestion to check the curriculum.
- **Auth errors:** Redirect to `/sign-in` with the original URL as `redirect` param.
- **Payment required:** Render the paywall preview (not a redirect or error page).
- **API errors:** Return appropriate HTTP status codes with JSON error bodies. Client-side: toast notifications for non-critical errors, error boundaries for critical failures.
- **Simulator errors:** React error boundaries catch rendering errors in simulators and show a "simulator failed to load" fallback with a reload button.
- **Database connection errors:** The `/api/health` endpoint returns 503, triggering Railway's healthcheck failure handling (restart). Application-level retries with exponential backoff for transient DB errors.

---

## Appendix A: Project Directory Structure

```
quantum/
  app/                          # Next.js App Router pages
    layout.tsx
    page.tsx
    globals.css
    ... (see Section 1.3 for full structure)
  components/
    mdx/                        # MDX custom components
      Math.tsx
      Callout.tsx
      TheoremBlocks.tsx
      WorkedExample.tsx
      Problem.tsx
      SimulatorEmbed.tsx
      Figure.tsx
      CodeBlock.tsx
      LessonNav.tsx
      index.tsx                 # Component map export
    ui/                         # Shared UI components
      Button.tsx
      Card.tsx
      Badge.tsx
      Navbar.tsx
      Footer.tsx
      Sidebar.tsx
      PaywallCTA.tsx
      ProgressBar.tsx
      ...
    simulators/                 # Standalone simulator components
      QubitSimulator.tsx
      BlochSphere.tsx
      SternGerlach.tsx
      CircuitBuilder.tsx
      CHSH.tsx
      GroverOracle.tsx
      QFTVisualizer.tsx
  content/
    lessons/                    # MDX lesson files (see Section 6.2)
      a1-complex-numbers/
        index.mdx
        assets/
      ...
    shared/                     # Shared content assets
      diagrams/
  db/
    migrations/
      001_initial_schema.sql
      002_seed_lesson_metadata.sql
    seed/
      lesson_metadata.sql
  hooks/                        # Custom React hooks
    useProgressTracker.ts
    useAuth.ts
    useSubscription.ts
    useLocalStorage.ts
  lib/
    db/
      client.ts                 # Database connection pool
      types.ts                  # TypeScript interfaces
      users.ts                  # User queries
      subscriptions.ts          # Subscription queries
      progress.ts               # Progress queries
      problems.ts               # Problem attempt queries
      bookmarks.ts              # Bookmark queries
      settings.ts               # Settings queries
    lessons/
      schema.ts                 # Frontmatter Zod schema
      render.ts                 # MDX compilation
      loader.ts                 # Lesson loading with cache
      toc.ts                    # Table of contents extraction
      navigation.ts             # Prev/next navigation
      data.ts                   # Static lesson data (slugs, order)
    auth.ts                     # Auth helper functions
    stripe.ts                   # Stripe client initialization
    katex-macros.ts             # KaTeX macro definitions
  public/
    fonts/
    images/
  middleware.ts                 # Route protection middleware
  next.config.mjs              # Next.js configuration
  tailwind.config.ts
  tsconfig.json
  package.json
  .github/
    workflows/
      ci.yml                   # CI/CD workflow
  .env.local                   # Local development env vars (git-ignored)
  .env.example                 # Template for env vars
```

## Appendix B: Next.js Configuration

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Output standalone for optimal Railway deployment
  output: 'standalone',

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // For user avatars from OAuth
      },
    ],
  },

  // Webpack configuration for KaTeX fonts
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2?$/,
      type: 'asset/resource',
    })
    return config
  },

  // Experimental features
  experimental: {
    // Enable server actions for form handling
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

## Appendix C: Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "@supabase/supabase-js": "^2.43",
    "@supabase/auth-helpers-nextjs": "^0.10",
    "next-mdx-remote": "^5.0",
    "katex": "^0.16",
    "stripe": "^15.0",
    "pg": "^8.12",
    "zod": "^3.23",
    "gray-matter": "^4.0",
    "remark-math": "^6.0",
    "rehype-katex": "^7.0",
    "remark-gfm": "^4.0",
    "rehype-slug": "^6.0",
    "rehype-autolink-headings": "^7.0",
    "tailwindcss": "^3.4",
    "class-variance-authority": "^0.7",
    "clsx": "^2.1",
    "tailwind-merge": "^2.3",
    "lucide-react": "^0.378"
  },
  "devDependencies": {
    "typescript": "^5.4",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/pg": "^8",
    "eslint": "^8",
    "eslint-config-next": "^14.2",
    "prettier": "^3.2",
    "vitest": "^1.6",
    "@vitejs/plugin-react": "^4.3",
    "node-pg-migrate": "^7.0"
  }
}
```

## Appendix D: Local Development Setup

```bash
# 1. Clone the repo
git clone git@github.com:your-org/quantum-learn.git
cd quantum-learn

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase, Stripe, and local DB credentials

# 4. Start local PostgreSQL (via Docker)
docker run -d --name quantum-pg \
  -e POSTGRES_DB=quantum \
  -e POSTGRES_USER=quantum \
  -e POSTGRES_PASSWORD=quantum \
  -p 5432:5432 \
  postgres:16

# 5. Run migrations
npm run db:migrate

# 6. Start the dev server
npm run dev
# App available at http://localhost:3000
```

`.env.example`:

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://quantum:quantum@localhost:5432/quantum
DATABASE_URL_DIRECT=postgresql://quantum:quantum@localhost:5432/quantum

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Cron
CRON_SECRET=your-random-secret
```
