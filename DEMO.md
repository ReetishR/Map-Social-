# WhereTo — Live Demo Guide

A script for walking someone through WhereTo in ~5 minutes. Everything in
`/demo` is scripted, deterministic client-side data — **no database, no
Google API calls, no network dependency of any kind.** It cannot fail
mid-presentation because of wifi, API keys, or a database connection.

## The 30-second pitch

> "Planning with a group always turns into the same argument — 'where should
> we go?', 'that's too far', 'let's just decide later'. WhereTo splits that
> problem in two.
>
> First, a **search layer** — today, Google Places; conceptually, this is
> exactly where an LLM-driven search agent slots in — goes and finds real
> candidate venues and enriches them with real-world information: ratings,
> reviews, photos, hours, price.
>
> Second, a **deterministic decision engine** takes those candidates plus
> everyone's private constraints — location, budget, transport, deal-breakers
> — and runs them through a weighted scoring matrix. Not a black-box LLM
> guess: eight explicit, auditable factors, each with a fixed weight, that
> add up to a group match score you can point at and explain. That's the
> difference between 'the AI thinks you'll like this' and 'here's exactly
> why this venue scored 91%.'"

## Before you start

```bash
npm install     # if you haven't already
npm run dev
```

Open `http://localhost:3000` and click **"▶ Watch a live demo"** on the
landing page, or go straight to `http://localhost:3000/demo`.

## Walkthrough

### 1. The Lobby (`/demo`)

Talking points:
- "Four friends — Whitefield, HSR Layout, Malleshwaram, Indiranagar. Genuinely
  far apart, no obvious meeting point."
- "No one downloaded an app or made an account — they joined with a link and
  a name."
- Point at the note under the participant avatars: *"WhereTo will find the
  fairest meeting zone, not just the midpoint."* — this is the thesis of the
  product. The geographic center of those four points is a bad answer;
  fairness is about travel time and access, not geometry.

Click **"Find Our Spot 🎯"**.

### 2. The scan

- The map animates through "Scanning Bangalore… Comparing travel routes…
  Matching group preferences… Finding the fairest zone…" — roughly 2.5
  seconds, then it resolves into three picks.
- This is a good beat to restate the two-layer pitch: search/info layer runs
  first (candidate venues + real data), then the weighted engine scores them
  against everyone's constraints.

### 3. Three recommendations, not thirty

- Point out the three labels: **Best Overall**, **Most Convenient**, **Wild
  Card**. "We deliberately don't show a list of thirty venues — that's the
  same decision paralysis the product exists to solve. Three distinct,
  explained options."
- Read one explanation line aloud, e.g. *"Best Overall because all four
  participants can arrive within approximately 34 minutes, it fits the
  group's ₹1,500 budget, offers strong vegetarian options, and is six
  minutes from a metro station."* — every claim in that sentence is a real
  computed number, not filler text.
- Click **"Match 91% ▸"** on the Best Overall card to expand the **weighted
  decision matrix**. This is the moment to explain the engine concretely:
  travel convenience is weighted highest (30%), then preference fit (20%),
  budget (15%), and so on down to novelty (5%). Each bar is `weight × score`.
  "This is the whole decision, laid out. Nothing hidden."
- Expand **"Read Google reviews"** on a card to show real review text, star
  ratings, and how recently they were posted — proof the search layer is
  pulling in real-world signal, not inventing plausible-sounding venues.
- Watch the vote counts — the other three participants "vote" live over the
  next few seconds (you'll see the numbers tick up under each card without
  touching anything). Cast your own vote on whichever card you like, then
  narrate: "Everyone can also veto or pick their own favorite — it's not the
  organizer deciding alone."

### 4. Lock it in

Click **"Lock In Group's Pick"**.

- Confetti, "Plan locked." — the celebratory payoff.
- Point at the per-participant travel times shown as chips (`Asha: 34 min`,
  etc.) — "everyone can see exactly what they signed up for."
- **Google Maps** and **Add to calendar** both work for real — the calendar
  button generates and downloads a real `.ics` file client-side, no server
  round-trip.
- Mention the **backup venue** — if the top pick falls through (closed,
  fully booked), the group has a second option with no extra work.

### 5. Wrap

- "Everything you just saw ran with zero network calls. In production, the
  same engine runs against live Google Places data — real venues, real
  reviews, real travel-time estimates factoring in rush hour — which I'm
  happy to show against a real API key separately."
- If asked about privacy: exact coordinates are never shown to other
  participants — only the label a participant's chosen privacy level allows
  (private / approximate area / neighborhood / landmark). The engine still
  uses exact coordinates for fairness math; the group just never sees them.

## Anticipated questions

**"Is this using an LLM right now?"**
Not yet in the decision path — that's deliberate. The recommendation itself
comes from the deterministic weighted engine so it's explainable and
reproducible. An LLM-driven search agent is the natural next step for the
*information-gathering* layer (broader web search beyond Places — menus,
special events, write-ups) feeding candidates into the same engine.

**"What stops the engine from just picking the cheapest place, or nearest to
the organizer?"**
The weights are explicit and shared across the group — nobody's constraints
get silently prioritized. The fairness factor specifically penalizes options
that create one badly-off participant, even if the average looks fine.

**"What if there's no venue that satisfies everyone?"**
The engine says so, explicitly — and suggests the smallest concrete change
that unlocks options, e.g. *"Increasing Asha's maximum travel time from 45 to
60 minutes would unlock 2 options."* Never silently degrades to a bad match.

**"Does this only work in Bangalore?"**
That's the current seeded dataset and neighborhood/metro data, not an
architectural limit — the venue provider is an abstraction with a mock
implementation and a Google Places implementation; either can be pointed at
any city.

## If something goes visibly wrong

It shouldn't — `/demo` has no external dependencies — but if the browser
itself misbehaves, refresh `/demo`; the state is entirely local and resets
cleanly. There's also a **"↺ Restart demo"** button on the winner screen for
running through it a second time.
