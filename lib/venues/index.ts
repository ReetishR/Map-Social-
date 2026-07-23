import { mockVenueProvider } from "./mockProvider";
import { googleVenueProvider } from "./googleProvider";
import type { VenueProvider } from "./types";

export const venueProvider: VenueProvider = process.env.GOOGLE_MAPS_API_KEY
  ? googleVenueProvider
  : mockVenueProvider;

export * from "./types";
export * from "./geo";
export * from "./neighborhoods";
export { MOCK_VENUES } from "./mockVenues";
