import { Fragment } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import {
  Card,
  EmptyState,
  ErrorState,
  OfflineBanner,
  Screen,
  Skeleton,
  ThemedText,
} from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { useOnline } from '@/hooks/useOnline';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';
import {
  conditionEmoji,
  dayKey,
  dayMonth,
  formatTemp,
  formatWind,
  shortHour,
} from '@/utils/weather';

/** Hourly forecast — next 24 hours, grouped by day (Phase 5). */
export function HourlyScreen() {
  const { hourly, units, isLoading, error, refresh } = useAppWeather();
  const clock = useSettingsStore((s) => s.clockFormat);
  const online = useOnline();
  const { colors } = useTheme();
  const { pulling, onRefresh } = usePullToRefresh(refresh);

  const now = Date.now();
  const upcoming = hourly
    .filter((h) => new Date(h.time).getTime() >= now - 3600_000)
    .slice(0, 24);

  if (!isLoading && upcoming.length === 0) {
    if (!online) {
      return (
        <Screen>
          <EmptyState
            emoji="📡"
            title="You’re offline"
            message="Connect to load the hourly forecast."
          />
        </Screen>
      );
    }
    if (error) {
      return (
        <Screen>
          <ErrorState error={error} onRetry={() => refresh()} />
        </Screen>
      );
    }
  }

  let lastDay = '';

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl
          refreshing={pulling}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {!online && <OfflineBanner />}
      <ThemedText variant="title">Hourly forecast</ThemedText>

      {isLoading && upcoming.length === 0
        ? [0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} style={styles.row}>
              <Skeleton width="100%" height={18} />
            </Card>
          ))
        : upcoming.map((h, i) => {
            const thisDay = dayKey(h.time);
            const showHeader = thisDay !== lastDay;
            lastDay = thisDay;
            return (
              <Fragment key={h.time}>
                {showHeader && (
                  <ThemedText variant="label" style={styles.dayHeader}>
                    {i === 0 ? 'Today' : dayMonth(h.time)}
                  </ThemedText>
                )}
                <Card style={styles.row}>
                  <ThemedText variant="body" style={styles.hour}>
                    {i === 0 ? 'Now' : shortHour(h.time, clock)}
                  </ThemedText>
                  <ThemedText style={styles.emoji}>
                    {conditionEmoji(h.condition_code)}
                  </ThemedText>
                  <View style={styles.meta}>
                    {h.precipitation_probability != null && (
                      <ThemedText variant="caption" muted>
                        💧 {h.precipitation_probability}%
                      </ThemedText>
                    )}
                    <ThemedText variant="caption" muted>
                      {formatWind(h.wind_speed, units)}
                    </ThemedText>
                  </View>
                  <ThemedText variant="heading" style={styles.temp}>
                    {formatTemp(h.temperature, units)}
                  </ThemedText>
                </Card>
              </Fragment>
            );
          })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  row: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hour: {
    width: 72,
  },
  emoji: {
    fontSize: 22,
    marginHorizontal: spacing.md,
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  temp: {
    minWidth: 50,
    textAlign: 'right',
  },
});
