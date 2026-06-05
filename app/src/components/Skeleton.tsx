import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { radius } from '@/theme';
import { useTheme } from '@/theme/useTheme';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
};

/** Pulsing placeholder block shown while data loads. */
export function Skeleton({ width = '100%', height = 16, style }: Props) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, opacity, backgroundColor: colors.surfaceMuted },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: radius.sm,
  },
});
