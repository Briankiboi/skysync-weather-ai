import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { SavedLocation, Settings, Units } from '../types/settings';
import { storage } from '../utils/storage';

type SettingsState = Settings & {
  hydrated: boolean;
  setUnits: (units: Units) => void;
  toggleUnits: () => void;
  setAiSummaryEnabled: (enabled: boolean) => void;
  addLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
};

/** Bridges our swappable storage layer to Zustand's persist middleware. */
const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name),
  setItem: (name, value) => storage.setString(name, value),
  removeItem: (name) => storage.remove(name),
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Defaults
      units: 'metric',
      aiSummaryEnabled: true,
      savedLocations: [],
      hydrated: false,

      setUnits: (units) => set({ units }),
      toggleUnits: () =>
        set({ units: get().units === 'metric' ? 'imperial' : 'metric' }),
      setAiSummaryEnabled: (aiSummaryEnabled) => set({ aiSummaryEnabled }),

      addLocation: (location) =>
        set((state) =>
          state.savedLocations.some((l) => l.id === location.id)
            ? state
            : { savedLocations: [...state.savedLocations, location] },
        ),
      removeLocation: (id) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter((l) => l.id !== id),
        })),
    }),
    {
      name: 'skysync-settings',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        units: state.units,
        aiSummaryEnabled: state.aiSummaryEnabled,
        savedLocations: state.savedLocations,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
