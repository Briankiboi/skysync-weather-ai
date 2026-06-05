import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { fontSize, fontWeight } from '@/theme';
import { useTheme } from '@/theme/useTheme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  muted?: boolean;
};

/** Typography primitive — use instead of raw <Text> for consistent styling. */
export function ThemedText({
  variant = 'body',
  color,
  muted,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  // Small section labels get the warm accent by default (adds life). An
  // explicit `color` always wins; `muted` still dims when you want it plain.
  const fallback =
    variant === 'label' && !muted ? colors.label : muted ? colors.textMuted : colors.text;
  const resolved = color ?? fallback;
  return <RNText style={[styles[variant], { color: resolved }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
