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
import { useDeviceLocation } from './useDeviceLocation';
import { useWeatherGeo } from './useWeather';

export type RefreshResult =
  | { status: 'refreshing' }
  | { status: 'cooldown'; minutesLeft: number };

export function useAppWeather() {
  const units = useSettingsStore((s) => s.units);
  const lastRefresh = useRefreshStore((s) => s.lastRefresh);
  const markRefreshed = useRefreshStore((s) => s.markRefreshed);

  // Location: prefer the device's real GPS (accurate), fall back to the API's
  // weather-geo?ip=auto when permission is denied or GPS is unavailable. One
  // request returns location + current + hourly + daily for every screen.
  const device = useDeviceLocation();
  const coords = device.location
    ? { lat: device.location.lat, lon: device.location.lon }
    : null;
  // Wait until GPS resolution finishes so we don't fetch ip=auto then refetch.
  const geo = useWeatherGeo(7, coords, device.status !== 'resolving');
  const bundle = geo.data ?? null;

  // Record a successful fetch time (drives the cooldown). We watch dataUpdatedAt
  // so we only stamp when fresh data actually arrives.
  const lastStamped = useRef(0);
  useEffect(() => {
    if (geo.isSuccess && geo.dataUpdatedAt && geo.dataUpdatedAt !== lastStamped.current) {
      lastStamped.current = geo.dataUpdatedAt;
      markRefreshed(geo.dataUpdatedAt);
    }
  }, [geo.isSuccess, geo.dataUpdatedAt, markRefreshed]);

  // Location name shown in the hero.
  //
  // When we have a real GPS fix we trust ONLY its reverse-geocoded name (e.g.
  // "Kasarani"). We must NOT fall back to the API's ip_geo city here: on mobile
  // that's always the carrier-gateway city ("Nairobi" for every Kenyan SIM), so
  // falling back would overwrite the user's real area with the wrong one. If GPS
  // resolved a fix but Nominatim couldn't name it, we show the flag only (no
  // city) rather than a misleading hard-coded name.
  //
  // Only when there's no GPS fix at all (permission denied / unavailable) do we
  // use the API's ip_geo as a best-effort fallback.
  const hasGps = device.location != null;
  const countryCode = hasGps
    ? device.location?.country ?? bundle?.location?.country
    : bundle?.ip_geo?.country ?? bundle?.location?.country;
  const city = hasGps
    ? device.location?.city ?? ''
    : bundle?.ip_geo?.city ?? '';
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
    // "Loading" includes the GPS-resolving phase (when the query is still
    // disabled) AND the actual fetch — so screens show skeletons the whole
    // time, never a blank screen, until the first data arrives.
    isLoading: (device.status === 'resolving' || geo.isLoading) && !bundle,
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
