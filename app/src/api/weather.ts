/**
 * WeatherAI endpoint functions (the six endpoints from the build guide).
 * Each returns a typed payload. No Pro-only endpoints, and none of
 * forecast14 / insights / webhooks / SMS / USSD (per v1 scope).
 */
import { request } from './client';
import {
  CurrentWeather,
  HourlyEntry,
  UsageResponse,
  WeatherBundle,
  WeatherQuery,
} from '@/types/weather';

function weatherParams(q: WeatherQuery) {
  return {
    lat: q.lat,
    lon: q.lon,
    days: q.days,
    units: q.units,
    ai: q.ai,
    lang: q.lang,
  };
}

/** GET /v1/weather — full bundle (current + hourly + daily) for lat/lon. */
export function getWeather(q: WeatherQuery): Promise<WeatherBundle> {
  return request<WeatherBundle>('/v1/weather', weatherParams(q));
}

/**
 * GET /v1/weather-geo?ip=auto — detect location from the request IP and
 * return the full weather bundle for it. Optionally override with lat/lon.
 */
export function getWeatherGeo(
  opts: { ip?: string; lat?: number; lon?: number; days?: number; ai?: boolean } = {},
): Promise<WeatherBundle> {
  const { ip = 'auto', lat, lon, days, ai } = opts;
  return request<WeatherBundle>('/v1/weather-geo', { ip, lat, lon, days, ai });
}

/** GET /v1/current — present-moment conditions (bundle includes current). */
export async function getCurrent(q: WeatherQuery): Promise<CurrentWeather> {
  const bundle = await request<WeatherBundle>('/v1/current', weatherParams(q));
  return enrichCurrent(bundle);
}

/** GET /v1/daily — day-by-day forecast (returned in the bundle's `daily`). */
export function getDaily(q: WeatherQuery): Promise<WeatherBundle> {
  return request<WeatherBundle>('/v1/daily', weatherParams(q));
}

/** GET /v1/hourly — hour-by-hour forecast (bundle's `hourly`). */
export function getHourly(q: WeatherQuery): Promise<HourlyEntry[]> {
  return request<WeatherBundle>('/v1/hourly', weatherParams(q)).then(
    (b) => b.hourly ?? [],
  );
}

/** GET /v1/usage — plan limits and remaining quota. */
export function getUsage(): Promise<UsageResponse> {
  return request<UsageResponse>('/v1/usage');
}

/**
 * The raw `current` object lacks humidity/feels_like — those live on the
 * hourly entries. current.time has minutes (e.g. 20:30) while hourly is on
 * the hour (20:00), so we match the *closest* hour, not an exact string.
 */
export function enrichCurrent(bundle: WeatherBundle): CurrentWeather {
  const { current, hourly } = bundle;
  if (!current) return current;
  const match = nearestHourly(hourly, current.time);
  return {
    ...current,
    feels_like: current.feels_like ?? match?.feels_like,
    humidity: current.humidity ?? match?.humidity,
    uv_index: current.uv_index ?? match?.uv_index,
  };
}

function nearestHourly(
  hourly: WeatherBundle['hourly'],
  iso: string,
): WeatherBundle['hourly'][number] | undefined {
  if (!hourly?.length) return undefined;
  const target = new Date(iso).getTime();
  let best = hourly[0];
  let bestDiff = Infinity;
  for (const h of hourly) {
    const diff = Math.abs(new Date(h.time).getTime() - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = h;
    }
  }
  return best;
}
