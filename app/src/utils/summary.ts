/**
 * Fact-only weather summary.
 *
 * IMPORTANT: WeatherAI's free tier returns NO text/AI summary, and the Pro
 * `insights` endpoint is explicitly out of scope (Guide §6). So we compose a
 * short summary ourselves — but every statement here is derived ONLY from real
 * fields the API returns. We never assert anything the data doesn't contain
 * (e.g. visibility, air quality), so the summary can't mislead.
 *
 * Real API fields used (and nothing else):
 *   current.temperature, current.feels_like, current.humidity,
 *   current.wind_speed, current.uv_index, current.condition_code
 *   hourly[].temperature, hourly[].precipitation_probability, hourly[].uv_index
 *   daily[0].temp_max, daily[0].temp_min, daily[0].precipitation_probability
 */
import { CurrentWeather, DailyEntry, HourlyEntry, Units } from '@/types/weather';
import { conditionLabel, formatTemp, formatWind } from './weather';

export function buildSummary(
  current: CurrentWeather,
  hourly: HourlyEntry[],
  today: DailyEntry | undefined,
  units: Units,
): string {
  const now = Date.now();
  const ahead = hourly
    .filter((h) => {
      const t = new Date(h.time).getTime();
      return t >= now && t <= now + 14 * 3600_000;
    })
    .slice(0, 14);

  const parts: string[] = [];

  // 1) Current condition + temperature (real: condition_code, temperature).
  parts.push(
    `Currently ${conditionLabel(current.condition_code).toLowerCase()} at ${formatTemp(
      current.temperature,
      units,
    )}.`,
  );

  // 2) Today's range (real: daily.temp_max / temp_min). Only if present.
  if (today) {
    parts.push(
      `Today's range is ${formatTemp(today.temp_min, units)} to ${formatTemp(
        today.temp_max,
        units,
      )}.`,
    );
  }

  // 3) Feels-like + humidity (real: feels_like, humidity). Only if present.
  const feelsHum = feelsAndHumidity(current, units);
  if (feelsHum) parts.push(feelsHum);

  // 4) Rain chance (real: precipitation_probability). State the number.
  const rain = rainFact(ahead, today);
  if (rain) parts.push(rain);

  // 5) Wind (real: wind_speed).
  parts.push(`Wind around ${formatWind(current.wind_speed, units)}.`);

  // 6) UV (real: uv_index). Only mention when there's daytime UV.
  const uv = uvFact(ahead, current);
  if (uv) parts.push(uv);

  return parts.join(' ');
}

/** Uses real feels_like + humidity only; omitted if the API didn't provide them. */
function feelsAndHumidity(current: CurrentWeather, units: Units): string {
  const bits: string[] = [];
  if (current.feels_like != null) {
    bits.push(`feels like ${formatTemp(current.feels_like, units)}`);
  }
  if (current.humidity != null) {
    bits.push(`humidity ${current.humidity}%`);
  }
  if (bits.length === 0) return '';
  return `It ${bits.join(', ')}.`;
}

/** States the real maximum precipitation probability, plus a measured label. */
function rainFact(ahead: HourlyEntry[], today: DailyEntry | undefined): string {
  const values: number[] = [];
  if (today?.precipitation_probability != null) {
    values.push(today.precipitation_probability);
  }
  ahead.forEach((h) => {
    if (h.precipitation_probability != null) values.push(h.precipitation_probability);
  });
  if (values.length === 0) return '';

  const maxPop = Math.max(...values);
  // Plain factual band based on the actual percentage.
  const label =
    maxPop >= 70 ? 'high' : maxPop >= 40 ? 'moderate' : maxPop >= 20 ? 'low' : 'very low';
  return `Chance of rain is ${label} at up to ${maxPop}%.`;
}

/** States the real peak UV index with the standard risk band. */
function uvFact(ahead: HourlyEntry[], current: CurrentWeather): string {
  const values: number[] = [];
  if (current.uv_index != null) values.push(current.uv_index);
  ahead.forEach((h) => {
    if (h.uv_index != null) values.push(h.uv_index);
  });
  if (values.length === 0) return '';

  const maxUv = Math.max(...values);
  if (maxUv <= 0) return ''; // night / no UV right now and ahead
  // Standard WHO UV index bands (factual mapping of the real number).
  const band =
    maxUv >= 11
      ? 'extreme'
      : maxUv >= 8
        ? 'very high'
        : maxUv >= 6
          ? 'high'
          : maxUv >= 3
            ? 'moderate'
            : 'low';
  return `Peak UV index ${Math.round(maxUv)} (${band}).`;
}
