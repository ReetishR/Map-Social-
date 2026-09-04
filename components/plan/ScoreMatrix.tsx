"use client";

import { SCORE_WEIGHTS } from "@/lib/recommendation/types";

const FACTOR_LABELS: Record<string, string> = {
  travel: "Travel convenience",
  preference: "Preference fit",
  budget: "Budget fit",
  fairness: "Fairness",
  quality: "Venue quality",
  accessibility: "Accessibility",
  availability: "Availability",
  novelty: "Novelty",
};

const FACTOR_ORDER = Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[];

export function ScoreMatrix({ scoreBreakdown }: { scoreBreakdown: Record<string, number> }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white/5 p-3">
      <span className="text-xs font-medium text-text-muted">Weighted decision matrix</span>
      <div className="flex flex-col gap-1.5">
        {FACTOR_ORDER.map((key) => {
          const score = scoreBreakdown[key] ?? 0;
          const weight = SCORE_WEIGHTS[key];
          const contribution = score * weight;
          return (
            <div key={key} className="flex items-center gap-2 text-[11px]">
              <span className="w-28 flex-shrink-0 text-text-faint">{FACTOR_LABELS[key] ?? key}</span>
              <span className="w-8 flex-shrink-0 text-right text-text-faint">
                {Math.round(weight * 100)}%
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple to-cyan"
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
              <span className="w-9 flex-shrink-0 text-right font-display text-text-muted">
                {Math.round(contribution * 100)}
              </span>
            </div>
          );
        })}
      </div>
      <span className="text-[10px] text-text-faint">
        weight × factor score = contribution to the group match %
      </span>
    </div>
  );
}
