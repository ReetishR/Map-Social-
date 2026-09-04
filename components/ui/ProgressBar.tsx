"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export function ProgressBar({
  value,
  max,
  accent = "purple",
  className,
}: {
  value: number;
  max: number;
  accent?: "purple" | "cyan" | "lime";
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const accentBg =
    accent === "purple" ? "bg-purple" : accent === "cyan" ? "bg-cyan" : "bg-lime";

  return (
    <div className={clsx("h-2 w-full overflow-hidden rounded-full bg-white/8", className)}>
      <motion.div
        className={clsx("h-full rounded-full", accentBg)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
