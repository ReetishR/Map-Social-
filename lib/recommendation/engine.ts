import { venueProvider, type LatLng, type TransportModeKey, type Venue } from "@/lib/venues";
import { haversineKm, mean } from "@/lib/venues/geo";
import {
  accessibilityScore,
  availabilityScore,
  budgetScore,
  confidenceFor,
  fairnessScore,
  hardConstraintsPass,
  noveltyScore,
  preferenceCompatibilityScore,
  travelConvenienceScore,
  venueQualityScore,
} from "./scoring";
import { explainRecommendation } from "./explain";
import {
  SCORE_WEIGHTS,
  type NoResultSuggestion,
  type ParticipantInput,
  type ParticipantTravel,
  type PlanInput,
  type RecommendationLabelled,
  type RecommendationResult,
  type ScoredRecommendation,
} from "./types";

const DEFAULT_DEPARTURE_MINUTE = 19 * 60 + 30;

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

const SURPRISE_FALLBACK_CATEGORIES = ["restaurant", "cafe"];

function resolveCategories(activity: string, participants: ParticipantInput[]): string[] {
  if (activity !== "surprise_me") return [activity];
  const union = new Set<string>();
  for (const p of participants) {
    for (const c of p.preferredCategories) union.add(c);
  }
  return union.size > 0 ? [...union] : SURPRISE_FALLBACK_CATEGORIES;
}

async function travelForParticipant(
  participant: ParticipantInput,
  venue: Venue,
  departureMinute: number,
): Promise<ParticipantTravel> {
  if (participant.lat == null || participant.lng == null) {
    return {
      participantId: participant.id,
      participantName: participant.name,
      minutes: 0,
      mode: participant.transportMode ?? "CAR",
      feasible: false,
      confidence: "LOW",
    };
  }

  const modes: TransportModeKey[] = [
    participant.transportMode,
    ...participant.altTransportModes,
  ].filter((m): m is TransportModeKey => Boolean(m));
  if (modes.length === 0) modes.push("CAR");

  const from: LatLng = { lat: participant.lat, lng: participant.lng };
  const to: LatLng = { lat: venue.lat, lng: venue.lng };

  const estimates = await Promise.all(
    modes.map((mode) => venueProvider.estimateTravel(from, to, mode, departureMinute)),
  );

  const feasibleOnes = estimates.filter((e) => e.feasible);
  const pool = feasibleOnes.length ? feasibleOnes : estimates;
  const best = pool.reduce((a, b) => (a.minutes <= b.minutes ? a : b));

  return {
    participantId: participant.id,
    participantName: participant.name,
    minutes: best.minutes,
    mode: best.mode,
    feasible: best.feasible,
    confidence: best.confidence,
  };
}

interface RerollAdjustment {
  extraMaxTravelMinutes: number;
  budgetMultiplier: number;
  noveltyBoost: number;
  forceMetro: boolean;
  forceParking: boolean;
  forceVegetarian: boolean;
}

function rerollAdjustments(reason?: string): RerollAdjustment {
  const base: RerollAdjustment = {
    extraMaxTravelMinutes: 0,
    budgetMultiplier: 1,
    noveltyBoost: 1,
    forceMetro: false,
    forceParking: false,
    forceVegetarian: false,
  };
  switch (reason) {
    case "too_expensive":
      return { ...base, budgetMultiplier: 0.75 };
    case "too_far":
      return { ...base, extraMaxTravelMinutes: -10 };
    case "too_familiar":
    case "not_exciting":
      return { ...base, noveltyBoost: 1.8 };
    case "too_crowded":
      return { ...base, noveltyBoost: 1.3 };
    case "need_metro_access":
      return { ...base, forceMetro: true };
    case "need_parking":
      return { ...base, forceParking: true };
    case "need_better_vegetarian_options":
      return { ...base, forceVegetarian: true };
    default:
      return base;
  }
}

function pickMostConvenient(
  candidates: ScoredRecommendation[],
  best: ScoredRecommendation,
): ScoredRecommendation | undefined {
  if (candidates.length === 0) return undefined;
  const distinct = candidates.filter((c) => c.neighborhood !== best.neighborhood);
  const pool = distinct.length ? distinct : candidates;
  return [...pool].sort(
    (a, b) =>
      a.avgTravelMinutes * 0.6 +
      a.maxTravelMinutes * 0.4 -
      (b.avgTravelMinutes * 0.6 + b.maxTravelMinutes * 0.4),
  )[0];
}

function pickWildCard(
  candidates: ScoredRecommendation[],
  chosen: ScoredRecommendation[],
): ScoredRecommendation | undefined {
  if (candidates.length === 0) return undefined;
  const chosenNeighborhoods = chosen.map((c) => c.neighborhood);
  const distinct = candidates.filter((c) => !chosenNeighborhoods.includes(c.neighborhood));
  const pool = distinct.length ? distinct : candidates;
  const novel = pool
    .filter((c) => c.scoreBreakdown.novelty >= 0.5)
    .sort((a, b) => b.groupMatchScore - a.groupMatchScore);
  return novel[0] ?? [...pool].sort((a, b) => b.groupMatchScore - a.groupMatchScore)[0];
}

function labelRecommendation(
  rec: ScoredRecommendation,
  label: RecommendationLabelled["label"],
  participantCount: number,
  groupBudget: number | null,
): RecommendationLabelled {
  const { explanation, tradeoff } = explainRecommendation(rec, label, participantCount, groupBudget);
  return { ...rec, label, explanation, tradeoff };
}

function buildNoResultSuggestion(
  located: ParticipantInput[],
  travelCache: Map<string, ParticipantTravel[]>,
  venues: Venue[],
): NoResultSuggestion {
  const withCaps = located.filter((p) => p.maxTravelMinutes != null);
  const suggestions: string[] = [];

  if (withCaps.length > 0) {
    const bottleneck = withCaps.reduce((worst, p) =>
      (p.maxTravelMinutes ?? Infinity) < (worst.maxTravelMinutes ?? Infinity) ? p : worst,
    );
    const currentCap = bottleneck.maxTravelMinutes!;
    const relaxedCap = currentCap + 15;

    let unlockCount = 0;
    for (const venue of venues) {
      const travel = travelCache.get(venue.id);
      if (!travel) continue;
      const bottleneckTravel = travel.find((t) => t.participantId === bottleneck.id);
      if (!bottleneckTravel) continue;
      const otherParticipantsOk = located
        .filter((p) => p.id !== bottleneck.id)
        .every((p) => {
          const t = travel.find((tt) => tt.participantId === p.id);
          return t && (p.maxTravelMinutes == null || t.minutes <= p.maxTravelMinutes);
        });
      if (
        otherParticipantsOk &&
        bottleneckTravel.minutes > currentCap &&
        bottleneckTravel.minutes <= relaxedCap
      ) {
        unlockCount++;
      }
    }

    if (unlockCount > 0) {
      suggestions.push(
        `Increasing ${bottleneck.name}'s maximum travel time from ${currentCap} to ${relaxedCap} minutes would unlock ${unlockCount} option${unlockCount === 1 ? "" : "s"}.`,
      );
    } else {
      suggestions.push(`Increasing ${bottleneck.name}'s maximum travel time would give the group more options.`);
    }
  }

  suggestions.push("Increasing the group budget slightly.");
  suggestions.push("Changing the activity category.");
  suggestions.push("Allowing another neighborhood.");
  suggestions.push("Relaxing a soft preference (like indoor-only or alcohol-free).");

  return {
    message: "No venue currently meets every requirement.",
    suggestions,
  };
}

export async function generateRecommendations(
  participants: ParticipantInput[],
  plan: PlanInput,
): Promise<RecommendationResult> {
  const located = participants.filter((p) => p.lat != null && p.lng != null);

  if (located.length === 0) {
    return {
      recommendations: [],
      noResult: {
        message: "No participant locations yet.",
        suggestions: ["Wait for at least one participant to share a starting location."],
      },
    };
  }

  const centroid: LatLng = {
    lat: mean(located.map((p) => p.lat!)),
    lng: mean(located.map((p) => p.lng!)),
  };
  const maxRadiusFromCentroid = Math.max(
    ...located.map((p) => haversineKm(centroid, { lat: p.lat!, lng: p.lng! })),
  );
  const radiusKm = Math.min(35, Math.max(8, maxRadiusFromCentroid * 1.6));

  const categories = resolveCategories(plan.activity, participants);
  const venueLists = await Promise.all(
    categories.map((category) => venueProvider.searchVenues({ category, near: centroid, radiusKm })),
  );
  const excludeIds = new Set(plan.excludeVenueIds ?? []);
  const venues = dedupeById(venueLists.flat()).filter((v) => !excludeIds.has(v.id));

  const departureMinute = plan.time ? hhmmToMinutes(plan.time) : DEFAULT_DEPARTURE_MINUTE;
  const reroll = rerollAdjustments(plan.rerollReason);

  const groupBudgets = located.map((p) => p.budget).filter((b): b is number => b != null);
  const groupBudget = plan.budgetPerPerson ?? (groupBudgets.length ? Math.round(mean(groupBudgets)) : null);

  const travelCache = new Map<string, ParticipantTravel[]>();
  const candidates: ScoredRecommendation[] = [];

  for (const venue of venues) {
    const travel = await Promise.all(
      located.map((p) => travelForParticipant(p, venue, departureMinute)),
    );
    travelCache.set(venue.id, travel);

    if (reroll.forceMetro && (venue.metroProximityMinutes == null || venue.metroProximityMinutes > 15)) continue;
    if (reroll.forceParking && !venue.parkingAvailable) continue;
    if (reroll.forceVegetarian && !venue.vegetarian) continue;

    const passes = located.every((participant, i) => {
      const adjustedParticipant: typeof participant = {
        ...participant,
        maxTravelMinutes:
          participant.maxTravelMinutes != null
            ? participant.maxTravelMinutes + reroll.extraMaxTravelMinutes
            : null,
        budget: participant.budget != null ? Math.round(participant.budget / reroll.budgetMultiplier) : null,
      };
      return hardConstraintsPass(adjustedParticipant, venue, travel[i].minutes, travel[i].feasible);
    });
    if (!passes) continue;

    const minutesList = travel.map((t) => t.minutes);
    const caps = located.map((p) => p.maxTravelMinutes ?? 60);
    const budgets = groupBudgets.length ? groupBudgets : groupBudget ? [groupBudget] : [];

    const scoreBreakdown = {
      travel: travelConvenienceScore(minutesList, caps),
      preference: preferenceCompatibilityScore(located, venue),
      budget: budgetScore(venue.estimatedCostPerPerson, budgets),
      fairness: fairnessScore(minutesList),
      quality: venueQualityScore(venue),
      accessibility: accessibilityScore(venue),
      availability: availabilityScore(venue, plan.time),
      novelty: Math.min(1, noveltyScore(venue) * reroll.noveltyBoost),
    };

    const composite = (Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[]).reduce(
      (sum, key) => sum + SCORE_WEIGHTS[key] * scoreBreakdown[key],
      0,
    );

    candidates.push({
      venueId: venue.id,
      venueName: venue.name,
      category: venue.category,
      neighborhood: venue.neighborhood,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng,
      priceLevel: venue.priceLevel,
      estimatedCostPerPerson: venue.estimatedCostPerPerson,
      rating: Math.round(venue.rating * 10) / 10,
      reviewCount: venue.reviewCount,
      vibeTags: [...venue.vibeTags, ...(venue.vegetarian ? ["vegetarian"] : [])],
      metroProximityMinutes: venue.metroProximityMinutes,
      parkingAvailable: venue.parkingAvailable,
      openingHours: `${venue.hours.open} - ${venue.hours.close}`,
      imageUrl: venue.imageUrl,
      travelBreakdown: travel,
      avgTravelMinutes: Math.round(mean(minutesList)),
      maxTravelMinutes: Math.round(Math.max(...minutesList)),
      fairnessScore: Math.round(scoreBreakdown.fairness * 100),
      groupMatchScore: Math.round(composite * 100),
      scoreBreakdown,
      confidence: confidenceFor(venue, travel, plan.time),
    });
  }

  if (candidates.length === 0) {
    return { recommendations: [], noResult: buildNoResultSuggestion(located, travelCache, venues) };
  }

  candidates.sort((a, b) => b.groupMatchScore - a.groupMatchScore);

  const bestOverall = candidates[0];
  const remainingAfterBest = candidates.filter((c) => c.venueId !== bestOverall.venueId);
  const mostConvenient = pickMostConvenient(remainingAfterBest, bestOverall);
  const remainingAfterConvenient = remainingAfterBest.filter((c) => c.venueId !== mostConvenient?.venueId);
  const wildCard = pickWildCard(remainingAfterConvenient, [bestOverall, mostConvenient].filter((x): x is ScoredRecommendation => Boolean(x)));

  const recommendations = [
    labelRecommendation(bestOverall, "BEST_OVERALL", located.length, groupBudget),
    mostConvenient && labelRecommendation(mostConvenient, "MOST_CONVENIENT", located.length, groupBudget),
    wildCard && labelRecommendation(wildCard, "WILD_CARD", located.length, groupBudget),
  ].filter((x): x is RecommendationLabelled => Boolean(x));

  return { recommendations, noResult: null };
}
