import type { TransportModeKey, VenueReview } from "@/lib/venues";

export type PreferenceStrength = "MUST_HAVE" | "STRONG" | "NICE_TO_HAVE" | "NONE";

export interface PreferenceEntry {
  value: string | boolean;
  strength: PreferenceStrength;
}

export interface HardConstraint {
  key: string;
  value: string | boolean | string[];
}

export interface ParticipantInput {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  transportMode: TransportModeKey | null;
  altTransportModes: TransportModeKey[];
  maxTravelMinutes: number | null;
  maxWalkingMinutes: number | null;
  budget: number | null;
  preferredCategories: string[];
  cuisine: string[];
  dietary: string[];
  preferences: Record<string, PreferenceEntry>;
  hardConstraints: HardConstraint[];
}

export interface PlanInput {
  activity: string;
  time: string | null; // "19:30"
  budgetPerPerson: number | null;
  rerollReason?: string;
  excludeVenueIds?: string[];
}

export interface ParticipantTravel {
  participantId: string;
  participantName: string;
  minutes: number;
  mode: TransportModeKey;
  feasible: boolean;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export interface ScoredRecommendation {
  venueId: string;
  venueName: string;
  category: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  priceLevel: number;
  estimatedCostPerPerson: number;
  rating: number;
  reviewCount: number;
  vibeTags: string[];
  metroProximityMinutes: number | null;
  parkingAvailable: boolean;
  openingHours: string;
  imageUrl: string;

  travelBreakdown: ParticipantTravel[];
  avgTravelMinutes: number;
  maxTravelMinutes: number;
  fairnessScore: number;
  groupMatchScore: number;
  scoreBreakdown: Record<string, number>;
  confidence: "HIGH" | "MEDIUM" | "LOW";

  editorialSummary: string | null;
  mapsUrl: string | null;
  photos: string[];
  reviews: VenueReview[];
}

export interface RecommendationLabelled extends ScoredRecommendation {
  label: "BEST_OVERALL" | "MOST_CONVENIENT" | "WILD_CARD";
  explanation: string;
  tradeoff: string | null;
}

export interface NoResultSuggestion {
  message: string;
  suggestions: string[];
}

export interface RecommendationResult {
  recommendations: RecommendationLabelled[];
  noResult: NoResultSuggestion | null;
}

export const SCORE_WEIGHTS = {
  travel: 0.3,
  preference: 0.2,
  budget: 0.15,
  fairness: 0.1,
  quality: 0.1,
  accessibility: 0.05,
  availability: 0.05,
  novelty: 0.05,
} as const;
