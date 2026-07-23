"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BangaloreMap, type MapPoint, type MeetingZone } from "@/components/plan/BangaloreMap";

const STATUS_MESSAGES = [
  "Scanning Bangalore…",
  "Comparing travel routes…",
  "Matching group preferences…",
  "Finding the fairest zone…",
];

export function GroupMapReveal({
  points,
  meetingZone,
}: {
  points: MapPoint[];
  meetingZone?: MeetingZone;
}) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
      <div className="panel glow-cyan w-full overflow-hidden">
        <BangaloreMap points={points} meetingZone={meetingZone} className="aspect-[8/6.2] w-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={STATUS_MESSAGES[statusIndex]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="font-display text-lg font-semibold text-cyan"
        >
          {STATUS_MESSAGES[statusIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
