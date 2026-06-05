import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { Button } from './Button';
import { ThemedText } from './ThemedText';

type Props = {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Friendly centered placeholder for empty / first-run / no-data screens. */
export function EmptyState({
  emoji = '🌤️',
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.wrap}>
      <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText variant="body" muted style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.lg,
    minWidth: 160,
  },
});
