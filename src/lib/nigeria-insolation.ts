export interface NigerianLocation {
  name: string;
  state: string;
  lat: number;
  lng: number;
  peakSunHours: number;
  zone: string;
}

export const NIGERIAN_LOCATIONS: NigerianLocation[] = [
  // Northern Nigeria (Sahel) — High insolation
  { name: "Sokoto", state: "Sokoto", lat: 13.06, lng: 5.24, peakSunHours: 6.5, zone: "North West" },
  { name: "Maiduguri", state: "Borno", lat: 11.85, lng: 13.16, peakSunHours: 6.5, zone: "North East" },
  { name: "Kano", state: "Kano", lat: 12.0, lng: 8.52, peakSunHours: 6.2, zone: "North West" },
  { name: "Katsina", state: "Katsina", lat: 13.0, lng: 7.6, peakSunHours: 6.3, zone: "North West" },
  { name: "Zamfara", state: "Zamfara", lat: 12.17, lng: 6.25, peakSunHours: 6.3, zone: "North West" },
  { name: "Kebbi", state: "Kebbi", lat: 12.45, lng: 4.2, peakSunHours: 6.4, zone: "North West" },
  { name: "Jigawa", state: "Jigawa", lat: 12.22, lng: 9.56, peakSunHours: 6.2, zone: "North West" },
  { name: "Yobe", state: "Yobe", lat: 12.29, lng: 11.75, peakSunHours: 6.4, zone: "North East" },
  { name: "Bauchi", state: "Bauchi", lat: 10.31, lng: 9.84, peakSunHours: 6.0, zone: "North East" },
  { name: "Gombe", state: "Gombe", lat: 10.29, lng: 11.17, peakSunHours: 6.0, zone: "North East" },
  { name: "Adamawa", state: "Adamawa", lat: 9.33, lng: 12.5, peakSunHours: 5.8, zone: "North East" },
  { name: "Taraba", state: "Taraba", lat: 7.87, lng: 9.78, peakSunHours: 5.5, zone: "North East" },

  // Middle Belt — Moderate-high insolation
  { name: "Abuja", state: "FCT", lat: 9.06, lng: 7.49, peakSunHours: 5.5, zone: "North Central" },
  { name: "Jos", state: "Plateau", lat: 9.92, lng: 8.89, peakSunHours: 5.8, zone: "North Central" },
  { name: "Kaduna", state: "Kaduna", lat: 10.52, lng: 7.44, peakSunHours: 5.8, zone: "North West" },
  { name: "Ilorin", state: "Kwara", lat: 8.5, lng: 4.55, peakSunHours: 5.3, zone: "North Central" },
  { name: "Minna", state: "Niger", lat: 9.62, lng: 6.55, peakSunHours: 5.5, zone: "North Central" },
  { name: "Lokoja", state: "Kogi", lat: 7.8, lng: 6.74, peakSunHours: 5.2, zone: "North Central" },
  { name: "Makurdi", state: "Benue", lat: 7.73, lng: 8.54, peakSunHours: 5.3, zone: "North Central" },
  { name: "Lafia", state: "Nasarawa", lat: 8.49, lng: 8.52, peakSunHours: 5.4, zone: "North Central" },

  // South West — Moderate insolation
  { name: "Lagos", state: "Lagos", lat: 6.52, lng: 3.38, peakSunHours: 4.2, zone: "South West" },
  { name: "Ibadan", state: "Oyo", lat: 7.38, lng: 3.95, peakSunHours: 4.5, zone: "South West" },
  { name: "Abeokuta", state: "Ogun", lat: 7.16, lng: 3.35, peakSunHours: 4.4, zone: "South West" },
  { name: "Akure", state: "Ondo", lat: 7.25, lng: 5.2, peakSunHours: 4.4, zone: "South West" },
  { name: "Ado-Ekiti", state: "Ekiti", lat: 7.62, lng: 5.22, peakSunHours: 4.5, zone: "South West" },
  { name: "Osogbo", state: "Osun", lat: 7.77, lng: 4.56, peakSunHours: 4.5, zone: "South West" },

  // South East — Lower insolation
  { name: "Enugu", state: "Enugu", lat: 6.44, lng: 7.5, peakSunHours: 4.8, zone: "South East" },
  { name: "Owerri", state: "Imo", lat: 5.48, lng: 7.03, peakSunHours: 4.2, zone: "South East" },
  { name: "Awka", state: "Anambra", lat: 6.21, lng: 7.07, peakSunHours: 4.5, zone: "South East" },
  { name: "Abakaliki", state: "Ebonyi", lat: 6.33, lng: 8.1, peakSunHours: 4.6, zone: "South East" },
  { name: "Umuahia", state: "Abia", lat: 5.53, lng: 7.49, peakSunHours: 4.3, zone: "South East" },

  // South South — Lower insolation (coastal/rainforest)
  { name: "Benin City", state: "Edo", lat: 6.34, lng: 5.63, peakSunHours: 4.3, zone: "South South" },
  { name: "Port Harcourt", state: "Rivers", lat: 4.82, lng: 7.03, peakSunHours: 3.8, zone: "South South" },
  { name: "Calabar", state: "Cross River", lat: 4.95, lng: 8.32, peakSunHours: 3.5, zone: "South South" },
  { name: "Uyo", state: "Akwa Ibom", lat: 5.04, lng: 7.93, peakSunHours: 3.8, zone: "South South" },
  { name: "Asaba", state: "Delta", lat: 6.2, lng: 6.73, peakSunHours: 4.2, zone: "South South" },
  { name: "Yenagoa", state: "Bayelsa", lat: 4.92, lng: 6.26, peakSunHours: 3.6, zone: "South South" },
];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestLocation(lat: number, lng: number): NigerianLocation | null {
  if (NIGERIAN_LOCATIONS.length === 0) return null;

  let nearest = NIGERIAN_LOCATIONS[0];
  let minDist = haversineDistance(lat, lng, nearest.lat, nearest.lng);

  for (let i = 1; i < NIGERIAN_LOCATIONS.length; i++) {
    const dist = haversineDistance(lat, lng, NIGERIAN_LOCATIONS[i].lat, NIGERIAN_LOCATIONS[i].lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = NIGERIAN_LOCATIONS[i];
    }
  }

  // If more than 500km from any Nigerian city, probably not in Nigeria
  if (minDist > 500) return null;

  return nearest;
}
