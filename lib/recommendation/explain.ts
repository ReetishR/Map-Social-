import type { RecommendationLabelled, ScoredRecommendation } from "./types";

const LABEL_TEXT: Record<RecommendationLabelled["label"], string> = {
  BEST_OVERALL: "Best Overall",
  MOST_CONVENIENT: "Most Convenient",
  WILD_CARD: "Wild Card",
};

function travelClause(rec: ScoredRecommendation, participantCount: number): string {
  const spread = rec.maxTravelMinutes - rec.avgTravelMinutes;
  if (spread > 10) {
    return `everyone can arrive within about ${rec.avgTravelMinutes} minutes on average, though the longest commute is around ${rec.maxTravelMinutes} minutes`;
  }
  return `all ${participantCount} participant${participantCount === 1 ? "" : "s"} can arrive within approximately ${rec.maxTravelMinutes} minutes`;
}

function budgetClause(rec: ScoredRecommendation, groupBudget: number | null): string {
  const budget = groupBudget ?? rec.estimatedCostPerPerson;
  return `it fits the group's ₹${budget.toLocaleString("en-IN")} budget`;
}

function attributeClauses(rec: ScoredRecommendation): string[] {
  const clauses: string[] = [];
  if (rec.vibeTags.some((t) => ["vegetarian"].includes(t))) clauses.push("offers strong vegetarian options");
  if (rec.metroProximityMinutes != null && rec.metroProximityMinutes <= 15) {
    clauses.push(
      rec.metroProximityMinutes <= 2
        ? "is right next to a metro station"
        : `is about ${rec.metroProximityMinutes} minutes from a metro station`,
    );
  }
  if (rec.parkingAvailable) clauses.push("has parking available");
  if (rec.rating >= 4.4) clauses.push(`is highly rated at ${rec.rating}★`);
  if (rec.scoreBreakdown.novelty >= 0.6) clauses.push("brings something a bit different to the usual spots");
  return clauses;
}

function tradeoffClause(rec: ScoredRecommendation): string | null {
  const entries = Object.entries(rec.scoreBreakdown).sort((a, b) => a[1] - b[1]);
  const [lowestKey, lowestValue] = entries[0];
  if (lowestValue >= 0.6) return null;

  switch (lowestKey) {
    case "fairness":
      return `one participant may have a notably longer journey, around ${rec.maxTravelMinutes} minutes`;
    case "budget":
      return "it sits toward the higher end of the group's budget";
    case "quality":
      return "it has fewer reviews than other options, so quality is less certain";
    case "preference":
      return "it may not match everyone's stated preferences perfectly";
    case "travel":
      return "average travel time is on the longer side for this group";
    case "accessibility":
      return "parking and metro access are limited here";
    case "novelty":
      return "it's a fairly familiar, mainstream pick";
    default:
      return null;
  }
}

export function explainRecommendation(
  rec: ScoredRecommendation,
  label: RecommendationLabelled["label"],
  participantCount: number,
  groupBudget: number | null,
): { explanation: string; tradeoff: string | null } {
  const clauses = [
    travelClause(rec, participantCount),
    budgetClause(rec, groupBudget),
    ...attributeClauses(rec).slice(0, 2),
  ];

  const joined =
    clauses.length > 1
      ? `${clauses.slice(0, -1).join(", ")}, and ${clauses[clauses.length - 1]}`
      : clauses[0];

  return {
    explanation: `${LABEL_TEXT[label]} because ${joined}.`,
    tradeoff: tradeoffClause(rec),
  };
}
