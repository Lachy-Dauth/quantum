# Quantum from First Principles

A quantum computing and physics learning website. Three interleaved tracks — Math (A), Physics (P), Computing (C) — teaching from 2x2 matrices to Shor's algorithm and Bell inequalities. 23 lessons total.

## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Content:** MDX via `next-mdx-remote/rsc`, KaTeX for math
- **Auth:** Supabase Auth (hosted) — email/password + Google/GitHub OAuth
- **Database:** PostgreSQL on Railway (application data), Supabase hosted DB (auth data)
- **Payments:** Stripe one-time payment ($49 lifetime access). First 3 lessons free (A1, A2, A3).
- **Hosting:** Railway (everything — Next.js app, Postgres, PgBouncer, cron)
- **CI/CD:** GitHub Actions → Railway
- **Migrations:** node-pg-migrate (SQL-first)
- **Simulators:** Pure TypeScript (no WASM). Four components sharing a linear algebra core:
  1. Qubit circuit simulator (up to 6 qubits)
  2. Stern-Gerlach simulator
  3. CHSH inequality simulator
  4. 1D Schrodinger simulator (Crank-Nicolson)

## Project Structure

```
specs/
  lessons-track-a-math/             # One file per lesson
    a1.md  a2.md  a3.md  a4.md  a5.md  a6.md
  lessons-track-p-physics/
    p1.md  p2.md  p3.md  p4.md  p5.md  p6.md  p7.md
  lessons-track-c-computing/
    c1.md  c2.md  c3.md  c4.md  c5.md
    c6.md  c7.md  c8.md  c9.md  c10.md
  simulator-spec.md                 # Simulator technical spec with TS interfaces
  site-architecture.md              # Routes, DB schema, auth, deployment, MDX pipeline
  dependency-graph-and-gantt.md     # Build order, progress tracker, and timeline
```

## Curriculum (Canonical Order)

A1 → A2 → A3 → P1 → P2 → C1 → C2 → A4 → P3 → P4 → C3 → A5 → P5 → P6 → C4 → A6 → C5 → C6 → C7 → P7 → C8 → C9 → C10

## Content Principles

- Derive everything from first principles. No "it can be shown that."
- Build intuition from multiple angles BEFORE formal notation.
- Lessons are long (8,000-25,000 words). This is intentional, it should never feel like a textbook as it should lean heavier on visualisations, examples, and interactive elements. 
- Tone: rigorous-but-warm. Respect the reader's intelligence.
- Every lesson has: motivation, derivation, worked examples, interactive simulator, problem set with solutions.
- Common confusions callout boxes dismantle specific wrong mental models.

## Key Conventions

- Dirac notation: |ψ⟩ for kets, ⟨ψ| for bras, ⟨φ|ψ⟩ for inner product
- Physics convention for inner product: conjugate-linear in first slot
- |0⟩ = spin-up = north pole of Bloch sphere, |1⟩ = spin-down = south pole
- Global phase is unphysical; parametrise qubit as cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩
- ℏ = 1 in most computing contexts; explicit in physics contexts

## Workflow

When you complete a task (infrastructure, simulator component, lesson spec/prose/visuals, or any node from the dependency graph), update its status to `done` in the progress tracker at the top of `specs/dependency-graph-and-gantt.md`. If you're starting a task, mark it `in-progress`. This is the single source of truth for project progress.

## Out of Scope (MVP)

Forums, certificates, mobile app, video, LLM tutor, real hardware backends, spaced repetition, relativistic QM, QFT, second quantisation.
