import type { Venue } from "@/lib/venues";
import { mean, median } from "@/lib/venues/geo";
import type { ParticipantInput, ParticipantTravel, PreferenceEntry } from "./types";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Does a single preference/constraint entry match this venue? */
export function preferenceMatches(
  key: string,
  value: string | boolean | string[],
  venue: Venue,
): boolean {
  switch (key) {
    case "atmosphere":
      return venue.vibeTags.includes(value as string);
    case "indoor_outdoor":
      return value === "indoor" ? venue.indoor : venue.outdoor;
    case "novelty_pref":
      return value === "adventurous" ? venue.novelty > 0.55 : venue.novelty <= 0.55;
    case "parking":
      return value ? venue.parkingAvailable : true;
    case "metro":
      return value
        ? venue.metroProximityMinutes != null && venue.metroProximityMinutes <= 15
        : true;
    case "accessibility":
      return value ? venue.accessible : true;
    case "alcohol":
      return value ? venue.alcohol : !venue.alcohol;
    case "group_seating":
      return value ? venue.groupSeating : true;
    case "child_friendly":
      return value ? venue.childFriendly : true;
    case "vegetarian":
      return value ? venue.vegetarian : true;
    case "vegan":
      return value ? venue.vegan : true;
    case "avoid_neighborhoods":
      return Array.isArray(value) ? !value.includes(venue.neighborhood) : true;
    case "avoid_venue_ids":
      return Array.isArray(value) ? !value.includes(venue.id) : true;
    default:
      return true;
  }
}

export function hardConstraintsPass(
  participant: ParticipantInput,
  venue: Venue,
  travelMinutes: number,
  travelFeasible: boolean,
): boolean {
  if (participant.budget != null && venue.estimatedCostPerPerson > participant.budget) {
    return false;
  }
  if (participant.maxTravelMinutes != null) {
    if (!travelFeasible || travelMinutes > participant.maxTravelMinutes) return false;
  }
  for (const diet of participant.dietary) {
    if (!preferenceMatches(diet, true, venue)) return false;
  }
  for (const [key, entry] of Object.entries(participant.preferences)) {
    if (entry.strength === "MUST_HAVE" && !preferenceMatches(key, entry.value, venue)) {
      return false;
    }
  }
  for (const hc of participant.hardConstraints) {
    if (!preferenceMatches(hc.key, hc.value, venue)) return false;
  }
  return true;
}

export function travelConvenienceScore(minutesList: number[], caps: number[]): number {
  if (minutesList.length === 0) return 0;
  const avg = mean(minutesList);
  const max = Math.max(...minutesList);
  const avgCeiling = caps.length ? mean(caps) : 60;
  const avgScore = clamp01(1 - avg / (avgCeiling * 1.15 || 60));
  const maxScore = clamp01(1 - max / 90);
  return clamp01(avgScore * 0.65 + maxScore * 0.35);
}

export function fairnessScore(minutesList: number[]): number {
  if (minutesList.length < 2) return 1;
  const spread = Math.max(...minutesList) - median(minutesList);
  return clamp01(1 - spread / 40);
}

export function budgetScore(cost: number, budgets: number[]): number {
  if (budgets.length === 0) return 0.8;
  const med = median(budgets);
  if (med <= 0) return 0.8;
  const ratio = cost / med;
  return clamp01(1 - Math.max(0, ratio - 1) * 1.5);
}

export function preferenceCompatibilityScore(
  participants: ParticipantInput[],
  venue: Venue,
): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  const weightFor = (strength: PreferenceEntry["strength"]) =>
    strength === "STRONG" ? 1 : strength === "NICE_TO_HAVE" ? 0.5 : 0;

  for (const p of participants) {
    for (const [key, entry] of Object.entries(p.preferences)) {
      const w = weightFor(entry.strength);
      if (w === 0) continue;
      totalWeight += w;
      if (preferenceMatches(key, entry.value, venue)) matchedWeight += w;
    }
    if (p.cuisine.length > 0) {
      totalWeight += 1;
      const cuisineLower = venue.cuisine.map((c) => c.toLowerCase());
      if (p.cuisine.some((c) => cuisineLower.includes(c.toLowerCase()))) matchedWeight += 1;
    }
  }

  if (totalWeight === 0) return 1;
  return clamp01(matchedWeight / totalWeight);
}

export function venueQualityScore(venue: Venue): number {
  const ratingNorm = clamp01((venue.rating - 3) / 2);
  const reviewNorm = clamp01(Math.log10(venue.reviewCount + 1) / 3.3);
  return clamp01(ratingNorm * 0.7 + reviewNorm * 0.3);
}

export function accessibilityScore(venue: Venue): number {
  const metroCredit =
    venue.metroProximityMinutes == null
      ? 0
      : venue.metroProximityMinutes <= 10
        ? 1
        : venue.metroProximityMinutes <= 20
          ? 0.5
          : 0.15;
  const parkingCredit = venue.parkingAvailable ? 1 : 0.3;
  const accessibleCredit = venue.accessible ? 1 : 0.5;
  return clamp01(metroCredit * 0.4 + parkingCredit * 0.35 + accessibleCredit * 0.25);
}

function minutesToDecimal(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function availabilityScore(venue: Venue, planTime: string | null): number {
  if (!planTime) return 1;
  const target = minutesToDecimal(planTime);
  const open = minutesToDecimal(venue.hours.open);
  let close = minutesToDecimal(venue.hours.close);
  if (close <= open) close += 24 * 60; // crosses midnight
  const targetAdj = target < open ? target + 24 * 60 : target;
  return open <= targetAdj && targetAdj <= close ? 1 : 0.25;
}

export function noveltyScore(venue: Venue): number {
  return clamp01(venue.novelty);
}

export function confidenceFor(
  venue: Venue,
  travel: ParticipantTravel[],
  planTime: string | null,
): "HIGH" | "MEDIUM" | "LOW" {
  const worstTravelConfidence = travel.reduce<"HIGH" | "MEDIUM" | "LOW">((worst, t) => {
    const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
    return rank[t.confidence] > rank[worst] ? t.confidence : worst;
  }, "HIGH");
  const dataOk = venue.dataFreshnessDays <= 30;
  const hoursOk = availabilityScore(venue, planTime) === 1;

  if (worstTravelConfidence === "LOW" || !dataOk) return "LOW";
  if (worstTravelConfidence === "MEDIUM" || !hoursOk) return "MEDIUM";
  return "HIGH";
}

export { clamp01 };
