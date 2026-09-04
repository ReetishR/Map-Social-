"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NEIGHBORHOODS } from "@/lib/venues/neighborhoods";
import { project, MAP_VIEWBOX } from "@/lib/mapProjection";

export interface MapPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  kind: "participant" | "venue";
  ready?: boolean;
  accent?: "purple" | "cyan" | "pink" | "lime";
  faded?: boolean;
}

export interface MeetingZone {
  lat: number;
  lng: number;
  radiusKm: number;
}

const ACCENT_HEX: Record<string, string> = {
  purple: "#8b5cf6",
  cyan: "#22d3ee",
  pink: "#ec4899",
  lime: "#84e044",
};

const KM_PER_VIEWBOX_UNIT = (13.14 - 12.8) * 111 / MAP_VIEWBOX.height;

export function BangoreMapDecorativeRoads() {
  const roads = [
    "M40,520 C220,470 340,380 420,300 C520,200 620,140 780,90",
    "M0,300 C160,320 300,300 420,300 C560,300 660,260 800,220",
    "M300,0 C310,140 320,260 300,400 C285,500 270,560 260,620",
    "M120,0 C160,120 220,220 340,260 C460,300 560,260 640,180",
  ];
  return (
    <g stroke="rgba(255,255,255,0.06)" strokeWidth={3} fill="none">
      {roads.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

export function BangaloreMap({
  points,
  meetingZone,
  showNeighborhoodLabels = true,
  className,
}: {
  points: MapPoint[];
  meetingZone?: MeetingZone;
  showNeighborhoodLabels?: boolean;
  className?: string;
}) {
  const zoneCenter = meetingZone ? project(meetingZone.lat, meetingZone.lng) : null;
  const zoneRadiusPx = meetingZone ? meetingZone.radiusKm / KM_PER_VIEWBOX_UNIT : 0;

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      className={className}
      role="img"
      aria-label="Map of Bangalore showing participant areas and candidate meeting zone"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>
        <radialGradient id="zoneGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0b0b16" />
      <rect width="100%" height="100%" fill="url(#grid)" />
      <BangoreMapDecorativeRoads />

      {showNeighborhoodLabels &&
        NEIGHBORHOODS.map((n) => {
          const { x, y } = project(n.lat, n.lng);
          return (
            <g key={n.name} opacity={0.55}>
              <circle cx={x} cy={y} r={2} fill="rgba(255,255,255,0.25)" />
              <text
                x={x + 6}
                y={y + 3}
                fontSize={10}
                fill="rgba(255,255,255,0.35)"
                fontFamily="var(--font-sans)"
              >
                {n.name}
              </text>
            </g>
          );
        })}

      {zoneCenter && (
        <motion.circle
          cx={zoneCenter.x}
          cy={zoneCenter.y}
          r={Math.max(zoneRadiusPx, 60)}
          fill="url(#zoneGlow)"
          stroke="#22d3ee"
          strokeOpacity={0.4}
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}

      <AnimatePresence>
        {points.map((p, i) => {
          const { x, y } = project(p.lat, p.lng);
          const color = ACCENT_HEX[p.accent ?? (p.kind === "venue" ? "pink" : "purple")];
          return (
            <motion.g
              key={p.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: p.faded ? 0.35 : 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              {p.kind === "participant" ? (
                <>
                  <circle cx={x} cy={y} r={16} fill={color} opacity={0.18}>
                    <animate attributeName="r" values="14;20;14" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r={6} fill={color} stroke="#0b0b16" strokeWidth={2} />
                </>
              ) : (
                <path
                  d={`M${x},${y - 12} c6,0 10,4.2 10,10 c0,7 -10,16 -10,16 s-10,-9 -10,-16 c0,-5.8 4,-10 10,-10 z`}
                  fill={color}
                  stroke="#0b0b16"
                  strokeWidth={1.5}
                />
              )}
              <text
                x={x}
                y={y + (p.kind === "participant" ? -14 : -20)}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="#f5f5f8"
                fontFamily="var(--font-display)"
              >
                {p.label}
              </text>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
