"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { categoryIcon } from "@/lib/categories";
import { VenueImage } from "@/components/plan/VenueImage";
import { submitFeedback, ApiError } from "@/lib/client/api";
import type { ParticipantDTO, PlanDTO, RecommendationDTO } from "@/lib/client/types";

const CONFETTI_EMOJI = ["🎉", "✨", "🎊", "🥳", "🍾"];

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  rotate: number;
}

function randomPieces(): ConfettiPiece[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
    left: Math.round(Math.random() * 100),
    delay: Math.random() * 0.4,
    rotate: Math.random() * 360 - 180,
  }));
}

function Confetti() {
  const reduced = useReducedMotion();
  // Lazy initializer: React guarantees this runs exactly once per mount,
  // which is the sanctioned way to seed one-off random state.
  const [pieces] = useState<ConfettiPiece[]>(randomPieces);

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
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

export function WinnerView({
  plan,
  recommendations,
  participants,
}: {
  plan: PlanDTO;
  recommendations: RecommendationDTO[];
  participants: ParticipantDTO[];
}) {
  const winner = recommendations.find((r) => r.id === plan.confirmedRecommendationId);
  const backup = recommendations.find((r) => r.id !== plan.confirmedRecommendationId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!winner) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <p className="text-text-muted">This plan was confirmed, but the winning venue can&apos;t be found.</p>
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${winner.lat},${winner.lng}`;
  const shareText = `Plan locked: ${plan.title} at ${winner.venueName}${plan.date ? ` on ${plan.date}` : ""}${plan.time ? ` at ${plan.time}` : ""}.`;

  const downloadCalendar = () => {
    const start = plan.date && plan.time ? `${plan.date}T${plan.time}:00` : null;
    const dtstart = start ? start.replace(/[-:]/g, "") : "";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${plan.title} @ ${winner.venueName}`,
      dtstart ? `DTSTART:${dtstart}` : "",
      `LOCATION:${winner.address ?? winner.venueName}`,
      `DESCRIPTION:${winner.explanation}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: plan.title, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
    }
  }

  async function handleFeedback() {
    if (rating === 0) return;
    setError(null);
    try {
      await submitFeedback(plan.slug, { rating, comment: comment || null });
      setFeedbackSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send feedback.");
    }
  }

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <Confetti />

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
          <VenueImage
            src={winner.imageUrl}
            category={winner.category}
            alt={winner.venueName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <h2 className="font-display text-2xl font-semibold">
            {categoryIcon(winner.category)} {winner.venueName}
          </h2>
          <p className="text-sm text-text-muted">
            {winner.neighborhood}
            {plan.date ? ` · ${plan.date}` : ""}
            {plan.time ? ` at ${plan.time}` : ""} · ~₹{winner.estimatedCostPerPerson}/person
          </p>

          <div className="flex flex-wrap gap-2">
            {participants.map((p) => {
              const travel = winner.travelBreakdown.find((t) => t.participantId === p.id);
              return (
                <Badge key={p.id} accent="neutral">
                  {p.name}: {travel ? `${travel.minutes} min` : "—"}
                </Badge>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                🧭 Directions
              </Button>
            </a>
            <Button variant="secondary" size="sm" onClick={downloadCalendar}>
              📅 Add to calendar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              🔗 Share plan
            </Button>
          </div>
        </div>
      </Panel>

      {backup && (
        <Panel className="flex items-center justify-between gap-3 p-4">
          <div>
            <span className="text-xs text-text-muted">Backup venue</span>
            <p className="font-display text-sm font-semibold">{backup.venueName}</p>
          </div>
          <Badge accent="neutral">{backup.neighborhood}</Badge>
        </Panel>
      )}

      <Panel className="flex flex-col gap-3 p-5">
        <span className="font-display text-sm font-semibold">How did WhereTo do?</span>
        {feedbackSent ? (
          <p className="text-sm text-lime">Thanks for the feedback! 🎉</p>
        ) : (
          <>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  className={n <= rating ? "opacity-100" : "opacity-30"}
                >
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Anything we should know? (optional)"
              rows={2}
              className="w-full rounded-xl border border-border bg-bg-elevated p-3 text-sm"
            />
            {error && <p className="text-sm text-red">{error}</p>}
            <Button size="sm" onClick={handleFeedback} disabled={rating === 0} className="w-fit">
              Send feedback
            </Button>
          </>
        )}
      </Panel>
    </div>
  );
}
