import { categoryImage } from "@/lib/venues/placeholderImage";
import type { RecommendationDTO, VenueReviewDTO } from "@/lib/client/types";
import type { MapPoint } from "@/components/plan/BangaloreMap";

export interface DemoParticipant {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  transportMode: string;
  isOrganizer: boolean;
}

export const DEMO_PLAN = {
  title: "Friday Night Drinks",
  activity: "pub",
  date: "Fri, 28 Nov",
  time: "19:30",
  budgetPerPerson: 1500,
};

export const DEMO_PARTICIPANTS: DemoParticipant[] = [
  { id: "asha", name: "Asha", neighborhood: "Whitefield", lat: 12.9698, lng: 77.75, transportMode: "Car", isOrganizer: true },
  { id: "rhea", name: "Rhea", neighborhood: "HSR Layout", lat: 12.9121, lng: 77.6446, transportMode: "Metro", isOrganizer: false },
  { id: "karan", name: "Karan", neighborhood: "Malleshwaram", lat: 13.0033, lng: 77.5709, transportMode: "Two-wheeler", isOrganizer: false },
  { id: "meera", name: "Meera", neighborhood: "Indiranagar", lat: 12.9784, lng: 77.6408, transportMode: "Auto", isOrganizer: false },
];

export const DEMO_MAP_POINTS: MapPoint[] = [
  { id: "asha", label: "Asha", lat: 12.9698, lng: 77.75, kind: "participant", accent: "purple" },
  { id: "rhea", label: "Rhea", lat: 12.9121, lng: 77.6446, kind: "participant", accent: "cyan" },
  { id: "karan", label: "Karan", lat: 13.0033, lng: 77.5709, kind: "participant", accent: "lime" },
  { id: "meera", label: "Meera", lat: 12.9784, lng: 77.6408, kind: "participant", accent: "pink" },
];

function mapsSearchUrl(venue: string, neighborhood: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${neighborhood} Bangalore`)}`;
}

function reviews(entries: [string, number, string, string][]): VenueReviewDTO[] {
  return entries.map(([authorName, rating, relativeTime, text]) => ({
    authorName,
    rating,
    relativeTime,
    text,
    profilePhotoUrl: null,
  }));
}

export const DEMO_RECOMMENDATIONS: RecommendationDTO[] = [
  {
    id: "demo-best-overall",
    generationBatch: 1,
    label: "BEST_OVERALL",
    secondaryLabel: null,
    venueName: "Copper & Cask",
    category: "pub",
    address: "100 Feet Road, Indiranagar",
    neighborhood: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    priceLevel: 3,
    estimatedCostPerPerson: 1300,
    rating: 4.6,
    reviewCount: 2140,
    imageUrl: categoryImage("pub"),
    vibeTags: ["lively", "live-music", "vegetarian"],
    metroProximityMinutes: 6,
    parkingAvailable: true,
    openingHours: "12:00 - 23:30",
    travelBreakdown: [
      { participantId: "asha", participantName: "Asha", minutes: 34, mode: "CAR", feasible: true, confidence: "HIGH" },
      { participantId: "rhea", participantName: "Rhea", minutes: 27, mode: "METRO", feasible: true, confidence: "HIGH" },
      { participantId: "karan", participantName: "Karan", minutes: 31, mode: "TWO_WHEELER", feasible: true, confidence: "HIGH" },
      { participantId: "meera", participantName: "Meera", minutes: 9, mode: "WALK", feasible: true, confidence: "HIGH" },
    ],
    avgTravelMinutes: 25,
    maxTravelMinutes: 34,
    fairnessScore: 82,
    groupMatchScore: 91,
    scoreBreakdown: {
      travel: 0.86,
      preference: 0.88,
      budget: 0.92,
      fairness: 0.82,
      quality: 0.9,
      accessibility: 0.85,
      availability: 1,
      novelty: 0.45,
    },
    confidence: "HIGH",
    explanation:
      "Best Overall because all four participants can arrive within approximately 34 minutes, it fits the group's ₹1,500 budget, offers strong vegetarian options, and is six minutes from a metro station.",
    tradeoff: null,
    editorialSummary: "Warm, exposed-brick pub known for its whiskey list and weekend live sets.",
    mapsUrl: mapsSearchUrl("Copper & Cask", "Indiranagar"),
    photos: [],
    reviews: reviews([
      ["Ananya Rao", 5, "2 weeks ago", "Perfect spot for a big group — the live music on Fridays makes it. Service was quick even when packed."],
      ["Vikram Shetty", 4, "a month ago", "Great whiskey selection, a bit loud after 9pm if you want to talk. Parking was easy to find."],
      ["Divya Menon", 5, "3 weeks ago", "Our go-to for group hangouts. Never disappoints, and it's central enough that nobody complains about the commute."],
    ]),
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-most-convenient",
    generationBatch: 1,
    label: "MOST_CONVENIENT",
    secondaryLabel: null,
    venueName: "The Hopped Table",
    category: "pub",
    address: "80 Feet Road, Koramangala",
    neighborhood: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    priceLevel: 2,
    estimatedCostPerPerson: 1000,
    rating: 4.3,
    reviewCount: 980,
    imageUrl: categoryImage("pub"),
    vibeTags: ["casual", "lively", "vegetarian"],
    metroProximityMinutes: 14,
    parkingAvailable: true,
    openingHours: "12:00 - 23:00",
    travelBreakdown: [
      { participantId: "asha", participantName: "Asha", minutes: 22, mode: "CAR", feasible: true, confidence: "HIGH" },
      { participantId: "rhea", participantName: "Rhea", minutes: 14, mode: "METRO", feasible: true, confidence: "HIGH" },
      { participantId: "karan", participantName: "Karan", minutes: 26, mode: "TWO_WHEELER", feasible: true, confidence: "HIGH" },
      { participantId: "meera", participantName: "Meera", minutes: 19, mode: "AUTO_TAXI", feasible: true, confidence: "HIGH" },
    ],
    avgTravelMinutes: 20,
    maxTravelMinutes: 26,
    fairnessScore: 88,
    groupMatchScore: 86,
    scoreBreakdown: {
      travel: 0.95,
      preference: 0.7,
      budget: 0.97,
      fairness: 0.88,
      quality: 0.75,
      accessibility: 0.7,
      availability: 1,
      novelty: 0.35,
    },
    confidence: "HIGH",
    explanation:
      "Most Convenient because everyone can arrive within about 20 minutes on average, the longest commute is just 26 minutes, and it comfortably fits the group's ₹1,500 budget.",
    tradeoff: "it's a fairly familiar, mainstream pick",
    editorialSummary: "No-frills neighborhood pub, reliable pours and quick service.",
    mapsUrl: mapsSearchUrl("The Hopped Table", "Koramangala"),
    photos: [],
    reviews: reviews([
      ["Rohit Iyer", 4, "5 days ago", "Nothing fancy but exactly what you want for a quick after-work drink with friends. Easy to get to from most parts of the city."],
      ["Sneha Kulkarni", 4, "2 months ago", "Good value, decent snacks. Gets crowded on weekends so go early."],
    ]),
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-wild-card",
    generationBatch: 1,
    label: "WILD_CARD",
    secondaryLabel: null,
    venueName: "Nightjar Rooftop",
    category: "pub",
    address: "Church Street",
    neighborhood: "Church Street",
    lat: 12.9757,
    lng: 77.605,
    priceLevel: 3,
    estimatedCostPerPerson: 1450,
    rating: 4.4,
    reviewCount: 410,
    imageUrl: categoryImage("pub"),
    vibeTags: ["quiet", "outdoor", "date-friendly"],
    metroProximityMinutes: 4,
    parkingAvailable: false,
    openingHours: "17:00 - 00:00",
    travelBreakdown: [
      { participantId: "asha", participantName: "Asha", minutes: 39, mode: "CAR", feasible: true, confidence: "MEDIUM" },
      { participantId: "rhea", participantName: "Rhea", minutes: 30, mode: "METRO", feasible: true, confidence: "HIGH" },
      { participantId: "karan", participantName: "Karan", minutes: 28, mode: "TWO_WHEELER", feasible: true, confidence: "HIGH" },
      { participantId: "meera", participantName: "Meera", minutes: 17, mode: "AUTO_TAXI", feasible: true, confidence: "MEDIUM" },
    ],
    avgTravelMinutes: 29,
    maxTravelMinutes: 39,
    fairnessScore: 68,
    groupMatchScore: 82,
    scoreBreakdown: {
      travel: 0.7,
      preference: 0.8,
      budget: 0.8,
      fairness: 0.68,
      quality: 0.85,
      accessibility: 0.6,
      availability: 0.9,
      novelty: 0.85,
    },
    confidence: "MEDIUM",
    explanation:
      "Wild Card because it brings something a bit different to the usual spots — a quiet rooftop with skyline views — and still fits the group's budget and preferences.",
    tradeoff: "one participant may have a notably longer journey, around 39 minutes",
    editorialSummary: "Candlelit rooftop bar with a small-batch cocktail menu and skyline views.",
    mapsUrl: mapsSearchUrl("Nightjar Rooftop", "Church Street"),
    photos: [],
    reviews: reviews([
      ["Farah Khan", 5, "1 week ago", "Such a nice surprise — quiet enough to actually talk, gorgeous view of the city. Cocktails are pricey but worth it once in a while."],
      ["Aditya Bose", 4, "3 weeks ago", "No parking nearby so plan for a cab. Otherwise a really unique spot compared to the usual Koramangala/Indiranagar crawl."],
    ]),
    createdAt: new Date().toISOString(),
  },
];
