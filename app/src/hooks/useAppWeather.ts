/**
 * App weather flow (Phase 4).
 *
 * A SINGLE call to /v1/weather-geo?ip=auto returns everything we need:
 * detected location, ip_geo (city/country), current, hourly, and daily.
 * So we use just that one request — no separate /v1/weather call — which
 * keeps API usage minimal. Units are converted client-side in the formatters,
 * so changing units never triggers a network request.
 *
 * Cached data renders immediately (persisted client) and a background refresh
 * updates it only when stale; successful responses are saved locally.
 */
import { useMemo } from 'react';
import { enrichCurrent } from '@/api/weather';
import { useSettingsStore } from '@/store/settingsStore';
import { countryName } from '@/utils/country';
import { useWeatherGeo } from './useWeather';

export function useAppWeather() {
  const units = useSettingsStore((s) => s.units);

  // One request gives location + ip_geo + current + hourly + daily.
  const geo = useWeatherGeo(7);
  const bundle = geo.data ?? null;

  const countryCode = bundle?.ip_geo?.country ?? bundle?.location?.country;
  const place = useMemo(() => {
    const city = bundle?.ip_geo?.city;
    const country = countryCode ? countryName(countryCode) : '';
    if (city) return country ? `${city}, ${country}` : city;
    return country || 'Your location';
  }, [bundle, countryCode]);

  // current lacks humidity/feels-like/UV — enrich from the nearest hourly entry.
  const current = useMemo(() => (bundle ? enrichCurrent(bundle) : null), [bundle]);

  return {
    bundle,
    units,
    place,
    countryCode,
    location: bundle?.location ?? null,
    current,
    hourly: bundle?.hourly ?? [],
    daily: bundle?.daily ?? [],
    isLoading: geo.isLoading,
    isRefreshing: geo.isFetching,
    error: geo.error ?? null,
    refetch: geo.refetch,
  };
}
