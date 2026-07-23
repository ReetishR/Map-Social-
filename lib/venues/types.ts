export type TransportModeKey =
  | "CAR"
  | "TWO_WHEELER"
  | "AUTO_TAXI"
  | "METRO"
  | "BUS"
  | "WALK";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
  neighborhood: string;
}

export interface TravelEstimate {
  minutes: number;
  mode: TransportModeKey;
  distanceKm: number;
  transfers: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  feasible: boolean;
}

export interface OpeningHours {
  open: string; // "11:00"
  close: string; // "23:30"
}

export interface Venue {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  priceLevel: 1 | 2 | 3 | 4;
  estimatedCostPerPerson: number;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  vibeTags: string[];
  vegetarian: boolean;
  vegan: boolean;
  alcohol: boolean;
  indoor: boolean;
  outdoor: boolean;
  groupSeating: boolean;
  parkingAvailable: boolean;
  metroProximityMinutes: number | null;
  accessible: boolean;
  childFriendly: boolean;
  hours: OpeningHours;
  imageUrl: string;
  novelty: number; // 0-1, higher = more unusual/less mainstream
  popularity: number; // 0-1
  dataFreshnessDays: number;
}

export interface VenueSearchParams {
  category: string;
  near: LatLng;
  radiusKm: number;
}

export interface VenueProvider {
  readonly name: "mock" | "google";
  geocode(query: string): Promise<GeocodeResult | null>;
  neighborhoodCenter(neighborhood: string): Promise<GeocodeResult | null>;
  searchVenues(params: VenueSearchParams): Promise<Venue[]>;
  estimateTravel(
    from: LatLng,
    to: LatLng,
    mode: TransportModeKey,
    departureMinuteOfDay?: number,
  ): Promise<TravelEstimate>;
}
