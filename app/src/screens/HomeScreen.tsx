import { StyleSheet, View } from 'react-native';
import { Card, Screen, Skeleton, ThemedText } from '../components';
import { spacing } from '../theme';

/** Home — current conditions. Data wiring comes in Phase 3. */
export function HomeScreen() {
  return (
    <Screen scroll>
      <ThemedText variant="label" muted>
        Current weather
      </ThemedText>
      <ThemedText variant="display" style={styles.temp}>
        --°
      </ThemedText>
      <ThemedText variant="heading" muted>
        Awaiting location…
      </ThemedText>

      <Card style={styles.card}>
        <ThemedText variant="caption" muted>
          Weather data connects in Phase 3 (WeatherAI).
        </ThemedText>
        <View style={styles.skeletons}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="80%" height={14} />
          <Skeleton width="45%" height={14} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  temp: {
    marginTop: spacing.xs,
  },
  card: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  skeletons: {
    gap: spacing.sm,
  },
});
