import { findNeighborhood } from "@/lib/venues/neighborhoods";
import type { MapPoint } from "@/components/plan/BangaloreMap";
import type { ParticipantDTO } from "./types";

const FALLBACK = { lat: 12.9716, lng: 77.5946 }; // central Bangalore
const ACCENTS: NonNullable<MapPoint["accent"]>[] = ["purple", "cyan", "lime", "pink"];

function jitter(seed: string): { dLat: number; dLng: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = ((Math.abs(h) % 1000) / 1000) - 0.5;
  const b = ((Math.abs(h >> 8) % 1000) / 1000) - 0.5;
  return { dLat: a * 0.02, dLng: b * 0.02 };
}

export function participantsToMapPoints(participants: ParticipantDTO[], meId: string): MapPoint[] {
  return participants
    .filter((p) => p.hasLocation)
    .map((p, i) => {
      const isSelf = p.id === meId;
      const accent = ACCENTS[i % ACCENTS.length];
      if (isSelf && p.lat != null && p.lng != null) {
        return { id: p.id, label: "You", lat: p.lat, lng: p.lng, kind: "participant" as const, accent };
      }
      const match = p.locationDisplay ? findNeighborhood(p.locationDisplay) : null;
      const j = jitter(p.id);
      if (match) {
        return {
          id: p.id,
          label: p.name,
          lat: match.lat + j.dLat,
          lng: match.lng + j.dLng,
          kind: "participant" as const,
          accent,
        };
      }
      return {
        id: p.id,
        label: p.name,
        lat: FALLBACK.lat + j.dLat,
        lng: FALLBACK.lng + j.dLng,
        kind: "participant" as const,
        accent,
        faded: true,
      };
    });
}

export function centroidOf(points: { lat: number; lng: number }[]): { lat: number; lng: number } | null {
  if (points.length === 0) return null;
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}
