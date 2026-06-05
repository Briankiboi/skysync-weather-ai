import { StyleSheet, View } from 'react-native';
import { Card, Screen, Skeleton, ThemedText } from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { spacing } from '@/theme';
import {
  conditionEmoji,
  conditionLabel,
  formatTemp,
  shortDay,
} from '@/utils/weather';

/** Daily forecast — one card per day (Phase 5). */
export function DailyScreen() {
  const { daily, units, isLoading } = useAppWeather();

  return (
    <Screen scroll>
      <ThemedText variant="title">Daily forecast</ThemedText>

      {isLoading && daily.length === 0
        ? [0, 1, 2, 3, 4].map((i) => (
            <Card key={i} style={styles.card}>
              <Skeleton width="100%" height={20} />
            </Card>
          ))
        : daily.map((d, i) => (
            <Card key={d.date} style={styles.card}>
              <View style={styles.row}>
                <ThemedText variant="heading" style={styles.day}>
                  {i === 0 ? 'Today' : shortDay(d.date)}
                </ThemedText>
                <ThemedText style={styles.emoji}>
                  {conditionEmoji(d.condition_code)}
                </ThemedText>
                <View style={styles.temps}>
                  <ThemedText variant="heading">
                    {formatTemp(d.temp_max, units)}
                  </ThemedText>
                  <ThemedText variant="body" muted>
                    {formatTemp(d.temp_min, units)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.metaRow}>
                <ThemedText variant="caption" muted>
                  {conditionLabel(d.condition_code)}
                </ThemedText>
                {d.precipitation_probability != null && (
                  <ThemedText variant="caption" muted>
                    💧 {d.precipitation_probability}%
                  </ThemedText>
                )}
              </View>
            </Card>
          ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  day: {
    flex: 1,
  },
  emoji: {
    fontSize: 26,
    marginHorizontal: spacing.md,
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    minWidth: 90,
    justifyContent: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
