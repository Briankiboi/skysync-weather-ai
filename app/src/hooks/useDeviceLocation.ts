import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { reverseGeocode } from '@/api/geocode';

export type DeviceLocation = {
  lat: number;
  lon: number;
  /** Reverse-geocoded place name (e.g. "Thika"), when available. */
  city?: string;
  region?: string;
  country?: string;
};

export type LocationStatus = 'resolving' | 'granted' | 'denied' | 'unavailable';

type State = {
  location: DeviceLocation | null;
  status: LocationStatus;
};

// ---------------------------------------------------------------------------
// Shared, resolve-once location state.
//
// Several screens read the device location (Home + Settings). If each screen's
// hook ran its own GPS + reverse-geocode, they'd prompt twice and could show
// different results (e.g. Home resolves "Zimmerman location" while Settings is
// still on the IP fallback "Kenya"). Instead we resolve ONCE at the module
// level and let every hook instance subscribe to the same state, so every
// screen shows the identical, fully-resolved area.
// ---------------------------------------------------------------------------

let sharedState: State = { location: null, status: 'resolving' };
const subscribers = new Set<(s: State) => void>();
let resolveStarted = false;

function setShared(next: State): void {
  sharedState = next;
  subscribers.forEach((fn) => fn(next));
}

/** Resolve a usable coordinate without hanging or hard-failing indoors.
 *
 * Strategy, fastest-acceptable-first:
 *  1. Last-known fix (instant; often good enough for weather).
 *  2. A fresh fix at Low accuracy (uses wifi/cell, works indoors) with a hard
 *     timeout so we never hang on a GPS lock that won't come.
 *  3. Last-known again as a final fallback.
 * Only if all three yield nothing do we report null and let the caller use the
 * IP fallback. This avoids the common "GPS hasn't locked yet indoors" failure
 * that previously dropped us straight to the carrier city ("Nairobi").
 */
async function getUsablePosition(): Promise<Location.LocationObject | null> {
  const last = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000 });
  if (last) return last;

  try {
    const fresh = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }),
      8000,
    );
    if (fresh) return fresh;
  } catch {
    // fall through to one more last-known attempt
  }

  return Location.getLastKnownPositionAsync();
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    const t = setTimeout(() => resolve(null), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      () => {
        clearTimeout(t);
        resolve(null);
      },
    );
  });
}

async function resolveLocation(): Promise<void> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setShared({ location: null, status: 'denied' });
      return;
    }

    const pos = await getUsablePosition();
    if (!pos) {
      // Permission granted but no fix available at all — fall back to IP.
      setShared({ location: null, status: 'unavailable' });
      return;
    }

    const base = toLocation(pos);
    setShared({ location: base, status: 'granted' }); // paint coords immediately
    const place = await reverseGeocode(base.lat, base.lon);
    setShared({ location: { ...base, ...place }, status: 'granted' });
  } catch {
    setShared({ location: null, status: 'unavailable' });
  }
}

/**
 * Gets the device's real GPS location (with a one-time permission prompt) and
 * reverse-geocodes it to a place name. Resolution runs once per app session and
 * is shared across all callers.
 *
 * GPS is the only accurate location source on mobile: IP geolocation (ip=auto)
 * routes through carrier gateways (e.g. every Kenyan SIM resolves to Nairobi),
 * so it can't see the user's real town. When permission is denied or GPS is
 * unavailable, `location` stays null and the caller falls back to ip=auto —
 * the app always works, it just loses precision.
 */
export function useDeviceLocation(): State {
  const [state, setState] = useState<State>(sharedState);

  useEffect(() => {
    subscribers.add(setState);
    // Re-sync in case resolution finished between render and effect.
    setState(sharedState);

    if (!resolveStarted) {
      resolveStarted = true;
      void resolveLocation();
    }

    return () => {
      subscribers.delete(setState);
    };
  }, []);

  return state;
}

function toLocation(pos: Location.LocationObject): DeviceLocation {
  return { lat: pos.coords.latitude, lon: pos.coords.longitude };
}
