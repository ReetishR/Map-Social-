import type { LatLng } from "./types";
import { haversineKm } from "./geo";

export interface NeighborhoodInfo extends LatLng {
  name: string;
  aliases: string[];
}

export interface MetroStation extends LatLng {
  name: string;
  line: string;
}

// Approximate real-world coordinates. Good enough for relative distance/travel-time
// reasoning; not survey-accurate. Swap to Google Geocoding once an API key is present.
export const NEIGHBORHOODS: NeighborhoodInfo[] = [
  { name: "Indiranagar", lat: 12.9784, lng: 77.6408, aliases: ["indira nagar"] },
  { name: "Koramangala", lat: 12.9352, lng: 77.6245, aliases: [] },
  { name: "HSR Layout", lat: 12.9121, lng: 77.6446, aliases: ["hsr"] },
  { name: "Whitefield", lat: 12.9698, lng: 77.75, aliases: [] },
  { name: "Marathahalli", lat: 12.9591, lng: 77.6974, aliases: ["marathahali"] },
  { name: "Bellandur", lat: 12.9257, lng: 77.6784, aliases: [] },
  { name: "MG Road", lat: 12.9757, lng: 77.6069, aliases: ["mahatma gandhi road"] },
  { name: "Church Street", lat: 12.9757, lng: 77.605, aliases: [] },
  { name: "Jayanagar", lat: 12.925, lng: 77.5938, aliases: [] },
  { name: "JP Nagar", lat: 12.9077, lng: 77.5906, aliases: ["jayaprakash nagar"] },
  { name: "Malleshwaram", lat: 13.0033, lng: 77.5709, aliases: [] },
  { name: "Hebbal", lat: 13.0357, lng: 77.597, aliases: [] },
  { name: "Yelahanka", lat: 13.1007, lng: 77.5963, aliases: [] },
  { name: "Electronic City", lat: 12.8452, lng: 77.6602, aliases: ["e city", "ecity"] },
  { name: "Rajajinagar", lat: 12.9915, lng: 77.554, aliases: [] },
  { name: "Banashankari", lat: 12.925, lng: 77.5667, aliases: [] },
  { name: "Sarjapur Road", lat: 12.901, lng: 77.687, aliases: ["sarjapur"] },
  { name: "Brigade Road", lat: 12.9716, lng: 77.6099, aliases: [] },
];

export const METRO_STATIONS: MetroStation[] = [
  { name: "MG Road", lat: 12.9757, lng: 77.6076, line: "Purple" },
  { name: "Trinity", lat: 12.9718, lng: 77.6197, line: "Purple" },
  { name: "Indiranagar", lat: 12.9783, lng: 77.6389, line: "Purple" },
  { name: "Byappanahalli", lat: 12.9906, lng: 77.6483, line: "Purple" },
  { name: "Whitefield (Kadugodi)", lat: 12.9908, lng: 77.7517, line: "Purple" },
  { name: "Cubbon Park", lat: 12.977, lng: 77.594, line: "Purple" },
  { name: "Vijayanagar", lat: 12.9719, lng: 77.5379, line: "Purple" },
  { name: "Yeshwanthpur", lat: 13.0284, lng: 77.5535, line: "Green" },
  { name: "Nagawara", lat: 13.0398, lng: 77.6205, line: "Pink" },
  { name: "Banashankari", lat: 12.9251, lng: 77.5738, line: "Green" },
  { name: "Jayanagar", lat: 12.9308, lng: 77.5838, line: "Green" },
  { name: "Yelachenahalli", lat: 12.894, lng: 77.5769, line: "Green" },
  { name: "RV Road", lat: 12.9422, lng: 77.5735, line: "Green" },
];

export function findNeighborhood(query: string): NeighborhoodInfo | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    NEIGHBORHOODS.find(
      (n) => n.name.toLowerCase() === q || n.aliases.includes(q),
    ) ??
    NEIGHBORHOODS.find(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.aliases.some((a) => a.includes(q)) ||
        q.includes(n.name.toLowerCase()),
    ) ??
    null
  );
}

export function nearestNeighborhood(point: LatLng): NeighborhoodInfo {
  let best = NEIGHBORHOODS[0];
  let bestDist = Infinity;
  for (const n of NEIGHBORHOODS) {
    const d = haversineKm(point, n);
    if (d < bestDist) {
      bestDist = d;
      best = n;
    }
  }
  return best;
}

export function nearestMetroMinutes(point: LatLng): number | null {
  let best = Infinity;
  for (const m of METRO_STATIONS) {
    const km = haversineKm(point, m);
    best = Math.min(best, km);
  }
  // ~4.5km/h walking pace to station, capped: beyond 3km treat metro as impractical.
  if (best > 3) return null;
  return Math.round((best / 4.5) * 60);
}
