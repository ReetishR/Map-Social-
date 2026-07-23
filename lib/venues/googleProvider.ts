import type {
  GeocodeResult,
  LatLng,
  TravelEstimate,
  TransportModeKey,
  Venue,
  VenueProvider,
  VenueSearchParams,
} from "./types";
import { categoryImage } from "./placeholderImage";
import { nearestNeighborhood } from "./neighborhoods";

// Maps WhereTo activity categories to Google Places "included types" / keyword fallback.
const CATEGORY_TO_PLACE_TYPE: Record<string, string> = {
  restaurant: "restaurant",
  cafe: "cafe",
  pub: "bar",
  bar: "bar",
  brewery: "bar",
  brunch: "restaurant",
  street_food: "restaurant",
  dessert: "bakery",
  movie: "movie_theater",
  nightlife: "night_club",
  gaming: "bowling_alley",
  shopping: "shopping_mall",
  park: "park",
  museum: "museum",
  family_activity: "amusement_park",
};

const GOOGLE_TRAVEL_MODE: Record<TransportModeKey, string> = {
  CAR: "driving",
  TWO_WHEELER: "driving",
  AUTO_TAXI: "driving",
  BUS: "transit",
  METRO: "transit",
  WALK: "walking",
};

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("GOOGLE_MAPS_API_KEY not configured");
  return key;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  geometry: { location: { lat: number; lng: number } };
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Maps API error: ${res.status}`);
  return res.json();
}

class GoogleVenueProvider implements VenueProvider {
  readonly name = "google" as const;

  async geocode(query: string): Promise<GeocodeResult | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      `${query}, Bengaluru, India`,
    )}&region=in&key=${apiKey()}`;
    const data = await fetchJson(url);
    const result = data.results?.[0];
    if (!result) return null;
    return {
      label: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      neighborhood:
        result.address_components?.find((c: { types: string[] }) =>
          c.types.includes("sublocality"),
        )?.long_name ?? query,
    };
  }

  async neighborhoodCenter(neighborhood: string): Promise<GeocodeResult | null> {
    return this.geocode(neighborhood);
  }

  async searchVenues(params: VenueSearchParams): Promise<Venue[]> {
    const placeType = CATEGORY_TO_PLACE_TYPE[params.category] ?? params.category;
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${params.near.lat},${params.near.lng}` +
      `&radius=${Math.round(params.radiusKm * 1000)}` +
      `&type=${encodeURIComponent(placeType)}` +
      `&key=${apiKey()}`;
    const data = await fetchJson(url);
    const results: unknown[] = data.results ?? [];

    return results.map((raw): Venue => {
      const r = raw as GooglePlaceResult;
      const priceLevel = (r.price_level ?? 2) + 1;
      const lat = r.geometry.location.lat;
      const lng = r.geometry.location.lng;
      return {
        id: `google-${r.place_id}`,
        name: r.name,
        category: params.category,
        neighborhood: nearestNeighborhood({ lat, lng }).name,
        address: r.vicinity ?? "",
        lat,
        lng,
        priceLevel: Math.min(4, Math.max(1, priceLevel)) as 1 | 2 | 3 | 4,
        estimatedCostPerPerson: priceLevel * 400,
        rating: r.rating ?? 4,
        reviewCount: r.user_ratings_total ?? 0,
        cuisine: [],
        vibeTags: [],
        vegetarian: true,
        vegan: false,
        alcohol: placeType === "bar",
        indoor: true,
        outdoor: false,
        groupSeating: true,
        parkingAvailable: false,
        metroProximityMinutes: null,
        accessible: true,
        childFriendly: false,
        hours: { open: "11:00", close: "23:00" },
        imageUrl: r.photos?.[0]
          ? `/api/venue-photo?ref=${encodeURIComponent(r.photos[0].photo_reference)}`
          : categoryImage(params.category),
        novelty: 0.5,
        popularity: Math.min(1, (r.user_ratings_total ?? 0) / 2000),
        dataFreshnessDays: 1,
      };
    });
  }

  async estimateTravel(
    from: LatLng,
    to: LatLng,
    mode: TransportModeKey,
    _departureMinuteOfDay?: number,
  ): Promise<TravelEstimate> {
    const googleMode = GOOGLE_TRAVEL_MODE[mode];
    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${from.lat},${from.lng}&destinations=${to.lat},${to.lng}` +
      `&mode=${googleMode}&departure_time=now&key=${apiKey()}`;
    const data = await fetchJson(url);
    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      return {
        minutes: 999,
        mode,
        distanceKm: 0,
        transfers: 0,
        confidence: "LOW",
        feasible: false,
      };
    }
    const seconds = element.duration_in_traffic?.value ?? element.duration.value;
    return {
      minutes: Math.round(seconds / 60),
      mode,
      distanceKm: element.distance.value / 1000,
      transfers: 0,
      confidence: "HIGH",
      feasible: true,
    };
  }
}

export const googleVenueProvider = new GoogleVenueProvider();
