export type PlanStatus = "LOBBY" | "GENERATING" | "REVIEWING" | "VOTING" | "CONFIRMED" | "CANCELLED";
export type PrivacyLevel = "EXACT_PRIVATE" | "APPROXIMATE_AREA" | "NEIGHBORHOOD" | "LANDMARK";
export type TransportMode = "CAR" | "TWO_WHEELER" | "AUTO_TAXI" | "METRO" | "BUS" | "WALK";
export type PreferenceStrength = "MUST_HAVE" | "STRONG" | "NICE_TO_HAVE" | "NONE";
export type RecommendationLabel =
  | "BEST_OVERALL"
  | "MOST_CONVENIENT"
  | "WILD_CARD"
  | "BEST_VALUE"
  | "FAIREST_COMMUTE"
  | "HIDDEN_GEM";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface PreferenceEntry {
  value: string | boolean;
  strength: PreferenceStrength;
}

export interface HardConstraint {
  key: string;
  value: string | boolean | string[];
}

export interface PlanDTO {
  id: string;
  slug: string;
  title: string;
  activity: string;
  date: string | null;
  time: string | null;
  groupSizeEstimate: number | null;
  budgetPerPerson: number | null;
  initialLocationLabel: string | null;
  responseDeadline: string | null;
  status: PlanStatus;
  rerollsUsed: number;
  rerollsAllowed: number;
  confirmedRecommendationId: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantDTO {
  id: string;
  name: string;
  isOrganizer: boolean;
  isReady: boolean;
  transportMode: TransportMode | null;
  maxTravelMinutes: number | null;
  budget: number | null;
  privacyLevel: PrivacyLevel;
  locationDisplay: string | null;
  hasLocation: boolean;
  joinedAt: string;
  self: boolean;
  sessionToken?: string;
  lat?: number | null;
  lng?: number | null;
  locationLabel?: string | null;
  altTransportModes?: TransportMode[];
  maxWalkingMinutes?: number | null;
  maxTransfers?: number | null;
  availability?: string | null;
  preferredCategories?: string[];
  cuisine?: string[];
  dietary?: string[];
  preferences?: Record<string, PreferenceEntry>;
  hardConstraints?: HardConstraint[];
}

export interface ParticipantTravelDTO {
  participantId: string;
  participantName: string;
  minutes: number;
  mode: TransportMode;
  feasible: boolean;
  confidence: Confidence;
}

export interface RecommendationDTO {
  id: string;
  generationBatch: number;
  label: RecommendationLabel;
  secondaryLabel: string | null;
  venueName: string;
  category: string;
  address: string | null;
  neighborhood: string | null;
  lat: number;
  lng: number;
  priceLevel: number | null;
  estimatedCostPerPerson: number | null;
  rating: number | null;
  reviewCount: number | null;
  imageUrl: string | null;
  vibeTags: string[];
  metroProximityMinutes: number | null;
  parkingAvailable: boolean | null;
  openingHours: string | null;
  travelBreakdown: ParticipantTravelDTO[];
  avgTravelMinutes: number;
  maxTravelMinutes: number;
  fairnessScore: number;
  groupMatchScore: number;
  scoreBreakdown: Record<string, number>;
  confidence: Confidence;
  explanation: string;
  tradeoff: string | null;
  editorialSummary: string | null;
  mapsUrl: string | null;
  photos: string[];
  reviews: VenueReviewDTO[];
  createdAt: string;
}

export interface VenueReviewDTO {
  authorName: string;
  rating: number;
  relativeTime: string;
  text: string;
  profilePhotoUrl: string | null;
}

export interface VoteDTO {
  id: string;
  participantId: string;
  recommendationId: string;
  createdAt: string;
}

export interface NoResultDTO {
  message: string;
  suggestions: string[];
}

export interface PlanDetailResponse {
  plan: PlanDTO;
  isOrganizer: boolean;
  participants: ParticipantDTO[];
  recommendations: RecommendationDTO[];
  votes: VoteDTO[];
}
