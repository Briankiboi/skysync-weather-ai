import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';
import { ThemedText } from './ThemedText';

/**
 * Small pill that toggles Light ↔ Dark. Intentionally INVERTED vs the screen
 * (dark pill in light mode, light pill in dark mode) so it stands out as a
 * tappable control. Shows the mode you'll switch TO.
 */
export function ThemeToggle() {
  const { isDark } = useTheme();
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  const next = isDark
    ? ({ icon: 'sunny-outline', label: 'Light' } as const)
    : ({ icon: 'moon-outline', label: 'Dark' } as const);

  // Inverted colors: dark-on-light screen, light-on-dark screen.
  const bg = isDark ? '#FFFFFF' : '#1E293B';
  const fg = isDark ? '#0F172A' : '#FFFFFF';

  return (
    <Pressable
      onPress={() => toggleTheme(isDark)}
      hitSlop={8}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={next.icon} size={14} color={fg} />
      <ThemedText variant="caption" color={fg} style={styles.label}>
        {next.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontWeight: '700',
  },
});
