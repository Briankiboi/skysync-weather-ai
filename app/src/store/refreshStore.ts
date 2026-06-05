import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { storage } from '@/utils/storage';

/** 30-minute cooldown between weather refreshes (foreground + background). */
export const REFRESH_COOLDOWN_MS = 30 * 60 * 1000;

type RefreshState = {
  /** Timestamp (ms) of the last successful weather refresh. */
  lastRefresh: number | null;
  /** Record a successful refresh now. */
  markRefreshed: (at: number) => void;
};

const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name),
  setItem: (name, value) => storage.setString(name, value),
  removeItem: (name) => storage.remove(name),
};

/**
 * Persists the last successful refresh time so the cooldown survives app
 * restarts. Backed by the swappable storage layer (MMKV-ready).
 */
export const useRefreshStore = create<RefreshState>()(
  persist(
    (set) => ({
      lastRefresh: null,
      markRefreshed: (at) => set({ lastRefresh: at }),
    }),
    {
      name: 'skysync-refresh',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/** Milliseconds remaining until a refresh is allowed (0 if allowed now). */
export function cooldownRemaining(lastRefresh: number | null, now: number): number {
  if (lastRefresh == null) return 0;
  return Math.max(0, lastRefresh + REFRESH_COOLDOWN_MS - now);
}

/** True if a refresh is allowed right now. */
export function canRefresh(lastRefresh: number | null, now: number): boolean {
  return cooldownRemaining(lastRefresh, now) === 0;
}
