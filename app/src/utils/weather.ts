/**
 * Presentation helpers for weather data: WMO condition codes -> human labels
 * and emoji, plus unit-aware formatting for temperature, wind, and time.
 */
import { Units } from '@/types/weather';

/** WMO weather interpretation codes -> short label. */
export function conditionLabel(code: string | number): string {
  const c = Number(code);
  if (c === 0) return 'Clear';
  if (c === 1) return 'Mainly clear';
  if (c === 2) return 'Partly cloudy';
  if (c === 3) return 'Overcast';
  if (c === 45 || c === 48) return 'Fog';
  if (c >= 51 && c <= 57) return 'Drizzle';
  if (c >= 61 && c <= 67) return 'Rain';
  if (c >= 71 && c <= 77) return 'Snow';
  if (c >= 80 && c <= 82) return 'Rain showers';
  if (c === 85 || c === 86) return 'Snow showers';
  if (c >= 95) return 'Thunderstorm';
  return 'Unknown';
}

/** WMO code -> emoji (rough day-neutral icon). */
export function conditionEmoji(code: string | number): string {
  const c = Number(code);
  if (c === 0 || c === 1) return '☀️';
  if (c === 2) return '⛅';
  if (c === 3) return '☁️';
  if (c === 45 || c === 48) return '🌫️';
  if (c >= 51 && c <= 67) return '🌧️';
  if (c >= 71 && c <= 77) return '❄️';
  if (c >= 80 && c <= 82) return '🌦️';
  if (c === 85 || c === 86) return '🌨️';
  if (c >= 95) return '⛈️';
  return '🌡️';
}

/** Format a temperature with the right unit symbol. API values are metric (°C). */
export function formatTemp(celsius: number | undefined, units: Units): string {
  if (celsius == null) return '--°';
  const value = units === 'imperial' ? celsius * 1.8 + 32 : celsius;
  return `${Math.round(value)}°`;
}

/** Temperature number only (no degree sign), for compact UIs. */
export function tempValue(celsius: number | undefined, units: Units): number | null {
  if (celsius == null) return null;
  return Math.round(units === 'imperial' ? celsius * 1.8 + 32 : celsius);
}

/** Format wind speed. API is m/s-ish; show km/h (metric) or mph (imperial). */
export function formatWind(speed: number | undefined, units: Units): string {
  if (speed == null) return '--';
  if (units === 'imperial') return `${Math.round(speed * 2.237)} mph`;
  return `${Math.round(speed * 3.6)} km/h`;
}

/** Wind direction degrees -> compass point. */
export function windDirection(deg: number | undefined): string {
  if (deg == null) return '';
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return points[Math.round(deg / 45) % 8];
}

/** "Mon", "Tue"… from an ISO date. */
export function shortDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

/**
 * Hour label in the user's chosen clock format.
 * '12h' -> "3 PM"; '24h' -> "15:00". (RN can't read the device's clock
 * setting reliably, so the user picks this in Settings.)
 */
export function shortHour(iso: string, clock: '12h' | '24h' = '12h'): string {
  const d = new Date(iso);
  const twelve = clock === '12h';
  return d
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: twelve,
    })
    .replace(':00', ''); // drop ":00" for clean whole hours
}

/** "Mon, 9 Jun" — used to mark when the hourly list crosses into a new day. */
export function dayMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/** True if the device's locale formats time as 12-hour (AM/PM). */
export function usesTwelveHour(): boolean {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
    }).formatToParts(new Date(2020, 0, 1, 13));
    return parts.some((p) => p.type === 'dayPeriod');
  } catch {
    return false; // default to 24h if we can't tell
  }
}

/** Just the day-of-month number, for grouping headers. */
export function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

/** "Updated 5 min ago" style relative label from an ISO time. */
export function relativeTime(iso: string | undefined, now: number): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.round((now - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
