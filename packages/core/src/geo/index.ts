/** Longitude and latitude in degrees, in that order (like GeoJSON). */
export type LonLat = readonly [lon: number, lat: number];

export interface GeoBounds {
  west: number;
  east: number;
  south: number;
  north: number;
}

/** Mean Earth radius in metres (IUGG). */
export const EARTH_MEAN_RADIUS_M = 6_371_008.8;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in metres (haversine). */
export function greatCircleDistance(a: LonLat, b: LonLat): number {
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_MEAN_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface Projection {
  width: number;
  height: number;
  /** Map coordinates with x to the east and y down (SVG convention). */
  project: (p: LonLat) => [number, number];
}

/**
 * Equirectangular projection fitted to `width`, with longitude squeezed by
 * cos(middle latitude) so shapes look right at that latitude. Good enough for
 * a region the size of Europe; not for the whole globe.
 */
export function equirectangular(bounds: GeoBounds, width: number): Projection {
  const k = Math.cos(rad((bounds.north + bounds.south) / 2));
  const scale = width / ((bounds.east - bounds.west) * k);
  return {
    width,
    height: (bounds.north - bounds.south) * scale,
    project: ([lon, lat]) => [(lon - bounds.west) * k * scale, (bounds.north - lat) * scale],
  };
}

/** SVG path data for a set of polylines. */
export function polylinesToPath(
  lines: readonly (readonly LonLat[])[],
  project: Projection["project"],
): string {
  return lines
    .map(
      (line) =>
        "M" +
        line
          .map((p) => {
            const [x, y] = project(p);
            return `${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join("L"),
    )
    .join("");
}
