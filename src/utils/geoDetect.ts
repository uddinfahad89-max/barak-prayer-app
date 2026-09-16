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

export function isWithinBarakValley(lat: number, lon: number): boolean {
  // Center of Barak Valley is roughly Silchar (24.8333, 92.7789)
  // Barak Valley spans roughly within ~75 km radius of Silchar
  const dist = calculateDistanceKm(lat, lon, 24.8333, 92.7789);
  return dist <= 75;
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
 * Calculate Qibla bearing (compass angle towards the Holy Kaaba in Makkah)
 * Kaaba coordinates: 21.422487° N, 39.826206° E
 */
export const MAKKAH_LAT = 21.422487;
export const MAKKAH_LON = 39.826206;

export function calculateQiblaBearing(lat: number, lon: number): number {
  const phiK = (MAKKAH_LAT * Math.PI) / 180.0;
  const lambdaK = (MAKKAH_LON * Math.PI) / 180.0;
  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lon * Math.PI) / 180.0;

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qibla = (Math.atan2(y, x) * 180.0) / Math.PI;
  qibla = (qibla + 360.0) % 360.0;
  return Math.round(qibla * 10) / 10;
}

export function calculateDistanceToMakkah(lat: number, lon: number): number {
  return Math.round(calculateDistanceKm(lat, lon, MAKKAH_LAT, MAKKAH_LON));
}

/**
 * Reverse geocode coordinates to get user place name with multiple fast fallbacks
 */
export async function reverseGeocodeCity(lat: number, lon: number): Promise<{ city: string; fullAddress?: string; addressObj?: Record<string, string> }> {
  // 1. Try BigDataCloud Client Reverse Geocoding (fast, CORS-friendly, reliable worldwide)
  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (bdcRes.ok) {
      const data = await bdcRes.json();
      const city = data.city || data.locality || data.principalSubdivision || data.countryName;
      if (city && city.trim().length > 0) {
        return {
          city: city.trim(),
          fullAddress: `${city}, ${data.principalSubdivision || ''}`,
          addressObj: {
            city: data.city || '',
            locality: data.locality || '',
            region: data.principalSubdivision || '',
            country: data.countryName || '',
          },
        };
      }
    }
  } catch {
    // try next
  }

  // 2. Try OpenStreetMap Nominatim
  try {
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    );
    if (nomRes.ok) {
      const data = await nomRes.json();
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.county ||
        address.state_district ||
        address.state;
      if (city) {
        return {
          city: city.trim(),
          fullAddress: data.display_name,
          addressObj: address,
        };
      }
    }
  } catch {
    // fallback
  }

  // 3. Fallback to nearest Barak Valley / Indian city coordinate
  const { constituency } = findClosestConstituency(lat, lon);
  return { city: constituency.name };
}

/**
 * Match by text tokens from reverse geocode response
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

