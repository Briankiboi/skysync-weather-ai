import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/theme';
import { WeatherBackground } from './WeatherBackground';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

/**
 * Base screen wrapper: ambient weather backdrop + top safe area + padding.
 * The themed gradient/glows render behind every screen's content.
 */
export function Screen({ children, scroll = false, style }: Props) {
  const inner = <View style={[styles.content, style]}>{children}</View>;
  return (
    <View style={styles.root}>
      <WeatherBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {inner}
          </ScrollView>
        ) : (
          inner
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
