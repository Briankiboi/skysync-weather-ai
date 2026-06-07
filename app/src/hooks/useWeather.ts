/**
 * TanStack Query hooks for WeatherAI.
 *
 * The primary flow uses geo-detected location (Phase 4): useWeatherGeo() runs
 * on launch, and the lat/lon it returns drives the other queries. All queries
 * inherit the offline-first caching defaults from the shared query client.
 */
import { useQuery } from '@tanstack/react-query';
import {
  getDaily,
  getHourly,
  getUsage,
  getWeather,
  getWeatherGeo,
  enrichCurrent,
} from '@/api/weather';
import { WeatherQuery } from '@/types/weather';

export const weatherKeys = {
  geo: ['weather', 'geo'] as const,
  weather: (q: WeatherQuery) => ['weather', 'bundle', q] as const,
  daily: (q: WeatherQuery) => ['weather', 'daily', q] as const,
  hourly: (q: WeatherQuery) => ['weather', 'hourly', q] as const,
  usage: ['weather', 'usage'] as const,
};

/**
 * Location + full weather bundle. If GPS coords are given, they drive the
 * request (precise); otherwise it falls back to ip=auto (per the Guide).
 * `enabled` lets the caller wait until GPS resolution finishes first.
 */
export function useWeatherGeo(
  days = 7,
  coords?: { lat: number; lon: number } | null,
  enabled = true,
) {
  // Round so tiny GPS jitter doesn't churn the cache key.
  const lat = coords ? Math.round(coords.lat * 100) / 100 : undefined;
  const lon = coords ? Math.round(coords.lon * 100) / 100 : undefined;
  return useQuery({
    queryKey: [...weatherKeys.geo, days, lat ?? 'ip', lon ?? 'auto'],
    queryFn: () =>
      coords
        ? getWeatherGeo({ lat, lon, days })
        : getWeatherGeo({ ip: 'auto', days }),
    enabled,
  });
}

/** Full bundle for an explicit lat/lon (e.g. a saved location). */
export function useWeather(q: WeatherQuery | null) {
  return useQuery({
    queryKey: q ? weatherKeys.weather(q) : ['weather', 'bundle', 'idle'],
    queryFn: () => getWeather(q as WeatherQuery),
    enabled: !!q,
  });
}

/** Current conditions, enriched with humidity/feels-like from hourly. */
export function useCurrent(q: WeatherQuery | null) {
  return useQuery({
    queryKey: q ? ['weather', 'current', q] : ['weather', 'current', 'idle'],
    queryFn: async () => enrichCurrent(await getWeather(q as WeatherQuery)),
    enabled: !!q,
  });
}

export function useDaily(q: WeatherQuery | null) {
  return useQuery({
    queryKey: q ? weatherKeys.daily(q) : ['weather', 'daily', 'idle'],
    queryFn: async () => (await getDaily(q as WeatherQuery)).daily ?? [],
    enabled: !!q,
  });
}

export function useHourly(q: WeatherQuery | null) {
  return useQuery({
    queryKey: q ? weatherKeys.hourly(q) : ['weather', 'hourly', 'idle'],
    queryFn: () => getHourly(q as WeatherQuery),
    enabled: !!q,
  });
}

/** Account usage / quota. */
export function useUsage() {
  return useQuery({
    queryKey: weatherKeys.usage,
    queryFn: getUsage,
    // /v1/usage is free (no quota cost), so unlike the weather queries it can
    // recover automatically when the network comes back and retry more.
    refetchOnReconnect: true,
    staleTime: 60_000,
    retry: 2,
  });
}
