/**
 * Country code helpers — fully client-side (no API calls).
 * - countryName: ISO 3166-1 alpha-2 code -> human name.
 * - countryFlag: code -> emoji flag (regional-indicator letters).
 */

/** Convert "KE" -> 🇰🇪 using Unicode regional indicator symbols. */
export function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return '';
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return '';
  const A = 0x1f1e6; // regional indicator 'A'
  const base = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    A + (cc.charCodeAt(0) - base),
    A + (cc.charCodeAt(1) - base),
  );
}

/** Human country name from a 2-letter code. Uses the platform Intl data when
 *  available, with a small fallback list for common cases. */
export function countryName(code?: string): string {
  if (!code) return '';
  const cc = code.toUpperCase();
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    const name = dn.of(cc);
    if (name && name !== cc) return name;
  } catch {
    // Intl.DisplayNames not available — fall through to the map.
  }
  return FALLBACK[cc] ?? cc;
}

// Minimal fallback for environments without Intl.DisplayNames region data.
const FALLBACK: Record<string, string> = {
  KE: 'Kenya',
  US: 'United States',
  GB: 'United Kingdom',
  NG: 'Nigeria',
  ZA: 'South Africa',
  TZ: 'Tanzania',
  UG: 'Uganda',
  IN: 'India',
  DE: 'Germany',
  FR: 'France',
};
