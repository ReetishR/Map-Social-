import type { Participant } from "@/app/generated/prisma/client";
import type { TransportModeKey } from "@/lib/venues";
import type { HardConstraint, ParticipantInput, PreferenceEntry } from "./types";

function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function toParticipantInput(p: Participant): ParticipantInput {
  return {
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    transportMode: p.transportMode as TransportModeKey | null,
    altTransportModes: safeParse<string[]>(p.altTransportModes, []) as TransportModeKey[],
    maxTravelMinutes: p.maxTravelMinutes,
    maxWalkingMinutes: p.maxWalkingMinutes,
    budget: p.budget,
    preferredCategories: safeParse<string[]>(p.preferredCategories, []),
    cuisine: safeParse<string[]>(p.cuisine, []),
    dietary: safeParse<string[]>(p.dietary, []),
    preferences: safeParse<Record<string, PreferenceEntry>>(p.preferences, {}),
    hardConstraints: safeParse<HardConstraint[]>(p.hardConstraints, []),
  };
}
