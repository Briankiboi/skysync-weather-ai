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
      staleTime: 5 * 60 * 1000, // 5 min — weather doesn't change every second
      gcTime: 24 * 60 * 60 * 1000, // keep cache 24h for offline use
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
});
