import { Card, Screen, ThemedText } from '../components';
import { spacing } from '../theme';

/** Hourly forecast — list/chart lands in Phase 5. */
export function HourlyScreen() {
  return (
    <Screen scroll>
      <ThemedText variant="title">Hourly forecast</ThemedText>
      <Card style={{ marginTop: spacing.lg }}>
        <ThemedText variant="caption" muted>
          Hourly breakdown will appear here once WeatherAI is connected.
        </ThemedText>
      </Card>
    </Screen>
  );
}
