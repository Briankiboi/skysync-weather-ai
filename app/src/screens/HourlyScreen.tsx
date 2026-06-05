import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Screen, Skeleton, ThemedText } from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { spacing } from '@/theme';
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
  const { hourly, units, isLoading } = useAppWeather();

  const now = Date.now();
  const upcoming = hourly
    .filter((h) => new Date(h.time).getTime() >= now - 3600_000)
    .slice(0, 24);

  let lastDay = '';

  return (
    <Screen scroll>
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
                  <ThemedText variant="label" muted style={styles.dayHeader}>
                    {i === 0 ? 'Today' : dayMonth(h.time)}
                  </ThemedText>
                )}
                <Card style={styles.row}>
                  <ThemedText variant="body" style={styles.hour}>
                    {i === 0 ? 'Now' : shortHour(h.time)}
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
