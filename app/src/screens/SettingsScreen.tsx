import { StyleSheet, Switch, View } from 'react-native';
import { Button, Card, Screen, ThemedText } from '../components';
import { useSettingsStore } from '../store/settingsStore';
import { colors, spacing } from '../theme';

/** Settings — fully wired to the persisted Zustand store. */
export function SettingsScreen() {
  const units = useSettingsStore((s) => s.units);
  const toggleUnits = useSettingsStore((s) => s.toggleUnits);
  const aiSummaryEnabled = useSettingsStore((s) => s.aiSummaryEnabled);
  const setAiSummaryEnabled = useSettingsStore((s) => s.setAiSummaryEnabled);
  const savedLocations = useSettingsStore((s) => s.savedLocations);

  return (
    <Screen scroll>
      <ThemedText variant="title">Settings</ThemedText>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText variant="body">Units</ThemedText>
            <ThemedText variant="caption" muted>
              {units === 'metric' ? 'Metric (°C, km/h)' : 'Imperial (°F, mph)'}
            </ThemedText>
          </View>
          <Button
            label={units === 'metric' ? 'Metric' : 'Imperial'}
            variant="secondary"
            onPress={toggleUnits}
            style={styles.unitBtn}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText variant="body">AI summary</ThemedText>
            <ThemedText variant="caption" muted>
              Show a smart written summary of conditions
            </ThemedText>
          </View>
          <Switch
            value={aiSummaryEnabled}
            onValueChange={setAiSummaryEnabled}
            trackColor={{ true: colors.accent, false: colors.surfaceMuted }}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <ThemedText variant="body">Saved locations</ThemedText>
        {savedLocations.length === 0 ? (
          <ThemedText variant="caption" muted style={styles.spacer}>
            No saved locations yet.
          </ThemedText>
        ) : (
          savedLocations.map((loc) => (
            <ThemedText key={loc.id} variant="caption" style={styles.spacer}>
              {loc.name}
            </ThemedText>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  unitBtn: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
  },
  spacer: {
    marginTop: spacing.sm,
  },
});
