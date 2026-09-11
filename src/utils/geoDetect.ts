export interface ConstituencyCoord {
  id: string;
  name: string;
  nameBn: string;
  lat: number;
  lon: number;
  offset: number;
}

export const CONSTITUENCY_COORDS: ConstituencyCoord[] = [
  { id: 'silchar', name: 'Silchar', nameBn: 'শিলচর', lat: 24.8333, lon: 92.7789, offset: 0 },
  { id: 'sonai', name: 'Sonai', nameBn: 'সোনাই', lat: 24.7170, lon: 92.8940, offset: 0 },
  { id: 'dholai', name: 'Dholai', nameBn: 'ধোলাই', lat: 24.5980, lon: 92.8420, offset: 0 },
  { id: 'udharbond', name: 'Udharbond', nameBn: 'উদারবন্দ', lat: 24.8960, lon: 92.8900, offset: 0 },
  { id: 'lakhipur', name: 'Lakhipur', nameBn: 'লক্ষীপুর', lat: 24.7950, lon: 93.0110, offset: -1 },
  { id: 'barkhola', name: 'Barkhola', nameBn: 'বারখলা', lat: 24.9330, lon: 92.7500, offset: 0 },
  { id: 'katigorah', name: 'Katigorah', nameBn: 'কাটিগড়া', lat: 24.9660, lon: 92.6000, offset: 1 },
  { id: 'hailakandi', name: 'Hailakandi', nameBn: 'হাইলাকান্দি', lat: 24.6830, lon: 92.5670, offset: -1 },
  { id: 'algapur', name: 'Algapur', nameBn: 'আলগাপুর', lat: 24.7670, lon: 92.5330, offset: -1 },
  { id: 'katlicherra', name: 'Katlicherra', nameBn: 'কাটলীছড়া', lat: 24.5170, lon: 92.5500, offset: -1 },
  { id: 'lala', name: 'Lala', nameBn: 'লালা', lat: 24.5500, lon: 92.6000, offset: -1 },
  { id: 'karimganj_north', name: 'Karimganj North', nameBn: 'করিমগঞ্জ উত্তর', lat: 24.8670, lon: 92.3500, offset: 2 },
  { id: 'karimganj_south', name: 'Karimganj South', nameBn: 'করিমগঞ্জ দক্ষিণ', lat: 24.8100, lon: 92.3300, offset: 2 },
  { id: 'badarpur', name: 'Badarpur', nameBn: 'বদরপুর', lat: 24.9000, lon: 92.5500, offset: 1 },
  { id: 'patharkandi', name: 'Patharkandi', nameBn: 'পাথারকান্দি', lat: 24.6170, lon: 92.3330, offset: 2 },
  { id: 'ratabari', name: 'Ratabari', nameBn: 'রাতাবাড়ী', lat: 24.5000, lon: 92.4000, offset: 2 },
];

/**
 * Calculate distance in km between two lat/lon pairs using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the closest Barak Valley constituency given GPS coordinates
 */
export function findClosestConstituency(
  lat: number,
  lon: number
): { constituency: ConstituencyCoord; distanceKm: number } {
  let closest = CONSTITUENCY_COORDS[0];
  let minDistance = calculateDistanceKm(lat, lon, closest.lat, closest.lon);

  for (let i = 1; i < CONSTITUENCY_COORDS.length; i++) {
    const item = CONSTITUENCY_COORDS[i];
    const dist = calculateDistanceKm(lat, lon, item.lat, item.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return {
    constituency: closest,
    distanceKm: Math.round(minDistance * 10) / 10,
  };
}

/**
 * Match by text tokens from Nominatim reverse geocode response
 */
export function matchConstituencyByAddressText(address: Record<string, string>): ConstituencyCoord | null {
  const fullText = Object.values(address).join(' ').toLowerCase();

  for (const c of CONSTITUENCY_COORDS) {
    const enName = c.name.toLowerCase();
    const id = c.id.toLowerCase();
    if (fullText.includes(enName) || fullText.includes(id)) {
      return c;
    }
  }
  return null;
}
