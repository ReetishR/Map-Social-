import type { Venue } from "./types";
import { NEIGHBORHOODS, nearestMetroMinutes } from "./neighborhoods";
import { categoryImage } from "./placeholderImage";

function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

type VenueSeed = Partial<Venue> &
  Pick<Venue, "name" | "category" | "neighborhood" | "priceLevel" | "estimatedCostPerPerson">;

function build(seed: VenueSeed): Venue {
  const nb = NEIGHBORHOODS.find((n) => n.name === seed.neighborhood);
  if (!nb) throw new Error(`Unknown neighborhood: ${seed.neighborhood}`);
  const rand = mulberry32(hashStr(seed.name));
  const jitterLat = (rand() - 0.5) * 0.012;
  const jitterLng = (rand() - 0.5) * 0.012;
  const lat = nb.lat + jitterLat;
  const lng = nb.lng + jitterLng;

  return {
    id: `mock-${seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    address: `${seed.neighborhood}, Bengaluru`,
    lat,
    lng,
    rating: 3.9 + rand() * 1.0,
    reviewCount: Math.round(80 + rand() * 2400),
    cuisine: [],
    vibeTags: [],
    vegetarian: true,
    vegan: false,
    alcohol: false,
    indoor: true,
    outdoor: false,
    groupSeating: true,
    parkingAvailable: rand() > 0.35,
    metroProximityMinutes: nearestMetroMinutes({ lat, lng }),
    accessible: rand() > 0.2,
    childFriendly: false,
    hours: { open: "11:00", close: "23:00" },
    imageUrl: categoryImage(seed.category),
    novelty: 0.35 + rand() * 0.5,
    popularity: 0.3 + rand() * 0.6,
    dataFreshnessDays: Math.round(3 + rand() * 40),
    ...seed,
  };
}

export const MOCK_VENUES: Venue[] = [
  // ---- Restaurants ----
  build({ name: "Copper & Ash", category: "restaurant", neighborhood: "Indiranagar", priceLevel: 3, estimatedCostPerPerson: 1300, cuisine: ["North Indian", "Grill"], vibeTags: ["lively", "trendy"], vegetarian: true, vegan: false, alcohol: true, groupSeating: true, hours: { open: "12:00", close: "23:30" } }),
  build({ name: "Second Story Kitchen", category: "restaurant", neighborhood: "Koramangala", priceLevel: 2, estimatedCostPerPerson: 900, cuisine: ["Continental", "Asian"], vibeTags: ["lively", "casual"], vegan: true, alcohol: true }),
  build({ name: "The Fig Tree Table", category: "restaurant", neighborhood: "HSR Layout", priceLevel: 2, estimatedCostPerPerson: 850, cuisine: ["Mediterranean"], vibeTags: ["quiet", "date-friendly"], outdoor: true, alcohol: false }),
  build({ name: "Whitefield Social Kitchen", category: "restaurant", neighborhood: "Whitefield", priceLevel: 2, estimatedCostPerPerson: 800, cuisine: ["Multi-cuisine"], vibeTags: ["casual", "family"], childFriendly: true }),
  build({ name: "Marathahalli Spice Route", category: "restaurant", neighborhood: "Marathahalli", priceLevel: 2, estimatedCostPerPerson: 700, cuisine: ["South Indian", "North Indian"], vibeTags: ["casual"], childFriendly: true }),
  build({ name: "Bellandur Bay Grill", category: "restaurant", neighborhood: "Bellandur", priceLevel: 2, estimatedCostPerPerson: 950, cuisine: ["Seafood", "Grill"], vibeTags: ["lively"], alcohol: true }),
  build({ name: "Church Street Diner", category: "restaurant", neighborhood: "Church Street", priceLevel: 3, estimatedCostPerPerson: 1400, cuisine: ["American", "Continental"], vibeTags: ["lively", "trendy"], alcohol: true }),
  build({ name: "Jayanagar Thali House", category: "restaurant", neighborhood: "Jayanagar", priceLevel: 1, estimatedCostPerPerson: 400, cuisine: ["South Indian"], vibeTags: ["family", "familiar"], vegetarian: true, childFriendly: true }),
  build({ name: "JP Nagar Garden Kitchen", category: "restaurant", neighborhood: "JP Nagar", priceLevel: 2, estimatedCostPerPerson: 750, cuisine: ["North Indian"], vibeTags: ["family", "quiet"], outdoor: true, childFriendly: true }),
  build({ name: "Malleshwaram Filter Coffee House", category: "restaurant", neighborhood: "Malleshwaram", priceLevel: 1, estimatedCostPerPerson: 350, cuisine: ["South Indian"], vibeTags: ["familiar", "traditional"], vegetarian: true, childFriendly: true }),
  build({ name: "Hebbal Lakeview Bistro", category: "restaurant", neighborhood: "Hebbal", priceLevel: 3, estimatedCostPerPerson: 1200, cuisine: ["Continental"], vibeTags: ["scenic", "date-friendly"], outdoor: true, alcohol: true }),
  build({ name: "Electronic City Tiffin Room", category: "restaurant", neighborhood: "Electronic City", priceLevel: 1, estimatedCostPerPerson: 450, cuisine: ["South Indian"], vibeTags: ["casual", "familiar"], childFriendly: true }),
  build({ name: "Rajajinagar Ration House", category: "restaurant", neighborhood: "Rajajinagar", priceLevel: 1, estimatedCostPerPerson: 500, cuisine: ["North Indian"], vibeTags: ["family"], childFriendly: true }),
  build({ name: "Sarjapur Sizzler Studio", category: "restaurant", neighborhood: "Sarjapur Road", priceLevel: 2, estimatedCostPerPerson: 850, cuisine: ["Continental", "Chinese"], vibeTags: ["casual"], childFriendly: true }),
  build({ name: "Brigade Road Kebab Co", category: "restaurant", neighborhood: "Brigade Road", priceLevel: 2, estimatedCostPerPerson: 900, cuisine: ["Mughlai", "Grill"], vibeTags: ["lively"], alcohol: true }),

  // ---- Cafes ----
  build({ name: "Third Wave Roasters", category: "cafe", neighborhood: "Indiranagar", priceLevel: 2, estimatedCostPerPerson: 450, cuisine: ["Coffee", "Continental"], vibeTags: ["quiet", "trendy"], outdoor: true }),
  build({ name: "Koramangala Bean Lab", category: "cafe", neighborhood: "Koramangala", priceLevel: 2, estimatedCostPerPerson: 400, vibeTags: ["quiet", "work-friendly"] }),
  build({ name: "HSR Corner Cafe", category: "cafe", neighborhood: "HSR Layout", priceLevel: 1, estimatedCostPerPerson: 300, vibeTags: ["casual", "familiar"], childFriendly: true }),
  build({ name: "Whitefield Grind House", category: "cafe", neighborhood: "Whitefield", priceLevel: 2, estimatedCostPerPerson: 400, vibeTags: ["casual"] }),
  build({ name: "Jayanagar Filter & Bean", category: "cafe", neighborhood: "Jayanagar", priceLevel: 1, estimatedCostPerPerson: 250, vibeTags: ["familiar", "quiet"], childFriendly: true }),
  build({ name: "Malleshwaram Morning Brew", category: "cafe", neighborhood: "Malleshwaram", priceLevel: 1, estimatedCostPerPerson: 280, vibeTags: ["quiet", "traditional"] }),
  build({ name: "Church Street Espresso Bar", category: "cafe", neighborhood: "Church Street", priceLevel: 2, estimatedCostPerPerson: 380, vibeTags: ["trendy", "lively"] }),
  build({ name: "Yelahanka Garden Cafe", category: "cafe", neighborhood: "Yelahanka", priceLevel: 1, estimatedCostPerPerson: 320, vibeTags: ["quiet"], outdoor: true, childFriendly: true }),

  // ---- Pubs / Bars / Breweries / Nightlife ----
  build({ name: "The Hopped Table Brewery", category: "brewery", neighborhood: "Koramangala", priceLevel: 3, estimatedCostPerPerson: 1300, cuisine: ["Pub Food"], vibeTags: ["lively", "loud"], alcohol: true, vegetarian: true }),
  build({ name: "Indiranagar Copper Still", category: "brewery", neighborhood: "Indiranagar", priceLevel: 3, estimatedCostPerPerson: 1400, vibeTags: ["lively"], alcohol: true }),
  build({ name: "MG Road Malt House", category: "pub", neighborhood: "MG Road", priceLevel: 3, estimatedCostPerPerson: 1350, vibeTags: ["lively", "live-music"], alcohol: true }),
  build({ name: "Church Street Tap Room", category: "pub", neighborhood: "Church Street", priceLevel: 2, estimatedCostPerPerson: 1100, vibeTags: ["lively"], alcohol: true }),
  build({ name: "Koramangala Draft House", category: "pub", neighborhood: "Koramangala", priceLevel: 2, estimatedCostPerPerson: 1000, vibeTags: ["lively", "casual"], alcohol: true, novelty: 0.3 }),
  build({ name: "HSR Bottle & Barrel", category: "pub", neighborhood: "HSR Layout", priceLevel: 3, estimatedCostPerPerson: 1250, vibeTags: ["lively", "quiet"], alcohol: true, novelty: 0.75, outdoor: true }),
  build({ name: "Indiranagar Underground Pub", category: "pub", neighborhood: "Indiranagar", priceLevel: 3, estimatedCostPerPerson: 1300, vibeTags: ["loud", "live-music"], alcohol: true, novelty: 0.8 }),
  build({ name: "Brigade Draft & Vine", category: "bar", neighborhood: "Brigade Road", priceLevel: 3, estimatedCostPerPerson: 1450, vibeTags: ["lively", "dance-floor"], alcohol: true }),
  build({ name: "Whitefield Beer Yard", category: "brewery", neighborhood: "Whitefield", priceLevel: 2, estimatedCostPerPerson: 1100, vibeTags: ["casual", "lively"], alcohol: true, outdoor: true }),
  build({ name: "Bellandur Skyline Lounge", category: "nightlife", neighborhood: "Bellandur", priceLevel: 3, estimatedCostPerPerson: 1500, vibeTags: ["loud", "dance-floor"], alcohol: true }),
  build({ name: "HSR Rooftop Social", category: "nightlife", neighborhood: "HSR Layout", priceLevel: 2, estimatedCostPerPerson: 1200, vibeTags: ["lively", "live-music"], alcohol: true, outdoor: true }),
  build({ name: "Marathahalli Night Market Bar", category: "bar", neighborhood: "Marathahalli", priceLevel: 2, estimatedCostPerPerson: 950, vibeTags: ["casual", "lively"], alcohol: true }),

  // ---- Dessert / Street Food / Brunch ----
  build({ name: "Koramangala Sundae Society", category: "dessert", neighborhood: "Koramangala", priceLevel: 1, estimatedCostPerPerson: 350, vibeTags: ["casual", "sweet-tooth"], childFriendly: true }),
  build({ name: "Indiranagar Waffle Room", category: "dessert", neighborhood: "Indiranagar", priceLevel: 2, estimatedCostPerPerson: 450, vibeTags: ["trendy"], childFriendly: true }),
  build({ name: "VV Puram Food Street Stalls", category: "street_food", neighborhood: "Jayanagar", priceLevel: 1, estimatedCostPerPerson: 250, vibeTags: ["familiar", "lively"], outdoor: true, childFriendly: true }),
  build({ name: "HSR Chaat Corner", category: "street_food", neighborhood: "HSR Layout", priceLevel: 1, estimatedCostPerPerson: 200, vibeTags: ["casual"], outdoor: true, childFriendly: true }),
  build({ name: "Indiranagar Brunch Club", category: "brunch", neighborhood: "Indiranagar", priceLevel: 3, estimatedCostPerPerson: 1300, vibeTags: ["lively", "trendy"], alcohol: true },),
  build({ name: "Koramangala Sunday Table", category: "brunch", neighborhood: "Koramangala", priceLevel: 2, estimatedCostPerPerson: 1000, vibeTags: ["casual", "lively"], alcohol: true }),

  // ---- Family / Parks / Activities ----
  build({ name: "Cubbon Park Green Walk", category: "park", neighborhood: "MG Road", priceLevel: 1, estimatedCostPerPerson: 0, vibeTags: ["quiet", "scenic"], outdoor: true, childFriendly: true, accessible: true }),
  build({ name: "Lalbagh Botanical Gardens", category: "park", neighborhood: "Jayanagar", priceLevel: 1, estimatedCostPerPerson: 30, vibeTags: ["quiet", "scenic"], outdoor: true, childFriendly: true }),
  build({ name: "Hebbal Lake Promenade", category: "park", neighborhood: "Hebbal", priceLevel: 1, estimatedCostPerPerson: 0, vibeTags: ["scenic", "quiet"], outdoor: true, childFriendly: true }),
  build({ name: "Yelahanka Lake Park", category: "park", neighborhood: "Yelahanka", priceLevel: 1, estimatedCostPerPerson: 0, vibeTags: ["quiet"], outdoor: true, childFriendly: true }),
  build({ name: "Koramangala Trampoline Arena", category: "family_activity", neighborhood: "Koramangala", priceLevel: 2, estimatedCostPerPerson: 600, vibeTags: ["fun", "energetic"], childFriendly: true, indoor: true }),
  build({ name: "Whitefield Adventure Zone", category: "family_activity", neighborhood: "Whitefield", priceLevel: 2, estimatedCostPerPerson: 700, vibeTags: ["fun"], childFriendly: true }),
  build({ name: "JP Nagar Bowling Alley", category: "gaming", neighborhood: "JP Nagar", priceLevel: 2, estimatedCostPerPerson: 550, vibeTags: ["fun", "casual"], childFriendly: true, indoor: true }),
  build({ name: "Marathahalli Escape Rooms", category: "gaming", neighborhood: "Marathahalli", priceLevel: 2, estimatedCostPerPerson: 650, vibeTags: ["exciting"], indoor: true }),
  build({ name: "Brigade Road Multiplex", category: "movie", neighborhood: "Brigade Road", priceLevel: 2, estimatedCostPerPerson: 500, vibeTags: ["casual"], indoor: true, childFriendly: true }),
  build({ name: "Bellandur Mall Multiplex", category: "movie", neighborhood: "Bellandur", priceLevel: 2, estimatedCostPerPerson: 450, vibeTags: ["casual"], indoor: true, childFriendly: true }),
  build({ name: "Indiranagar 100 Feet Road Shopping Walk", category: "shopping", neighborhood: "Indiranagar", priceLevel: 2, estimatedCostPerPerson: 0, vibeTags: ["trendy"], outdoor: true }),
  build({ name: "Commercial Street Market", category: "shopping", neighborhood: "Brigade Road", priceLevel: 1, estimatedCostPerPerson: 0, vibeTags: ["lively", "familiar"], outdoor: true, childFriendly: true }),
];

export function venuesByCategory(category: string): Venue[] {
  return MOCK_VENUES.filter((v) => v.category === category);
}
