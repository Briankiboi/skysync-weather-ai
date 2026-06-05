import { Card, Screen, ThemedText } from '../components';
import { spacing } from '../theme';

/** Usage — shows /v1/usage data once connected (Phase 5). */
export function UsageScreen() {
  return (
    <Screen scroll>
      <ThemedText variant="title">API usage</ThemedText>
      <Card style={{ marginTop: spacing.lg }}>
        <ThemedText variant="caption" muted>
          WeatherAI usage stats will appear here when available.
        </ThemedText>
      </Card>
    </Screen>
  );
}
