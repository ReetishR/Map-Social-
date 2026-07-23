"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, generateRecommendations, getPlan } from "@/lib/client/api";
import { loadIdentity, type StoredIdentity } from "@/lib/client/storage";
import { participantsToMapPoints, centroidOf } from "@/lib/client/mapPoints";
import type { NoResultDTO, PlanDetailResponse } from "@/lib/client/types";
import { JoinForm } from "@/components/plan/JoinForm";
import { ParticipantSetupForm } from "@/components/plan/ParticipantSetupForm";
import { LobbyView } from "@/components/plan/LobbyView";
import { GroupMapReveal } from "@/components/plan/GroupMapReveal";
import { RecommendationReveal } from "@/components/plan/RecommendationReveal";
import { WinnerView } from "@/components/plan/WinnerView";

const POLL_INTERVAL_MS = 3000;
const MIN_SCAN_DURATION_MS = 2600;

export function PlanExperience({ slug }: { slug: string }) {
  const [identity, setIdentity] = useState<StoredIdentity | null | undefined>(undefined);
  const [data, setData] = useState<PlanDetailResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [noResult, setNoResult] = useState<NoResultDTO | null>(null);

  useEffect(() => {
    // localStorage is only reachable client-side, so the identity for this
    // plan can only be known after mount — there is no way to compute it
    // during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(loadIdentity(slug));
  }, [slug]);

  const refresh = useCallback(async () => {
    try {
      const res = await getPlan(slug, {
        participantToken: identity?.sessionToken,
        organizerToken: identity?.organizerToken,
      });
      setData(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true);
    }
  }, [slug, identity]);

  useEffect(() => {
    if (identity === undefined) return;
    // Polling the server is this effect's subscription to an external system;
    // `refresh` only calls setState after its own async response resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [identity, refresh]);

  if (notFound) {
    return (
      <Centered>
        <p className="text-text-muted">This plan doesn&apos;t exist or has been removed.</p>
      </Centered>
    );
  }

  if (identity === undefined || !data) {
    return (
      <Centered>
        <p className="text-text-muted">Loading your lobby…</p>
      </Centered>
    );
  }

  const { plan, participants, recommendations, votes, isOrganizer } = data;
  const me = identity ? participants.find((p) => p.id === identity.participantId) : undefined;

  if (!identity || !me) {
    return <JoinForm slug={slug} plan={plan} onJoined={() => setIdentity(loadIdentity(slug))} />;
  }

  async function handleGenerate() {
    if (!identity?.organizerToken) return;
    setScanning(true);
    setNoResult(null);
    const start = Date.now();
    try {
      const res = await generateRecommendations(slug, identity.organizerToken);
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SCAN_DURATION_MS - elapsed);
      setTimeout(async () => {
        if (res.noResult) setNoResult(res.noResult);
        await refresh();
        setScanning(false);
      }, wait);
    } catch {
      setScanning(false);
      setNoResult({ message: "Something went wrong generating recommendations.", suggestions: [] });
    }
  }

  const mapPoints = participantsToMapPoints(participants, me.id);
  const centroid = centroidOf(mapPoints);

  if (scanning) {
    return (
      <GroupMapReveal
        points={mapPoints}
        meetingZone={centroid ? { ...centroid, radiusKm: 5 } : undefined}
      />
    );
  }

  if (plan.status === "CONFIRMED") {
    return <WinnerView plan={plan} recommendations={recommendations} participants={participants} />;
  }

  if (plan.status === "REVIEWING" && recommendations.length > 0) {
    return (
      <RecommendationReveal
        slug={slug}
        plan={plan}
        recommendations={recommendations}
        votes={votes}
        isOrganizer={isOrganizer}
        meId={me.id}
        sessionToken={identity.sessionToken}
        organizerToken={identity.organizerToken}
        participantPoints={mapPoints}
        onRefresh={refresh}
      />
    );
  }

  if (!me.isReady || editingPreferences) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <div>
          <span className="text-xs uppercase tracking-wide text-text-muted">
            {plan.title}
          </span>
          <h1 className="font-display text-2xl font-bold">Set up your preferences</h1>
          <p className="mt-1 text-sm text-text-muted">
            Only you can see the details — the group only sees what you choose to share.
          </p>
        </div>
        <ParticipantSetupForm
          slug={slug}
          participant={me}
          sessionToken={identity.sessionToken}
          showSurpriseCategories={plan.activity === "surprise_me"}
          onSaved={async () => {
            setEditingPreferences(false);
            await refresh();
          }}
        />
      </div>
    );
  }

  return (
    <LobbyView
      plan={plan}
      participants={participants}
      isOrganizer={isOrganizer}
      meId={me.id}
      generating={scanning}
      noResult={noResult}
      onGenerate={handleGenerate}
      onEditPreferences={() => setEditingPreferences(true)}
    />
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {children}
    </div>
  );
}
