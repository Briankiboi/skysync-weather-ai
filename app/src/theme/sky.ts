/**
 * Dynamic "weather sky" — a subtle, theme-aware background tint that reflects
 * the current condition and time of day. Crucially it respects light/dark
 * mode: light mode always stays light & airy (dark text stays readable), dark
 * mode stays deep. Modern, clean colors (no muddy washes).
 */

export type SkyCondition =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'fog';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export type ColorScheme = 'light' | 'dark';

export type Sky = {
  gradient: [string, string, string];
};

/** Bucket an hour (0–23) into a time-of-day. */
export function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

/** Map a free-form condition label to our sky condition. */
export function conditionFromText(text?: string): SkyCondition {
  const t = (text ?? '').toLowerCase();
  if (/thunder|storm|lightning/.test(t)) return 'storm';
  if (/snow|sleet|flurr|ice|hail/.test(t)) return 'snow';
  if (/rain|drizzle|shower/.test(t)) return 'rain';
  if (/fog|mist|haze/.test(t)) return 'fog';
  if (/overcast|cloudy|clouds/.test(t)) return 'cloudy';
  if (/partly|mostly|mainly|few|scattered/.test(t)) return 'partly';
  if (/clear|sun|fair/.test(t)) return 'clear';
  return 'partly';
}

/**
 * LIGHT mode skies — always light & airy so dark navy text stays readable.
 * Modern pastel tints per condition; bottom fades to near-white.
 */
const LIGHT: Record<SkyCondition, [string, string, string]> = {
  clear: ['#E8F2FF', '#F3F8FF', '#FFFFFF'],
  partly: ['#E6EFFB', '#F2F7FE', '#FFFFFF'],
  cloudy: ['#EAEEF3', '#F4F6F9', '#FFFFFF'],
  rain: ['#E3EAF1', '#EEF3F8', '#FFFFFF'],
  storm: ['#E4E7EE', '#EFF1F6', '#FFFFFF'],
  snow: ['#EEF4F9', '#F6FAFD', '#FFFFFF'],
  fog: ['#EDEFF2', '#F5F6F8', '#FFFFFF'],
};

/** Warm light tints for dawn/dusk (still light overall). */
const LIGHT_WARM: [string, string, string] = ['#FFEFE0', '#FFF6EE', '#FFFFFF'];

/**
 * DARK mode skies — deep modern colors per condition.
 */
const DARK: Record<SkyCondition, [string, string, string]> = {
  clear: ['#0E1730', '#14213F', '#0B1226'],
  partly: ['#101A33', '#172642', '#0C1428'],
  cloudy: ['#161C28', '#1F2733', '#10141C'],
  rain: ['#121A26', '#1A2532', '#0D131C'],
  storm: ['#0F141E', '#181F2C', '#0A0E16'],
  snow: ['#16202F', '#202C40', '#101726'],
  fog: ['#171B22', '#212733', '#10131A'],
};

/** Warm dark tints for dusk. */
const DARK_WARM: [string, string, string] = ['#241826', '#1C1622', '#120E18'];

/** Resolve the sky for a condition + time of day + color scheme. */
export function resolveSky(
  condition: SkyCondition,
  tod: TimeOfDay,
  scheme: ColorScheme,
): Sky {
  if (scheme === 'light') {
    if (tod === 'dawn' || tod === 'dusk') return { gradient: LIGHT_WARM };
    return { gradient: LIGHT[condition] };
  }
  // dark
  if (tod === 'dusk') return { gradient: DARK_WARM };
  return { gradient: DARK[condition] };
}
