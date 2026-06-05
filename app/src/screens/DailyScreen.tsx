import { Card, Screen, ThemedText } from '../components';
import { spacing } from '../theme';

/** Daily forecast — cards land in Phase 5. */
export function DailyScreen() {
  return (
    <Screen scroll>
      <ThemedText variant="title">Daily forecast</ThemedText>
      <Card style={{ marginTop: spacing.lg }}>
        <ThemedText variant="caption" muted>
          Daily cards will appear here once WeatherAI is connected.
        </ThemedText>
      </Card>
    </Screen>
  );
}
