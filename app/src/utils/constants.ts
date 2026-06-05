/** App-wide constants. Keep magic strings/numbers here. */

export const APP_NAME = 'SkySync';

/** Storage keys (namespaced to avoid collisions). */
export const STORAGE_KEYS = {
  settings: 'skysync-settings',
  weatherCache: 'skysync-weather-cache',
} as const;

/** Cache / refresh timing. */
export const CACHE = {
  staleTime: 5 * 60 * 1000, // 5 min
  gcTime: 24 * 60 * 60 * 1000, // 24 h
} as const;
