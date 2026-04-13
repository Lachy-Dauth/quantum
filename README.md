# Quantum from First Principles

A quantum computing and physics learning website. Three interleaved tracks -- Mathematics, Physics, and Computing -- teaching from 2x2 matrices to Shor's algorithm and Bell inequalities. 23 lessons total.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Content:** MDX via `next-mdx-remote/rsc`, KaTeX for math rendering
- **Auth:** Supabase Auth (email/password + Google/GitHub OAuth)
- **Database:** PostgreSQL on Railway, Supabase hosted DB for auth
- **Payments:** Stripe one-time payment ($49 lifetime access)
- **Hosting:** Railway
- **CI/CD:** GitHub Actions
- **Migrations:** node-pg-migrate (SQL-first)
- **Simulators:** Pure TypeScript -- qubit circuit, Stern-Gerlach, CHSH inequality, 1D Schrodinger

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL (for local development, or use a cloud instance)

### Installation

```bash
git clone https://github.com/lachy-dauth/quantum.git
cd quantum
npm install
```

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable                             | Description                                   |
| ------------------------------------ | --------------------------------------------- |
| `DATABASE_URL`                       | PostgreSQL connection string (pooled)         |
| `DATABASE_URL_DIRECT`                | Direct PostgreSQL connection (for migrations) |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anonymous key                        |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase service role key                     |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                             |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                        |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook secret                         |
| `STRIPE_PRICE_ID`                    | Stripe price ID for lifetime access           |

### Database Setup

Run migrations against your PostgreSQL instance:

```bash
npm run db:migrate
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script                      | Description               |
| --------------------------- | ------------------------- |
| `npm run dev`               | Start development server  |
| `npm run build`             | Production build          |
| `npm start`                 | Start production server   |
| `npm run lint`              | Run ESLint                |
| `npm run type-check`        | TypeScript type checking  |
| `npm run format`            | Format code with Prettier |
| `npm run format:check`      | Check formatting          |
| `npm test`                  | Run tests with Vitest     |
| `npm run test:coverage`     | Run tests with coverage   |
| `npm run db:migrate`        | Run database migrations   |
| `npm run db:migrate:create` | Create a new migration    |

## Project Structure

```
app/                    # Next.js App Router pages and layouts
components/
  mdx/                  # MDX custom components (Math, Callout, etc.)
  ui/                   # Shared UI components (Button, Card, Navbar, etc.)
  providers/            # React context providers (ThemeProvider)
content/
  lessons/              # MDX lesson files organized by slug
db/
  migrations/           # SQL migration files
lib/
  db/                   # Database client, types, and queries
  lessons/              # Lesson loading, rendering, TOC, navigation
  tracks.ts             # Track metadata and color mappings
  utils.ts              # Shared utilities (cn)
  auth.ts               # Auth helpers (stub)
  stripe.ts             # Stripe client (stub)
  katex-macros.ts       # KaTeX macro definitions
specs/                  # Project specifications and design docs
```

## Curriculum

23 lessons across three interleaved tracks:

**Track A -- Mathematics (6 lessons):** Complex numbers, vectors, matrices, eigenvalues, tensor products, probability/Born rule.

**Track P -- Physics (7 lessons):** Classical physics failures, postulates, Schrodinger equation, spin/Pauli, uncertainty, Bell/CHSH, decoherence.

**Track C -- Computing (10 lessons):** Qubits, measurement, gates, multi-qubit systems, universal gates, Deutsch-Jozsa, teleportation, Grover, QFT, Shor.

**Canonical order:** A1 -> A2 -> A3 -> P1 -> P2 -> C1 -> C2 -> A4 -> P3 -> P4 -> C3 -> A5 -> P5 -> P6 -> C4 -> A6 -> C5 -> C6 -> C7 -> P7 -> C8 -> C9 -> C10

The first 3 lessons (A1, A2, A3) are free. All others require a one-time $49 payment.

## Content Principles

- Derive everything from first principles
- Build intuition from multiple angles before formal notation
- Lessons are long (8,000-25,000 words) with heavy use of visualizations and interactive elements
- Every lesson includes: motivation, derivation, worked examples, interactive simulator, problem set with solutions

## License

All rights reserved.
