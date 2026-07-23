import type { Participant, Recommendation, Plan, Vote, Feedback } from "@/app/generated/prisma/client";

function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function displayLocationLabel(p: Pick<Participant, "lat" | "lng" | "privacyLevel" | "locationLabel">): string | null {
  if (p.lat == null || p.lng == null) return null;
  switch (p.privacyLevel) {
    case "EXACT_PRIVATE":
      return "Location shared privately";
    case "APPROXIMATE_AREA":
      return p.locationLabel ?? "Nearby area shared";
    case "NEIGHBORHOOD":
      return p.locationLabel ?? "Neighborhood shared";
    case "LANDMARK":
      return p.locationLabel ?? "Landmark shared";
    default:
      return null;
  }
}

export function serializeParticipant(p: Participant, requesterToken?: string | null) {
  const isSelf = Boolean(requesterToken) && requesterToken === p.sessionToken;

  const base = {
    id: p.id,
    name: p.name,
    isOrganizer: p.isOrganizer,
    isReady: p.isReady,
    transportMode: p.transportMode,
    maxTravelMinutes: p.maxTravelMinutes,
    budget: p.budget,
    privacyLevel: p.privacyLevel,
    locationDisplay: displayLocationLabel(p),
    hasLocation: p.lat != null && p.lng != null,
    joinedAt: p.joinedAt,
  };

  if (!isSelf) return { ...base, self: false as const };

  return {
    ...base,
    self: true as const,
    sessionToken: p.sessionToken,
    lat: p.lat,
    lng: p.lng,
    locationLabel: p.locationLabel,
    altTransportModes: safeParse<string[]>(p.altTransportModes, []),
    maxWalkingMinutes: p.maxWalkingMinutes,
    maxTransfers: p.maxTransfers,
    availability: p.availability,
    preferredCategories: safeParse<string[]>(p.preferredCategories, []),
    cuisine: safeParse<string[]>(p.cuisine, []),
    dietary: safeParse<string[]>(p.dietary, []),
    preferences: safeParse<Record<string, { value: string | boolean; strength: string }>>(
      p.preferences,
      {},
    ),
    hardConstraints: safeParse<{ key: string; value: unknown }[]>(p.hardConstraints, []),
  };
}

export function serializeRecommendation(r: Recommendation) {
  return {
    id: r.id,
    generationBatch: r.generationBatch,
    label: r.label,
    secondaryLabel: r.secondaryLabel,
    venueName: r.venueName,
    category: r.category,
    address: r.address,
    neighborhood: r.neighborhood,
    lat: r.lat,
    lng: r.lng,
    priceLevel: r.priceLevel,
    estimatedCostPerPerson: r.estimatedCostPerPerson,
    rating: r.rating,
    reviewCount: r.reviewCount,
    imageUrl: r.imageUrl,
    vibeTags: safeParse<string[]>(r.vibeTags, []),
    metroProximityMinutes: r.metroProximityMinutes,
    parkingAvailable: r.parkingAvailable,
    openingHours: r.openingHours,
    travelBreakdown: safeParse<unknown[]>(r.travelBreakdown, []),
    avgTravelMinutes: r.avgTravelMinutes,
    maxTravelMinutes: r.maxTravelMinutes,
    fairnessScore: r.fairnessScore,
    groupMatchScore: r.groupMatchScore,
    scoreBreakdown: safeParse<Record<string, number>>(r.scoreBreakdown, {}),
    confidence: r.confidence,
    explanation: r.explanation,
    tradeoff: r.tradeoff,
    editorialSummary: r.editorialSummary,
    mapsUrl: r.mapsUrl,
    photos: safeParse<string[]>(r.photos, []),
    reviews: safeParse<VenueReviewDTO[]>(r.reviews, []),
    createdAt: r.createdAt,
  };
}

interface VenueReviewDTO {
  authorName: string;
  rating: number;
  relativeTime: string;
  text: string;
  profilePhotoUrl: string | null;
}

export function serializeVote(v: Vote) {
  return {
    id: v.id,
    participantId: v.participantId,
    recommendationId: v.recommendationId,
    createdAt: v.createdAt,
  };
}

export function serializeFeedback(f: Feedback) {
  return {
    id: f.id,
    participantName: f.participantName,
    rating: f.rating,
    comment: f.comment,
    createdAt: f.createdAt,
  };
}

export function serializePlan(p: Plan) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    activity: p.activity,
    date: p.date,
    time: p.time,
    groupSizeEstimate: p.groupSizeEstimate,
    budgetPerPerson: p.budgetPerPerson,
    initialLocationLabel: p.initialLocationLabel,
    responseDeadline: p.responseDeadline,
    status: p.status,
    rerollsUsed: p.rerollsUsed,
    rerollsAllowed: p.rerollsAllowed,
    confirmedRecommendationId: p.confirmedRecommendationId,
    confirmedAt: p.confirmedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
