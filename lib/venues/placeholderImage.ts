const CATEGORY_STYLE: Record<string, { from: string; to: string; icon: string }> = {
  restaurant: { from: "#7c3aed", to: "#312e81", icon: "🍽️" },
  cafe: { from: "#d97706", to: "#78350f", icon: "☕" },
  pub: { from: "#0891b2", to: "#164e63", icon: "🍺" },
  bar: { from: "#db2777", to: "#831843", icon: "🍸" },
  brewery: { from: "#65a30d", to: "#365314", icon: "🍻" },
  brunch: { from: "#f59e0b", to: "#7c2d12", icon: "🥐" },
  street_food: { from: "#ea580c", to: "#7c2d12", icon: "🌮" },
  dessert: { from: "#ec4899", to: "#701a45", icon: "🍰" },
  nightlife: { from: "#a21caf", to: "#3b0764", icon: "🌃" },
  park: { from: "#16a34a", to: "#14532d", icon: "🌳" },
  family_activity: { from: "#0ea5e9", to: "#0c4a6e", icon: "🎡" },
  movie: { from: "#6366f1", to: "#1e1b4b", icon: "🎬" },
  gaming: { from: "#8b5cf6", to: "#2e1065", icon: "🎮" },
  shopping: { from: "#f43f5e", to: "#4c0519", icon: "🛍️" },
};

/** Deterministic inline-SVG placeholder — no network dependency, fits the dark neon theme. */
export function categoryImage(category: string): string {
  const style = CATEGORY_STYLE[category] ?? {
    from: "#4f46e5",
    to: "#1e1b4b",
    icon: "📍",
  };
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${style.from}'/>
        <stop offset='1' stop-color='${style.to}'/>
      </linearGradient>
    </defs>
    <rect width='400' height='240' fill='url(#g)'/>
    <text x='50%' y='55%' font-size='72' text-anchor='middle' dominant-baseline='middle'>${style.icon}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
