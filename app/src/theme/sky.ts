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
  // Bright sunny blue sky
  clear: ['#7EC0FF', '#B8DEFF', '#EAF5FF'],
  // Blue sky with a hint of cloud grey
  partly: ['#9CC7EC', '#C7DEF2', '#EDF3FA'],
  // Soft overcast grey
  cloudy: ['#AAB4BF', '#C9D1D9', '#EDEFF2'],
  // Cooler, rainy blue-grey
  rain: ['#8C9CAB', '#AEBDC9', '#E2E8EE'],
  // Moody storm grey
  storm: ['#7C8694', '#9AA4B2', '#DADEE4'],
  // Crisp pale snow blue
  snow: ['#C2D6E6', '#DCE9F3', '#F3F8FC'],
  // Hazy desaturated grey
  fog: ['#B6BCC2', '#D0D4D9', '#EEF0F2'],
};

/** Warm sunrise/sunset tints (light overall). */
const LIGHT_WARM: [string, string, string] = ['#FFC089', '#FFD9B0', '#FFF0E0'];

/**
 * DARK mode skies — deep modern colors per condition.
 */
const DARK: Record<SkyCondition, [string, string, string]> = {
  // Clear night — deep starry royal blue
  clear: ['#16336B', '#102449', '#0A1730'],
  // Partly — indigo-blue night
  partly: ['#22315E', '#172445', '#0E182F'],
  // Cloudy — distinct slate grey
  cloudy: ['#2B333F', '#20262F', '#14181F'],
  // Rain — cool teal-grey (recognizably "wet")
  rain: ['#15303A', '#102329', '#0A171C'],
  // Storm — near-black with a cold edge
  storm: ['#1A1F2B', '#11141C', '#08090D'],
  // Snow — icy deep blue
  snow: ['#1F3A57', '#172B42', '#0F1D2E'],
  // Fog — desaturated charcoal
  fog: ['#2A2F36', '#1E2228', '#13161A'],
};

/** Warm purple sunset tint for dusk in dark mode. */
const DARK_WARM: [string, string, string] = ['#4A2456', '#321840', '#1C0E28'];

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
