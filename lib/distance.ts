const SHILLONG_LAT = 25.5788;
const SHILLONG_LNG = 91.8933;

export function distanceKmFromShillong(coords: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (coords.lat - SHILLONG_LAT) * (Math.PI / 180);
  const dLng = (coords.lng - SHILLONG_LNG) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(SHILLONG_LAT * (Math.PI / 180)) *
    Math.cos(coords.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
