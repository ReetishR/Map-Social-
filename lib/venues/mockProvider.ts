import type {
  GeocodeResult,
  LatLng,
  TravelEstimate,
  TransportModeKey,
  Venue,
  VenueProvider,
  VenueSearchParams,
} from "./types";
import { haversineKm } from "./geo";
import {
  findNeighborhood,
  METRO_STATIONS,
  nearestNeighborhood,
} from "./neighborhoods";
import { venuesByCategory } from "./mockVenues";

interface ModeProfile {
  speedKmh: number;
  overheadMin: number;
  rushMultiplier: number;
  maxSensibleKm: number;
}

const MODE_PROFILES: Record<TransportModeKey, ModeProfile> = {
  CAR: { speedKmh: 22, overheadMin: 5, rushMultiplier: 1.4, maxSensibleKm: 60 },
  TWO_WHEELER: { speedKmh: 27, overheadMin: 3, rushMultiplier: 1.15, maxSensibleKm: 60 },
  AUTO_TAXI: { speedKmh: 20, overheadMin: 6, rushMultiplier: 1.3, maxSensibleKm: 45 },
  BUS: { speedKmh: 16, overheadMin: 10, rushMultiplier: 1.25, maxSensibleKm: 45 },
  WALK: { speedKmh: 4.5, overheadMin: 0, rushMultiplier: 1.0, maxSensibleKm: 3 },
  METRO: { speedKmh: 34, overheadMin: 6, rushMultiplier: 1.05, maxSensibleKm: 60 },
};

function isRushHour(minuteOfDay: number): boolean {
  const morning = minuteOfDay >= 8 * 60 && minuteOfDay <= 10 * 60;
  const evening = minuteOfDay >= 17 * 60 + 30 && minuteOfDay <= 20 * 60 + 30;
  return morning || evening;
}

function nearestStation(point: LatLng) {
  let best = METRO_STATIONS[0];
  let bestKm = Infinity;
  for (const s of METRO_STATIONS) {
    const d = haversineKm(point, s);
    if (d < bestKm) {
      bestKm = d;
      best = s;
    }
  }
  return { station: best, km: bestKm };
}

function estimateMetro(from: LatLng, to: LatLng): TravelEstimate {
  const originStation = nearestStation(from);
  const destStation = nearestStation(to);
  const walkSpeed = MODE_PROFILES.WALK.speedKmh;

  if (originStation.km > 3 || destStation.km > 3) {
    return {
      minutes: Math.round((haversineKm(from, to) / MODE_PROFILES.CAR.speedKmh) * 60 * 1.6),
      mode: "METRO",
      distanceKm: haversineKm(from, to),
      transfers: 0,
      confidence: "LOW",
      feasible: false,
    };
  }

  const walkToStation = (originStation.km / walkSpeed) * 60;
  const walkFromStation = (destStation.km / walkSpeed) * 60;
  const lineKm = haversineKm(originStation.station, destStation.station);
  const transfers = originStation.station.line === destStation.station.line ? 0 : 1;
  const rideMinutes =
    (lineKm / MODE_PROFILES.METRO.speedKmh) * 60 * 1.2 + transfers * 8;

  const minutes = Math.round(
    walkToStation + walkFromStation + rideMinutes + MODE_PROFILES.METRO.overheadMin,
  );

  return {
    minutes,
    mode: "METRO",
    distanceKm: haversineKm(from, to),
    transfers,
    confidence: transfers > 0 ? "MEDIUM" : "HIGH",
    feasible: true,
  };
}

export function estimateTravelSync(
  from: LatLng,
  to: LatLng,
  mode: TransportModeKey,
  departureMinuteOfDay = 19 * 60 + 30,
): TravelEstimate {
  const rush = isRushHour(departureMinuteOfDay);

  if (mode === "METRO") return estimateMetro(from, to);

  const distanceKm = haversineKm(from, to);
  const profile = MODE_PROFILES[mode];
  const rushFactor = rush ? profile.rushMultiplier : 1;
  const minutes = Math.round(
    profile.overheadMin + (distanceKm / profile.speedKmh) * 60 * rushFactor,
  );

  const feasible = distanceKm <= profile.maxSensibleKm;
  const confidence: TravelEstimate["confidence"] =
    distanceKm > profile.maxSensibleKm * 0.7
      ? "LOW"
      : rush
        ? "MEDIUM"
        : "HIGH";

  return { minutes, mode, distanceKm, transfers: 0, confidence, feasible };
}

class MockVenueProvider implements VenueProvider {
  readonly name = "mock" as const;

  async geocode(query: string): Promise<GeocodeResult | null> {
    const n = findNeighborhood(query);
    if (!n) return null;
    return { label: n.name, lat: n.lat, lng: n.lng, neighborhood: n.name };
  }

  async neighborhoodCenter(neighborhood: string): Promise<GeocodeResult | null> {
    return this.geocode(neighborhood);
  }

  async searchVenues(params: VenueSearchParams): Promise<Venue[]> {
    const candidates = venuesByCategory(params.category);
    return candidates.filter(
      (v) => haversineKm(params.near, v) <= params.radiusKm,
    );
  }

  async estimateTravel(
    from: LatLng,
    to: LatLng,
    mode: TransportModeKey,
    departureMinuteOfDay?: number,
  ): Promise<TravelEstimate> {
    return estimateTravelSync(from, to, mode, departureMinuteOfDay);
  }
}

export const mockVenueProvider = new MockVenueProvider();

export function labelForPoint(point: LatLng): string {
  return nearestNeighborhood(point).name;
}
