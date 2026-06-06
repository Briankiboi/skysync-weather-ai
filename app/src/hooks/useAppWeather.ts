/**
 * App weather flow (Phase 4) with a 45-minute refresh cooldown.
 *
 * A SINGLE call to /v1/weather-geo?ip=auto returns everything we need
 * (location, ip_geo, current, hourly, daily), so we use just that one request.
 * Units are converted client-side, so changing units never hits the network.
 *
 * Refresh cooldown: after a successful fetch we record the time and block any
 * further API calls — foreground (pull-to-refresh) or background — for 45 min.
 * The timestamp is persisted, so the cooldown survives app restarts.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { enrichCurrent } from '@/api/weather';
import { useSettingsStore } from '@/store/settingsStore';
import {
  canRefresh,
  cooldownRemaining,
  useRefreshStore,
} from '@/store/refreshStore';
import { countryName } from '@/utils/country';
import { useWeatherGeo } from './useWeather';

export type RefreshResult =
  | { status: 'refreshing' }
  | { status: 'cooldown'; minutesLeft: number };

export function useAppWeather() {
  const units = useSettingsStore((s) => s.units);
  const lastRefresh = useRefreshStore((s) => s.lastRefresh);
  const markRefreshed = useRefreshStore((s) => s.markRefreshed);

  const geo = useWeatherGeo(7);
  const bundle = geo.data ?? null;

  // Auto-recovery on reconnect is handled globally by TanStack Query's
  // onlineManager (wired to NetInfo in queryClient.ts) — failed/stale queries
  // refetch automatically when the network returns, on every screen.

  // Record a successful fetch time (drives the cooldown). We watch dataUpdatedAt
  // so we only stamp when fresh data actually arrives.
  const lastStamped = useRef(0);
  useEffect(() => {
    if (geo.isSuccess && geo.dataUpdatedAt && geo.dataUpdatedAt !== lastStamped.current) {
      lastStamped.current = geo.dataUpdatedAt;
      markRefreshed(geo.dataUpdatedAt);
    }
  }, [geo.isSuccess, geo.dataUpdatedAt, markRefreshed]);

  const countryCode = bundle?.ip_geo?.country ?? bundle?.location?.country;
  const city = bundle?.ip_geo?.city ?? '';
  const place = useMemo(() => {
    const country = countryCode ? countryName(countryCode) : '';
    if (city) return country ? `${city}, ${country}` : city;
    return country || 'Your location';
  }, [city, countryCode]);

  const current = useMemo(() => (bundle ? enrichCurrent(bundle) : null), [bundle]);

  /** Cooldown-aware manual refresh (used by pull-to-refresh). */
  const refresh = useCallback(async (): Promise<RefreshResult> => {
    const now = Date.now();
    if (!canRefresh(lastRefresh, now)) {
      const minutesLeft = Math.ceil(cooldownRemaining(lastRefresh, now) / 60000);
      return { status: 'cooldown', minutesLeft };
    }
    await geo.refetch();
    return { status: 'refreshing' };
  }, [lastRefresh, geo]);

  return {
    bundle,
    units,
    place,
    city,
    countryCode,
    location: bundle?.location ?? null,
    current,
    hourly: bundle?.hourly ?? [],
    daily: bundle?.daily ?? [],
    isLoading: geo.isLoading,
    isRefreshing: geo.isFetching,
    error: geo.error ?? null,
    refresh,
    // Cooldown info for the UI.
    lastRefresh,
    cooldownMsLeft: cooldownRemaining(lastRefresh, Date.now()),
    // Data source: live if the last fetch is recent, else cached.
    isCached: !geo.isFetching && geo.isStale,
  };
}
