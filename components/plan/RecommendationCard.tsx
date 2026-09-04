"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { categoryIcon } from "@/lib/categories";
import { VenueImage } from "@/components/plan/VenueImage";
import { ScoreMatrix } from "@/components/plan/ScoreMatrix";
import type { RecommendationDTO } from "@/lib/client/types";

const LABEL_META: Record<
  string,
  { text: string; accent: "purple" | "cyan" | "pink"; glow: string }
> = {
  BEST_OVERALL: { text: "Best Overall", accent: "purple", glow: "glow-purple" },
  MOST_CONVENIENT: { text: "Most Convenient", accent: "cyan", glow: "glow-cyan" },
  WILD_CARD: { text: "Wild Card", accent: "pink", glow: "glow-pink" },
  BEST_VALUE: { text: "Best Value", accent: "cyan", glow: "glow-cyan" },
  FAIREST_COMMUTE: { text: "Fairest Commute", accent: "purple", glow: "glow-purple" },
  HIDDEN_GEM: { text: "Hidden Gem", accent: "pink", glow: "glow-pink" },
};

export function RecommendationCard({
  rec,
  index = 0,
  voteCount,
  votedByMe,
  isWinner,
  onVote,
  onViewMap,
  interactive = true,
}: {
  rec: RecommendationDTO;
  index?: number;
  voteCount?: number;
  votedByMe?: boolean;
  isWinner?: boolean;
  onVote?: () => void;
  onViewMap?: () => void;
  interactive?: boolean;
}) {
  const meta = LABEL_META[rec.label] ?? LABEL_META.BEST_OVERALL;
  const priceDisplay = rec.priceLevel ? "₹".repeat(rec.priceLevel) : "";
  const [showReviews, setShowReviews] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      className={clsx(
        "panel panel-hover flex flex-col overflow-hidden",
        isWinner && "glow-lime border-lime/50",
      )}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <VenueImage
          src={rec.imageUrl}
          category={rec.category}
          alt={rec.venueName}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <Badge accent={meta.accent} className={clsx("backdrop-blur", meta.glow)}>
            {meta.text}
          </Badge>
        </div>
        <button
          type="button"
          onClick={() => setShowMatrix((v) => !v)}
          className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-display font-semibold backdrop-blur transition-colors hover:bg-black/70"
          title="See the weighted decision matrix"
        >
          Match {rec.groupMatchScore}% {showMatrix ? "▾" : "▸"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">
            {categoryIcon(rec.category)} {rec.venueName}
          </h3>
          <p className="text-sm text-text-muted">
            {rec.neighborhood} · {priceDisplay || "₹"} · {rec.rating}★ ({rec.reviewCount} reviews)
          </p>
        </div>

        {showMatrix && <ScoreMatrix scoreBreakdown={rec.scoreBreakdown} />}

        <div className="flex flex-wrap gap-1.5 text-xs">
          {rec.vibeTags.slice(0, 4).map((t) => (
            <Badge key={t} accent="neutral">
              {t}
            </Badge>
          ))}
        </div>

        {rec.photos.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {rec.photos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${rec.venueName} photo`}
                className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="text-text-faint text-xs">Avg travel</div>
            <div className="font-display font-semibold">{rec.avgTravelMinutes} min</div>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="text-text-faint text-xs">Longest</div>
            <div className="font-display font-semibold">{rec.maxTravelMinutes} min</div>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="text-text-faint text-xs">Est. cost</div>
            <div className="font-display font-semibold">₹{rec.estimatedCostPerPerson}</div>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <div className="text-text-faint text-xs">Confidence</div>
            <div className="font-display font-semibold">{rec.confidence}</div>
          </div>
        </div>

        <p className="text-sm text-text-muted">{rec.explanation}</p>
        {rec.tradeoff && (
          <p className="flex items-start gap-1.5 text-xs text-amber">
            <span aria-hidden>⚠</span> {rec.tradeoff}
          </p>
        )}
        {rec.editorialSummary && (
          <p className="text-xs italic text-text-faint">&ldquo;{rec.editorialSummary}&rdquo;</p>
        )}

        {rec.reviews.length > 0 && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowReviews((v) => !v)}
              className="w-fit text-xs text-text-muted underline decoration-dotted underline-offset-4 hover:text-text"
            >
              {showReviews ? "Hide" : "Read"} Google reviews ({rec.reviews.length})
            </button>
            {showReviews && (
              <div className="flex flex-col gap-3 rounded-lg bg-white/5 p-3">
                {rec.reviews.map((review, i) => (
                  <div key={i} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text">{review.authorName}</span>
                      <span className="text-text-faint">{review.relativeTime}</span>
                    </div>
                    <div className="text-amber">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                    <p className="text-text-muted line-clamp-3">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {interactive && (
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={onViewMap}
                className="text-xs text-text-muted underline decoration-dotted underline-offset-4 hover:text-text"
              >
                View on map
              </button>
              {rec.mapsUrl && (
                <a
                  href={rec.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-muted underline decoration-dotted underline-offset-4 hover:text-text"
                >
                  Google Maps ↗
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              {voteCount !== undefined && (
                <span className="text-xs text-text-faint">
                  {voteCount} vote{voteCount === 1 ? "" : "s"}
                </span>
              )}
              <Button
                size="sm"
                variant={votedByMe ? "secondary" : "primary"}
                onClick={onVote}
                aria-pressed={votedByMe}
              >
                {votedByMe ? "Voted ✓" : "Vote"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
