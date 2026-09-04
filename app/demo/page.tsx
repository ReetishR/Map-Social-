"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GroupMapReveal } from "@/components/plan/GroupMapReveal";
import { RecommendationCard } from "@/components/plan/RecommendationCard";
import { VenueImage } from "@/components/plan/VenueImage";
import { categoryIcon } from "@/lib/categories";
import { DEMO_PLAN, DEMO_PARTICIPANTS, DEMO_MAP_POINTS, DEMO_RECOMMENDATIONS } from "@/lib/demo/demoData";

type Stage = "lobby" | "scanning" | "recommendations" | "winner";

const ME = "asha";
const SCAN_DURATION_MS = 2600;

function computeWinner(votes: Record<string, string[]>): string {
  let winnerId = DEMO_RECOMMENDATIONS[0].id;
  let winnerVotes = -1;
  for (const rec of DEMO_RECOMMENDATIONS) {
    const count = votes[rec.id]?.length ?? 0;
    if (count > winnerVotes) {
      winnerVotes = count;
      winnerId = rec.id;
    } else if (count === winnerVotes) {
      const current = DEMO_RECOMMENDATIONS.find((r) => r.id === winnerId)!;
      if (rec.groupMatchScore > current.groupMatchScore) winnerId = rec.id;
    }
  }
  return winnerId;
}

export default function DemoPage() {
  const [stage, setStage] = useState<Stage>("lobby");
  const [votes, setVotes] = useState<Record<string, string[]>>({});
  const [winnerId, setWinnerId] = useState<string | null>(null);

  useEffect(() => {
    if (stage !== "scanning") return;
    const t = setTimeout(() => setStage("recommendations"), SCAN_DURATION_MS);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "recommendations") return;
    // Simulate the rest of the group voting in real time, so it doesn't look staged.
    const timers = [
      setTimeout(() => castVote("rhea", "demo-best-overall"), 900),
      setTimeout(() => castVote("meera", "demo-wild-card"), 1700),
      setTimeout(() => castVote("karan", "demo-best-overall"), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  function castVote(participantId: string, recommendationId: string) {
    setVotes((prev) => {
      const next: Record<string, string[]> = {};
      for (const rec of DEMO_RECOMMENDATIONS) {
        next[rec.id] = (prev[rec.id] ?? []).filter((p) => p !== participantId);
      }
      next[recommendationId] = [...(next[recommendationId] ?? []), participantId];
      return next;
    });
  }

  function restart() {
    setVotes({});
    setWinnerId(null);
    setStage("lobby");
  }

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v.length, 0);

  if (stage === "scanning") {
    return <GroupMapReveal points={DEMO_MAP_POINTS} meetingZone={{ lat: 12.965, lng: 77.615, radiusKm: 5 }} />;
  }

  if (stage === "winner" && winnerId) {
    return <DemoWinner winnerId={winnerId} onRestart={restart} />;
  }

  if (stage === "recommendations") {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <DemoBadge />
        <div className="text-center">
          <span className="text-xs uppercase tracking-wide text-cyan">Meeting zone unlocked</span>
          <h1 className="font-display text-3xl font-bold">Here&apos;s where you could go</h1>
          <p className="mt-1 text-text-muted">Vote for your favorite — the group decides together.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DEMO_RECOMMENDATIONS.map((rec, i) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              index={i}
              voteCount={votes[rec.id]?.length ?? 0}
              votedByMe={votes[rec.id]?.includes(ME) ?? false}
              onVote={() => castVote(ME, rec.id)}
            />
          ))}
        </div>

        <Panel className="flex flex-col items-center gap-3 p-5 sm:flex-row sm:justify-between">
          <span className="text-sm text-text-muted">{totalVotes} of 4 players have voted</span>
          <Button
            size="lg"
            onClick={() => {
              setWinnerId(computeWinner(votes));
              setStage("winner");
            }}
          >
            Lock In Group&apos;s Pick
          </Button>
        </Panel>
      </div>
    );
  }

  // lobby
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <DemoBadge />
      <div>
        <span className="text-xs uppercase tracking-wide text-text-muted">Game Lobby</span>
        <h1 className="font-display text-3xl font-bold">
          {categoryIcon(DEMO_PLAN.activity)} {DEMO_PLAN.title}
        </h1>
        <p className="mt-1 text-text-muted">
          Pub · {DEMO_PLAN.date} at {DEMO_PLAN.time} · ~₹{DEMO_PLAN.budgetPerPerson}/person
        </p>
      </div>

      <Panel className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold">4 of 4 players ready</span>
          <Badge accent="lime">All ready</Badge>
        </div>
        <ProgressBar value={4} max={4} accent="lime" />
        <div className="flex flex-wrap gap-4">
          {DEMO_PARTICIPANTS.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <Avatar name={p.name} ready />
              <span className="text-xs text-text-muted">
                {p.name}
                {p.id === ME ? " (you)" : ""}
              </span>
              {p.isOrganizer && <Badge accent="purple">Host</Badge>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="flex flex-col gap-2 p-5 text-sm text-text-muted">
        <span className="font-display text-sm font-semibold text-text">Everyone&apos;s in</span>
        <p>
          Whitefield, HSR Layout, Malleshwaram, and Indiranagar — four very different starting
          points. WhereTo will find the fairest meeting zone, not just the midpoint.
        </p>
      </Panel>

      <Button size="lg" onClick={() => setStage("scanning")}>
        Find Our Spot 🎯
      </Button>
    </div>
  );
}

function DemoBadge() {
  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="font-display text-sm font-bold">
        Where<span className="text-gradient">To</span>
      </Link>
      <Badge accent="amber">Demo mode — scripted data, no live API calls</Badge>
    </div>
  );
}

function DemoWinner({ winnerId, onRestart }: { winnerId: string; onRestart: () => void }) {
  const winner = DEMO_RECOMMENDATIONS.find((r) => r.id === winnerId)!;
  const backup = DEMO_RECOMMENDATIONS.find((r) => r.id !== winnerId)!;

  function downloadCalendar() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${DEMO_PLAN.title} @ ${winner.venueName}`,
      `LOCATION:${winner.address ?? winner.venueName}`,
      `DESCRIPTION:${winner.explanation}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${DEMO_PLAN.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <DemoConfetti />
      <DemoBadge />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="text-xs uppercase tracking-wide text-lime">Victory</span>
        <h1 className="font-display text-4xl font-bold">Plan locked. 🔒</h1>
      </motion.div>

      <Panel className="glow-lime flex flex-col gap-4 overflow-hidden p-0">
        <div className="relative h-44 w-full">
          <VenueImage src={winner.imageUrl} category={winner.category} alt={winner.venueName} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <h2 className="font-display text-2xl font-semibold">
            {categoryIcon(winner.category)} {winner.venueName}
          </h2>
          <p className="text-sm text-text-muted">
            {winner.neighborhood} · {DEMO_PLAN.date} at {DEMO_PLAN.time} · ~₹{winner.estimatedCostPerPerson}/person
          </p>
          <div className="flex flex-wrap gap-2">
            {winner.travelBreakdown.map((t) => (
              <Badge key={t.participantId} accent="neutral">
                {t.participantName}: {t.minutes} min
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {winner.mapsUrl && (
              <a href={winner.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">📍 Google Maps</Button>
              </a>
            )}
            <Button variant="secondary" size="sm" onClick={downloadCalendar}>📅 Add to calendar</Button>
          </div>
        </div>
      </Panel>

      <Panel className="flex items-center justify-between gap-3 p-4">
        <div>
          <span className="text-xs text-text-muted">Backup venue</span>
          <p className="font-display text-sm font-semibold">{backup.venueName}</p>
        </div>
        <Badge accent="neutral">{backup.neighborhood}</Badge>
      </Panel>

      <Button variant="secondary" onClick={onRestart}>
        ↺ Restart demo
      </Button>
    </div>
  );
}

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  rotate: number;
}
const CONFETTI_EMOJI = ["🎉", "✨", "🎊", "🥳", "🍾"];
function randomPieces(): ConfettiPiece[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
    left: Math.round(Math.random() * 100),
    delay: Math.random() * 0.4,
    rotate: Math.random() * 360 - 180,
  }));
}
function DemoConfetti() {
  const reduced = useReducedMotion();
  const [pieces] = useState<ConfettiPiece[]>(randomPieces);
  const memoPieces = useMemo(() => pieces, [pieces]);
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {memoPieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 text-2xl"
          style={{ left: `${p.left}%` }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: 260, opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 2.2, delay: p.delay, ease: "easeIn" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
