import { ScrollView, StyleSheet, View } from 'react-native';
import { Units, HourlyEntry } from '@/types/weather';
import { spacing } from '@/theme';
import { conditionEmoji, formatTemp, shortHour } from '@/utils/weather';
import { Card } from './Card';
import { ThemedText } from './ThemedText';

type Props = {
  hourly: HourlyEntry[];
  units: Units;
  /** How many upcoming hours to show. */
  count?: number;
};

/**
 * Horizontal hourly strip for the Home screen — time, icon, temp, and rain
 * chance for the next hours. Uses data already fetched (no extra API call).
 */
export function HourlyStrip({ hourly, units, count = 16 }: Props) {
  const now = Date.now();
  const upcoming = hourly
    .filter((h) => new Date(h.time).getTime() >= now - 3600_000)
    .slice(0, count);

  if (upcoming.length === 0) return null;

  return (
    <Card style={styles.card}>
      <ThemedText variant="label" muted style={styles.title}>
        Next hours
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        // Let the strip scroll edge-to-edge by cancelling the card padding.
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
        {upcoming.map((h, i) => (
          <View key={h.time} style={styles.cell}>
            <ThemedText variant="caption" muted>
              {i === 0 ? 'Now' : shortHour(h.time)}
            </ThemedText>
            <ThemedText style={styles.emoji}>
              {conditionEmoji(h.condition_code)}
            </ThemedText>
            <ThemedText variant="body" style={styles.temp}>
              {formatTemp(h.temperature, units)}
            </ThemedText>
            <View style={styles.precipRow}>
              <ThemedText variant="caption" muted style={styles.precip}>
                💧 {h.precipitation_probability ?? 0}%
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    gap: spacing.md,
    paddingHorizontal: 0, // strip handles its own horizontal padding
    paddingVertical: spacing.lg,
  },
  title: {
    paddingHorizontal: spacing.lg,
  },
  scroll: {
    marginHorizontal: 0,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
    alignItems: 'center',
  },
  cell: {
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 52,
  },
  emoji: {
    fontSize: 26,
  },
  temp: {
    fontWeight: '700',
  },
  precipRow: {
    marginTop: spacing.xs / 2,
  },
  precip: {
    fontSize: 11,
  },
});
