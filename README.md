# WhereTo

_Less debating. More doing._

WhereTo helps a group turn "where should we go?" into a confirmed venue, date,
and time — fast. Create a plan, share one link, and everyone privately adds
their starting location, budget, and preferences. WhereTo calculates a fair
meeting zone (not just the geographic midpoint), scores candidate venues, and
hands the group three distinct, explained recommendations to vote on.

See `PRD.MD` / `TRD.MD` for the full product spec this implements.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** — dark, neon, game-lobby visual style
- **Prisma 7** + SQLite (via the `better-sqlite3` driver adapter) for local dev
- **Framer Motion** for the map reveal / card / winner animations
- A pluggable venue/travel-time provider: a built-in **mock Bangalore
  dataset** (no API key needed) that automatically upgrades to **Google Maps
  Platform** (Places, Distance Matrix, Geocoding) the moment
  `GOOGLE_MAPS_API_KEY` is set.

## Getting started

```bash
npm install
npx prisma migrate dev   # creates dev.db from prisma/schema.prisma
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys are required
to use the full app — recommendations are generated from a realistic mock
dataset of Bangalore venues and travel times.

Copy `.env.example` to `.env.local` if you want to add a
`GOOGLE_MAPS_API_KEY` later; the app detects it automatically and switches
providers.

## How it works

1. **Create a plan** (`/create`) — title, activity, date/time, budget. This
   also creates you as the organizer with an unguessable invite link.
2. **Group Lobby** (`/plan/[slug]`) — share the link; participants join with
   just a name (no account) and privately submit their location, transport
   mode, travel limit, budget, and preferences.
3. **Find Our Spot** — the organizer triggers `lib/recommendation/engine.ts`,
   which filters venues by hard constraints, scores the rest across travel
   convenience, preference fit, budget, fairness, quality, accessibility,
   availability, and novelty (weights in `lib/recommendation/types.ts`), and
   returns three distinct, labeled, explained picks (Best Overall / Most
   Convenient / Wild Card).
4. **Vote and confirm** — simple voting with live tallies, one reroll with a
   reason, and an organizer "Lock In" action that resolves ties by score.
5. **Plan locked** — directions, calendar download, share text, a backup
   venue, and a quick feedback prompt.

## Project layout

- `lib/venues/` — provider abstraction, mock data, geo helpers
- `lib/recommendation/` — scoring engine + explanation generation
- `app/api/plans/...` — plan lifecycle REST routes (Prisma-backed)
- `components/plan/` — the game-lobby UI: join, setup, lobby, map reveal,
  recommendation cards, voting, winner screen
- `prisma/schema.prisma` — Plan / Participant / Recommendation / Vote /
  Feedback models

## Notes

- Guests never see another participant's exact coordinates — only the label
  their chosen privacy level allows (exact/private, approximate area,
  neighborhood, or landmark). Exact coordinates are only ever sent back to
  the participant who owns them.
- The MVP scope intentionally excludes payments, bookings, native apps, and
  advanced gamification (badges/XP) — see `PRD.MD` section 15 for what's in
  vs. out.
