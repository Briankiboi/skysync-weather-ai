import { StyleSheet, View } from 'react-native';
import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';
import { ThemedText } from './ThemedText';

type Props = {
  /** Whether cached data is being shown beneath the banner. */
  hasCache?: boolean;
};

/**
 * Subtle "you're offline" pill. Reassures the user that cached data is still
 * shown, rather than blocking the screen.
 */
export function OfflineBanner({ hasCache = true }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
      ]}
    >
      <ThemedText variant="caption" muted>
        {hasCache
          ? '📡 Offline · showing saved weather'
          : '📡 You’re offline'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
});
