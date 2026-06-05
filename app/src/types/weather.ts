/**
 * WeatherAI response types — modelled from the live API
 * (https://api.weather-ai.co). Every weather endpoint returns the same
 * combined bundle: location + current + hourly + daily.
 */

export type Units = 'metric' | 'imperial';

export type WeatherLocation = {
  lat: number;
  lon: number;
  timezone: string;
  requested_lat?: number;
  requested_lon?: number;
  country?: string;
};

/** IP-derived geo (present on /v1/weather-geo) — gives a human place name. */
export type IpGeo = {
  country?: string;
  region?: string;
  city?: string;
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  wind_speed: number;
  wind_direction: number;
  condition_code: string;
  icon: string;
  icon_path?: string;
  /** Enriched from the matching hourly entry (not always on the raw object). */
  feels_like?: number;
  humidity?: number;
  uv_index?: number;
};

export type HourlyEntry = {
  time: string;
  temperature: number;
  feels_like?: number;
  humidity?: number;
  precipitation_probability?: number;
  wind_speed: number;
  wind_gust?: number;
  uv_index?: number;
  condition_code: string;
  icon: string;
  icon_path?: string;
};

export type DailyEntry = {
  date: string;
  temp_min: number;
  temp_max: number;
  precipitation_sum?: number;
  precipitation_probability?: number;
  sunrise?: string;
  sunset?: string;
  wind_max?: number;
  condition_code: string;
  icon: string;
  icon_path?: string;
};

/** The full bundle returned by /v1/weather, /v1/current, /v1/daily, /v1/hourly, /v1/weather-geo. */
export type WeatherBundle = {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  /** IP-derived place (city/region/country) on /v1/weather-geo. */
  ip_geo?: IpGeo;
  /** Optional AI summary text, when the API includes one. */
  ai_summary?: string;
};

export type UsagePeriod = {
  start: string | null;
  end: string | null;
  requestCount: number;
  aiRequestCount: number;
};

export type UsageLimits = {
  requests: number;
  aiRequests: number;
  maxDays: number;
  webhooks: boolean;
  teamSeats: number;
  sms: boolean;
};

export type UsageResponse = {
  plan: string;
  period: UsagePeriod;
  limits: UsageLimits;
  remaining: {
    requests: number;
    aiRequests: number;
  };
};

/** Shared query params accepted by the weather endpoints. */
export type WeatherQuery = {
  lat: number;
  lon: number;
  days?: number; // 1–7 on the free tier
  units?: Units;
  ai?: boolean;
  lang?: string;
};
