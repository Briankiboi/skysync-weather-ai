import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';

/**
 * Wire TanStack Query's online manager to NetInfo. Without this, React Native
 * has no idea when the device reconnects, so `refetchOnReconnect` never fires.
 * With it, queries that failed while offline recover automatically once the
 * network is back — across every screen. (Official RN integration.)
 */
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(Boolean(state.isConnected));
  }),
);

/**
 * Shared TanStack Query client.
 * Tuned for offline-first weather: serve cached data instantly, retry transient
 * failures, and recover automatically when connectivity returns.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Weather data is fresh for 30 min (matches the refresh cooldown), so
      // background refetches won't hit the API before then. Main lever for
      // keeping API usage low.
      staleTime: 30 * 60 * 1000, // 30 min — matches REFRESH_COOLDOWN_MS
      gcTime: 24 * 60 * 60 * 1000, // keep cache 24h for offline use
      retry: 1, // one retry on transient failure
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      // Recover when the network returns. Safe because staleTime (30 min) still
      // prevents redundant calls when fresh data already exists — a reconnect
      // only triggers a refetch for queries that are stale or errored.
      refetchOnReconnect: true,
    },
  },
});
