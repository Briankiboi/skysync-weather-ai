export type Units = 'metric' | 'imperial';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type ClockFormat = '12h' | '24h';

export type SavedLocation = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export type Settings = {
  units: Units;
  aiSummaryEnabled: boolean;
  themeMode: ThemeMode;
  clockFormat: ClockFormat;
  savedLocations: SavedLocation[];
};
