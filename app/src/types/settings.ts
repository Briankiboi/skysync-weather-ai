export type Units = 'metric' | 'imperial';

export type SavedLocation = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export type Settings = {
  units: Units;
  aiSummaryEnabled: boolean;
  savedLocations: SavedLocation[];
};
