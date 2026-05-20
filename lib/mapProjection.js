export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 520;

export function projectLngLat(lng, lat) {
  const safeLng = Math.max(-180, Math.min(180, Number(lng)));
  const safeLat = Math.max(-85, Math.min(85, Number(lat)));
  const x = ((safeLng + 180) / 360) * MAP_WIDTH;
  const latRad = (safeLat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = MAP_HEIGHT / 2 - (MAP_WIDTH * mercN) / (2 * Math.PI);
  return { x, y: Math.max(0, Math.min(MAP_HEIGHT, y)) };
}

export function riskColor(level) {
  const normalized = String(level || '').toLowerCase();
  if (normalized.includes('high')) return '#dc2626';
  if (normalized.includes('medium')) return '#f59e0b';
  if (normalized.includes('low')) return '#16a34a';
  return '#64748b';
}
