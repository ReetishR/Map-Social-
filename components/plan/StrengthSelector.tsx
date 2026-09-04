"use client";

import clsx from "clsx";
import type { PreferenceStrength } from "@/lib/client/types";

const OPTIONS: { key: PreferenceStrength; label: string }[] = [
  { key: "NONE", label: "No pref" },
  { key: "NICE_TO_HAVE", label: "Nice" },
  { key: "STRONG", label: "Strong" },
  { key: "MUST_HAVE", label: "Must" },
];

export function StrengthSelector({
  value,
  onChange,
}: {
  value: PreferenceStrength;
  onChange: (v: PreferenceStrength) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-bg-elevated p-0.5 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={clsx(
            "rounded-full px-2.5 py-1 font-medium transition-colors",
            value === opt.key ? "bg-purple text-white" : "text-text-muted hover:text-text",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
