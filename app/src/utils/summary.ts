/**
 * Local weather summary.
 *
 * The free WeatherAI tier doesn't return AI-generated text (that's the Pro-only
 * `insights` endpoint, which is out of scope per the build guide). So we build
 * a concise, human summary from the data we already have — no extra API call.
 * If a real AI summary becomes available later, this can be swapped out.
 */
import { CurrentWeather, DailyEntry, HourlyEntry, Units } from '@/types/weather';
import { conditionLabel, formatTemp } from './weather';

export function buildSummary(
  current: CurrentWeather,
  hourly: HourlyEntry[],
  today: DailyEntry | undefined,
  units: Units,
): string {
  const cond = conditionLabel(current.condition_code).toLowerCase();

  const parts: string[] = [];
  parts.push(
    `${capitalize(cond)} and ${formatTemp(current.temperature, units)}`,
  );

  if (current.feels_like != null) {
    parts.push(`feels like ${formatTemp(current.feels_like, units)}`);
  }

  // Rain outlook from the next several hours.
  const soon = hourly
    .filter((h) => new Date(h.time).getTime() >= Date.now())
    .slice(0, 6);
  const maxPop = soon.reduce(
    (m, h) => Math.max(m, h.precipitation_probability ?? 0),
    0,
  );
  if (maxPop >= 60) parts.push('rain likely soon');
  else if (maxPop >= 30) parts.push('a chance of rain');
  else parts.push('little rain expected');

  // Today's range, if we have it.
  if (today) {
    parts.push(
      `high ${formatTemp(today.temp_max, units)}, low ${formatTemp(
        today.temp_min,
        units,
      )}`,
    );
  }

  return `${parts.join(', ')}.`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
