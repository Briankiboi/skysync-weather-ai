import { StyleSheet, Switch, View } from 'react-native';
import { Card, Screen, Segmented, ThemedText } from '@/components';
import { useAppWeather } from '@/hooks/useAppWeather';
import { useSettingsStore } from '@/store/settingsStore';
import { spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';
import { ClockFormat, Units } from '@/types/settings';
import { countryFlag } from '@/utils/country';

/** Settings — units, AI summary, and saved locations (Phase 5). */
export function SettingsScreen() {
  const { colors } = useTheme();
  const units = useSettingsStore((s) => s.units);
  const setUnits = useSettingsStore((s) => s.setUnits);
  const aiSummaryEnabled = useSettingsStore((s) => s.aiSummaryEnabled);
  const setAiSummaryEnabled = useSettingsStore((s) => s.setAiSummaryEnabled);
  const clockFormat = useSettingsStore((s) => s.clockFormat);
  const setClockFormat = useSettingsStore((s) => s.setClockFormat);
  const savedLocations = useSettingsStore((s) => s.savedLocations);

  const { place, countryCode } = useAppWeather();

  return (
    <Screen scroll>
      <ThemedText variant="title">Settings</ThemedText>

      {/* Units */}
      <Card style={styles.card}>
        <View style={styles.rowText}>
          <ThemedText variant="body">Units</ThemedText>
          <ThemedText variant="caption" muted>
            {units === 'metric' ? 'Celsius · km/h' : 'Fahrenheit · mph'}
          </ThemedText>
        </View>
        <Segmented<Units>
          options={[
            { label: '°C', value: 'metric' },
            { label: '°F', value: 'imperial' },
          ]}
          value={units}
          onChange={setUnits}
        />
      </Card>

      {/* Time format */}
      <Card style={styles.card}>
        <View style={styles.rowText}>
          <ThemedText variant="body">Time format</ThemedText>
          <ThemedText variant="caption" muted>
            {clockFormat === '12h' ? '12-hour (AM/PM)' : '24-hour'}
          </ThemedText>
        </View>
        <Segmented<ClockFormat>
          options={[
            { label: '12h', value: '12h' },
            { label: '24h', value: '24h' },
          ]}
          value={clockFormat}
          onChange={setClockFormat}
        />
      </Card>

      {/* AI summary */}
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText variant="body">Daily summary</ThemedText>
            <ThemedText variant="caption" muted>
              A short, written overview of today’s weather
            </ThemedText>
          </View>
          <Switch
            value={aiSummaryEnabled}
            onValueChange={setAiSummaryEnabled}
            trackColor={{ true: colors.primary, false: colors.surfaceMuted }}
            thumbColor={colors.onPrimary}
          />
        </View>
      </Card>

      {/* Saved locations */}
      <Card style={styles.card}>
        <ThemedText variant="body">Locations</ThemedText>

        <View style={styles.locationRow}>
          <ThemedText variant="body">
            {countryFlag(countryCode)} {place}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: colors.surfaceMuted }]}>
            <ThemedText variant="caption" muted>
              Current
            </ThemedText>
          </View>
        </View>

        {savedLocations.map((loc) => (
          <View key={loc.id} style={styles.locationRow}>
            <ThemedText variant="body">{loc.name}</ThemedText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    gap: spacing.md,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
});
