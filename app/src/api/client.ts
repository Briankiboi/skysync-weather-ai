/**
 * Single WeatherAI API client.
 * - Base URL + Bearer auth from environment (EXPO_PUBLIC_*).
 * - Centralised error handling with friendly, typed errors for the statuses
 *   the app cares about (401/403/429/500/503).
 * Endpoint functions live in ./weather.ts and call request() here.
 */

const BASE_URL =
  process.env.EXPO_PUBLIC_WEATHERAI_BASE_URL ?? 'https://api.weather-ai.co';
const API_KEY = process.env.EXPO_PUBLIC_WEATHERAI_KEY ?? '';

export type ApiErrorKind =
  | 'unauthorized' // 401
  | 'forbidden' // 403
  | 'rate_limited' // 429
  | 'server' // 500
  | 'unavailable' // 503
  | 'network' // no response / offline
  | 'unknown';

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

function kindForStatus(status: number): ApiErrorKind {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 429:
      return 'rate_limited';
    case 500:
      return 'server';
    case 503:
      return 'unavailable';
    default:
      return 'unknown';
  }
}

const FRIENDLY: Record<ApiErrorKind, string> = {
  unauthorized: 'Your WeatherAI API key is missing or invalid.',
  forbidden: 'This request is not allowed on your current plan.',
  rate_limited: 'Too many requests — please wait a moment and try again.',
  server: 'WeatherAI had a problem. Please try again shortly.',
  unavailable: 'WeatherAI is temporarily unavailable. Please try again.',
  network: 'No internet connection. Showing cached data if available.',
  unknown: 'Something went wrong fetching the weather.',
};

export function hasApiKey(): boolean {
  return API_KEY.length > 0;
}

type Params = Record<string, string | number | boolean | undefined>;

/**
 * Build the request URL by hand. We avoid `new URL()` because Hermes (RN's
 * engine) has a partial URL/searchParams implementation that can misbehave.
 */
function buildUrl(path: string, params?: Params): string {
  const base = BASE_URL.replace(/\/$/, '');
  const query = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join('&')
    : '';
  return query ? `${base}${path}?${query}` : `${base}${path}`;
}

/** Perform a GET request and return parsed JSON, or throw a typed ApiError. */
export async function request<T>(path: string, params?: Params): Promise<T> {
  if (!hasApiKey()) {
    throw new ApiError('unauthorized', FRIENDLY.unauthorized, 401);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    });
  } catch {
    // fetch rejects on network failure / offline.
    throw new ApiError('network', FRIENDLY.network);
  }

  if (!res.ok) {
    const kind = kindForStatus(res.status);
    throw new ApiError(kind, FRIENDLY[kind], res.status);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError('unknown', 'Received an invalid response from WeatherAI.');
  }
}
