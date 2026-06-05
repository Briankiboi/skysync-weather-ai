import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client.
 * Tuned for offline-first weather: keep data fresh-ish, retry transient
 * failures, and serve cached data instantly while refetching in background.
 * (Phase 3 will add the actual WeatherAI queries that use this.)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Weather data is hourly — treat it as fresh for 30 min so we don't
      // refetch on every screen mount / remount. This is the main lever for
      // keeping API usage low.
      staleTime: 30 * 60 * 1000, // 30 min
      gcTime: 24 * 60 * 60 * 1000, // keep cache 24h for offline use
      retry: 1, // one retry on transient failure (was 2) — fewer wasted calls
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // don't auto-refetch just because network blipped
    },
  },
});
