"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { RecommendationCard } from "@/components/plan/RecommendationCard";
import { BangaloreMap, type MapPoint } from "@/components/plan/BangaloreMap";
import { castVote, confirmPlan, generateRecommendations, ApiError } from "@/lib/client/api";
import type { NoResultDTO, PlanDTO, RecommendationDTO, VoteDTO } from "@/lib/client/types";

const REROLL_REASONS = [
  { key: "too_expensive", label: "Too expensive" },
  { key: "too_far", label: "Too far" },
  { key: "too_familiar", label: "Too familiar" },
  { key: "too_crowded", label: "Too crowded" },
  { key: "not_exciting", label: "Not exciting" },
  { key: "need_metro_access", label: "Need metro access" },
  { key: "need_parking", label: "Need parking" },
  { key: "need_better_vegetarian_options", label: "Need better vegetarian options" },
];

export function RecommendationReveal({
  slug,
  plan,
  recommendations,
  votes,
  isOrganizer,
  meId,
  sessionToken,
  organizerToken,
  participantPoints,
  onRefresh,
}: {
  slug: string;
  plan: PlanDTO;
  recommendations: RecommendationDTO[];
  votes: VoteDTO[];
  isOrganizer: boolean;
  meId: string;
  sessionToken: string;
  organizerToken?: string;
  participantPoints: MapPoint[];
  onRefresh: () => void;
}) {
  const [mapVenueId, setMapVenueId] = useState<string | null>(null);
  const [rerollReason, setRerollReason] = useState(REROLL_REASONS[0].key);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResult, setNoResult] = useState<NoResultDTO | null>(null);

  const rerollsLeft = plan.rerollsAllowed - plan.rerollsUsed;

  async function handleVote(recommendationId: string) {
    setError(null);
    try {
      await castVote(slug, sessionToken, recommendationId);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't record your vote.");
    }
  }

  async function handleReroll() {
    if (!organizerToken) return;
    setBusy(true);
    setError(null);
    setNoResult(null);
    try {
      const res = await generateRecommendations(slug, organizerToken, rerollReason);
      if (res.noResult) setNoResult(res.noResult);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reroll right now.");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm(recommendationId?: string) {
    if (!organizerToken) return;
    setBusy(true);
    setError(null);
    try {
      await confirmPlan(slug, organizerToken, recommendationId);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't confirm the plan.");
    } finally {
      setBusy(false);
    }
  }

  const mapVenue = recommendations.find((r) => r.id === mapVenueId);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="text-center">
        <span className="text-xs uppercase tracking-wide text-cyan">Meeting zone unlocked</span>
        <h1 className="font-display text-3xl font-bold">Here&apos;s where you could go</h1>
        <p className="mt-1 text-text-muted">Vote for your favorite — the group decides together.</p>
      </div>

      {mapVenue && (
        <Panel className="overflow-hidden">
          <BangaloreMap
            points={[
              ...participantPoints,
              {
                id: mapVenue.id,
                label: mapVenue.venueName,
                lat: mapVenue.lat,
                lng: mapVenue.lng,
                kind: "venue",
                accent: "pink",
              },
            ]}
            className="aspect-[8/4] w-full"
          />
        </Panel>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {recommendations.map((rec, i) => {
          const voteCount = votes.filter((v) => v.recommendationId === rec.id).length;
          const votedByMe = votes.some((v) => v.participantId === meId && v.recommendationId === rec.id);
          return (
            <div key={rec.id} className="flex flex-col gap-2">
              <RecommendationCard
                rec={rec}
                index={i}
                voteCount={voteCount}
                votedByMe={votedByMe}
                onVote={() => handleVote(rec.id)}
                onViewMap={() => setMapVenueId(mapVenueId === rec.id ? null : rec.id)}
              />
              {isOrganizer && (
                <Button size="sm" variant="secondary" onClick={() => handleConfirm(rec.id)} disabled={busy}>
                  Confirm this pick
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-center text-sm text-red">{error}</p>}
      {noResult && (
        <Panel className="flex flex-col gap-2 border-amber/40 p-5">
          <span className="font-display text-sm font-semibold text-amber">{noResult.message}</span>
          <ul className="list-inside list-disc text-sm text-text-muted">
            {noResult.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Panel>
      )}

      {isOrganizer && (
        <Panel className="flex flex-col gap-4 p-5">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <select
                value={rerollReason}
                onChange={(e) => setRerollReason(e.target.value)}
                className="rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm"
              >
                {REROLL_REASONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                onClick={handleReroll}
                disabled={busy || rerollsLeft <= 0}
              >
                🎲 Reroll ({rerollsLeft} left)
              </Button>
            </div>
            <Button size="lg" onClick={() => handleConfirm()} disabled={busy}>
              Lock In Group&apos;s Pick
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
