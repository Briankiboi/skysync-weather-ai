import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import {
  Card,
  EmptyState,
  ErrorState,
  HourlyGraph,
  OfflineBanner,
  Screen,
  Skeleton,
  ThemedText,
  ThemeToggle,
} from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { useOnline } from '@/hooks/useOnline';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme';
import { useSky } from '@/theme/SkyContext';
import { useTheme } from '@/theme/useTheme';
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

/** Home — live current conditions (Phase 5) with smart pull-to-refresh. */
export function HomeScreen() {
  const {
    current, hourly, daily, city, countryCode, units,
    isLoading, error, isRefreshing, refresh,
  } = useAppWeather();
  const aiSummaryEnabled = useSettingsStore((s) => s.aiSummaryEnabled);
  const clock = useSettingsStore((s) => s.clockFormat);
  const online = useOnline();
  const { setSky } = useSky();
  const { colors } = useTheme();

  // Pull-to-refresh (shared hook; cooldown enforced quietly).
  const { pulling, upToDate, onRefresh } = usePullToRefresh(refresh);

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

  // Still loading the very first data.
  if (isLoading && !current) return <HomeLoading />;

  // No cached data to fall back on:
  if (!current) {
    if (!online) {
      return (
        <Screen>
          <EmptyState
            emoji="📡"
            title="You’re offline"
            message="Connect to the internet to load the latest weather. Saved weather will appear here once you’ve loaded it at least once."
          />
        </Screen>
      );
    }
    return (
      <Screen>
        <ErrorState error={error} onRetry={() => refresh()} />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl
          refreshing={pulling || isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {!online && <OfflineBanner />}

      <View style={styles.header}>
        <ThemedText variant="caption" muted>
          {upToDate
            ? 'Already up to date'
            : isRefreshing
              ? 'Updating…'
              : `Updated ${relativeTime(current.time, Date.now())}`}
        </ThemedText>
        <ThemeToggle />
      </View>

      <View style={styles.hero}>
        <ThemedText style={styles.heroIcon}>
          {conditionEmoji(current.condition_code)}
        </ThemedText>
        <ThemedText variant="display" style={styles.heroTemp}>
          {formatTemp(current.temperature, units)}
        </ThemedText>
        {city ? (
          <ThemedText variant="caption" muted style={styles.heroCity}>
            {countryFlag(countryCode)} {city}
          </ThemedText>
        ) : null}
        <ThemedText variant="heading" muted>
          {conditionLabel(current.condition_code)}
        </ThemedText>
        <ThemedText variant="body" muted style={styles.heroMeta}>
          Feels like {formatTemp(current.feels_like, units)}
          {daily[0]
            ? `  ·  High ${formatTemp(daily[0].temp_max, units)}  ·  Low ${formatTemp(daily[0].temp_min, units)}`
            : ''}
        </ThemedText>
      </View>

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
      <HourlyGraph hourly={hourly} units={units} clock={clock} />

      {/* Smart summary (respects the AI-summary toggle in Settings) */}
      {aiSummaryEnabled && (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHead}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primary} />
            <ThemedText variant="label">
              Daily summary
            </ThemedText>
          </View>
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
      <ThemedText variant="label">
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
      <ThemedText variant="label">
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
  hero: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: spacing.xs,
  },
  heroTemp: {
    textAlign: 'center',
  },
  heroCity: {
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  heroMeta: {
    marginTop: spacing.xs,
    textAlign: 'center',
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
  summaryCard: {
    marginTop: spacing.lg,
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryText: {
    lineHeight: 26,
  },
});
