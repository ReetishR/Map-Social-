export interface ActivityCategory {
  key: string;
  label: string;
  icon: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  { key: "restaurant", label: "Restaurant", icon: "🍽️" },
  { key: "cafe", label: "Café", icon: "☕" },
  { key: "pub", label: "Pub", icon: "🍺" },
  { key: "bar", label: "Bar", icon: "🍸" },
  { key: "brewery", label: "Brewery", icon: "🍻" },
  { key: "brunch", label: "Brunch", icon: "🥐" },
  { key: "street_food", label: "Street Food", icon: "🌮" },
  { key: "dessert", label: "Dessert", icon: "🍰" },
  { key: "nightlife", label: "Nightlife", icon: "🌃" },
  { key: "family_activity", label: "Family Activity", icon: "🎡" },
  { key: "park", label: "Park", icon: "🌳" },
  { key: "movie", label: "Movie", icon: "🎬" },
  { key: "gaming", label: "Gaming", icon: "🎮" },
  { key: "shopping", label: "Shopping", icon: "🛍️" },
  { key: "surprise_me", label: "Surprise Me", icon: "🎲" },
];

export function categoryLabel(key: string): string {
  return ACTIVITY_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function categoryIcon(key: string): string {
  return ACTIVITY_CATEGORIES.find((c) => c.key === key)?.icon ?? "📍";
}

export interface TransportOption {
  key: string;
  label: string;
  icon: string;
}

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { key: "CAR", label: "Car", icon: "🚗" },
  { key: "TWO_WHEELER", label: "Two-wheeler", icon: "🏍️" },
  { key: "AUTO_TAXI", label: "Auto / Taxi", icon: "🛺" },
  { key: "METRO", label: "Metro", icon: "🚇" },
  { key: "BUS", label: "Bus", icon: "🚌" },
  { key: "WALK", label: "Walk", icon: "🚶" },
];

export function transportLabel(key: string): string {
  return TRANSPORT_OPTIONS.find((t) => t.key === key)?.label ?? key;
}

export function transportIcon(key: string): string {
  return TRANSPORT_OPTIONS.find((t) => t.key === key)?.icon ?? "🚗";
}

export const RECOMMENDATION_LABEL_META: Record<
  string,
  { text: string; accent: "purple" | "cyan" | "pink"; blurb: string }
> = {
  BEST_OVERALL: { text: "Best Overall", accent: "purple", blurb: "Strongest all-round balance" },
  MOST_CONVENIENT: { text: "Most Convenient", accent: "cyan", blurb: "Lowest total travel burden" },
  WILD_CARD: { text: "Wild Card", accent: "pink", blurb: "Something a bit different" },
  BEST_VALUE: { text: "Best Value", accent: "cyan", blurb: "Strong pick, easier on budget" },
  FAIREST_COMMUTE: { text: "Fairest Commute", accent: "purple", blurb: "Most even travel times" },
  HIDDEN_GEM: { text: "Hidden Gem", accent: "pink", blurb: "Less obvious, well loved" },
};
