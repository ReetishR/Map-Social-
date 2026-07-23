const BOUNDS = { minLat: 12.8, maxLat: 13.14, minLng: 77.52, maxLng: 77.78 };

export const MAP_VIEWBOX = { width: 800, height: 620 };

export function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * MAP_VIEWBOX.width;
  const y =
    (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_VIEWBOX.height;
  return { x, y };
}
