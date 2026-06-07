/**
 * Reverse geocoding (coordinates → place name).
 *
 * The on-device Android geocoder (Location.reverseGeocodeAsync) is unreliable
 * on many phones — on Samsung devices it often returns an empty array or null
 * fields, which left the app falling back to the carrier-IP city ("Nairobi")
 * for everyone. We instead reverse-geocode the GPS coordinates with the free
 * OpenStreetMap Nominatim API, which returns the real neighbourhood/suburb/town
 * (e.g. "Kasarani") for any coordinate on Earth, with no API key.
 */

export type GeoPlace = {
  /** Most specific real area name (e.g. "Kasarani"), when resolvable. */
  city?: string;
  region?: string;
  /** ISO 3166-1 alpha-2 country code (e.g. "KE"), for the flag. */
  country?: string;
};

type NominatimAddress = {
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city_district?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city?: string;
  county?: string;
  state?: string;
  country_code?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
};

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

/**
 * OSM boundary names often carry a trailing administrative descriptor —
 * "Zimmerman location", "Githurai division", "X sublocation", "Y ward". Those
 * read awkwardly as a place name, so we strip a single trailing descriptor to
 * get the plain area ("Zimmerman"). Only the LAST word is removed, so real
 * multi-word names (e.g. "South B") are preserved.
 */
const ADMIN_SUFFIXES = new Set([
  'location',
  'sublocation',
  'division',
  'ward',
  'district',
  'subcounty',
  'sub-county',
  'county',
  'estate',
  'area',
]);

function cleanArea(name: string | undefined): string | undefined {
  if (!name) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    const last = parts[parts.length - 1].toLowerCase();
    if (ADMIN_SUFFIXES.has(last)) {
      return parts.slice(0, -1).join(' ');
    }
  }
  return name.trim();
}

/**
 * Reverse-geocode coordinates to a real area name via OpenStreetMap Nominatim.
 * Returns {} on any failure — the caller keeps working with coords-only weather.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoPlace> {
  try {
    const url =
      `${ENDPOINT}?lat=${lat}&lon=${lon}&format=json&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        // Nominatim's usage policy requires a descriptive User-Agent.
        'User-Agent': 'SkySyncWeather/1.0 (https://skysync.app)',
        Accept: 'application/json',
      },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as NominatimResponse;
    const a = data.address;
    if (!a) return {};

    // Prefer the most specific local area over the broad administrative city,
    // so we show "Kasarani" rather than "Nairobi".
    const area =
      a.neighbourhood ||
      a.suburb ||
      a.quarter ||
      a.city_district ||
      a.town ||
      a.village ||
      a.municipality ||
      a.city ||
      a.county ||
      undefined;

    return {
      city: cleanArea(area),
      region: a.state ?? undefined,
      country: a.country_code ? a.country_code.toUpperCase() : undefined,
    };
  } catch {
    return {};
  }
}
