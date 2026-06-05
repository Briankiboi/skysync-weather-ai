import { ApiError, ApiErrorKind } from '@/api/client';
import { EmptyState } from './EmptyState';

type Props = {
  error: unknown;
  onRetry?: () => void;
};

type Display = { emoji: string; title: string; message: string; retry: boolean };

/** Friendly, actionable copy for each error kind (401/403/429/5xx/offline). */
const COPY: Record<ApiErrorKind, Display> = {
  unauthorized: {
    emoji: '🔑',
    title: 'API key problem',
    message:
      'Your WeatherAI key is missing or invalid. Check the app configuration.',
    retry: false,
  },
  forbidden: {
    emoji: '🚫',
    title: 'Not allowed',
    message: 'This request isn’t available on the current plan.',
    retry: false,
  },
  rate_limited: {
    emoji: '⏳',
    title: 'Too many requests',
    message: 'You’ve hit the rate limit. Give it a moment and try again.',
    retry: true,
  },
  server: {
    emoji: '🛠️',
    title: 'WeatherAI had a hiccup',
    message: 'The service ran into a problem. Please try again shortly.',
    retry: true,
  },
  unavailable: {
    emoji: '🛰️',
    title: 'Temporarily unavailable',
    message: 'WeatherAI is briefly unavailable. Please try again.',
    retry: true,
  },
  network: {
    emoji: '📡',
    title: 'No connection',
    message: 'Check your internet connection and try again.',
    retry: true,
  },
  unknown: {
    emoji: '⚠️',
    title: 'Something went wrong',
    message: 'We couldn’t load the weather. Please try again.',
    retry: true,
  },
};

export function ErrorState({ error, onRetry }: Props) {
  const kind: ApiErrorKind =
    error instanceof ApiError ? error.kind : 'unknown';
  const d = COPY[kind];
  return (
    <EmptyState
      emoji={d.emoji}
      title={d.title}
      message={d.message}
      actionLabel={d.retry && onRetry ? 'Try again' : undefined}
      onAction={d.retry ? onRetry : undefined}
    />
  );
}
