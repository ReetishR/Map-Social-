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
- **Prisma 7** + **Postgres** (via the `pg` driver adapter)
- **Framer Motion** for the map reveal / card / winner animations
- A pluggable venue/travel-time provider: a built-in **mock Bangalore
  dataset** (no API key needed) that automatically upgrades to **Google Maps
  Platform** (Places, Distance Matrix, Geocoding, and Place Details for
  reviews/photos) the moment `GOOGLE_MAPS_API_KEY` is set.

## Getting started

You need a Postgres database — a local one, or a free one from
[Neon](https://neon.tech)/[Supabase](https://supabase.com) work fine.

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL (and optionally GOOGLE_MAPS_API_KEY)
npx prisma migrate dev      # applies prisma/migrations to your database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys are required
to use the full app — recommendations are generated from a realistic mock
dataset of Bangalore venues and travel times.

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this on the
   branch), then in the Vercel dashboard: **Add New → Project** and import it.
2. In the project's **Storage** tab, add the **Neon** integration (or any
   Postgres) — this creates a `DATABASE_URL` for you automatically. If you
   provisioned a database elsewhere instead, add `DATABASE_URL` yourself
   under **Settings → Environment Variables**.
3. Optionally add `GOOGLE_MAPS_API_KEY` under the same Environment Variables
   screen to use real venues, reviews, and photos instead of the mock data.
4. Deploy. The build script (`prisma generate && prisma migrate deploy && next
   build`) applies migrations automatically — no manual DB setup step needed
   beyond having `DATABASE_URL` set before the first deploy.

Note: `pg` connects over standard Postgres wire protocol, so any Postgres
works (Neon, Supabase, RDS, a VPS) — Neon's pooled connection string is
recommended on Vercel since serverless functions open many short-lived
connections.

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
