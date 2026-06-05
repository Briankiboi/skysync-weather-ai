import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, HourlyStrip, Screen, Skeleton, ThemedText } from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme';
import { useSky } from '@/theme/SkyContext';
import { conditionFromText, timeOfDayFromHour } from '@/theme/sky';
import { countryFlag } from '@/utils/country';
import { buildSummary } from '@/utils/summary';
import {
  conditionEmoji,
  conditionLabel,
  formatTemp,
  formatWind,
  relativeTime,
  windDirection,
} from '@/utils/weather';

/** Home — live current conditions (Phase 5). */
export function HomeScreen() {
  const { current, hourly, daily, place, countryCode, units, isLoading, error, isRefreshing } =
    useAppWeather();
  const aiSummaryEnabled = useSettingsStore((s) => s.aiSummaryEnabled);
  const { setSky } = useSky();

  // Drive the dynamic background from the live condition + local hour.
  useEffect(() => {
    if (!current) return;
    const hour = new Date(current.time).getHours();
    setSky({
      conditionText: conditionLabel(current.condition_code),
      condition: conditionFromText(conditionLabel(current.condition_code)),
      timeOfDay: timeOfDayFromHour(hour),
    });
  }, [current, setSky]);

  if (isLoading && !current) return <HomeLoading />;

  if (error && !current) {
    return (
      <Screen>
        <ThemedText variant="label" muted>
          Current weather
        </ThemedText>
        <Card style={styles.errorCard}>
          <ThemedText variant="heading">Can’t load weather</ThemedText>
          <ThemedText variant="caption" muted style={styles.errorMsg}>
            {error.message}
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  if (!current) return <HomeLoading />;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <ThemedText variant="label" muted>
          Current weather
        </ThemedText>
        <ThemedText variant="caption" muted>
          {isRefreshing ? 'Updating…' : `Updated ${relativeTime(current.time, Date.now())}`}
        </ThemedText>
      </View>

      <ThemedText variant="caption" muted style={styles.location}>
        {countryFlag(countryCode)} {place}
      </ThemedText>

      <View style={styles.heroRow}>
        <ThemedText variant="display">{formatTemp(current.temperature, units)}</ThemedText>
        <ThemedText style={styles.emoji}>{conditionEmoji(current.condition_code)}</ThemedText>
      </View>
      <ThemedText variant="heading" muted>
        {conditionLabel(current.condition_code)}
      </ThemedText>

      <View style={styles.metrics}>
        <Metric label="Feels like" value={formatTemp(current.feels_like, units)} />
        <Metric label="Humidity" value={current.humidity != null ? `${current.humidity}%` : '--'} />
        <Metric
          label="Wind"
          value={`${formatWind(current.wind_speed, units)} ${windDirection(current.wind_direction)}`}
        />
        <Metric label="UV index" value={current.uv_index != null ? `${current.uv_index}` : '--'} />
      </View>

      {/* Hourly analytics strip — uses already-fetched data, no extra API call */}
      <HourlyStrip hourly={hourly} units={units} />

      {/* Smart summary (respects the AI-summary toggle in Settings) */}
      {aiSummaryEnabled && (
        <Card style={styles.summaryCard}>
          <ThemedText variant="label" muted>
            Summary
          </ThemedText>
          <ThemedText variant="body" style={styles.summaryText}>
            {buildSummary(current, hourly, daily[0], units)}
          </ThemedText>
        </Card>
      )}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.metric}>
      <ThemedText variant="label" muted>
        {label}
      </ThemedText>
      <ThemedText variant="heading" style={styles.metricValue}>
        {value}
      </ThemedText>
    </Card>
  );
}

function HomeLoading() {
  return (
    <Screen>
      <ThemedText variant="label" muted>
        Current weather
      </ThemedText>
      <View style={styles.loadingHero}>
        <Skeleton width={160} height={72} />
        <Skeleton width="50%" height={20} style={{ marginTop: spacing.md }} />
      </View>
      <View style={styles.metrics}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} style={styles.metric}>
            <Skeleton width="60%" height={12} />
            <Skeleton width="80%" height={20} style={{ marginTop: spacing.sm }} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    marginTop: spacing.xs,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  emoji: {
    fontSize: 44,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  metric: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: spacing.sm,
  },
  metricValue: {
    marginTop: spacing.xs,
  },
  loadingHero: {
    marginTop: spacing.lg,
  },
  errorCard: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  errorMsg: {
    marginTop: spacing.xs,
  },
  summaryCard: {
    marginTop: spacing.lg,
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  summaryText: {
    lineHeight: 26,
  },
});
