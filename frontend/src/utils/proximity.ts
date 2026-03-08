export function calculateDistanceMeters(
  coordsA: [number, number],
  coordsB: [number, number]
): number {
  const [lng1, lat1] = coordsA;
  const [lng2, lat2] = coordsB;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMeters = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}