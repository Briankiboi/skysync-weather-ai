import { ReactElement, ReactNode } from 'react';
import {
  RefreshControlProps,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/theme';
import { WeatherBackground } from './WeatherBackground';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  /** Optional pull-to-refresh control for scrollable screens. */
  refreshControl?: ReactElement<RefreshControlProps>;
};

/**
 * Base screen wrapper: ambient weather backdrop + top safe area + padding.
 * The themed gradient/glows render behind every screen's content.
 */
export function Screen({ children, scroll = false, style, refreshControl }: Props) {
  const inner = <View style={[styles.content, style]}>{children}</View>;
  return (
    <View style={styles.root}>
      <WeatherBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
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
