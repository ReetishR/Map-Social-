"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { BangaloreMap } from "@/components/plan/BangaloreMap";
import { RecommendationCard } from "@/components/plan/RecommendationCard";
import type { RecommendationDTO } from "@/lib/client/types";
import { categoryImage } from "@/lib/venues/placeholderImage";

const DEMO_POINTS = [
  { id: "1", label: "You", lat: 12.9784, lng: 77.6408, kind: "participant" as const, accent: "purple" as const },
  { id: "2", label: "Rhea", lat: 12.9121, lng: 77.6446, kind: "participant" as const, accent: "cyan" as const },
  { id: "3", label: "Karan", lat: 13.0033, lng: 77.5709, kind: "participant" as const, accent: "lime" as const },
  { id: "4", label: "MG Road Malt House", lat: 12.9757, lng: 77.6076, kind: "venue" as const, accent: "pink" as const },
];

const DEMO_RECS: RecommendationDTO[] = [
  {
    id: "demo-1",
    generationBatch: 1,
    label: "BEST_OVERALL",
    secondaryLabel: null,
    venueName: "MG Road Malt House",
    category: "pub",
    address: null,
    neighborhood: "MG Road",
    lat: 12.9757,
    lng: 77.6076,
    priceLevel: 3,
    estimatedCostPerPerson: 1300,
    rating: 4.6,
    reviewCount: 812,
    imageUrl: categoryImage("pub"),
    vibeTags: ["lively", "live-music", "vegetarian"],
    metroProximityMinutes: 5,
    parkingAvailable: true,
    openingHours: "11:00 - 23:00",
    travelBreakdown: [],
    avgTravelMinutes: 34,
    maxTravelMinutes: 45,
    fairnessScore: 78,
    groupMatchScore: 91,
    scoreBreakdown: {},
    confidence: "HIGH",
    explanation:
      "Best Overall because everyone can arrive within approximately 45 minutes, it fits the group's ₹1,300 budget, and it is five minutes from a metro station.",
    tradeoff: null,
    editorialSummary: null,
    mapsUrl: null,
    photos: [],
    reviews: [],
    createdAt: "",
  },
  {
    id: "demo-2",
    generationBatch: 1,
    label: "MOST_CONVENIENT",
    secondaryLabel: null,
    venueName: "Indiranagar Underground Pub",
    category: "pub",
    address: null,
    neighborhood: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    priceLevel: 3,
    estimatedCostPerPerson: 1450,
    rating: 4.4,
    reviewCount: 530,
    imageUrl: categoryImage("pub"),
    vibeTags: ["loud", "live-music"],
    metroProximityMinutes: 3,
    parkingAvailable: false,
    openingHours: "11:00 - 23:00",
    travelBreakdown: [],
    avgTravelMinutes: 29,
    maxTravelMinutes: 49,
    fairnessScore: 65,
    groupMatchScore: 86,
    scoreBreakdown: {},
    confidence: "MEDIUM",
    explanation: "Most Convenient because most of the group arrives in under 30 minutes on average.",
    tradeoff: "one participant may have a notably longer journey, around 49 minutes",
    editorialSummary: null,
    mapsUrl: null,
    photos: [],
    reviews: [],
    createdAt: "",
  },
  {
    id: "demo-3",
    generationBatch: 1,
    label: "WILD_CARD",
    secondaryLabel: null,
    venueName: "HSR Bottle & Barrel",
    category: "pub",
    address: null,
    neighborhood: "HSR Layout",
    lat: 12.9121,
    lng: 77.6446,
    priceLevel: 3,
    estimatedCostPerPerson: 1500,
    rating: 4.2,
    reviewCount: 190,
    imageUrl: categoryImage("pub"),
    vibeTags: ["quiet", "outdoor"],
    metroProximityMinutes: null,
    parkingAvailable: true,
    openingHours: "11:00 - 23:00",
    travelBreakdown: [],
    avgTravelMinutes: 38,
    maxTravelMinutes: 50,
    fairnessScore: 70,
    groupMatchScore: 82,
    scoreBreakdown: {},
    confidence: "MEDIUM",
    explanation: "Wild Card because it brings something a bit different to the usual spots.",
    tradeoff: null,
    editorialSummary: null,
    mapsUrl: null,
    photos: [],
    reviews: [],
    createdAt: "",
  },
];

const STEPS = [
  {
    icon: "🎮",
    title: "Create a lobby",
    body: "Start a plan and share one link. No app, no account needed to join.",
  },
  {
    icon: "📍",
    title: "Everyone adds their spot",
    body: "Location, budget, and vibe — submitted privately, never shown exactly.",
  },
  {
    icon: "🏆",
    title: "Vote and lock it in",
    body: "Get three fair, distinct picks. Vote, confirm, and share the plan.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="font-display text-xl font-bold tracking-tight">
          Where<span className="text-gradient">To</span>
        </div>
        <Link href="/join" className="text-sm text-text-muted hover:text-text">
          Join a Plan
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 pb-24">
        <section className="grid grid-cols-1 items-center gap-10 pt-8 lg:grid-cols-2 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="w-fit rounded-full border border-border-strong px-3 py-1 text-xs text-text-muted">
              Bangalore · Beta
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Nobody knows where to go.{" "}
              <span className="text-gradient">WhereTo does.</span>
            </h1>
            <p className="max-w-md text-lg text-text-muted">
              Less debating. More doing. Create a plan, invite your group, and get three
              fair, fast picks everyone can actually reach.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/create">
                <Button size="lg">Create a Plan</Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="secondary">
                  Join a Plan
                </Button>
              </Link>
            </div>
            <Link
              href="/demo"
              className="w-fit text-sm text-text-muted underline decoration-dotted underline-offset-4 hover:text-text"
            >
              ▶ Watch a live demo — no setup, no account
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="panel glow-purple overflow-hidden"
          >
            <BangaloreMap
              points={DEMO_POINTS}
              meetingZone={{ lat: 12.965, lng: 77.615, radiusKm: 4.5 }}
              className="aspect-[8/6.2] w-full"
            />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Panel className="flex h-full flex-col gap-2 p-6">
                <span className="text-3xl">{step.icon}</span>
                <h3 className="font-display text-lg font-semibold">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-sm text-text-muted">{step.body}</p>
              </Panel>
            </motion.div>
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold">What you&apos;ll get</h2>
            <span className="text-sm text-text-muted">Example: Friday Night Drinks</span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {DEMO_RECS.map((rec, i) => (
              <RecommendationCard key={rec.id} rec={rec} index={i} interactive={false} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-center text-xs text-text-faint">
        WhereTo helps groups decide — it doesn&apos;t try to show every place in town.
      </footer>
    </div>
  );
}
