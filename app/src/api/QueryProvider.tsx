import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';
import { CACHE, STORAGE_KEYS } from '@/utils/constants';
import { storage } from '@/utils/storage';
import { queryClient } from './queryClient';

/**
 * Persist the query cache to local storage so weather shows instantly on
 * launch and survives offline (Phase 4: "show cached data immediately",
 * "save all successful responses locally"). Backed by our swappable storage
 * layer (AsyncStorage today, MMKV-ready).
 */
const asyncPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await storage.setJSON(STORAGE_KEYS.weatherCache, client);
  },
  restoreClient: async () => {
    return (await storage.getJSON<PersistedClient>(
      STORAGE_KEYS.weatherCache,
    )) ?? undefined;
  },
  removeClient: async () => {
    await storage.remove(STORAGE_KEYS.weatherCache);
  },
};

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncPersister,
        maxAge: CACHE.gcTime, // keep cached weather for offline use
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
