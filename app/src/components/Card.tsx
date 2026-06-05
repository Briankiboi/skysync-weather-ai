import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

/**
 * Frosted card — a translucent fill that blends over the weather gradient
 * with just a subtle border. No elevation/shadow: on Android a shadow behind
 * a semi-transparent fill shows through as an ugly inner box, so we rely on
 * the border alone for a clean, seamless edge in both light and dark mode.
 */
export function Card({ children, style }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardSurface, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
});
